

class CaroGame {
    constructor(gameId){
        console.log('Caro game board created '+gameId);
        this.height = 15;
        this.width = 15;
        this.gameId = gameId;
        this.boardData= this.createEmptyBoard(this.width,this.height);
        this.checkedCount;
        this.players=[]
    }

    findGame(gameId){
        return this.gameId==gameId;
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

    playerPlayTurn(y,x,pattern){
        if(y>=0 && y<this.height && x>=0 && x<this.width && pattern){
            if(this.boardData[y][x].isChecked==false){
                ++ this.checkedCount;
                this.boardData[y][x].isChecked = true;
                this.boardData[y][x].typePattern = pattern;

                return this.isPlayerWin(y,x,pattern);
            }
        }
        return null;
    }

    // 0 win , 1 draw ,2 next turn
    isPlayerWin(y,x,pattern){

        let left = x-6;
        if(left<0){
            while(left<0){
                left+=1;
            }
        }
        let right =x+6;
        if(right>=this.width){
            while(right>=this.width){
                right-=1;
            }
        }
        let top=y-6;
        if(top<0){
            while(top<0){
                top+=1;
            }
        }
        let bottom = y+6;
        if(bottom>=this.height){
            while(bottom>=this.width){
                bottom-=1;
            }
        }

        let blockedHead=false;
        let blockedTail=true;
        let count=0;

        //check horizontal
        for(let j=x;j>=left;--j){
            let current = this.boardData[y][j];
            if(current.typePattern===pattern){
                ++count;
            }
            else if(current.typePattern === ""){
                break;
            }else{
                blockedHead=true;
                break;   
            }
        }
        for(let j=x+1;j<=right;++j){
            let current = this.boardData[y][j];
            if(current.typePattern===pattern){
                ++count;
            }
            else if(current.typePattern === ""){
                break;
            }else{
                blockedTail=true;
                break;   
            }
        }
        
        console.log('//check horizontal',count);
        if((count==5 && !(blockedHead && blockedTail))){
            return 0;
        }

        blockedHead=false;
        blockedTail=false;
        count=0;
        
        //check vertical
        for(let i=y;i>=top;--i){
            let current = this.boardData[i][x];
            if(current.typePattern===pattern){
                ++count;
            }
            else if(current.typePattern === ""){
                break;
            }else{
                blockedHead=true;
                break;   
            }
        }
        for(let i=y+1;i<=bottom;++i){
            let current = this.boardData[i][x];
            if(current.typePattern===pattern){
                ++count;
            }
            else if(current.typePattern === ""){
                break;
            }else{
                blockedTail=true;
                break;   
            }
        }
        console.log('//check vertical',count);
        if((count==5 && !(blockedHead&&blockedTail))){
            return 0;
        }
        
        blockedHead=false;
        blockedTail=false;
        count=0;
        //check diagonal
        for(let i=x, j=y; i>=left && j>=top; --i,--j){
            let current = this.boardData[j][i];
            if(current.typePattern===pattern){
                ++count;
            }
            else if(current.typePattern === ""){
                break;
            }else{
                blockedHead=true;
                break;   
            }
        }
        for(let i=x+1, j=y+1; i<=right && j<=bottom; ++i, ++j){
            let current = this.boardData[j][i];
            if(current.typePattern===pattern){
                ++count;
            }
            else if(current.typePattern === ""){
                break;
            }else{
                blockedTail=true;
                break;   
            }
        }
        console.log('//check diagonal',count);
        if((count==5 && !(blockedHead&&blockedTail))){
            return 0;
        }

        blockedHead=false;
        blockedTail=false;
        count=0;
        //check back diagonal
        for(let i=x, j=y; i<=right && j>=top; ++i,--j){
            let current = this.boardData[j][i];
            if(current.typePattern===pattern){
                ++count;
            }
            else if(current.typePattern === ""){
                break;
            }else{
                blockedHead=true;
                break;   
            }
        }
        for(let i=x-1, j=y+1; i>=left && j<=bottom; --i, ++j){
            let current = this.boardData[j][i];
            if(current.typePattern===pattern){
                ++count;
            }
            else if(current.typePattern === ""){
                break;
            }else{
                blockedTail=true;
                break;   
            }
        }
        console.log('//check back diagonal',count);
        if((count==5 && !(blockedHead&&blockedTail))){
            return 0;
        }

        if(this.checkedCount == this.height*this.width){
            return 1;
        }
        
        return 2;
    }

}

module.exports = CaroGame;