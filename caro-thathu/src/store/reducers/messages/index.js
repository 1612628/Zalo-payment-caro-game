const initialMessageState={
    messages:[]
}

const MessageReducers=(state=initialMessageState,action)=>{
    switch(action.type){
        case 'APPEND_MESSAGE':
            return { 
                ...state,
                messages: [...state.messages, action.payload]
            }
        
        default:
            return state;
    }
}

export default MessageReducers;