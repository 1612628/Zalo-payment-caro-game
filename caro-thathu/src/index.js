import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {Provider} from 'react-redux';
import {Route,Switch} from 'react-router';
import {ConnectedRouter, routerActions} from 'connected-react-router';
import configureStore,{history} from './store/configurationStore';

import Register from './components/register';
import MainScreenGame from './components//main-screen-game/'

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <>
                <Switch>
                    <Route exact path="/" component={App}></Route>
                    <Route exact path="/register" component={Register}></Route>
                    <Route path="/mainScreenGame" component={MainScreenGame}></Route>
                </Switch>
            </>            
        </ConnectedRouter>
    </Provider>
, document.getElementById('root'));

serviceWorker.unregister();
