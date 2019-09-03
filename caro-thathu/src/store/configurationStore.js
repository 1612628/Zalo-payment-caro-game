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
  storage:storage,
  whitelist:['UserReducer','AuthReducer'],
  transforms: [JSOGTransform]
}
export const history = createBrowserHistory()

const rootReducer = (state,action)=>{
  if(action.type==='INITIAL_STATE'){
    storage.removeItem('persist:root');
    state=undefined
  }
  return allReducers(history)(state,action);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);


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