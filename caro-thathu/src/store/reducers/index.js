import {combineReducers} from 'redux';
import UserReducer from './user';
import CellListReducer from './cellList';
import WaitingGamesReducer from './waitingGames';
import LeaderboardReducer from './leaderboard';
import MessageReducer from './messages';
import RoomGameReducer from './roomGame';
import ServerReducer from './server';
import AuthReducer from './auth';
import TimeReducer from './timer';
import { connectRouter } from 'connected-react-router'


const allReducers =(history)=> combineReducers({
    router:connectRouter(history),
    UserReducer:UserReducer,
    RoomGameReducer:RoomGameReducer,
    CellListReducer:CellListReducer,
    WaitingGamesReducer:WaitingGamesReducer,
    LeaderboardReducer:LeaderboardReducer,
    MessageReducer:MessageReducer,
    ServerReducer:ServerReducer,
    AuthReducer:AuthReducer,
    TimeReducer:TimeReducer
    
});

export default allReducers;
