import React, { Component } from 'react'
import {connect} from "react-redux";
import Modal from "react-bootstrap/Modal";
import Swal from 'sweetalert2';
import Wallet from "./Wallet";
import storage from "../../../../Storage"
import {sendNotfication, Event} from "../../../../Helper"
import {setWallet} from "../../../../actions/gameWallet";
import * as Cookies from "js-cookie";

class Alert extends Component{
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            uid:  Cookies.get("uid") ?  Cookies.get("uid") : null
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        Event.on('other_coins', () => {
            this.setState({ show: false, effect: 'zoomOut' });
            this.props.setWallet(false);
        })
    }

    componentWillMount() {
        let { uid } = this.props;

        if(uid === this.state.uid)
            sendNotfication('Please First Make a Deposit', 'info', 'top-right');
    }

    handleClose(){
        this.setState({ show: false, effect: 'zoomOut' });
        this.props.setWallet(false);
    }

    handleShow(){
        if(storage.getKey('token') === null)
        {
            return Swal.fire({
                title: 'Error',
                text: 'Please Login to use this Option.',
                type: 'error'
            });
        }
        this.setState({ show: true, effect: 'pulse' });
    }

    render() {
        return(
            <>
                <Modal
                    size="md"
                    centered={true}
                    show={this.state.show}
                    backdrop={'static'}
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
                        <Wallet/>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default connect(null, {setWallet})(Alert);