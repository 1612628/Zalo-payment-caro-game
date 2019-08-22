import {combineReducers} from 'redux';
import UserReducer from './user';
import CellListReducer from './cellList';
import WaitingGamesReducer from './waitingGames';
import LeaderboardReducer from './leaderboard';
import MessageReducers from './messages';
import RoomGameReducer from './roomGame';
import ServerReducer from './server';
import { connectRouter } from 'connected-react-router'


const allReducers =(history)=> combineReducers({
    router:connectRouter(history),
    UserReducer:UserReducer,
    RoomGameReducer:RoomGameReducer,
    CellListReducer:CellListReducer,
    WaitingGamesReducer:WaitingGamesReducer,
    LeaderboardReducer:LeaderboardReducer,
    MessageReducers:MessageReducers,
    ServerReducer:ServerReducer,    
});

export default allReducers;
