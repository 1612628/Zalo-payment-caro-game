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
        default:
            return state;
    }
}