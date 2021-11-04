import React, {Component, Fragment} from "react";

import Burger from '../../components/Burger/Burger';
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';

import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";
import {connect} from "react-redux";
import * as actions from '../../Store/actions/rootAction';

class BurgerBuilder extends Component{

    state = {
        purchaseMode: false,
        loading: false,
    };

    componentDidMount() {
        this.props.onInitIngredients()
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(ingKey => {
                return ingredients[ingKey]
            })
            .reduce((sum, el) => {
                return sum + el
            }, 0)
        return  sum > 0
    };

    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({
                purchaseMode: true
            })
        } else {
            this.props.onSetAuthRedirectPath('/checkout')
            this.props.history.push('/authAction')
        }
    };

    purchaseCancelHandler = () => {
        this.setState({
            purchaseMode: false
        })
    };

    purchaseContinueHandler = () => {
        this.props.onInitPurchase()
        this.props.history.push({pathname: '/checkout'})
    }

    render() {
        const disabledInfo = {
            ...this.props.ings
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />
        let orderSummary = null

        if(this.props.ings) {
            burger = (
                <Fragment>
                    <Burger ingredients={this.props.ings} />
                    <div>
                        <BuildControls
                            ingredientAdded={this.props.onIngredientAdd}
                            ingredientRemoved={this.props.onIngredientRemove}
                            disabled={disabledInfo}
                            price={this.props.price}
                            isAuth={this.props.isAuthenticated}
                            purchasable={this.updatePurchaseState(this.props.ings)}
                            ordered={this.purchaseHandler}
                        />
                    </div>
                </Fragment>
            );
            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                burgerPrice={this.props.price.toFixed(2)}
            />
        }

        if(this.state.loading) {
            orderSummary = <Spinner />
        }

        return(
            <Fragment>
                <Modal show={this.state.purchaseMode} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Fragment>
        );
    }
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