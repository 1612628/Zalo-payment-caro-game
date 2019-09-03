

export const generateMockCellList=()=>{
    let cellCount = 15;
    let cellList=[]
    for(let i=0;i<cellCount;++i){
        for(let j=0;j<cellCount;++i){
            cellList.push({
                y:i,
                x:j,
                isChecked:false,
                typePattern:null
            })
        }
    }
    return({cellList:cellList});
}

export const createEmptyBoard=(height, width)=> {
    let data = [];
    for (let i = 0; i < width; i++) {
      data.push([]);
      for (let j = 0; j < height; j++) {
        data[i][j]= {
          x:j,
          y:i,
          isChecked:false,
          typePattern: ""
        }
      }
    }
    return data;
  }