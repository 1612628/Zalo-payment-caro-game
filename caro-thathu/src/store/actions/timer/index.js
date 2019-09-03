export const startDecrementTime=()=>{
    return{
        type:'START_TIMER',
        payload:{
            isMyTurn:true
        }
    }
}

export const pauseTime=()=>{
    return{
        type:'PAUSE_TIMER',
        payload:{
            isMyTurn:false
        }
    }
}
export const restartTime = () =>{
    return {
        type:'RESTART_TIMER',
        payload:{
            isMyTurn:false
        }
    }
}
export const restartTurn =()=>{
    return{
        type:'RESTART_NEW_TURN',
        payload:{
            isMyTurn:true
        }
    }
}

