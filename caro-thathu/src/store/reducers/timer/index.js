const intInitTime = {
    time: 15,
    isMyTurn: true
}
const TimeReducer = (state = intInitTime, action) => {
    switch (action.type) {
        case "START_TIMER":
            return {
                ...state,
                time: state.time - 1,
                isMyTurn: action.payload.isMyTurn
            };
        case "PAUSE_TIMER":
            return {
                ...state,
                isMyTurn: action.payload.isMyTurn
            };
        case "RESTART_TIMER":
            return{
                ...state,
                isMyTurn:action.payload.isMyTurn,
                time:15
            };
        case "RESTART_NEW_TURN":
            return{
                ...state,
                isMyTurn:action.payload.isMyTurn,
                time:15
            }
        default:
            return state;
    }
}
export default TimeReducer;