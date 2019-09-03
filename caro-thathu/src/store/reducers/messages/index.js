const initialMessageState = {
    messages: []
}

const MessageReducer = (state = initialMessageState, action) => {
    switch (action.type) {
        case 'APPEND_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload]
            }
        case 'RESTART_MESSAGE_LIST':
            return {
                ...initialMessageState
            }
        default:
            return state;
    }
}

export default MessageReducer;