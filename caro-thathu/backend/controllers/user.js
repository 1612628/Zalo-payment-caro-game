
const redisClient = require('../databases/redisDatabase/index');
const mongoDb = require('../databases/mongoDatabase/index');
const mongoRoomGameModel = require('../databases/mongoDatabase/models/roomGame');
const mongoUserModel = require('../databases/mongoDatabase/models/user');
const bcrypt = require('bcrypt');


async function createUser(userInfo){
    console.log("createUser",userInfo);
    await bcrypt.hash(userInfo.password,10, async function(err,hash){
        if (err){
            console.log("Bcrypt error: ",err);
            return null;
            
        }else{
            let user = await new mongoUserModel({
                username:userInfo.username,
                password:hash,
                email:userInfo.email,
                golds: 10000,
                won_game: 0,
                draw_game:0,
                total_played_game:0
            })
            await user.save(function(err,createdUser){
                if(err){
                    console.log('createUser Error: '+err);
                    return null;
                }
                console.log("createUser successful");
                return createdUser;
            })
        }
    });
}

function isUserExisted(userInfo){
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

module.exports={
    createUser:createUser,
    isUserExisted:isUserExisted
}