import {combineReducers} from '@reduxjs/toolkit';
import userReducer from './reducer/userReducer';
import thunk from "redux-thunk";
import {createLogger} from "redux-logger";
import {applyMiddleware, compose, createStore} from "redux";
import {persistReducer, persistStore} from "redux-persist";
import storage from 'redux-persist/lib/storage';
import tokenReducer from "./reducer/tokenReducer";
import signInReducer from "./reducer/signInReducer";
import socketReducer from "./reducer/socketReducer";

const combineReduces = combineReducers({
    user: userReducer,
    token: tokenReducer,
    signIn: signInReducer,
    socket: socketReducer
})

const middlewares = [thunk, createLogger()]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'token', 'signIn', 'socket']
};

/**
 * Redux store
 * **/
export const store = createStore(persistReducer(persistConfig, combineReduces), composeEnhancers(applyMiddleware(...middlewares)))
export const persistence = persistStore(store)

