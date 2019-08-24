var CaroGame = require('./caro-game.js');

class CaroGameList{
    constructor(){
        this.gameList=[];
    }

    findGameByGameId(gameId){
        for(let i =0;i<this.gameList.length;++i){
            if(this.gameList[i].findGame(gameId)){
                return this.gameList[i];
            }
        }
        return null;
    }

    removeGameByGameId(gameId){
        for(let i =0;i<this.gameList.length;++i){
            if(this.gameList[i].findGame(gameId)){
                return this.gameList.splice(i,1);
                
            }
        }
        return null;
    }
    addGame(game){
        this.gameList.push(game);
        return game;
    }
}

module.exports = CaroGameList;