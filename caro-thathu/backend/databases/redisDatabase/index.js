const redis = require('redis');

const redisClient = redis.createClient(6379);
redisClient.on('error',(err)=>{
    console.log('Error: '+err);
})

module.exports = redisClient;

