import React from 'react';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import EditorReducer from './redux/reducers/editor';
import {logger} from 'redux-logger';
import thunk from "redux-thunk";

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const middleware = [logger(),thunk];

export default createStore(
  combineReducers({
    editor:EditorReducer
  }),
  {},
  applyMiddleware(logger,thunk)
);
