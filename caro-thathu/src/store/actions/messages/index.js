export const appendMessage=(message,userId)=>{
    return {
        type: "APPEND_MESSAGE",
        payload:{
            message,
            userId
        }
    }
}

