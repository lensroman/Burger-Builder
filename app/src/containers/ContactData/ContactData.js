import React, { useState } from 'react';
import { connect } from "react-redux";

import Button from "../../components/UI/Button/Button";
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';

import axios from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from '../../Store/actions/rootAction';

import classes from './ContactData.module.scss';
import {checkValidity} from "../../shared/utility";

const ContactData = props => {
    const [orderFormState, setOrderFormState] = useState({
        name: {
            elementType: 'input',
                elementConfig: {
                type: 'text',
                    placeholder: 'Your Name'
            },
            value: '',
                validation: {
                required: true
            },
            valid: false,
                touched: false
        },
        street: {
            elementType: 'input',
                elementConfig: {
                type: 'text',
                    placeholder: 'Street'
            },
            value: '',
                validation: {
                required: true
            },
            valid: false,
                touched: false
        },
        zipCode: {
            elementType: 'input',
                elementConfig: {
                type: 'text',
                    placeholder: 'ZIP Code'
            },
            value: '',
                validation: {
                required: true,
                    minLength: 6,
                    maxLength: 6,
                    isNumeric: true
            },
            valid: false,
                touched: false
        },
        country: {
            elementType: 'input',
                elementConfig: {
                type: 'text',
                    placeholder: 'Your Country'
            },
            value: '',
                validation: {
                required: true
            },
            valid: false,
                touched: false
        },
        email: {
            elementType: 'input',
                elementConfig: {
                type: 'email',
                    placeholder: 'Your Email'
            },
            value: '',
                validation: {
                required: true,
                    isEmail: true
            },
            valid: false,
                touched: false
        },
        deliveryMethod: {
            elementType: 'select',
                elementConfig: {
                options: [{value: 'fastest', dispValue: 'Fastest'}, {value: 'cheapest', dispValue: 'Cheapest'}]
            },
            value: 'fastest',
                validation: {},
            valid: true
        }
    })
    const [formIsValid, setFormIsValid] = useState(false)


    const orderHandler = (event) => {
        event.preventDefault();

        const formData = {}
        for (let formElementIdentifier in orderFormState) {
            formData[formElementIdentifier] = orderFormState[formElementIdentifier].value
        }

        const order = {
            ingredients: props.ings,
            price: props.price,
            orderData: formData,
            userId: props.userId
        }

        props.onOrderBurger(order, props.token)
    }

    const inputChangeHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {...orderFormState}
        const updatedFormElement = {...updatedOrderForm[inputIdentifier]}
        updatedFormElement.value = event.target.value
        updatedFormElement.touched = true
        updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation)
        updatedOrderForm[inputIdentifier] = updatedFormElement

        let formIsValid = true
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
        }

        setOrderFormState(updatedOrderForm)
        setFormIsValid(formIsValid)
    }

    const formElements = []

    for (let key in orderFormState) {
        formElements.push({id: key, config: orderFormState[key]})
    }

    let form = (
        <form>
            {formElements.map(formElement => {
                return (<Input
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    changed={(event) => inputChangeHandler(event, formElement.id)}
                />)
            })}
            <Button btnType="Success" clicked={orderHandler} disabled={!formIsValid}>ORDER</Button>
        </form>
    )

    if ( props.loading ) {
        form = <Spinner />
    }

    return (
        <div className={classes.ContactData}>
            <h4>Enter Your Contact Data</h4>
            {form}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));