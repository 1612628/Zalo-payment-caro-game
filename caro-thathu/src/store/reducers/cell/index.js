const initialCell={
    cell:{
        x:-1,
        y:-1,
        isChecked:false,
        typePattern: 'x'
    }    
}

const CellReducer=(state=initialCell,action)=>{
    switch(action.type){
        case "UPDATE_CELL":
            return action.payload;
        default:
            return state;
    }
}
export default CellReducer;