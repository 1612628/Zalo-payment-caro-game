
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
    return mongoUserModel.findOne(
            {username:userInfo.username}
        )
        .exec()
        .then((user)=>{
            if(user){
                return bcrypt.compare(userInfo.password,user.password)
                .then((success)=>{
                    if(success){
                        console.log("isUserExisted correct password.");
                        return user;
                    }else{
                        console.log("isUserExisted wrong password.");
                        return null;
                    }
                })
            }else{
                console.log("isUserExisted user not existed.");
                return null;
            }            
        })
        .catch(err=>{
            console.log("isUserExisted Error: "+err);
            return null;
        });
}

function getLeaderBoard(){
    return mongoUserModel
    .find({})
    .sort({golds:'desc'})
    .limit(100)
    .select('username golds total_played_game')
    .exec()
    .then((users)=>{
        return users;
    })
    .catch(err=>{
        console.log('getLeaderBoard Error:',err);
        return null;
    });
    
}

module.exports={
    createUser:createUser,
    isUserExisted:isUserExisted,
    getLeaderBoard:getLeaderBoard
}