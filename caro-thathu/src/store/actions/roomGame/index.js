export const createRoomGame=(roomGameId,status,bettingGolds)=>{
    return{
        type:'CREATE_ROOM_GAME',
        payload:{
            roomGameId:roomGameId,
            status:status,
            bettingGolds:bettingGolds,
        }
    }
}

