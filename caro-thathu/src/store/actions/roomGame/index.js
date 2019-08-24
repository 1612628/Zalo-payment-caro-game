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
export const getOutOfOwnCreatedRoomGame=()=>{
    return{
        type:'GET_OUT_OWN_CREATED_ROOM_GAME',
        payload:{}
    }
}
export const joinInRoomGame=(roomGameId,status,bettingGolds,opponentId,opponentUsername,opponentGolds)=>{
    return{
        type:'JOIN_IN_ROOM_GAME',
        payload:{
            roomGameId:roomGameId,
            status:status,
            bettingGolds:bettingGolds,
            opponent:{
                id:opponentId,
                username:opponentUsername,
                golds:opponentGolds,
                typePattern:null
            }
        }
    }
}
export const opponentJoinGame=(opponentId,opponentUsername,opponentGolds)=>{
    return{
        type:'OPPONENT_JOIN_GAME',
        payload:{
            id:opponentId,
            username:opponentUsername,
            golds:opponentGolds,
            typePattern:null
        }
    }
}
