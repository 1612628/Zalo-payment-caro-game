const initialCellListState={
    cellList:[]
}

var cellCount = 15;

function generateMockCellList(){
    cellList=[]
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


export default function CellListReducer(state=initialCellListState,action){
    state= generateMockCellList();
    switch(action.type){
        default:
            return state;
    }
}