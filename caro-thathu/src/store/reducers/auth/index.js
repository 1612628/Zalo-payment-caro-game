const initialAuthState={
    auth:false    
}

const AuthReducer = (state=initialAuthState,action)=>{
    switch(action.type){
        case 'CHANGE_AUTH':
            return {...state,
                auth:action.payload.auth
            }
        default:
            return state;
    }
}

export default AuthReducer;