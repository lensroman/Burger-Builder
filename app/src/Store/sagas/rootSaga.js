import { takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import {authActionSaga, authCheckSaga, authLogoutSaga, checkAuthTimeoutSaga} from "./authSaga";
import {initIngredientsSaga} from "./burgerBuilderSaga";
import {fetchOrdersSaga, purchaseBurgerSaga} from "./orderSaga";

export function* watchAuthSaga() {
    yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, authLogoutSaga)
    yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga)
    yield takeEvery(actionTypes.AUTH_USER, authActionSaga)
    yield takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckSaga)
}

export function* watchBurgerBuilderSaga() {
    yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga)
}

export function* watchOrderSaga() {
    yield takeEvery(actionTypes.PURCHASE_BURGER, purchaseBurgerSaga)
    yield takeEvery(actionTypes.FETCH_ORDERS, fetchOrdersSaga)
}