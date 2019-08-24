const initialCellListState={
    cellList:null
}
const CellListReducer=(state=initialCellListState,action)=>{    
    switch(action.type){
        case "INIT_BOARD":
            return{
                ...state,
                cellList:action.payload.board
            }
        case "CELL_CLICK":
            let newCellList =  state.cellList.map((row,y)=>{
                return row.map((cell,x)=>{
                    if(x===action.payload.xcord && y==action.payload.ycord){
                        cell.isChecked = action.payload.isChecked;
                        cell.typePattern = action.payload.typePattern;
                    }
                    return cell;
                })
            })
            return {
                ...state,
                cellList: newCellList
            }
                        
        default:
            return state;
    }
}
export default CellListReducer;