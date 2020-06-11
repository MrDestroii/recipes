import { combineReducers, applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";

import { routerMiddleware, connectRouter } from "connected-react-router";
import { createBrowserHistory as createHistory } from "history";

import * as R from 'ramda'

import routerSaga from "./router/saga";

import { authReducer } from "./auth/reducer";
import { authSaga } from "./auth/saga";

const isDevelopmentMode = R.equals(process.env.NODE_ENV, "development")

const history = createHistory();

const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware, routerMiddleware(history)];

const reducers = combineReducers({
  router: connectRouter(history),
  auth: authReducer,
});

const store = applyMiddleware(...middleware)(createStore)(
  reducers,
  isDevelopmentMode && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

sagaMiddleware.run(routerSaga);
sagaMiddleware.run(authSaga)

export { store, history };
