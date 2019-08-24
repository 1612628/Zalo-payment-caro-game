export const createRoomGame=(roomGameId,status,bettingGolds,numberPlayedGame)=>{
    return{
        type:'CREATE_ROOM_GAME',
        payload:{
            roomGameId:roomGameId,
            status:status,
            bettingGolds:bettingGolds,
        }
    }
}

