const express=require('express');
const router = express.Router();

const RedisClient = require('../databases/redisDatabase');
const UserController = require('../controllers/user.js');

const jwtUtil = require('../controllers/jwtUtils/jwtUtils');

router.post('/register', (req,res)=>{
    console.log('/register',req.body);
    if(req.body){
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        if(username && password && email){
            var createdUser = UserController.createUser({username:username,password:password,email:email});
            if(createdUser==null){
                res.status(500);
                res.send();
            }else{
                res.status(201);
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

router.post('/login',async (req,res)=>{
    console.log('/login',req.body);
    if(req.body){
        let username = req.body.username;
        let password = req.body.password;
        if(username && password){
            let user = await UserController.isUserExisted({username:username,password:password})
            if(user !=null){
                let token = jwtUtil.createToken(user._id);
                res.status(200);
                res.json({
                    user:user,
                    token:token
                });
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

router.get('/leaderboard',jwtUtil.checkRequestToken,async (req,res)=>{
    console.log('/leaderboard');
    let users = await UserController.getLeaderBoard();
    res.status(200).json(users)
})

router.get('/waitinggames',jwtUtil.checkRequestToken,async (req,res)=>{
    var waitingRoomGames=[];
    await RedisClient.keys('room_game:*',async (err,roomGames)=>{
        if(err){
            console.log('/games Error redis keys:',err);
            res.status(500).send();
        }else{
            var keys = Object.keys(roomGames);
                await roomGames.forEach(async (roomGame,index)=>{
                    await RedisClient.hget(roomGame,'status',async (err,status)=>{
                        if(err){
                            console.log('/games Error redis hget:',err);
                            res.status(500).send();
                        }else if(status==='waiting'){
                            await RedisClient.hgetall(roomGame,(err,roomGameDetailInfo)=>{
                                if(err){
                                    console.log('/games Error redis hgetall:',err);;
                                    res.status(500).send();
                                }else{
                                    waitingRoomGames.push(roomGameDetailInfo);
                                    
                                }
                                if(index===keys.length-1){
                                    res.status(200).json(waitingRoomGames)
                                }
                            })
                            
                        }
                    }) 
                })
        }
    })
})

module.exports=router;