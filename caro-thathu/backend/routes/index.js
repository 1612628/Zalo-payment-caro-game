const express=require('express');
const router = express.Router();

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
});

router.get('/leaderboard',async (req,res)=>{
    let users = await UserController.getLeaderBoard();
    res.status(200).json({"leaderboard":users})
})

module.exports=router;