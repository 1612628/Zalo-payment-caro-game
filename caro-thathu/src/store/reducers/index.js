import {combineReducers} from 'redux';
import UserReducer from './user';
import CellListReducer from './cellList';
import WaitingGamesReducer from './waitingGames';
import LeaderboardReducer from './leaderboard';
import MessageReducers from './messages';
import RoomGameReducer from './roomGame';
import ServerReducer from './server';
import AuthReducer from './auth';
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
    AuthReducer:AuthReducer
});

export default allReducers;
