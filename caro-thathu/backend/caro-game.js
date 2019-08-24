

class CaroGame {
    constructor(height, width,gameId){
        this.height = height;
        this.width = width;
        this.gameId = gameId;
        this.boardData= this.createEmptyBoard(width,height);

        this.players=[]
    }

    createEmptyBoard(height, width) {
        let data = [];
        for (let i = 0; i < width; i++) {
          data.push([]);
          for (let j = 0; j < height; j++) {
            data[i][j]= {
              isChecked:false,
              typePattern: ""
            }
          }
        }
        return data;
    }

    playerPlayTurn(x,y,pattern){
        if(y>=0 && y<this.height && x>=0 && x<this.width && pattern){
            if(this.boardData[y][x].isChecked==false){
                this.boardData[y][x].isChecked = true;
                this.boardData[y][x].typePattern = pattern;


            }
        }        
    }
    isPlayerWin(x,y,pattern){
        
        let left = y-6;
        if(left<0){
            while(left<0){
                left+=1;
            }
        }
        let right =y+6;
        if(right>=this.width){
            while(right>=this.width){
                right-=1;
            }
        }
        let top=x-6;
        if(top<0){
            while(top<0){
                top+=1;
            }
        }
        let bottom = x+6;
        if(bottom>=this.height){
            while(bottom>=this.width){
                bottom-=1;
            }
        }

        let results=[];
        let tempArr=[];
        let blockedHead=[];
        let blockedTail = [];
        let count =0;

        //check horizontal
        for(let j=y;i>=left;--i){
            let current = this.boardData[y][j];
            if(current.typePattern===pattern){
                ++count;
            }
            else if(current.typePattern === null){
                
            }
        }


    }


}

module.exports = CaroGame;