import React from "react";
import {Row, Col} from "react-bootstrap";
import storage from "../../../../Storage";
import socket from "../../../../Socket";
import {decode, encode, wait, isEmail, sendNotfication} from "../../../../Helper";
import ReactTooltip from "react-tooltip";
import C from "../../../../Constant";

class Parent extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            firstUserName: storage.getKey('name'),
            firstEmail: (storage.getKey('email') !== 'false') ? storage.getKey('email'): '',
            token: storage.getKey('token'),
            email: (storage.getKey('email') !== 'false') ? storage.getKey('email'): '',
            username: storage.getKey('name'),
            loadingEmail: false,
            loadingUsername: false,
            loadingPrivacy: false,
            loading2Fa: false,
            checkbox: false,
            checkbox2: false
        };
    }

    componentDidMount(){
        this._isMounted = true;
        socket.on(C.EDIT_ACCOUNT, data => this.updateProfile(decode(data)));
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    updateProfile(data){
        if(this._isMounted)
        {
            this.setState({ loadingUsername: false, loadingEmail: false });
            if(data.status)
            {
                storage.setKey('name', this.state.username);
                storage.setKey('email', this.state.email);
                sendNotfication('Your Account Setting was Updated !', 'success', 'top-center');
                window.location.reload();
            }
            else {
                return sendNotfication(data.error, 'success', 'top-center');
            }
        }
    }

    save(input){
        if(this._isMounted)
        {
            let { token, email, username, firstUserName, firstEmail } = this.state;

            if(input === 'email')
            {
                if(email === firstEmail){
                    return sendNotfication('Please Enter New Email Address !', 'info', 'top-center');
                }

                if(!email)
                {
                    document.getElementById('email').classList.add('border-danger');
                    return;
                }
                
                if(email.trim() === "")
                {
                    document.getElementById('email').classList.add('border-danger');
                    return;
                }

                if(!isEmail(email))
                {
                    document.getElementById('email').classList.add('border-danger');
                    return;
                }

                this.setState({ loadingEmail: true });

                wait(100).then(() => {
                    socket.emit(C.EDIT_ACCOUNT, encode({
                        token: token,
                        email: email
                    }));
                })
            }

            if(input === 'username')
            {
                if(username === firstUserName){
                    return sendNotfication('Please Enter New Username !', 'info', 'top-center');
                }

                if(!username)
                {
                    document.getElementById('username').classList.add('border-danger');
                    return;
                }

                if(username.trim() === "")
                {
                    document.getElementById('username').classList.add('border-danger');
                    return;
                }

                this.setState({ loadingUsername: true });

                wait(500).then(() => {
                    socket.emit(C.EDIT_ACCOUNT, encode({
                        token: token,
                        username: username
                    }));
                })
            }
        }
    }

    handleCheckBox = (e) => {
        this.setState({ checkbox: true, loadingPrivacy: true });
             wait(1200).then(() => {
                this.setState({ loadingPrivacy: false, checkbox: false });
                return sendNotfication('This feature can\'t be active in your account !', 'info', 'top-center');
            })
    }

    render() {
        return (
            <>
                <ReactTooltip />
                <Row>
                    <Col sm={6}>
                        <label htmlFor="email">Email Address</label>
                        <div className="input-group">
                            <input
                                type="email"
                                id="email"
                                autoComplete={'off'}
                                className="form-control"
                                placeholder={'Enter New Email'}
                                value={this.state.email}
                                required={true}
                                onChange={e => this.setState({ email: e.target.value })}
                            />
                            <div className="input-group-append">
                                <button onClick={e => this.save('email') } type="button" className="btn btn-secondary no-shadow btn-clipboard" data-tip="Save">
                                    {this.state.loadingEmail ?
                                        <div className="spinner-border spinner-border-sm" role="status" />
                                        : <i className="mdi mdi-content-save-settings"/>
                                    }
                                </button>
                            </div>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <label htmlFor="username">Username</label>
                        <div className="input-group">
                            <input
                                type="username"
                                id="username"
                                autoComplete={'off'}
                                className="form-control"
                                value={this.state.username}
                                required={true}
                                onChange={e => this.setState({ username: e.target.value })}
                            />
                            <div className="input-group-append">
                                <button onClick={e => this.save('username') } type="button" className="btn btn-secondary no-shadow btn-clipboard" data-tip="Save">
                                    {this.state.loadingUsername ?
                                        <div className="spinner-border spinner-border-sm" role="status" />
                                        : <i className="mdi mdi-content-save-settings"/>
                                    }
                                </button>
                            </div>
                        </div>
                    </Col>
                </Row>
                {/*
                <Row>
                    <Col sm={12} md="6">
                        <label className="mt-3" htmlFor="mi"></label>
                        <div className="input-group">
                            <div class="custom-control custom-switch switch-danger">
                                <input type="checkbox" class="custom-control-input" id="mi" checked={this.state.checkbox} onChange={this.handleCheckBox}  />
                                <label class="custom-control-label cpt" for="mi">Make Me Incognito
                                   {this.state.loadingPrivacy &&
                                        <div className="spinner-border spinner-border-sm ml-2" role="status" />
                                    }
                                </label>
                            </div>
                        </div>
                    </Col>
                </Row>
                */}
            </>
        );
    }
}

export default Parent;