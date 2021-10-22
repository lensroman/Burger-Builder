import React, { Component } from 'react';

import Button from "../../components/UI/Button/Button";
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';

import axios from "../../axios-orders";

import classes from './ContactData.module.scss';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        })
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Roman Lensky',
                address: {
                    street: 'testStreet',
                    zipCode: '123123',
                    country: 'Russia'
                },
                email: 'test@test.com',
                deliveryMethod: 'fastest'
            }
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false})
                this.props.history.push('/')
            })
            .catch(error => this.setState({loading: false}))
    }

    render() {
        let form = (
            <form>
                <Input inputtype="input" type="text" placeholder="Your Name" />
                <Input inputtype="input" type="email" placeholder="Your Mail" />
                <Input inputtype="input" type="text" placeholder="Street" />
                <Input inputtype="input" type="text" placeholder="Your Postal Code" />
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </form>
        )

        if ( this.state.loading ) {
            form = <Spinner />
        }

        return(
            <div className={classes.ContactData}>
                <h4>Enter Your Contact Data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;