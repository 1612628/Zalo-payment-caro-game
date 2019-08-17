const UserInfo = {
    idUser: null,
    username: "thuc",
    golds: null,
    socket:null
}
const LogginReducer = (state = UserInfo,action) =>{
    switch(action.type){
        case 'LOGIN':
            {
                state.idUser = action.data.idUser;
                state.username = action.data.username;
                state.golds = action.data.golds;
                state.socket = action.data.socket;
                return state;
            }
        default:
            return state;
    }
}
export default LogginReducer;