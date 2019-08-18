const initialUserState={
    user:{
        id:-1,
        username:"-1",
        golds:-1,
        token:null,
        socket:null
    }    
}

export default function UserReducer(state=initialUserState,action){
    switch(action.type){
        case 'UPDATE_USER_SOCKET':
            return action.payload;
        default:
            return state;
    }
}