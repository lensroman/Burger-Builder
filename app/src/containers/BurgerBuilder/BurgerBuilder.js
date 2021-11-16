import React, { Fragment, useState, useEffect } from "react";

import Burger from '../../components/Burger/Burger';
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';

import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";
import {connect} from "react-redux";
import * as actions from '../../Store/actions/rootAction';

const BurgerBuilder = props => {

    const [purchaseMode, setPurchaseMode] = useState(false)
    const [loading] = useState(false)

    const { onInitIngredients } = props
    useEffect(() => {
        onInitIngredients()
    }, [onInitIngredients])

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(ingKey => {
                return ingredients[ingKey]
            })
            .reduce((sum, el) => {
                return sum + el
            }, 0)
        return  sum > 0
    };

    const purchaseHandler = () => {
        if (props.isAuthenticated) {
            setPurchaseMode(true)
        } else {
            props.onSetAuthRedirectPath('/checkout')
            props.history.push('/authAction')
        }
    };

    const purchaseCancelHandler = () => {
        setPurchaseMode(false)
    };

    const purchaseContinueHandler = () => {
        props.onInitPurchase()
        props.history.push({pathname: '/checkout'})
    }

    const disabledInfo = {
        ...props.ings
    };
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0
    }

    let burger = props.error ? <p>Ingredients can't be loaded</p> : <Spinner />

    let orderSummary = null

    if (props.ings) {
        burger = (
            <Fragment>
                <Burger ingredients={props.ings} />
                <div>
                    <BuildControls
                        ingredientAdded={props.onIngredientAdd}
                        ingredientRemoved={props.onIngredientRemove}
                        disabled={disabledInfo}
                        price={props.price}
                        isAuth={props.isAuthenticated}
                        purchasable={updatePurchaseState(props.ings)}
                        ordered={purchaseHandler}
                    />
                </div>
            </Fragment>
        );
        orderSummary = <OrderSummary
            ingredients={props.ings}
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler}
            burgerPrice={props.price.toFixed(2)}
        />
    }

    if (loading) {
        orderSummary = <Spinner />
    }

    return (
        <Fragment>
            <Modal show={purchaseMode} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Fragment>
    );
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdd: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemove: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));