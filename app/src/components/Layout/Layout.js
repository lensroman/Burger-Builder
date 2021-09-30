import React, {Fragment} from "react";
import classes from './Layout.module.scss';

const layout = ( props ) => {
    return(
        <Fragment>
            <div>
                Toolbar, SideDrawer, BackDrop
            </div>
            <main className={classes.content}>
                {props.children}
            </main>
        </Fragment>
    );
};

export default layout;