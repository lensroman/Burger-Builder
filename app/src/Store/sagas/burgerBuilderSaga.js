import {put} from 'redux-saga/effects'

import * as actions from '../actions/rootAction';

import axios from "../../axios-orders";


export function* initIngredientsSaga() {
    try {
        const response = yield axios.get('https://react-my-burger-1aead-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json')
        yield put(actions.setIngredients(response.data))
    } catch(error) {
        yield put(actions.fetchIngredientsFailed(error))
    }
}