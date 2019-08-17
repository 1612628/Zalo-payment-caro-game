
const redisClient = require('../databases/redisDatabase/index');
const mongoDb = require('../databases/mongoDatabase/index');
const mongoRoomGameModel = require('../databases/mongoDatabase/models/roomGame');
const mongoUserModel = require('../databases/mongoDatabase/models/user');
const bcrypt = require('bcrypt');


export const createUser=function(userInfo){
    bcrypt.hash(userInfo.password,10,function(err,hash){
        if (err){
            res.status(500);
            
        }else{
            let user = new mongoUserModel({
                username:userInfo.username,
                password:hash,
                email:userInfo.email,
                golds: 10000,
                won_game: 0,
                draw_game:0,
                total_played_game:0
            })
            user.save(function(err,createdUser){
                if(err){
                    console.log('createUser Error: '+err);
                    return null;
                }
                return createdUser;
                
            })
        }
    });
}

export const isUserExisted = function(userInfo){
    mongoUserModel.find(
        {username:userInfo.username}
        )
        .exec(function(err,user){
            if(err){
                console.log("isUserExisted Error: "+err);
                return null;
            }
            if(user){
                return user;
            }
            console.log("isUserExisted user not existed.");
            return null;
        });
}