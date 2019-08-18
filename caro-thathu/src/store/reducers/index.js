import {combineReducers} from 'redux';
import UserReducer from './user';
import CellListReducer from './cellList';
import GameListReducer from './gameList';
import LeaderboardReducer from './leaderboard';
import MessagesReducer from './messages';
import RoomGameReducer from './roomGame';
import ServerReducer from './server';
import { connectRouter } from 'connected-react-router'


const allReducers =(history)=> combineReducers({
    router:connectRouter(history),
    UserReducer:UserReducer,
    RoomGameReducer:RoomGameReducer,
    CellListReducer:CellListReducer,
    GameListReducer:GameListReducer,
    LeaderboardReducer:LeaderboardReducer,
    MessagesReducer:MessagesReducer,
    ServerReducer:ServerReducer
});
// =======
// import registerReducer from './register';
// import loginReducer from './login';
// import {combineReducers} from 'redux';

// const allReducers = combineReducers({
//     User : loginReducer,
//     isRegisterSucces: registerReducer
// })

export default allReducers;
// >>>>>>> feature/mainscreen
