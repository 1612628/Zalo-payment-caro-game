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
export const getOutOfOwnCreatedRoomGame=()=>{
    return{
        type:'GET_OUT_OWN_CREATED_ROOM_GAME',
        payload:{}
    }
}

export const getOutOfGame = ()=>{
    return {
        type:'GET_OUT_OF_GAME'
    }
}

export const joinInRoomGame=(roomGameId,status,bettingGolds,opponentId,opponentUsername,opponentGolds,opponentTotalPlayedGame)=>{
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
                typePattern:null,
                totalPlayedGame:opponentTotalPlayedGame
            }
        }
    }
}
export const opponentJoinGame=(opponentId,opponentUsername,opponentGolds,opponentTotalPlayedGame)=>{
    return{
        type:'OPPONENT_JOIN_GAME',
        payload:{
            id:opponentId,
            username:opponentUsername,
            golds:opponentGolds,
            typePattern:null,
            totalPlayedGame:opponentTotalPlayedGame
        }
    }
}

export const opponentOutGame=(newGameId,bettingGolds)=>{
    return{
        type:'OPPONENT_OUT_GAME',
        payload:{
            newGameId:newGameId,
            bettingGolds:bettingGolds
        }
    }
}

export const updateOpponentTypePattern=(typePattern)=>{
    return{
        type:'UPDATE_OPPONENT_TYPE_PATTERN',
        payload:{
            typePattern:typePattern
        }
    }
}

export const updateGameStatus=(status)=>{
    return{
        type:'UPDATE_GAME_STATUS',
        payload:{
            status
        }
    }
}

export const updateGameIdToContinueGame=(gameId)=>{
    return{
        type:'UPDATE_GAME_ID_TO_CONTINUE_GAME',
        payload:{
            gameId
        }
    }
}

export const updateOpponentInfoToContinueGame=(opponentGolds,opponentTotalPlayedGame)=>{
    return{
        type:'UPDATE_OPPONENT_INFO_TO_CONTINUE_GAME',
        payload:{
            opponentGolds,
            opponentTotalPlayedGame
        }
    }
}

export const resetRoomGame=()=>{
    return{
        type:'RESET_ROOM_GAME_TO_DEFAULT'
    }
}

export const resetOpponentToDefault=()=>{
    return{
        type:'RESET_OPPONENT_TO_DEFAULT'
    }
}