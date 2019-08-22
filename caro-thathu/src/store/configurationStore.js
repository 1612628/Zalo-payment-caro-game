import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import allReducers from './reducers'

import {persistStore,persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig={
  key:'root',
  storage:storage
}


export const history = createBrowserHistory()


export default function configureStore() {

  const persistedReducer = persistReducer(persistConfig,allReducers(history))
  
  const store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(
        routerMiddleware(history),
      ),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  )
  const persistor=persistStore(store)
  return {store,persistor}
}