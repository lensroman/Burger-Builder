import React, {Fragment} from "react";

import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.module.scss';
import Backdrop from '../../UI/Backdrop/Backdrop';

const sideDrawer = (props) => {

    let attachedClasses = [classes.SideDrawer, classes.Close]

    if (props.opened) {
       attachedClasses = [classes.SideDrawer, classes.Open]
    }

    return (
        <Fragment>
            <div className={classes.MobileOnly}>
                <Backdrop show={props.opened} clicked={props.closed}/>
            </div>
            <div className={attachedClasses.join(' ')} onClick={props.closed}>
                <div className={classes.Logo}>
                    <Logo />
                </div>
                <nav>
                    <NavigationItems isAuthenticated={props.isAuth} />
                </nav>
            </div>
        </Fragment>
    );
};

export default sideDrawer;