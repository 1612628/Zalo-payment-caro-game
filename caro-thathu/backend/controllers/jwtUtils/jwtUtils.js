const jwt = require('jsonwebtoken');
const config = require('../../config.js');

var jwtOptions={
    expiresIn: '1h'
}

function createToken(payload){
    return jwt.sign({data:String(payload)},config.secret,jwtOptions);
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

function checkRequestToken(req,res,next){
    let token = req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    if(token){
        jwt.verify(token,config.secret,function(err,decoded){
            if (err) {
                console.log('checkRequestToken unauthorized!')
                return res.status(401).send();
              } else {
                console.log('checkRequestToken authorized!')
                req.decoded = decoded;
                next();
              }
        });
    }else {
        console.log('checkRequestToken token miss!')
        return res.status(401).send();
    }
    
}


module.exports={
    createToken:createToken,
    checkToken:checkToken,
    checkRequestToken:checkRequestToken
}