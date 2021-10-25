import React, {Component, Fragment} from "react";

import Burger from '../../components/Burger/Burger';
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';

import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";
import {connect} from "react-redux";
import * as actionTypes from '../../Store/actions';

class BurgerBuilder extends Component{

    state = {
        purchaseMode: false,
        loading: false,
    };

    componentDidMount() {
        // axios.get('https://react-my-burger-1aead-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients: response.data})
        //     })
        //     .catch(error => {})
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
        this.setState({
            purchaseMode: true
        })
    };

    purchaseCancelHandler = () => {
        this.setState({
            purchaseMode: false
        })
    };

    purchaseContinueHandler = () => {
        this.props.history.push({pathname: '/checkout'})
    }

    render() {
        const disabledInfo = {
            ...this.props.ings
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let burger = <Spinner />
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
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdd: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemove: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));