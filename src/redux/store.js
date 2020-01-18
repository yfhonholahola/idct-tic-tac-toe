import { createStore, applyMiddleware, compose  } from "redux";
import thunk from 'redux-thunk';
import rootReducer from "./reducers";

const composeEnhancers = __DEV__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;
export default createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
