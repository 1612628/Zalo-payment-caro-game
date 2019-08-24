var CaroGame = require('./caro-game.js');

class CaroGameList{
    constructor(){
        console.log('Caro game list created ');
        this.gameList=[];
    }

    findIndexGameByGameId(gameId){
        for(let i =0;i<this.gameList.length;++i){
            if(this.gameList[i].findGame(gameId)){
                return i;
            }
        }
        return null;
    }

    removeGameByGameId(gameId){
        console.log('removeGameByGameId: '+gameId);
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

    playerPlayATurnOfGameIndex(index,y,x,pattern){
        return this.gameList[index].playerPlayTurn(y,x,pattern)
    }
}

module.exports = CaroGameList;