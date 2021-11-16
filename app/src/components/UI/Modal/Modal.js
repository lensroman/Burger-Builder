import React, { Fragment } from "react";
import classes from './Modal.module.scss'
import Backdrop from "../Backdrop/Backdrop";

const Modal = props => {
    return (
        <Fragment>
            <div
                className={classes.Modal}
                style={{
                    transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0'
                }}
            >
                {props.children}
            </div>
            <Backdrop show={props.show} clicked={props.modalClosed}/>
        </Fragment>
    )
}

export default React.memo(
    Modal,
    (prevProps, nextProps) =>
        nextProps.show === prevProps.show &&
        nextProps.children === prevProps.children);