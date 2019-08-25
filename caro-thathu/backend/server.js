const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const port = process.env.PORT || 4001;

const routes = require('./routes/index');

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

const cors = require('cors');

app.use(cors({
    origin: "*",
    methods: "*"
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);


const RedisClient = require('./databases/redisDatabase');
const jwtUtil = require('./controllers/jwtUtils/jwtUtils');

io.use(function (socket, next) {
    console.log('socket middleware')
    if (socket.handshake.query && socket.handshake.query.token) {
        let decoded = jwtUtil.checkToken(socket.handshake.query.token);
        if (decoded === null) {
            return next(new Error('Authentication error'))
        }
        socket.decoded = decoded;
        next();
    } else {
        return next(new Error('Authentication error'))
    }
})

var CaroGameList = require('./caro-game-list.js');
var CaroGame = require('./caro-game.js');
var caroGames = new CaroGameList();

const mongoRoomGameModel = require('./databases/mongoDatabase/models/roomGame');
const mongoUserModel = require('./databases/mongoDatabase/models/user');

io.on("connection", function (socket) {
    console.log("New client socket connected");

    socket.on("user_id", (id) => {
        console.log('socket get user id: ' + id);
        RedisClient.set('socket:' + socket.id + ':' + id, id);
    })
    socket.on("disconnect", async () => {
        console.log("Client disconnected")
        let socketRedis = await RedisClient.keys('socket:' + socket.id + ':*');
        let id = await RedisClient.get(socketRedis);
        await RedisClient.hset("user:" + id, 'is_online', 'false');
        await RedisClient.del(socketRedis);
    });

    socket.on('create_game', async (data) => {
        console.log('socker create room game: ' + data.gameId);
        socket.join('' + data.gameId);
        socket.join('chat' + data.gameId);
        let caroGame = new CaroGame(data.gameId);
        caroGames.addGame(caroGame);
        let waitingRoomGames = await getNewWaitingRoomList();
        socket.broadcast.emit('update_list_waiting_game', {
            data: waitingRoomGames,
            userId: data.userId
        })
    })


    socket.on('get_out_of_game', async (data) => {
        console.log('socker get out of game: ');
        let index = caroGames.findIndexGameByGameId(data.gameId)
        let isHostOutGame = true;
        if(index !=null){
            //current user lost
            //get info of host and opponent
            let response =[];
            let roomGame = await RedisClient.hgetall('room_game:'+data.gameId);
            let host = await RedisClient.hgetall('user:'+roomGame.host_id);
            let opponent = await RedisClient.hgetall('user:'+roomGame.opponent_id);
            let bettingGolds = parseInt(roomGame.betting_golds);
            let hostGolds = parseInt(host.golds);
            let bonusGolds = 1000;
    

            if(opponent == null)
            {
                //remove old game
                await RedisClient.del('room_game:' + data.gameId);
                socket.leave('' + data.gameId);
                socket.leave('chat' + data.gameId);
                let waitingRoomGames = await getNewWaitingRoomList();
                socket.broadcast.emit('update_list_waiting_game', {
                    data: waitingRoomGames,
                    userId: data.userId
                })
                return;
            }
            else
            {
                let opponentGolds = parseInt(opponent.golds);
                let opponentTotalPlayedGame = parseInt(opponent.total_played_game);
                let hostTotalPlayedGame = parseInt(host.total_played_game);
                
                if(data.userId==roomGame.host_id){

                    roomGame.winner_id=roomGame.opponent_id;                
                    
                    await RedisClient.hmset('user:'+roomGame.host_id,
                    'total_played_game',hostTotalPlayedGame+1,
                    'golds',hostGolds-bettingGolds);
                    await RedisClient.hmset('user:'+roomGame.opponent_id,
                    'total_played_game',opponentTotalPlayedGame+1,
                    'golds',opponentGolds+bettingGolds+bonusGolds)
    
                    await RedisClient.zincrby('leaderboard',bettingGolds,roomGame.opponent_id)
                    await RedisClient.zincrby('leaderboard',-bettingGolds,roomGame.host_id);

    
                    await mongoUserModel.findByIdAndUpdate(roomGame.host_id,
                        {
                            golds:hostGolds-bettingGolds,
                            total_played_game:hostTotalPlayedGame+1
    
                        })
    
                    let opponentMongo = await mongoUserModel.findById(roomGame.opponent_id);
                    await mongoUserModel.findByIdAndUpdate(roomGame.opponent_id,
                        {
                            golds:opponentGolds+bettingGolds+bonusGolds,
                            won_game:opponentMongo.won_game+1,
                            total_played_game:opponentMongo.total_played_game+1,
                        }
                    )
                    
                }else{
                    isHostOutGame = false;

                    await RedisClient.hset('user:'+roomGame.host_id,
                    'total_played_game',hostTotalPlayedGame+1,
                    'golds',hostGolds+bettingGolds+bonusGolds);

                    await RedisClient.hmset('user:'+roomGame.opponent_id,
                    'total_played_game',opponentTotalPlayedGame+1,
                    'golds',opponentGolds-bettingGolds)
    
                    await RedisClient.zincrby('leaderboard',-bettingGolds,roomGame.opponent_id)
                    await RedisClient.zincrby('leaderboard',bettingGolds,roomGame.host_id);
    
    
                    await mongoUserModel.findByIdAndUpdate(roomGame.opponent_id,
                        {
                            golds:opponentGolds-bettingGolds,
                            total_played_game:opponentTotalPlayedGame+1
                        })
                    let hostMongo = await mongoUserModel.findById(roomGame.host_id);
                    await mongoUserModel.findByIdAndUpdate(roomGame.host_id,
                        {
                            golds:hostGolds+bettingGolds+bonusGolds,
                            won_game:hostMongo.won_game+1,
                            total_played_game:hostMongo.total_played_game+1
                        }
                        )
                }
            }

            roomGame.status = 'end'
            //save to mongoose
            let gameModel = new mongoRoomGameModel({
                host_id:roomGame.host_id,
                opponent_id:roomGame.opponent_id,
                winner_id:roomGame.winner_id,
                betting_golds:bettingGolds,
                status:roomGame.status
            })
            await gameModel.save(function(err,game){
                if(err){
                    console.log('gameModel save Error: '+err);
                }
                console.log("gameModel save successful");
            })



            //remove old game
            await RedisClient.del('room_game:' + data.gameId);

            let newHostId = roomGame.host_id;
            if(isHostOutGame)
            {   
                newHostId = roomGame.opponent_id;
            }
            let idGameCount = await RedisClient.incr('idGameCount');
            await RedisClient.hmset('room_game:'+idGameCount,
            'host_id',newHostId,
            'betting_golds',bettingGolds,
            'status','waiting',
            'opponent_id','null',
            'winner_id','null',
            'host_ready','false',
            'opponent_ready','false');

            response.push({
                gameId:idGameCount,
                bettingGolds:bettingGolds,
                bonusGolds:1000,
                opponent:null
            })

            console.log(response);
            caroGames.removeGameByGameId(data.gameId);
            let caroGame = new CaroGame(idGameCount);
            caroGames.addGame(caroGame);
            //send message to user in room
            io.sockets.in('' + data.gameId).clients((err, clients) => {
                clients.forEach((client) => {
                    const clientSocket = io.of('/').connected[client];
                    if (client !== socket.id) {
                        clientSocket.join(''+idGameCount);
                        clientSocket.emit('opponent_out_game',response);
                    }
                })
            })
            socket.leave('' + data.gameId);
            socket.leave('chat' + data.gameId);
        } 
    })

    socket.on('chat', data => {
        console.log("socket chat");
        console.log(data);
        io.sockets.in('chat' + data.gameId).emit('message_come', {
            message: data.message,
            time: data.time,
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
                if(client != socket.id){
                    const clientSocket = io.of('/').connected[client];
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

        io.sockets.in('' + data.gameId).clients((err, clients) => {
            clients.forEach((client) => {
                io.of('/').connected[client]
                    .emit('ready_to_start_game', data.gameId);
            })
        })
        let waitingRoomGames = getNewWaitingRoomList();
        socket.broadcast.emit('update_list_waiting_game', {
            data: waitingRoomGames,
            userId: data.userId
        })
    })

    socket.on('ready_to_play', async (data) => {
        let roomGame = await RedisClient.hgetall('room_game:' + data.gameId);
        if (data.userId == roomGame.host_id) {
            await RedisClient.hset('room_game:' + data.gameId, 'host_ready', 'true');
        } else {
            await RedisClient.hset('room_game:' + data.gameId, 'opponent_ready', 'true');
        }

        roomGame = await RedisClient.hgetall('room_game:' + data.gameId);
        if (roomGame.host_ready === 'true' && roomGame.opponent_ready === 'true') {
            // let clients = io.sockets.adapter.rooms[''+data.gameId].sockets;

            // random who first
            // 0 is host and 1 id opponent
            let first = Math.round(Math.random());
            let response = {};
            if (first == 0) {
                response = {
                    firstUserId: roomGame.host_id,
                    patterns: [
                        {
                            patternType: 'X',
                            userId: roomGame.host_id
                        },
                        {
                            patternType: 'O',
                            userId: roomGame.opponent_id
                        }
                    ]

                }
            } else {
                response = {
                    firstUserId: roomGame.opponent_id,
                    patterns: [
                        {
                            patternType: 'X',
                            userId: roomGame.opponent_id
                        },
                        {
                            patternType: 'O',
                            userId: roomGame.host_id
                        }
                    ]

                }
            }
            // /random who first

            // for(const client of clients){
            //     client.emit('start_game',response);
            // }
            await RedisClient.hset('room_game:' + data.gameId, 'status', 'playing');
            io.to('' + data.gameId).emit('start_game', response);


        }
    })

    socket.on('play_a_game_turn',async (data)=>{
        let index = caroGames.findIndexGameByGameId(data.gameId)
        if(index !=null){
            
            let resCode = await caroGames.playerPlayATurnOfGameIndex(index,data.y,data.x,data.pattern);
            console.log(resCode);
            if(resCode == 0){
                //current user win
                let response = [];

                let roomGame = await RedisClient.hgetall('room_game:' + data.gameId);
                let host = await RedisClient.hgetall('user:' + roomGame.host_id);
                let opponent = await RedisClient.hgetall('user:' + roomGame.opponent_id);

                let opponentGolds = parseInt(opponent.golds);
                let opponentTotalPlayedGame = parseInt(opponent.total_played_game);
                let hostGolds = parseInt(host.golds);
                let hostTotalPlayedGame = parseInt(host.total_played_game);
                let bettingGolds = parseInt(roomGame.betting_golds);
                let bonusGolds = 1000;
                

                if (data.userId != roomGame.host_id) {

                    roomGame.winner_id = roomGame.opponent_id;
                    hostGolds = hostGolds- bettingGolds;
                    opponentGolds = opponentGolds+bettingGolds+bonusGolds;

                    await RedisClient.hset('user:' + roomGame.host_id,
                        'total_played_game', hostTotalPlayedGame + 1,
                        'golds', hostGolds);
                    await RedisClient.hmset('user:' + roomGame.opponent_id,
                        'total_played_game', opponentTotalPlayedGame + 1,
                        'golds', opponentGolds)

                    await RedisClient.zincrby('leaderboard',bettingGolds,roomGame.opponent_id)
                    await RedisClient.zincrby('leaderboard',-bettingGolds,roomGame.host_id);

                    
                    await mongoUserModel.findByIdAndUpdate(roomGame.host_id,
                        {
                            golds:hostGolds,
                            total_played_game:hostTotalPlayedGame+1

                        })
                    
                    let opponentMongo = await mongoUserModel.findById(roomGame.opponent_id);
                    
                    await mongoUserModel.findByIdAndUpdate(roomGame.opponent_id,
                        {
                            golds:opponentGolds,
                            won_game:opponentMongo.won_game+1,
                            total_played_game:opponentMongo.total_played_game+1,
                        }
                    )

                    
                    response.push({
                        type:'OLD_GAME',
                        gameId:data.gameId,
                        betting_golds:bettingGolds,
                        winner:roomGame.opponent_id,
                        loser:roomGame.host_id,
                        bonus_golds:bonusGolds
                    })

                } else {
                    roomGame.winner_id = roomGame.host_id;
                    opponentGolds = opponentGolds - bettingGolds;
                    hostGolds = hostGolds+bettingGolds+bonusGolds;

                    await RedisClient.hset('user:' + roomGame.host_id,
                        'total_played_game', hostTotalPlayedGame + 1,
                        'golds', hostGolds);
                    await RedisClient.hmset('user:' + roomGame.opponent_id,
                        'total_played_game', opponentTotalPlayedGame + 1,
                        'golds', opponentGolds)

                    await RedisClient.zincrby('leaderboard',-bettingGolds,roomGame.opponent_id)
                    await RedisClient.zincrby('leaderboard',bettingGolds,roomGame.host_id);

                    
                    await mongoUserModel.findByIdAndUpdate(roomGame.opponent_id,
                        {
                            golds:opponentGolds,
                            total_played_game:opponentTotalPlayedGame+1
                        })
                    
                    let hostMongo = await mongoUserModel.findById(roomGame.host_id);
                    
                    await mongoUserModel.findByIdAndUpdate(roomGame.host_id,
                        {
                            golds:hostGolds,
                            won_game:hostMongo.won_game+1,
                            total_played_game:hostMongo.total_played_game+1
                        }
                        )

                    response.push({
                        type:'OLD_GAME',
                        gameId:data.gameId,
                        betting_golds:bettingGolds,
                        winner:roomGame.host_id,
                        loser:roomGame.opponent_id,
                        bonus_golds:bonusGolds
                    })
                }
                roomGame.status = 'end'

                let gameModel = new mongoRoomGameModel({
                    host_id:roomGame.host_id,
                    opponent_id:roomGame.opponent_id,
                    winner_id:roomGame.winner_id,
                    betting_golds:bettingGolds,
                    status:roomGame.status
                })
                await gameModel.save(function(err,game){
                    if(err){
                        console.log('gameModel save Error: '+err);
                    }
                    console.log("gameModel save successful");
                })



                //remove old game
                await RedisClient.del('room_game:' + data.gameId);

                //create new game
                let idGameCount = await RedisClient.incr('idGameCount');

                if(opponentGolds >= bettingGolds && hostGolds>= bettingGolds){
                    await RedisClient.hmset('room_game:'+idGameCount,
                    'host_id',roomGame.host_id,
                    'betting_golds',bettingGolds,
                    'status','ready',
                    'opponent_id',roomGame.opponent_id,
                    'winner_id','null',
                    'host_ready','false',
                    'opponent_ready','false');

                    response.push({
                        type:'NEW_GAME',
                        gameId:idGameCount,
                        hostId:roomGame.host_id,
                        opponentId:roomGame.opponent_id
                    })
    
                    //create temp continue room game
                    await RedisClient.hmset('room_game_continue:'+idGameCount,
                    'host_id',roomGame.host_id,
                    'betting_golds',bettingGolds,
                    'status','waiting',
                    'opponent_id',roomGame.opponent_id,
                    'host_accept_continue','null',
                    'opponent_accept_continue','null');
                }else if(opponentGolds<bettingGolds && hostGolds>=bettingGolds){
                    await RedisClient.hmset('room_game:'+idGameCount,
                    'host_id',roomGame.host_id,
                    'betting_golds',bettingGolds,
                    'status','ready',
                    'opponent_id','null',
                    'winner_id','null',
                    'host_ready','false',
                    'opponent_ready','false');

                    response.push({
                        type:'NEW_GAME',
                        gameId:idGameCount,
                        hostId:roomGame.host_id,
                        opponentId: null
                    })
                }else if(hostGolds<bettingGolds && opponentGolds>=bettingGolds){
                    await RedisClient.hmset('room_game:'+idGameCount,
                    'host_id',roomGame.opponent_id,
                    'betting_golds',bettingGolds,
                    'status','ready',
                    'opponent_id','null',
                    'winner_id','null',
                    'host_ready','false',
                    'opponent_ready','false');

                    response.push({
                        type:'NEW_GAME',
                        gameId:idGameCount,
                        hostId:roomGame.opponent_id,
                        opponentId: null
                    })
                }
                
                caroGames.removeGameByGameId(data.gameId);
                let caroGame = new CaroGame(idGameCount);
                caroGames.addGame(caroGame);

                io.to(''+data.gameId).emit('end_game_and_play_new_game',response);
                
            }else if(resCode==2){
                // next turn
                console.log('next turn');
                io.sockets.in(''+data.gameId).clients((err,clients)=>{
                    console.log(clients,socket.id);
                    for(const client of clients){
                        if(client != socket.id){
                            console.log('client emit',client);
                            const clientSocket = io.of('/').connected[client];
                            clientSocket.emit('next_turn',{
                                gameId:data.gameId,
                                y:data.y,
                                x:data.x,
                                pattern:data.pattern
                            });
                        }
                    }
                })
            } else {
                //draw
                let response = [];

                let roomGame = await RedisClient.hgetall('room_game:' + data.gameId);
                // let host = await RedisClient.hgetall('user:' + roomGame.host_id);
                // let opponent = await RedisClient.hgetall('user:' + roomGame.opponent_id);

                let bettingGolds = parseInt(roomGame.betting_golds);

                let opponentMongo = await mongoUserModel.findById(roomGame.opponent_id);
                await mongoUserModel.findByIdAndUpdate(roomGame.opponent_id,
                    {
                        draw_game: opponentMongo.draw_game + 1,
                        total_played_game: opponentMongo.total_played_game + 1
                    })
                let hostMongo = await mongoUserModel.findById(roomGame.host_id);
                await mongoUserModel.findByIdAndUpdate(roomGame.host_id,
                    {
                        draw_game: hostMongo.draw_game + 1,
                        total_played_game: hostMongo.total_played_game + 1
                    })
                response.push({
                    type: 'OLD_GAME',
                    gameId: data.gameId,
                    betting_golds: roomGame.betting_golds,
                    winner: null,
                    loser: null,
                })

                roomGame.status = 'end'

                let gameModel = new mongoRoomGameModel({
                    host_id: roomGame.host_id,
                    opponent_id: roomGame.opponent_id,
                    winner_id: null,
                    betting_golds: roomGame.betting_golds,
                    status: 'draw'
                })
                await gameModel.save(function (err, game) {
                    if (err) {
                        console.log('gameModel save Error: ' + err);

                    }
                    console.log("gameModel save successful");

                })

                //remove old game
                await RedisClient.del('room_game:' + data.gameId);

                //create new game
                let idGameCount = await RedisClient.incr('idGameCount');
                await RedisClient.hmset('room_game:' + idGameCount,
                    'host_id', roomGame.host_id,
                    'betting_golds', bettingGolds,
                    'status', 'waiting',
                    'opponent_id', roomGame.opponent_id,
                    'winner_id', 'null',
                    'host_ready', 'false',
                    'opponent_ready', 'false');

                response.push({
                    type: 'NEW_GAME',
                    gameId: idGameCount,
                    hostId: roomGame.host_id,
                    opponent: roomGame.opponent_id
                })

                //create temp continue room game
                await RedisClient.hmset('room_game_continue:' + idGameCount,
                    'host_id', roomGame.host_id,
                    'betting_golds', bettingGolds,
                    'status', 'waiting',
                    'opponent_id', roomGame.opponent_id,
                    'host_accept_continue', 'null',
                    'opponent_accept_continue', 'null');

                caroGames.removeGameByGameId(data.gameId);
                let caroGame = new CaroGame(idGameCount);
                caroGames.addGame(caroGame);

                io.to('' + data.gameId).emit('end_game_and_play_new_game', response);
            }
        }
    })

    socket.on('play_time_out',async (data)=>{
        let index = caroGames.findIndexGameByGameId(data.gameId)
        if(index !=null){
            //current user lost
            let response =[];
            let roomGame = await RedisClient.hgetall('room_game:'+data.gameId);
            let host = await RedisClient.hgetall('user:'+roomGame.host_id);
            let opponent = await RedisClient.hgetall('user:'+roomGame.opponent_id);

            let opponentGolds = parseInt(opponent.golds);
            let opponentTotalPlayedGame = parseInt(opponent.total_played_game);
            let hostGolds = parseInt(host.golds);
            let hostTotalPlayedGame = parseInt(host.total_played_game);
            let bettingGolds = parseInt(roomGame.betting_golds);
            let bonusGolds = 1000;

            
            if(data.userId==roomGame.host_id){

                roomGame.winner_id=roomGame.opponent_id;

                hostGolds = hostGolds-bettingGolds;
                opponentGolds=opponentGolds+bettingGolds+bonusGolds;

                await RedisClient.hmset('user:'+roomGame.host_id,
                'total_played_game',hostTotalPlayedGame+1,
                'golds',hostGolds);
                await RedisClient.hmset('user:'+roomGame.opponent_id,
                'total_played_game',opponentTotalPlayedGame+1,
                'golds',opponentGolds)

                await RedisClient.zincrby('leaderboard',bettingGolds,roomGame.opponent_id)
                await RedisClient.zincrby('leaderboard',-bettingGolds,roomGame.host_id);

                await mongoUserModel.findByIdAndUpdate(roomGame.host_id,
                    {
                        golds:hostGolds,
                        total_played_game:hostTotalPlayedGame+1

                    })
                let opponentMongo = await mongoUserModel.findById(roomGame.opponent_id);
                
                await mongoUserModel.findByIdAndUpdate(roomGame.opponent_id,
                    {
                        golds:opponentGolds,
                        won_game:opponentMongo.won_game+1,
                        total_played_game:opponentMongo.total_played_game+1,
                    }
                )
                
                response.push({
                    type:'OLD_GAME',
                    gameId:data.gameId,
                    betting_golds:bettingGolds,
                    winner:roomGame.opponent_id,
                    loser:roomGame.host_id,
                    bonus_golds:bonusGolds
                })

            }else{

                hostGolds = hostGolds+bettingGolds+bonusGolds
                opponentGolds = opponentGolds-bettingGolds;

                await RedisClient.hset('user:'+roomGame.host_id,
                'total_played_game',hostTotalPlayedGame+1,
                'golds',hostGolds);
                await RedisClient.hmset('user:'+roomGame.opponent_id,
                'total_played_game',opponentTotalPlayedGame+1,
                'golds',opponentGolds)

                await RedisClient.zincrby('leaderboard',-bettingGolds,roomGame.opponent_id)
                await RedisClient.zincrby('leaderboard',bettingGolds,roomGame.host_id);

                await mongoUserModel.findByIdAndUpdate(roomGame.opponent_id,
                    {
                        golds:opponentGolds,
                        total_played_game:opponentTotalPlayedGame+1
                    })
                let hostMongo = await mongoUserModel.findById(roomGame.host_id);

                await mongoUserModel.findByIdAndUpdate(roomGame.host_id,
                    {
                        golds:hostGolds,
                        won_game:hostMongo.won_game+1,
                        total_played_game:hostMongo.total_played_game+1
                    }
                    )

                response.push({
                    type:'OLD_GAME',
                    gameId:data.gameId,
                    betting_golds:bettingGolds,
                    winner:roomGame.host_id,
                    loser:roomGame.opponent_id,
                    bonus_golds:bonusGolds
                })
            }
            roomGame.status = 'end'

            //save to mongoose
            let gameModel = new mongoRoomGameModel({
                host_id:roomGame.host_id,
                opponent_id:roomGame.opponent_id,
                winner_id:roomGame.winner_id,
                betting_golds:bettingGolds,
                status:roomGame.status
            })
            await gameModel.save(function(err,game){
                if(err){
                    console.log('gameModel save Error: '+err);
                }
                console.log("gameModel save successful");
            })

            //remove old game
            await RedisClient.del('room_game:' + data.gameId);

            //create new game
            let idGameCount = await RedisClient.incr('idGameCount');

            if(opponentGolds >= bettingGolds && hostGolds>= bettingGolds){
                await RedisClient.hmset('room_game:'+idGameCount,
                'host_id',roomGame.host_id,
                'betting_golds',bettingGolds,
                'status','ready',
                'opponent_id',roomGame.opponent_id,
                'winner_id','null',
                'host_ready','false',
                'opponent_ready','false');

                response.push({
                    type:'NEW_GAME',
                    gameId:idGameCount,
                    hostId:roomGame.host_id,
                    opponentId:roomGame.opponent_id
                })

                //create temp continue room game
                await RedisClient.hmset('room_game_continue:'+idGameCount,
                'host_id',roomGame.host_id,
                'betting_golds',bettingGolds,
                'status','waiting',
                'opponent_id',roomGame.opponent_id,
                'host_accept_continue','null',
                'opponent_accept_continue','null');
            }else if(opponentGolds<bettingGolds && hostGolds>=bettingGolds){
                await RedisClient.hmset('room_game:'+idGameCount,
                'host_id',roomGame.host_id,
                'betting_golds',bettingGolds,
                'status','ready',
                'opponent_id','null',
                'winner_id','null',
                'host_ready','false',
                'opponent_ready','false');

                response.push({
                    type:'NEW_GAME',
                    gameId:idGameCount,
                    hostId:roomGame.host_id,
                    opponentId: null
                })
            }else if(hostGolds<bettingGolds && opponentGolds>=bettingGolds){
                await RedisClient.hmset('room_game:'+idGameCount,
                'host_id',roomGame.opponent_id,
                'betting_golds',bettingGolds,
                'status','ready',
                'opponent_id','null',
                'winner_id','null',
                'host_ready','false',
                'opponent_ready','false');

                response.push({
                    type:'NEW_GAME',
                    gameId:idGameCount,
                    hostId:roomGame.opponent_id,
                    opponentId: null
                })
            }

            caroGames.removeGameByGameId(data.gameId);
            let caroGame = new CaroGame(idGameCount);
            caroGames.addGame(caroGame);

            
            io.to(''+data.gameId).emit('end_game_and_play_new_game',response);
       
            
        }
    })
    
    socket.on('accept_to_play_new_game',async (data)=>{
        let continueRoomGame = await RedisClient.hgetall('room_game_continue:'+data.gameId);
        if(data.userId == continueRoomGame.host_id){
            if(data.accept === "true"){
                console.log('host accept')
                await RedisClient.hset('room_game_continue:'+data.gameId,
                'host_accept_continue','true')
                
                socket.join(''+data.gameId)
                socket.join('chat'+data.gameId);
                if(continueRoomGame.opponent_accept_continue == 'false'){
                    await RedisClient.hmset('room_game:'+data.gameId,
                    'status','waiting',
                    'opponent_id','null')
                    await RedisClient.del('room_game_continue:'+data.gameId);
                    socket.emit('opponent_get_out_of_game',data.gameId);

                    io.sockets.in(''+data.gameId).clients((err,clients)=>{
                        clients.forEach(async (client)=>{
                            if(client != socket.id){
                                const clientSocket = io.of('/').connected[client];
                                let waitingRoomGames = await getNewWaitingRoomList();
                                clientSocket.emit('update_list_waiting_game',{
                                    data: waitingRoomGames,
                                });
                            }
                        })
                    })
                }

            }else{
                console.log('host reject')
                await RedisClient.hset('room_game_continue:'+data.gameId,
                'host_accept_continue','false');
                if(continueRoomGame.opponent_accept_continue == 'true'){
                    await RedisClient.hmset('room_game:'+data.gameId,
                    'status','waiting',
                    'host_id',continueRoomGame.opponent_id,
                    'opponent_id','null')
                    await RedisClient.del('room_game_continue:'+data.gameId);

                    io.sockets.in(''+data.gameId).clients((err,clients)=>{
                        clients.forEach((client)=>{
                            if(client != socket.id){
                                const clientSocket = io.of('/').connected[client];
                                clientSocket.emit('opponent_get_out_of_game',data.gameId);
                            }
                        })
                    })
                    
                }
            }
        }else{
            if(data.accept === "true"){
                console.log('opponent accept')
                await RedisClient.hset('room_game_continue:'+data.gameId,
                'opponent_accept_continue','true')
                
                socket.join(''+data.gameId)
                socket.join('chat'+data.gameId);
                if(continueRoomGame.host_accept_continue== 'false'){
                    await RedisClient.hmset('room_game:'+data.gameId,
                    'status','waiting',
                    'host_id',continueRoomGame.opponent_id,
                    'opponent_id','null')
                    await RedisClient.del('room_game_continue:'+data.gameId);
                    socket.emit('opponent_get_out_of_game',data.gameId);

                    io.sockets.in(''+data.gameId).clients((err,clients)=>{
                        clients.forEach(async (client)=>{
                            if(client != socket.id){
                                const clientSocket = io.of('/').connected[client];
                                let waitingRoomGames = await getNewWaitingRoomList();
                                clientSocket.emit('update_list_waiting_game',{
                                    data: waitingRoomGames,
                                });
                            }
                        })
                    })
                }
            }else{
                console.log('opponent reject')
                await RedisClient.hset('room_game_continue:'+data.gameId,
                'opponent_accept_continue','false')
                if(continueRoomGame.host_accept_continue == 'true'){
                    await RedisClient.hmset('room_game:'+data.gameId,
                    'status','waiting',
                    'opponent_id','null')
                    await RedisClient.del('room_game_continue:'+data.gameId);

                    io.sockets.in(''+data.gameId).clients((err,clients)=>{
                        clients.forEach((client)=>{
                            if(client != socket.id){
                                const clientSocket = io.of('/').connected[client];
                                clientSocket.emit('opponent_get_out_of_game',data.gameId);
                            }
                        })
                    })
                    
                }
            }
        }

        continueRoomGame = await RedisClient.hgetall('room_game_continue:'+data.gameId);
        if(continueRoomGame && continueRoomGame.host_accept_continue == 'true'
            && continueRoomGame.opponent_accept_continue =='true'){
                console.log('two accept')
                io.to(''+data.gameId).emit('ready_to_start_game',data.gameId);
                await RedisClient.del('room_game_continue:'+data.gameId);
            }
        else if(continueRoomGame && continueRoomGame.host_accept_continue ==='false'
            && continueRoomGame.opponent_accept_continue === 'false'){
                console.log('two reject')
                await RedisClient.del('room_game:'+data.gameId);
                await RedisClient.del('room_game_continue:'+data.gameId);
                caroGames.removeGameByGameId(data.gameId);
            }
    })

});

async function getNewWaitingRoomList() {
    let waitingRoomGames = [];
    let roomGames = await RedisClient.keys('room_game:*')
    for (let roomGame of roomGames) {
        let status = await RedisClient.hget(roomGame, 'status');
        if (status === 'waiting') {
            let roomGameDetailInfo = await RedisClient.hgetall(roomGame);
            let host = await RedisClient.hgetall('user:' + roomGameDetailInfo.host_id);
            if (roomGameDetailInfo && host) {
                let gameId = parseInt(roomGame.split(":")[1]);
                roomGameDetailInfo.room_game_id = gameId;
                roomGameDetailInfo.host_name = host.username;
                waitingRoomGames.push(roomGameDetailInfo);
            }
        }

    }
    return waitingRoomGames;
}

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
})