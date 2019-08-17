const express=require('express');
const http=require('http');
const socketIo=require('socket.io');
const axios=require('axios');

const port=process.env.PORT || 4001;

const routes=require('./routes/index');

const app=express();
app.use(routes);

const server = http.createServer(app);

const io=socketIo(server);

const cors = require('cors');

app.use(cors({
    origin:"*",
    methods:"*"
}))

io.on("connection",function(socket){
    console.log("New client connected", socket);

    

    socket.on("disconnect",()=>console.log("Client disconnected"));
});

server.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});