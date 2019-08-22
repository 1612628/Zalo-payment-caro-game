export const updateUser=(id,username,golds,token,totalPlayedGame,socket)=>{
    return{
        type:'UPDATE_USER',
        payload:{    
            id:id,
            username:username,
            golds:golds,
            token:token,
            totalPlayedGame:totalPlayedGame,
            socket:socket            
        }
    }
}

