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



io.on("connection",function(socket){
    console.log("New client socket connected");

    socket.on("user_id",(id)=>{
         RedisClient.set('socket:'+socket.id,id);
    })
    socket.on("disconnect",async ()=>{
        console.log("Client disconnected")
        let id = await RedisClient.get('socket:'+socket.id);
        await RedisClient.hset("user:"+id,'is_online','false');
        await RedisClient.del('socket:'+socket.id);
    });

    socket.on('updateOnline',()=>{
        
    })
    
});

server.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});