let timeStampPlugin = require('./plugins/timestamp')

let mongoose=require('mongoose');
let validator=require('validator');
const bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        validate:(value)=>{return validator.isEmail(value)}
    },
    golds: Number,
    won_game: Number,
    draw_game:Number,
    total_played_game:Number
});

userSchema.plugin(timeStampPlugin);

userSchema.pre('save',function(next){
    var user =this;
    if(!user.isModified('password')){
        return next();
    }

    this.password={}
    
    bcrypt.hash(user.password,10)
    .then((hash)=>{
        console.log(hash);
        user.password = hash;
        next()
    })
    .catch(err=>{
        return next(err);
    }) 
})
userSchema.methods.comparePassword = async function(password) {
    return new Promise((resolve,reject)=>{
        bcrypt.compare(password, this.password, function(err, isMatch) {
            if (err) return reject(err);
            resolve(isMatch);
        });
    })
};

module.exports = mongoose.model('User',userSchema);