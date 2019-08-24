const initialRoomGameState={
    roomGame:{
        roomGameId:-1,
        status:"waiting",
        bettingGolds:0,
        opponent:{
            id:-1,
            username:"-1",
            golds:-1,
            typePattern:null
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
        default:
            return state;
    }
}

export default RoomGameReducer;