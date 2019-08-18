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

app.use(bodyParser.json());
app.use(routes);

io.on("connection",function(socket){
    console.log("New client socket connected");
    socket.emit('fromserver',"yeaa");
    socket.on("disconnect",()=>console.log("Client disconnected"));
});

server.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});