import React, { Component } from 'react'
import {Modal, Dropdown} from "react-bootstrap";
import storage from "../../../../Storage";
import {sendNotfication, Event} from "../../../../Helper";
import Wallet from "./Wallet";

class Main extends Component{
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        Event.on('other_coins', () => {
            this.setState({ show: false });
        })
        Event.on('update_payment', () => {
            this.setState({ show: false });
        })
    }

    handleClose(){
        this.setState({ show: false, effect: 'zoomOut' });
    }

    handleShow(){
        if(storage.getKey('token') === null)
        {
            return sendNotfication('Please Login to use this option.','warning', 'top-right');
        }
        
        this.setState({ show: true, effect: 'pulse' });
    }

    render() {
        const { menu } = this.props;

        return(
            <>
                { !menu ?
                    <span onClick={this.handleShow} className={"dropdown-item"}>
                        <i className="dripicons-wallet text-muted mr-2 text-drop"/>
                        Wallet
                    </span>
                    :
                    <Dropdown.Toggle onClick={this.handleShow} split variant="user mt-2-5 py-1 mr-3 btn-wallet no-shadow" id="dropdown-notification-user">
                        <i className="dripicons-wallet text-drop mr-1 font-13"/> Wallet
                    </Dropdown.Toggle>
                }
                <Modal
                    size="md"
                    backdrop={'static'}
                    centered={true}
                    scrollable={false}
                    show={this.state.show}
                    onHide={this.handleClose}
                    aria-labelledby="wallet-md-modal"
                    className={"animated " + this.state.effect}
                >
                    <Modal.Header>
                        Wallet
                        <button type="button" className="close p-2" onClick={this.handleClose}>
                            <i className={'mdi mdi-close'}/>
                        </button>
                    </Modal.Header>
                    <Modal.Body className={'p-0 wallet-modal'} closeButton>
                        <Wallet />
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default Main;