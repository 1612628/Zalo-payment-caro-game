export const updateUserSocket=(socket)=>{
    return{
        type:'UPDATE_USER_SOCKET',
        payload:{
            user:{
                socket:socket
            }
        }
    }
}

