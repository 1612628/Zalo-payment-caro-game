// x:-1,
// y:-1,
// isClicked:false,
// typePattern: 'x'
const initialCellListState={
    cellList:null
}

const CellListReducer=(state=initialCellListState,action)=>{
    switch(action.type){
        case "INIT_BOARD":
            return action.payload;
        default:
            return state;
    }
}
export default CellListReducer;