import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import allReducers from './reducers'

import {persistStore,persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createTransform } from 'redux-persist';
import JSOG from 'jsog'

export const JSOGTransform = createTransform(
    (inboundState, key) => JSOG.encode(inboundState),
    (outboundState, key) => JSOG.decode(outboundState),
)

const persistConfig = {
  key: 'root',
  storage,
  backlist:['ui','router','RoomGameReducer','CellListReducer','WaitingGamesReducer','LeaderboardReducer','MessagesReducer','ServerReducer'],
  transforms: [JSOGTransform]
}
export const history = createBrowserHistory()

const persistedReducer = persistReducer(persistConfig, allReducers(history));


export default function configureStore() {
  const store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(
        routerMiddleware(history),
      ),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
    
  )
  const persistor = persistStore(store);
  return {store,persistor}
}