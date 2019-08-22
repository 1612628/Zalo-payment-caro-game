export const InitBoard = (board)=>{
    return {
        type:"INIT_BOARD",
        payload:{
            board
        }
    }
}