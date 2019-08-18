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
            console.log('aaaaaaaaaa');
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

module.exports=router;