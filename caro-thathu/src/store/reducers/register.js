const registerReducer = (state = false,action)=>{
    switch(action.type){
        case 'REGISTER':
            if(action.status === "succes")
                return true;
            return false;
        default:
            return false;
    }
}
export default registerReducer;