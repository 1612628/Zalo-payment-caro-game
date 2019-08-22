const initialWaitingGameState={
    waitingGames:[]
}

const WaitingGamesReducer=(state=initialWaitingGameState,action)=>{
    switch(action.type){
        case 'UPDATE_WAITING_GAMES':
            return {...state,
                waitingGames:action.payload.reconstructWaitingGame};
        default:
            return state;
    }
}

export default WaitingGamesReducer;