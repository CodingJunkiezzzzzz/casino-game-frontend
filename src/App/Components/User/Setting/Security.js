import React from "react";
import {Col, Form, Row} from "react-bootstrap";
import storage from "../../../../Storage";
import socket from "../../../../Socket";
import {decode, encode, wait, sendNotfication} from "../../../../Helper";
import C from "../../../../Constant";

class Security extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            disabled: false,
            password: '',
            _password: '',
        };
        this.saveUserSetting = this.saveUserSetting.bind(this);
    }

    componentDidMount(){
        this._isMounted = true;
        socket.on(C.EDIT_PASSWORD, data => this.updateProfile(decode(data)));
    }

    componentWillMount() {
        wait(500).then(() => {
            this.setState({ loading: false });
        })
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    saveUserSetting(e){
        if(this._isMounted)
        {
            wait(750).then(() => {
                socket.emit(C.EDIT_PASSWORD, encode({
                    token: storage.getKey('token'),
                    password: this.state.password
                }));
            })
        }
    }

    updateProfile(data){
        if(this._isMounted)
        {
            this.setState({ disabled: false });
            if(data.status){
                return sendNotfication('Your Account Password was Updated ', 'success', 'top-center');
            }
            else {
                return sendNotfication(data.error, 'error', 'top-center');
            }
        }
    }

    back = () => {
        this.props.clicked();
    };

    render() {
        return (
            <>
                {this.state.loading ?
                    <>
                        <div className="text-center" style={{ minHeight: 150 }}>
                            <div class="spinner-border text-info my-2 user-loader" role="status"/>
                        </div>
                    </>
                    :
                    <Form
                        onSubmit={e => {
                            e.preventDefault();

                            if(!this.state.password){
                                document.getElementById('password').classList.add('border-danger');
                                return;
                            }

                            if(!this.state._password){
                                document.getElementById('_password').classList.add('border-danger');
                                return;
                            }

                            if(this.state.password !== this.state._password){
                                sendNotfication('Passwords is different!', 'error', 'top-center');
                            }

                            if(this.state.password === this.state._password){
                                this.setState({ disabled: true });
                                this.saveUserSetting(e);
                            }
                        }}
                    >
                        <Row>
                            <Col sm={6}>
                                <label className="mt-1" htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    autoComplete={'off'}
                                    className="form-control"
                                    value={this.state.password}
                                    required={true}
                                    onChange={e => this.setState({ password: e.target.value })}
                                />
                            </Col>
                            <Col sm={6}>
                                <label className="mt-1" htmlFor="_password">Confirmation Password</label>
                                <input
                                    type="password"
                                    id="_password"
                                    autoComplete={'off'}
                                    className="form-control"
                                    value={this.state._password}
                                    required={true}
                                    onChange={e => this.setState({ _password: e.target.value })}
                                />
                            </Col>
                            <Col sm={12} className="mt-4 text-center">
                                <button type="submit" className="btn btn-sm btn-purple no-shadow" disabled={this.state.disabled}>
                                    <i className="mdi mdi-content-save-outline align-middle mr-1" />
                                    Save New Password
                                    { this.state.disabled &&
                                        <><div className={'ml-2 spinner-border spinner-border-sm'} /></>
                                    }
                                </button>
                                <button type="button" className="btn btn-xs bg-cs btn-back" onClick={this.back}>
                                    Back
                                </button>
                            </Col>
                        </Row>
                    </Form>
                }
            </>
        );
    }
}

export default Security;