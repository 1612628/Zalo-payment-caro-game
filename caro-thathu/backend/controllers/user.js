
const mongoRoomGameModel = require('../databases/mongoDatabase/models/roomGame');
const mongoUserModel = require('../databases/mongoDatabase/models/user');


function createUser(userInfo){
    console.log("createUser",userInfo);
    let user = new mongoUserModel({
        username:userInfo.username,
        password:userInfo.password,
        email:userInfo.email,
        golds: 10000,
        won_game: 0,
        draw_game:0,
        total_played_game:0
    })
    return user.save()
    .then((createUser)=>{
        console.log("createUser successful");
        return createUser;
    })
    .catch(err=>{
        if(err){
            console.log('createUser Error: '+err);
            return null;
        }
    })
    
}

function isCorrectUser(userInfo){
    console.log('isCorrectUser',userInfo);
    return mongoUserModel.findOne(
            {username:userInfo.username}
        )
        .exec()
        .then((user)=>{
            if(user){
                return user.comparePassword(userInfo.password)
                .then(isMatch=>{
                    console.log("isCorrectUser correct password.");
                    return user;
                })
                .catch(err=>{
                    console.log("isCorrectUser wrong password.");
                    return null;
                })
            }else{
                console.log("isCorrectUser user not existed.");
                return null;
            }            
        })
        .catch(err=>{
            console.log("isCorrectUser Error: "+err);
            return null;
        });
}
function isExistedUser(username){
    console.log('isExistedUser',username);
    return mongoUserModel.findOne(
            {username:username}
        )
        .exec()
        .then((user)=>{
            if(user){
                console.log("isUserExisted user existed.");
                return user;
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

function updateUserPassword(userId,password){
    console.log('updateUserPassword',userId,password);    
    return mongoUserModel.findOneAndUpdate({_id:userId},{password:password})
}

module.exports={
    createUser:createUser,
    isCorrectUser:isCorrectUser,
    isExistedUser:isExistedUser,
    getLeaderBoard:getLeaderBoard,
    updateUserPassword:updateUserPassword
}