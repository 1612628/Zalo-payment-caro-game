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

    socket.on('create_game',(gameId)=>{
        console.log('socker create room game: '+gameId);
        socket.join(''+gameId);
    })

    socket.on('get_out_of_game',async (gameId)=>{
        console.log('socker get out of game: '+gameId);
        await RedisClient.del('room_game:'+gameId);
        socket.leave(''+gameId);
    })

    socket.on('join_game',(data)=>{
        console.log('join_game',data);
        socket.join(''+data.gameId);

        let clients = io.sockets.adapter.rooms[''+data.gameId].sockets;
        for(const client of clients){
            if(client.id !== socket.id){
                
                client.emit('opponent_join_game',{
                    gameId:gameId,
                    opponentId:data.userId,
                    opponentName:data.username,
                    opponentGolds:data.golds
                });
            }
        }
        for(const client of clients){
            client.emit('ready_to_start_game',gameId);
        }
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
            let clients = io.sockets.adapter.rooms[''+data.gameId].sockets;
            
            // random who first
            // 0 is host and 1 id opponent

            let first = Math.round(Math.random());
            let response = {};
            if(first==0){
                response={
                    firstUserId:roomGame.host_id,
                    patterns:[
                        {
                            patternType:'x',
                            userId:roomGame.host_id
                        },
                        {
                            patternType:'o',
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
            io.to(''+data.gameId).emit('start_game',response);


        }
    })

    
    
});

server.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});