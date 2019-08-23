const intInitTime={
    time:16
}
const TimeReducer = (state= intInitTime,action) =>
{
    switch(action.type){
        case "START_TIMER":
            return {...state,
                time: state.time - 1
            };
        case "PAUSE_TIMER":
            return {...state};
        default:
            return state;
    }
}
export default TimeReducer;