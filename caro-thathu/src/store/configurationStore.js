import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import allReducers from './reducers'

export const history = createBrowserHistory()

export default function configureStore() {
  const store = createStore(
    allReducers(history),
    compose(
      applyMiddleware(
        routerMiddleware(history),
      ),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  )

  return store
}