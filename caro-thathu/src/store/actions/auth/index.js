export const changeAuth=(isAuthenticate)=>{
    return{
        type:'CHANGE_AUTH',
        payload:{
            isAuthenticate
        }
    }
}

