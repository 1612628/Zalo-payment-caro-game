const initialRoomGameState={
    roomGameId:-1,
    status:"waiting",
    opponent:{
        id:-1,
        username:"-1",
        golds:-1
    }
};

export default function RoomGameReducer(state=initialRoomGameState,action){
    switch(action.type){
        default:
            return state;
    }
}