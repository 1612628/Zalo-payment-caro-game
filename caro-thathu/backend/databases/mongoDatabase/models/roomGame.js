let timeStampPlugin = require('./plugins/timestamp')
let mongoose=require('mongoose');

let roomGame = new mongoose.Schema({
    host_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    opponent_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    winner_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    betting_golds:Number,
    status:String
});

roomGame.plugin(timeStampPlugin);

module.exports = mongoose.model('RoomGame',roomGame);