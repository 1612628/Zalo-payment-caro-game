export const appendMessage=(message,time,userIdSend)=>{
    return {
        type: "APPEND_MESSAGE",
        payload:{
            message,
            time,
            userIdSend
        }
    }
}

