import { createStore, applyMiddleware, compose  } from "redux";
import thunk from 'redux-thunk';
import rootReducer from "./reducers";
import socketMiddleware from "./middleware/socketMiddleware";
import SocketClient from "../socket/client";

const composeEnhancers = __DEV__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;

const configureStore = (initialState = {}, socketClient = new SocketClient()) => {
    const middlewares = [
        thunk,
        socketMiddleware(socketClient),
    ];
    return createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)));
}

export default configureStore
