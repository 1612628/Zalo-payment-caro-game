const initialRoomGameState={
    roomGame:{
        roomGameId:-1,
        status:"waiting",
        opponent:{
            id:-1,
            username:"-1",
            golds:-1
        }
    }    
};

const RoomGameReducer=(state=initialRoomGameState,action)=>{
    switch(action.type){
        default:
            return state;
    }
}

export default RoomGameReducer;