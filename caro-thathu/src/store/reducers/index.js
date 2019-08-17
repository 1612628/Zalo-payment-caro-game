import registerReducer from './register';
import loginReducer from './login';
import {combineReducers} from 'redux';

const allReducers = combineReducers({
    User : loginReducer,
    isRegisterSucces: registerReducer
})

export default allReducers;