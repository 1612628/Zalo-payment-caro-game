const initialServerState={
    server:{
        endpoint:"http://127.0.0.1:4001"
    }    
}

const ServerReducer= (state=initialServerState,action)=>{
    switch(action.type){
        default:
            return state;
    }
}

export default ServerReducer;