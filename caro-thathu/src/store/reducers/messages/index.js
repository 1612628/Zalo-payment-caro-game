const initialMessagesState={
    messages:[]
}

const MessagesReducer=(state=initialMessagesState,action)=>{
    switch(action.type){
        default:
            return state;
    }
}

export default MessagesReducer;