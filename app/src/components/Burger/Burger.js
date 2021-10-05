import React from "react";
import classes from './Burger.module.scss';
import BurgerIngredient from './BurgerIngredients/BurgerIngredient';

const Burger = (props) => {
    let transformedIngredients = Object.keys(props.ingredients)
        .map(ingKeys => {
            return [...Array(props.ingredients[ingKeys])].map((_, i) => {
                    return <BurgerIngredient key={ingKeys + i} type={ingKeys} />;
            })
        })
        .reduce((arr, el) => {
           return  arr.concat(el)
        }, [])

    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please Start Adding Ingredients</p>
    }

    return(
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top' />
            {transformedIngredients}
            <BurgerIngredient type='bread-bottom' />
        </div>
    );
}

export default Burger;