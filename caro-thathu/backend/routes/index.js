const express=require('express');
const router = express.Router();

const mongooseClient = require('../databases/mongoDatabase');
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
    
            await RedisClient.del('socket:'+userId);
            await RedisClient.hset("user:"+userId,'is_online','false');
            res.status(200);
            res.send();
        }else{
            res.status(400);
            res.send();
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
    var waitingRoomGames=[];
    let roomGames = await RedisClient.keys('room_game:*')
    
    for(let roomGame of roomGames){
        let status = await RedisClient.hget(roomGame,'status');
        if(status==='waiting'){
            let roomGameDetailInfo = await RedisClient.hgetall(roomGame);
            if(roomGameDetailInfo){
                let gameId = roomGame.split(":")[1];
                roomGameDetailInfo.room_game_id=gameId;
                waitingRoomGames.push(roomGameDetailInfo);
            }else{
                console.log('/games Error redis hgetall:',err);;
                res.status(500).send();
            }
        }else{
            console.log('/games Error redis hget:',err);
            res.status(500).send();
        }
    }
    res.status(200).json(waitingRoomGames)
    
})

router.post('/games',async (req,res)=>{
    console.log('/games create game');
    if(req.body){
        let hostId = req.body.host_id;
        let hostName = req.body.host_name;
        let bettingGolds = req.body.betting_golds;
        if(hostId && hostName && bettingGolds){
            let idGameCount = await RedisClient.incr('idGameCount');
            if(idGameCount){
                let ok = await RedisClient.hmset('room_game:'+idGameCount,'host_id',hostId,
                'host_name',hostName,'betting_golds',bettingGolds,'status','waiting');
                console.log(ok);
                if(ok){
                    res.status(200).json({roomGameId:idGameCount,status:'waiting'});
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

module.exports=router;