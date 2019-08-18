const jwt = require('jsonwebtoken');
const config = require('../../config.js');

var jwtOptions={
    expiresIn:"12h"
}

function createToken(payload){
    return jwt.sign(payload,config.secret,jwtOptions);
}

function checkToken(token){
    jwt.verify(token,config.secret,(err,decoded)=>{
        if(err){
            console.log("checkToken Error: "+err);
            return null;
        }else{
            return decoded;
        }
    });
}


module.exports={
    createToken:createToken,
    checkToken:checkToken
}