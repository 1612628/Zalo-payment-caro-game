import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {Provider} from 'react-redux';
import {Route,Switch} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';

import configureStore,{history} from './store/configurationStore';

import Register from './components/register';
import MainScreenGame from './components/main-screen-game/'
import ForgotPassword from './components/forgot-password';
import PlayGame from './components/play-game';

import PrivateRoute from './privateRoute';
import { PersistGate } from 'redux-persist/integration/react';

const {store,persistor} = configureStore();



ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
                <>
                    <Switch>
                        <Route exact path="/" component={App}></Route>
                        <Route exact path="/register" component={Register}></Route>
                        {/* <Route exact path="/mainscreengame" component={MainScreenGame}></Route> */}
                        <PrivateRoute path="/mainscreengame" component={MainScreenGame}></PrivateRoute>
                        <PrivateRoute path="/playgame" component={PlayGame}></PrivateRoute>
                        <Route exact path="/forgotpassword" component={ForgotPassword}></Route>
                    </Switch>
                </>            
            </ConnectedRouter>
        </PersistGate>
           
    </Provider>
, document.getElementById('root'));

serviceWorker.unregister();
