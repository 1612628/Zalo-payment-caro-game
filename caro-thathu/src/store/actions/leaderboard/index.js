export const updateLeaderboard=(leaderboard)=>{
    let reconstructLeaderboard=leaderboard.map((user)=>{
        return({
            username:user.username,
            totalPlayedGame:user.total_played_game,
            golds:user.golds
        })
    })
    return{
        type:'UPDATE_LEADERBOARD',
        payload:{
            reconstructLeaderboard
        }
    }
}

