const initialRoomGameState={
    roomGame:{
        roomGameId:-1,
        status:"waiting",
        bettingGolds:0,
        opponent:{
            id:-1,
            username:"-1",
            golds:-1,
            typePattern:null,
            totalPlayedGame: 1,
            
        }
    }    
};

const RoomGameReducer=(state=initialRoomGameState,action)=>{
    switch(action.type){
        case 'CREATE_ROOM_GAME':
            return {...state,
                roomGame:{
                    ...state.roomGame,
                    roomGameId:action.payload.roomGameId,
                    status: action.payload.status,
                    bettingGolds: action.payload.bettingGolds,
                    opponent:{
                        id:-1,
                        username:"-1",
                        golds:-1,
                        typePattern:null
                    }
                }  
                      
            }
        case 'OPPONENT_OUT_GAME':
            console.log(action.payload.newGameId)
                return{
                    ...state,
                    roomGame:{
                        roomGameId:action.payload.newGameId,
                        bettingGolds:action.payload.bettingGolds,
                        status:"waiting",
                        opponent:{
                            id:-1,
                            username:"-1",
                            golds:-1,
                            typePattern:null,
                            totalPlayedGame: 1,
                        }
                    }
                }
        
        case 'GET_OUT_OF_GAME':
            return {
                ...initialRoomGameState
            }

        case 'GET_OUT_OWN_CREATED_ROOM_GAME':
            return{
                ...state
            }
        case 'JOIN_IN_ROOM_GAME':
            return{
                ...state,
                roomGame:action.payload
            }
        case 'OPPONENT_JOIN_GAME':
            return{
                ...state,
                roomGame:{
                    ...state.roomGame,
                    opponent:action.payload
                }
            }
        case 'UPDATE_OPPONENT_TYPE_PATTERN':
            return{
                ...state,
                roomGame:{
                    ...state.roomGame,
                    opponent:{
                        ...state.roomGame.opponent,
                        typePattern:action.payload.typePattern
                    }
                }
            }
        case 'UPDATE_GAME_STATUS':
            return{
                ...state,
                roomGame:{
                    ...state.roomGame,
                    status:action.payload.status
                }
            }
        case 'UPDATE_GAME_ID_TO_CONTINUE_GAME':
            return{
                ...state,
                roomGame:{
                    ...state.roomGame,
                    roomGameId:action.payload.gameId,
                }
            }
        case 'UPDATE_OPPONENT_INFO_TO_CONTINUE_GAME':
            return{
                ...state,
                roomGame:{
                    ...state.roomGame,
                    opponent:{
                        ...state.roomGame.opponent,
                        golds:action.payload.opponentGolds,
                        totalPlayedGame:action.payload.opponentTotalPlayedGame
                    }
                }
            }
        case 'RESET_ROOM_GAME_TO_DEFAULT':
            return initialRoomGameState;
        case 'RESET_OPPONENT_TO_DEFAULT':
            return{
                ...state,
                roomGame:{
                    ...state.roomGame,
                    opponent:{
                        ...initialRoomGameState.roomGame.opponent
                    }
                }
            }
        
        default:
            return state;
    }
}

export default RoomGameReducer;