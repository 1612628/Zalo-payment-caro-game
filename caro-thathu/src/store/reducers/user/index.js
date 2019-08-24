const initialUserState={
    user:{
        id:-1,
        username:"-1",
        golds:-1,
        token:null,
        socket:null,
        typePattern: "X",
        totalPlayedGame:0
    }       
}

export default function UserReducer(state=initialUserState,action){
    switch(action.type){
        case 'UPDATE_USER':
            return {...state,
                user:action.payload
            }
        case 'UPDATE_USER_PATTERN':
            return{
                ...state,
                user:{
                    ...state.user,
                    typePattern:action.payload.typePattern
                }
            }
        case 'USER_LOG_OUT':
            console.log('USER_LOG_OUT');
            return{
                ...initialUserState
            }
        default:
            return state;
    }
}

