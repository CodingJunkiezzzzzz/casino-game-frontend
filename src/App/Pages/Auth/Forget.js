import React, { Component } from 'react';
import {Modal} from "react-bootstrap";
import {isEmail, decode, encode, sendNotfication, wait} from "../../../Helper";
import socket from "../../../Socket";
import C from "../../../Constant";

class Forget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            loading: true,
            disabled: false,
            email: ''
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillMount() {
        wait(500).then(() => {
            this.setState({ loading: false });
        })
    }

    componentDidMount() {
        socket.on(C.RESET_PASSWORD, data => this.resetPassword(decode(data)));
    }

    handleShow(e){
        this.props.clicked();
        this.setState({ show: true });
    }

    handleClose(){
        this.setState({ show: false });
    }

    resetPassword = (data) => {
        let response = data;
        const { t } = this.props;

        this.setState({disabled: false});

        if(response.status)
        {
            return sendNotfication(t('your_password_sended_to_email'), 'success','top-center');
        }
        else {
            return sendNotfication(t('this_email_is_not_registred_on_our_system'), 'warning','top-center');
        }
    };

    submitForm(e){
        e.preventDefault();
        const { t } = this.props;

        if(!isEmail(this.state.email))
        {
            return sendNotfication(t('please_enter_valid_email_address'), 'warning','top-center');
        }

        this.setState({disabled: true});

        wait(700).then(() => {
            socket.emit(C.RESET_PASSWORD, encode({ email: this.state.email }));
        })
    }

    back = () => {
        this.props.clicked();
    };

    render() {
        return (
            <>
                {this.state.loading ?
                    <>
                        <div className="text-center">
                            <div class="spinner-border text-info my-3 user-loader" role="status"/>
                        </div>
                    </>
                    :
                    <>
                    <div class="px-3">
                            <div className="text-center auth-logo-text">
                                <p className="mt-2 text-white">Get Your Password in Your Email</p>
                            </div>
                            <form className="my-4" onSubmit={ (e) => this.submitForm(e)} >
                                <div className="form-group text-center">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-append">
                                                <span className="input-group-text bgp">Email</span>
                                            </div>
                                            <input type="email" className="form-control" name="email" placeholder={"..."} autocomplete={"off"} style={{height: 40}}
                                                onChange={e => this.setState({ email: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group mt-2 text-center">
                                    <button type="submit" className="btn btn-purple no-shadow btn-block" disabled={this.state.disabled}>
                                        <i className="mdi mdi-email" /> Send Password
                                    </button>
                                    <button type="button" className="btn btn-sm -2 btn-outline-light btn-block" onClick={this.back}>
                                       <i className="mdi mdi-refresh" /> Back
                                    </button>
                                </div>
                            </form>
                    </div>
                    </>
            }
            </>
        );
    }
}

export default Forget;