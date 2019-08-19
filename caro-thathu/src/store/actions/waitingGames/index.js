export const updateWaitingGame=(waitingGames)=>{
    return{
        type:'UPDATE_WAITING_GAMES',
        payload:{
            waitingGames:waitingGames
        }
    }
}

