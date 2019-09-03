const intInitTime = {
    time: 15,
    isMyTurn: false,
    
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
            console.log('RESTART_TIMER');
            return{
                ...state,
                isMyTurn:false,
                time:15
            };
        case "RESTART_NEW_TURN":
            console.log('RESTART_NEW_TURN');
            return{
                ...state,
                isMyTurn:true,
                time:15
            }
        default:
            return state;
    }
}
export default TimeReducer;