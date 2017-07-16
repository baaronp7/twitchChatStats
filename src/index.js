import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom';
import rootReducer from './reducers/index.js';
import promiseMiddleware from 'redux-promise';
import { getViewers, getChannel } from './actions/index.js';
import { createStore, applyMiddleware } from 'redux';

var store = createStore(rootReducer, applyMiddleware(promiseMiddleware), window.PROPS);
store.dispatch(getViewers());
store.dispatch(getChannel());

ReactDOM.render(
    <Provider store={store}>
            <App />
    </Provider>,
  document.getElementById('app')
);