const redis = require("redis");
const asyncRedis = require("async-redis");

const mongoUserModel = require('../mongoDatabase/models/user');
const UserController = require('../../controllers/user');

const redisClient = redis.createClient(6379);

const asyncRedisClient = asyncRedis.decorate(redisClient);

asyncRedisClient.on('connect',async ()=>{
    console.log('Redis database connected!');
    
    await asyncRedisClient.del('leaderboard');
    await asyncRedisClient.del('user:*');
    await asyncRedisClient.set('idGameCount',0);
    await asyncRedisClient.del('room_game_continue:*');
    // await asyncRedisClient.del('room_game:*');
    
    let allUsers = await UserController.getLeaderBoard();

    for(let user of allUsers){
        const userId = user._id.toString();
        await asyncRedisClient.zadd('leaderboard',user.golds,userId);
   
        await asyncRedisClient.hmset('user:'+userId,
        'username',user.username,
        'total_played_game',user.total_played_game,
        'golds',user.golds,
        'is_online','false');
        
    }



})
asyncRedisClient.on('error',(err)=>{
    console.log('Error: '+err);
})

module.exports = asyncRedisClient;

