const express=require('express');
const http=require('http');
const socketIo=require('socket.io');
const bodyParser = require('body-parser');

const port=process.env.PORT || 4001;

const routes=require('./routes/index');

const app=express();

const server = http.createServer(app);

const io=socketIo(server);

const cors = require('cors');

app.use(cors({
    origin:"*",
    methods:"*"
}))

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(routes);


const RedisClient = require('./databases/redisDatabase');
const jwtUtil = require('./controllers/jwtUtils/jwtUtils');

io.use(function(socket,next){
    console.log('socket middleware')
    if(socket.handshake.query && socket.handshake.query.token){
        let decoded = jwtUtil.checkToken(socket.handshake.query.token);
        if(decoded===null){
            return next(new Error('Authentication error'))
        }
        socket.decoded = decoded;
        next();
    }else{
        return next(new Error('Authentication error'))
    }
})

var CaroGameList = require('./caro-game-list.js');
var CaroGame = require('./caro-game.js');
var caroGames = new CaroGameList();

const mongoRoomGameModel = require('./databases/mongoDatabase/models/roomGame');
const mongoUserModel = require('./databases/mongoDatabase/models/user');

io.on("connection",function(socket){
    console.log("New client socket connected");

    socket.on("user_id",(id)=>{
        console.log('socket get user id: '+id);
        RedisClient.set('socket:'+socket.id+':'+id,id);
    })
    socket.on("disconnect",async ()=>{
        console.log("Client disconnected")
        let socketRedis= await RedisClient.keys('socket:'+socket.id+':*');
        let id = await RedisClient.get(socketRedis);
        await RedisClient.hset("user:"+id,'is_online','false');
        await RedisClient.del(socketRedis);
    });

    socket.on('create_game',async (data)=>{
        console.log('socker create room game: '+data.gameId);
        socket.join(''+ data.gameId);
        socket.join('chat'+ data.gameId);
        let caroGame = new CaroGame(data.gameId);
        caroGames.addGame(caroGame);
        let waitingRoomGames = await getNewWaitingRoomList();
        socket.broadcast.emit('update_list_waiting_game',{
            data:waitingRoomGames,
            userId:data.userId
        })

    socket.on('get_out_of_game',async (gameId)=>{
        console.log('socker get out of game: '+gameId);
        await RedisClient.del('room_game:'+gameId);
        socket.leave(''+gameId);
        socket.leave('chat'+ gameId);

        caroGames.removeGameByGameId(gameId);
    })

    socket.on('chat',data=>{
        console.log("socket chat");
        console.log(data);
        io.sockets.in('chat'+data.gameId).emit('message_come',{
            message: data.message,
            time:data.time,
            userIdSend: data.userId
        })
    });

    socket.on('join_game',(data)=>{
        console.log('join_game',data);
        socket.join(''+data.gameId);
        socket.join('chat'+data.gameId);
        // let clients = io.sockets.adapter.rooms[''+data.gameId].sockets;
        io.sockets.in(''+data.gameId).clients((err,clients)=>{
            clients.forEach((client)=>{
                const clientSocket = io.of('/').connected[client];
                if(client !== socket.id){
                    clientSocket.emit('opponent_join_game',{
                        gameId:data.gameId,
                        opponentId:data.userId,
                        opponentName:data.username,
                        opponentGolds:data.golds,
                        opponentTotalPlayedGame:data.totalPlayedGame
                    });
                }
            })
        })

        io.sockets.in(''+data.gameId).clients((err,clients)=>{
            clients.forEach((client)=>{
                io.of('/').connected[client]
                .emit('ready_to_start_game',data.gameId);
            })
        })
        let waitingRoomGames = getNewWaitingRoomList();
        socket.broadcast.emit('update_list_waiting_game',{
            data:waitingRoomGames,
            userId:data.userId
        })
    })
    
    socket.on('ready_to_play',async (data)=>{
        let roomGame = await RedisClient.hgetall('room_game:'+data.gameId);
        if(data.userId==roomGame.host_id){
            await RedisClient.hset('room_game:'+data.gameId,'host_ready','true');
        }else{
            await RedisClient.hset('room_game:'+data.gameId,'opponent_ready','true');
        }

        roomGame = await RedisClient.hgetall('room_game:'+data.gameId);
        if(roomGame.host_ready ==='true' && roomGame.opponent_ready==='true'){
            // let clients = io.sockets.adapter.rooms[''+data.gameId].sockets;
            
            // random who first
            // 0 is host and 1 id opponent
            let first = Math.round(Math.random());
            let response = {};
            if(first==0){
                response={
                    firstUserId:roomGame.host_id,
                    patterns:[
                        {
                            patternType:'X',
                            userId:roomGame.host_id
                        },
                        {
                            patternType:'O',
                            userId:roomGame.opponent_id
                        }
                    ]
                    
                }
            }else{
                response={
                    firstUserId:roomGame.opponent_id,
                    patterns:[
                        {
                            patternType:'X',
                            userId:roomGame.opponent_id
                        },
                        {
                            patternType:'O',
                            userId:roomGame.host_id
                        }
                    ]
                    
                }
            }
            // /random who first

            // for(const client of clients){
            //     client.emit('start_game',response);
            // }
            await RedisClient.hset('room_game:'+data.gameId,'status','playing');
            io.to(''+data.gameId).emit('start_game',response);


        }
    })

    socket.on('play_a_game_turn',async (data)=>{
        let game = caroGames.findGameByGameId(data.gameId)
        if(game !=null){
            game.playerPlayTurn(data.y,data.x,data.pattern);
            let resCode = game.isPlayerWin(data.y,data.x,data.pattern);

            
            if(resCode == 0){
                //current user win
                let response =[];

                let roomGame = await RedisClient.hgetall('room_game:'+data.gameId);
                let host = await RedisClient.hgetall('user:'+roomGame.host_id);
                let opponent = await RedisClient.hgetall('user:'+roomGame.opponent_id);

                let opponentGolds = parseInt(opponent.golds);
                let opponentTotalPlayedGame = parseInt(opponent.total_played_game);
                let hostGolds = parseInt(host.golds);
                let hostTotalPlayedGame = parseInt(host.total_played_game);
                let bettingGolds =parseInt(roomGame.betting_golds);
                let bonusGolds =1000;

                
                if(data.userId!=roomGame.host_id){

                    roomGame.winner_id=roomGame.opponent_id;                

                    await RedisClient.hmset('user:'+roomGame.host_id,
                    'total_played_game',hostTotalPlayedGame+1,
                    'golds',hostGolds-bettingGolds);
                    await RedisClient.hmset('user:'+roomGame.opponent_id,
                    'total_played_game',opponentTotalPlayedGame+1,
                    'golds',opponentGolds+bettingGolds+bonusGolds)

                    await RedisClient.zincrby('leaderboard',bettingGolds,opponent.id)
                    await RedisClient.zincrby('leaderboard',-bettingGolds,host.id);

                    await mongoUserModel.findByIdAndUpdate(roomGame.host_id,
                        {total_played_game:hostTotalPlayedGame+1})
                    let opponentMongo = await mongoUserModel.findById(roomGame.opponent_id);
                    await mongoUserModel.findByIdAndUpdate(roomGame.opponent_id,
                        {won_game:opponentMongo.won_game+1,
                        total_played_game:opponentMongo.total_played_game+1})
                    
                    response.push({
                        type:'OLD_GAME',
                        gameId:data.gameId,
                        betting_golds:roomGame.betting_golds,
                        winner:roomGame.opponent_id,
                        loser:roomGame.host_id,
                        bonus_golds:bonusGolds
                    })

                }else{

                    roomGame.winner_id=roomGame.host_id;

                    await RedisClient.hset('user:'+roomGame.host_id,
                    'total_played_game',hostTotalPlayedGame+1,
                    'golds',hostGolds+bettingGolds+bonusGolds);
                    await RedisClient.hmset('user:'+roomGame.opponent_id,
                    'total_played_game',opponentTotalPlayedGame+1,
                    'golds',opponentGolds-bettingGolds)

                    await RedisClient.zincrby('leaderboard',-bettingGolds,opponent.id)
                    await RedisClient.zincrby('leaderboard',bettingGolds,host.id);

                    await mongoUserModel.findByIdAndUpdate(roomGame.opponent_id,
                        {total_played_game:opponentTotalPlayedGame+1})
                    let hostMongo = await mongoUserModel.findById(roomGame.host_id);
                    await mongoUserModel.findByIdAndUpdate(roomGame.host_id,
                        {won_game:hostMongo.won_game+1,
                        total_played_game:hostMongo.total_played_game+1})

                    response.push({
                        type:'OLD_GAME',
                        gameId:data.gameId,
                        betting_golds:roomGame.betting_golds,
                        winner:roomGame.host_id,
                        loser:roomGame.opponent_id,
                        bonus_golds:bonusGolds
                    })
                }
                roomGame.status='end'

                let gameModel = new mongoRoomGameModel({
                    host_id:roomGame.host_id,
                    opponent_id:roomGame.opponent_id,
                    winner_id:roomGame.winner_id,
                    betting_golds:roomGame.betting_golds,
                    status:roomGame.status
                })
                await gameModel.save(function(err,game){
                    if(err){
                        console.log('gameModel save Error: '+err);
                    
                    }
                    console.log("gameModel save successful");
                    
                })


                //remove old game
                await RedisClient.del('room_game:'+data.gameId);

                //create new game
                let idGameCount = await RedisClient.incr('idGameCount');
                await RedisClient.hmset('room_game:'+idGameCount,
                'host_id',host.id,
                'betting_golds',bettingGolds,
                'status','waiting',
                'opponent_id',opponent.id,
                'winner_id','null',
                'host_ready','false',
                'opponent_ready','false');



                response.push({
                    type:'NEW_GAME',
                    gameId:idGameCount,
                    hostId:host.id,
                    opponent:opponent.id
                })

                //create temp continue room game
                await RedisClient.hmset('room_game_continue:'+idGameCount,
                'host_id',host.id,
                'betting_golds',bettingGolds,
                'status','waiting',
                'opponent_id',opponent.id,
                'host_accept_continue','null',
                'opponent_accept_continue','null');

                caroGames.removeGameByGameId(data.gameId);
                let caroGame = new CaroGame(idGameCount);
                caroGames.addGame(caroGame);

                io.to(''+data.gameId).emit('end_game_and_play_new_game',response);
            }else if(resCode==2){
                // next turn
                io.sockets.in(''+data.gameId).clients((err,clients)=>{
                    clients.forEach((client)=>{
                        const clientSocket = io.of('/').connected[client];
                        if(client !== socket.id){
                            clientSocket.emit('next_turn',{
                                gameId:data.gameId,
                                y:data.y,
                                x:data.x,
                                pattern:data.pattern
                            });
                        }
                    })
                })
            }else{
                //draw
                let response =[];

                let roomGame = await RedisClient.hgetall('room_game:'+data.gameId);
                let host = await RedisClient.hgetall('user:'+roomGame.host_id);
                let opponent = await RedisClient.hgetall('user:'+roomGame.opponent_id);

                let bettingGolds =parseInt(roomGame.betting_golds);
            
                

                let opponentMongo = await mongoUserModel.findById(roomGame.opponent_id);
                await mongoUserModel.findByIdAndUpdate(roomGame.opponent_id,
                    {
                        draw_game:opponentMongo.draw_game+1,
                        total_played_game:opponentMongo.total_played_game+1
                    })
                let hostMongo = await mongoUserModel.findById(roomGame.host_id);
                await mongoUserModel.findByIdAndUpdate(roomGame.host_id,
                    {
                        draw_game:hostMongo.draw_game+1,
                        total_played_game:hostMongo.total_played_game+1
                    })
                response.push({
                    type:'OLD_GAME',
                    gameId:data.gameId,
                    betting_golds:roomGame.betting_golds,
                    winner:null,
                    loser:null,
                })
                
                roomGame.status='end'

                let gameModel = new mongoRoomGameModel({
                    host_id:roomGame.host_id,
                    opponent_id:roomGame.opponent_id,
                    winner_id:null,
                    betting_golds:roomGame.betting_golds,
                    status:'draw'
                })
                await gameModel.save(function(err,game){
                    if(err){
                        console.log('gameModel save Error: '+err);
                    
                    }
                    console.log("gameModel save successful");
                    
                })

                //remove old game
                await RedisClient.del('room_game:'+data.gameId);
                
                //create new game
                let idGameCount = await RedisClient.incr('idGameCount');
                await RedisClient.hmset('room_game:'+idGameCount,
                'host_id',roomGame.host_id,
                'betting_golds',bettingGolds,
                'status','waiting',
                'opponent_id',roomGame.opponent_id,
                'winner_id','null',
                'host_ready','false',
                'opponent_ready','false');

                response.push({
                    type:'NEW_GAME',
                    gameId:idGameCount,
                    hostId:roomGame.host_id,
                    opponent:roomGame.opponent_id
                })

                //create temp continue room game
                await RedisClient.hmset('room_game_continue:'+idGameCount,
                'host_id',roomGame.host_id,
                'betting_golds',bettingGolds,
                'status','waiting',
                'opponent_id',roomGame.opponent_id,
                'host_accept_continue','null',
                'opponent_accept_continue','null');

                caroGames.removeGameByGameId(data.gameId);
                let caroGame = new CaroGame(idGameCount);
                caroGames.addGame(caroGame);

                io.to(''+data.gameId).emit('end_game_and_play_new_game',response);
            }
        }
    })

    socket.on('play_time_out',async (data)=>{
        let game = caroGames.findGameByGameId(data.gameId)
        if(game !=null){
            let response =[];

            let roomGame = await RedisClient.hgetall('room_game:'+data.gameId);
            let host = await RedisClient.hgetall('user:'+roomGame.host_id);
            let opponent = await RedisClient.hgetall('user:'+roomGame.opponent_id);

            let opponentGolds = parseInt(opponent.golds);
            let opponentTotalPlayedGame = parseInt(opponent.total_played_game);
            let hostGolds = parseInt(host.golds);
            let hostTotalPlayedGame = parseInt(host.total_played_game);
            let bettingGolds =parseInt(roomGame.betting_golds);
            let bonusGolds =1000;

            
            if(data.userId==roomGame.host_id){
                
                roomGame.winner_id=roomGame.opponent_id;                

                await RedisClient.hset('user:'+roomGame.host_id,
                'total_played_game',hostTotalPlayedGame+1,
                'golds',hostGolds-bettingGolds);
                await RedisClient.hset('user:'+roomGame.opponent_id,
                'total_played_game',opponentTotalPlayedGame+1,
                'golds',opponentGolds+bettingGolds+bonusGolds)

                await RedisClient.zincrby('leaderboard',bettingGolds,opponent.id)
                await RedisClient.zincrby('leaderboard',-bettingGolds,host.id);

                await mongoUserModel.findByIdAndUpdate(roomGame.host_id,
                    {total_played_game:hostTotalPlayedGame+1})
                let opponentMongo = await mongoUserModel.findById(roomGame.opponent_id);
                await mongoUserModel.findByIdAndUpdate(roomGame.opponent_id,
                    {won_game:opponentMongo.won_game+1,
                    total_played_game:opponentMongo.total_played_game+1})

                response.push({
                    type:'OLD_GAME',
                    gameId:data.gameId,
                    betting_golds:roomGame.betting_golds,
                    winner:roomGame.opponent_id,
                    loser:roomGame.host_id,
                    bonus_golds:bonusGolds
                })
            }else{
                

                roomGame.winner_id=roomGame.host_id;

                await RedisClient.hset('user:'+roomGame.host_id,
                'total_played_game',hostTotalPlayedGame+1,
                'golds',hostGolds+bettingGolds+bonusGolds);
                await RedisClient.hset('user:'+roomGame.opponent_id,
                'total_played_game',opponentTotalPlayedGame+1,
                'golds',opponentGolds-bettingGolds)

                await RedisClient.zincrby('leaderboard',-bettingGolds,opponent.id)
                await RedisClient.zincrby('leaderboard',bettingGolds,host.id);

                await mongoUserModel.findByIdAndUpdate(roomGame.opponent_id,
                    {total_played_game:hostTotalPlayedGame+1})
                let hostMongo = await mongoUserModel.findById(roomGame.host_id);
                await mongoUserModel.findByIdAndUpdate(roomGame.host_id,
                    {won_game:hostMongo.won_game+1,
                    total_played_game:hostMongo.total_played_game+1})

                response.push({
                    type:'OLD_GAME',
                    gameId:data.gameId,
                    betting_golds:roomGame.betting_golds,
                    winner:roomGame.host_id,
                    loser:roomGame.opponent_id,
                    bonus_golds:bonusGolds
                })
            }
            roomGame.status='end'

            let gameModel = new mongoRoomGameModel({
                host_id:roomGame.host_id,
                opponent_id:roomGame.opponent_id,
                winner_id:roomGame.winner_id,
                betting_golds:roomGame.betting_golds,
                status:roomGame.status
            })
            await gameModel.save(function(err,game){
                if(err){
                    console.log('gameModel save Error: '+err);
                    
                }
                console.log("gameModel save successful");
              
            })

            //remove old game
            await RedisClient.del('room_game:'+data.gameId);

            //create new game
            let idGameCount = await RedisClient.incr('idGameCount');
            await RedisClient.hmset('room_game:'+idGameCount,
            'host_id',host.id,
            'betting_golds',bettingGolds,
            'status','waiting',
            'opponent_id',opponent.id,
            'winner_id','null',
            'host_ready','false',
            'opponent_ready','false');

            response.push({
                type:'NEW_GAME',
                gameId:idGameCount,
                hostId:host.id,
                opponent:opponent.id
            })
            
            //create temp continue room game
            await RedisClient.hmset('room_game_continue:'+idGameCount,
            'host_id',host.id,
            'betting_golds',bettingGolds,
            'status','waiting',
            'opponent_id',opponent.id,
            'host_accept_continue','null',
            'opponent_accept_continue','null');

            io.to(''+data.gameId).emit('end_game_and_play_new_game',response);
            
        }
    })
    
    socket.on('accept_to_play_new_game',async (data)=>{
        let continueRoomGame = await RedisClient.hgetall('room_game_continue:'+data.gameId);
        if(data.userId == continueRoomGame.host_id){
            if(data.accept === "true"){
                await RedisClient.hset('room_game_continue:'+data.gameId,
                'host_accept_continue','true')
                socket.join(''+data.gameId)
            }else{
                await RedisClient.hset('room_game_continue:'+data.gameId,
                'host_accept_continue','false');
                await RedisClient.hmset('room_game:'+data.gameId,
                'host_id',continueRoomGame.opponent_id,
                'opponent_id','null')
            }
        }else{
            if(data.accept === "true"){
                await RedisClient.hset('room_game_continue:'+data.gameId,
                'opponent_accept_continue','true')
                socket.join(''+data.gameId)
            }else{
                await RedisClient.hset('room_game_continue:'+data.gameId,
                'opponent_accept_continue','false')
            }
        }

        continueRoomGame = await RedisClient.hgetall('room_game_continue:'+data.gameId);

        if(continueRoomGame.host_accept_continue 
            && continueRoomGame.opponent_accept_continue){
                io.to(''+data.gameId).emit('ready_to_start_game',data.gameId);
                await RedisClient.del('room_game_continue:'+data.gameId);
            }
        else if(!continueRoomGame.host_accept_continue 
            && !continueRoomGame.opponent_accept_continue){
                await RedisClient.del('room_game:'+data.gameId);
                await RedisClient.del('room_game_continue:'+data.gameId);
                caroGames.removeGameByGameId(data.gameId);
            }
    })
    
});

async function getNewWaitingRoomList()
{
    let waitingRoomGames=[];
    let roomGames = await RedisClient.keys('room_game:*')
    for(let roomGame of roomGames){
        let status = await RedisClient.hget(roomGame,'status');
        if(status==='waiting'){
            let roomGameDetailInfo = await RedisClient.hgetall(roomGame);
            let host = await RedisClient.hgetall('user:'+roomGameDetailInfo.host_id);
            if(roomGameDetailInfo && host){
                let gameId = roomGame.split(":")[1];
                roomGameDetailInfo.room_game_id=gameId;
                roomGameDetailInfo.host_name=host.username;
                waitingRoomGames.push(roomGameDetailInfo);
            }
        }

    }
    return waitingRoomGames;
}

server.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});

module.exports={
    io:io
}