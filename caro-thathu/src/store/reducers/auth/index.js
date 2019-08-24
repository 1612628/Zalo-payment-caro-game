const initialAuthState={
    isAuthenticate:false    
}

const AuthReducer = (state=initialAuthState,action)=>{
    switch(action.type){
        case 'CHANGE_AUTH':
            return {...state,
                isAuthenticate:action.payload.isAuthenticate
            }
        default:
            return state;
    }
}

export default AuthReducer;