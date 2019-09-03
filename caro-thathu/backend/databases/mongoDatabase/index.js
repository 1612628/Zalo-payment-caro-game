let mongoose = require("mongoose");

const server = '127.0.0.1:27017';
const database = 'caro_game_db';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex',true);

class MongoDatabase{
    constructor(){
       this._connect();
    }

    _connect(){
        mongoose.connect(`mongodb://${server}/${database}`)
        .then(()=>{
            console.log("Mongo database connection successful")
        })
        .catch(err=>{
            console.error('Database connection error:',err);
        })
    }
}

module.exports = new MongoDatabase();
