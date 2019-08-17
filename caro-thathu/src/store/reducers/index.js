import {combineReducers} from 'redux';
import UserReducer from './user';
import CellListReducer from './cellList';
import GameListReducer from './gameList';
import LeaderboardReducer from './leaderboard';
import MessagesReducer from './messages';
import RoomGameReducer from './roomGame';
import ServerReducer from './server';


export default combineReducers({
    UserReducer,
    RoomGameReducer,
    CellListReducer,
    GameListReducer,
    LeaderboardReducer,
    MessagesReducer,
    ServerReducer
});
// =======
// import registerReducer from './register';
// import loginReducer from './login';
// import {combineReducers} from 'redux';

// const allReducers = combineReducers({
//     User : loginReducer,
//     isRegisterSucces: registerReducer
// })

// export default allReducers;
// >>>>>>> feature/mainscreen
