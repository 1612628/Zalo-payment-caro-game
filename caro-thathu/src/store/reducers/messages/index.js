const initialMessagesState={
    messages:[]
}

export default function MessagesReducer(state=initialMessagesState,action){
    switch(action.type){
        default:
            return state;
    }
}