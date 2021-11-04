import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import createSagaMiddleware from 'redux-saga';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import burgerBuilderReducer from "./Store/reducers/burgerBuilderReducer";
import orderReducer from "./Store/reducers/orderReducer";
import authReducer from './Store/reducers/authReducer';
import {watchAuthSaga, watchBurgerBuilderSaga, watchOrderSaga} from "./Store/sagas/rootSaga";

const devTools = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null
const composeEnhancers = devTools || compose;

const sagaMiddleWare = createSagaMiddleware()

const rootReducer = combineReducers({
    burgerBuilder: burgerBuilderReducer,
    order: orderReducer,
    auth: authReducer
})

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, sagaMiddleWare)))

sagaMiddleWare.run(watchAuthSaga)
sagaMiddleWare.run(watchBurgerBuilderSaga)
sagaMiddleWare.run(watchOrderSaga)

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

reportWebVitals();
