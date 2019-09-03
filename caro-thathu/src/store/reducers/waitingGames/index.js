const initialWaitingGameState={
    waitingGames:[]
}

const WaitingGamesReducer=(state=initialWaitingGameState,action)=>{
    switch(action.type){
        case 'UPDATE_WAITING_GAMES':
            return {...state,
                waitingGames:action.payload.reconstructWaitingGame};
        case 'RESET_WAITING_GAMES_TO_DEFAULT':
            return{...initialWaitingGameState}
        default:
            return state;
    }
}

export default WaitingGamesReducer;