const intInitTime = {
    time: 15,
    isMyturn: true
}
const TimeReducer = (state = intInitTime, action) => {
    switch (action.type) {
        case "START_TIMER":
            return {
                ...state,
                time: state.time - 1,
                isMyturn: action.payload
            };
        case "PAUSE_TIMER":
            return {
                ...state,
                isMyturn: action.payload
            };
        case "RESTART_TIMER":
            return{
                ...state,
                isMyturn:false,
                time:15
            }
        default:
            return state;
    }
}
export default TimeReducer;