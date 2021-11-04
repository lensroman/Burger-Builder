import { put, delay } from 'redux-saga/effects';

import * as actions from '../actions/rootAction';
import axios from "axios";

export function* authLogoutSaga() {
    yield localStorage.removeItem('token')
    yield localStorage.removeItem('expirationDate')
    yield localStorage.removeItem('userId')
    yield put(actions.authLogoutSucceed())
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime * 1000)
    yield put(actions.authLogout())
}

export function* authActionSaga(action) {
    yield put(actions.authStart())
    const authData = yield {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    }
    let url = yield 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBkWLEvrURzKHQUl6S58hzVzEGuSuQliW0'
    if (!action.isSignUp) {
        yield url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBkWLEvrURzKHQUl6S58hzVzEGuSuQliW0'
    }
    try {
        const response = yield axios.post(url, authData)
        const expirationDate = yield new Date(new Date().getTime() + response.data.expiresIn * 1000)
        yield localStorage.setItem('token', response.data.idToken)
        yield localStorage.setItem('expirationDate', expirationDate)
        yield localStorage.setItem('userId', response.data.localId)
        yield put(actions.authSuccess(response.data.idToken, response.data.localId))
        yield put(actions.checkAuthTimeout(response.data.expiresIn))
    } catch(error) {
        yield put(actions.authFail(error))
    }
}

export function* authCheckSaga() {
    const token = yield localStorage.getItem('token')
    if (!token) {
        yield put(actions.authLogout())
    } else {
        const expirationDate = yield new Date(localStorage.getItem('expirationDate'))
        if (expirationDate > new Date()) {
            const userId = yield localStorage.getItem('userId')
            yield put(actions.authSuccess(token, userId))
            yield put(actions.checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
        } else {
            yield put(actions.authLogout())
        }
    }
}