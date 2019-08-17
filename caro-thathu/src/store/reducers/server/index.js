const initialServerState={
    endpoint:"http://127.0.0.1:4001"
}

export default function ServerReducer(state=initialServerState,action){
    switch(action.type){
        default:
            return state;
    }
}