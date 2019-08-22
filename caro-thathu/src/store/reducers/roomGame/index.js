const initialRoomGameState={
    roomGame:{
        roomGameId:-1,
        status:"waiting",
        bettingGolds:0,
        opponent:{
            id:-1,
            username:"-1",
            golds:-1
        }
    }    
};

const RoomGameReducer=(state=initialRoomGameState,action)=>{
    switch(action.type){
        case 'CREATE_ROOM_GAME':
            return {...state,
                roomGame:action.payload        
            }
        default:
            return state;
    }
}

export default RoomGameReducer;