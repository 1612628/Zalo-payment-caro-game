export const InitBoard = (board)=>{
    return {
        type:"INIT_BOARD",
        payload:{
            board
        }
    }
}

export const CellClick = (xcord, ycord, isChecked, typePattern) => {
    return{
        type:"CELL_CLICK",
        payload:{
            xcord,
            ycord,
            isChecked,
            typePattern
        }
    }

}