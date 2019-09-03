const express=require('express');
const router = express.Router();

const mongooseClient = require('../databases/mongoDatabase');
const RedisClient = require('../databases/redisDatabase');
const UserController = require('../controllers/user.js');

const jwtUtil = require('../controllers/jwtUtils/jwtUtils');

router.post('/register',async (req,res)=>{
    console.log('/register',req.body);
    if(req.body){
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        let user = await UserController.isExistedUser(username);
        if(user){
            console.log('/register user existed');
            res.status(409);
            res.send();
        }else{
            if(username && password && email){
                var createdUser = UserController.createUser({username:username,password:password,email:email});
                if(createdUser==null){
                    console.log('/register fail to create user');
                    res.status(500);
                    res.send();
                }else{
                    console.log('/register created user');
                    res.status(201);
                    res.send();
                }
            }else{
                res.status(400);
                res.send();    
            }
        }
        
    }else{
        res.status(400);
        res.send();
    }
    
})

router.post('/login',async (req,res)=>{
    console.log('/login',req.body);
    if(req.body){
        let username = req.body.username;
        let password = req.body.password;
        if(username && password){
            let user = await UserController.isCorrectUser({username:username,password:password})
            console.log(user);
            if(user !=null){
                const userId = user._id.toString();
                let isOnline = await RedisClient.hget('user:'+userId,'is_online')
                
                if(isOnline==='false'){
                    let token = jwtUtil.createToken(user._id);
                        await RedisClient.hset("user:"+user._id.toString(),'is_online','true');
                    res.status(200);
                    res.json({
                        user:user,
                        token:token
                    });
                }else{
                    res.status(409);
                    res.send();
                }
            }else{
                res.status(403);
                res.send(); 
            }            
        }else{
            res.status(400);
            res.send();    
        }
    }else{
        res.status(400);
        res.send();
    }
});

router.post('/logout',async (req,res)=>{
    console.log('/logout',req.body);
    if(req.body){
        let userId = req.body.user_id;
        if(userId){
            let socket= await RedisClient.keys('socket:*:'+userId);
            console.log(socket);
            await RedisClient.del(socket);
            
            await RedisClient.hset("user:"+userId,'is_online','false');
            res.status(200);
            res.send();
        }else{
            res.status(400);
            res.send();socket.idsocket.id
        }
    }else{
        res.status(400);
        res.send();
    }
});

router.get('/leaderboard',async (req,res)=>{
    console.log('/leaderboard');
    let users = await UserController.getLeaderBoard();
    res.status(200).json(users)
})

router.get('/games',async (req,res)=>{
    console.log('get /games')
    var waitingRoomGames=[];
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
            }else{
                console.log('/games Error redis hgetall:');
                res.status(500).send();
                return;
            }
        }else{
            console.log('/games Error redis hget:');
            res.status(500).send();
            return;
        }
    }
    res.status(200).json(waitingRoomGames)
})

router.post('/games',async (req,res)=>{
    console.log('/games create game');
    if(req.body){
        let hostId = req.body.host_id;
        let bettingGolds = req.body.betting_golds;
        if(hostId && bettingGolds){
            let idGameCount = await RedisClient.incr('idGameCount');
            if(idGameCount){
                let ok = await RedisClient.hmset('room_game:'+idGameCount,
                'host_id',hostId,
                'betting_golds',bettingGolds,
                'status','waiting',
                'opponent_id','null','winner_id','null',
                'host_ready','false','opponent_ready','false');
                console.log(ok);
                if(ok){
                    res.status(200).json({roomGameId:idGameCount,betting_golds:bettingGolds,status:'waiting'});
                }else{
                    res.status(500);
                res.send();
                }
            }else{
                res.status(500);
                res.send();
            }
        }else{
            res.status(400);
            res.send();    
        }
    }else{
        res.status(400);
        res.send();
    }
})

router.post('/games/join',async (req,res)=>{
    console.log('/games/join');
    if(req.body){
        let userId = req.body.user_id;
        let userGolds = req.body.user_golds;
        let gameId = req.body.game_id;
        if(userId && userGolds && gameId){
            let status = await RedisClient.hget('room_game:'+gameId,'status');
            if(status=='waiting'){
                let ok = await RedisClient.hmset('room_game:'+gameId,
                'opponent_id',userId,'status','ready');
                if(ok){
                    let roomGame = await RedisClient.hgetall('room_game:'+gameId);
                    
                    let host = await RedisClient.hgetall('user:'+roomGame.host_id);
                    res.status(200).json({
                        game_id:gameId,
                        status:"ready",
                        opponent:{
                            id:roomGame.host_id,
                            name:host.username,
                            golds:host.golds,
                            totalPlayedGame:host.total_played_game
                        }
                    });
                }
            }else{
                res.status(409);
                res.send();
            }
        }else{
            res.status(400);
            res.send();    
        }
    }else{
        res.status(400);
        res.send();
    }
})

var generator = require('generate-password');
const nodemailer = require('nodemailer');

router.post('/forgotpassword', async(req, res) => {
    console.log('/forgotpassword',req.body);
    if(req.body){
        let username = req.body.username;
        let email = req.body.email;
        
        if(username && email){
            let user = await UserController.isExistedUser(username);
            if(user && email===user.email){
                var password = generator.generate({
                    length: 10,
                    numbers: true
                });

                var transporter = nodemailer.createTransport({
                    service: "Gmail",
                    secure: true,
                    auth: {
                        user: 'thathucaro@gmail.com',
                        pass: 'thathucaro123'
                    }
                });

                var mailOptions = {
                    to: email,
                    from: `"ThaThu Caro" <thathucaro@gmail.com>`,
                    subject: 'Reset password',
                    text: 'Dear ' + username+',\n\n' +
                        'You have requested to reset your password\n\n' +
                        'Here your new password: ' + password + '\n\n'
                };
                transporter.sendMail(mailOptions, function(res,err) {});
                UserController.updateUserPassword(user._id,password);
                res.status(200).send();
            }else{
                res.status(400);
                res.send();
            }  
        }else{
            res.status(400).send();
        }
              
    }else{
        res.status(400);
        res.send();
    }
})
module.exports=router;