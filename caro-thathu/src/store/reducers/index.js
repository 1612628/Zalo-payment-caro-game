import {combineReducers} from 'redux';
import UserReducer from './user';
import CellListReducer from './cellList';
import WaitingGamesReducer from './waitingGames';
import LeaderboardReducer from './leaderboard';
import MessagesReducer from './messages';
import RoomGameReducer from './roomGame';
import ServerReducer from './server';
import CellReducer from './cell'
import { connectRouter } from 'connected-react-router'


const allReducers =(history)=> combineReducers({
    router:connectRouter(history),
    UserReducer:UserReducer,
    RoomGameReducer:RoomGameReducer,
    CellListReducer:CellListReducer,
    WaitingGamesReducer:WaitingGamesReducer,
    LeaderboardReducer:LeaderboardReducer,
    MessagesReducer:MessagesReducer,
    ServerReducer:ServerReducer,
    CellReducer: CellReducer
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
