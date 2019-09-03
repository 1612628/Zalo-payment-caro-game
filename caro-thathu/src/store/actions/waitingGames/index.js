export const updateWaitingGame=(waitingGames)=>{
    let reconstructWaitingGame=[];
    if(waitingGames.length > 0)
    {
        reconstructWaitingGame=waitingGames.map((game)=>{
            return({
                roomGameId:game.room_game_id,
                status:game.status,
                bettingGolds:game.betting_golds,
                hostId:game.host_id,
                hostName:game.host_name
            })
        })
        
    }

    return{
        type:'UPDATE_WAITING_GAMES',
        payload:{
            reconstructWaitingGame
        }
    }
}

