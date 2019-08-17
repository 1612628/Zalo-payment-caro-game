let timeStampPlugin = require('./plugins/timestamp')

let mongoose=require('mongoose');
let validator=require('validator');

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

module.exports = mongoose.model('User',userSchema);