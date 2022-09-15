import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import { GoogleLogin } from 'react-google-login';
import {CLIENT_ID, encode, randomString, sendNotfication} from "../../../Helper";
import socket from "../../../Socket";
import C from "../../../Constant";

class Google extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogined: false,
            accessToken: ''
        };
        this.login = this.login.bind(this);
    }

    login (resp){
            this.setState(state => ({ isLogined: true, accessToken: resp.accessToken }));

            let profile = resp.profileObj;

            socket.emit(C.LOGIN_USER_GOOGLE, encode({
                username: profile.givenName + profile.familyName,
                email: profile.email,
                token: randomString(50),

                //FAKES
                user_token: randomString(50), // fake
                security_key: randomString(10), // fake
                secret_user: randomString(44), // fake
                secret_realtime: randomString(50), // fake
                client_system: randomString(23), // fake
                token_key: randomString(23), // fake
                secret_token: randomString(25), // fake
            }));
    }

    render() {
        return (
            <div className="google">
                { !this.state.isLogined &&
                    <GoogleLogin
                        clientId={ CLIENT_ID }
                        buttonText='Login by Google'
                        onSuccess={ this.login }
                        cookiePolicy={ 'single_host_origin' }
                        responseType='code,token'
                />
                }
            </div>
        )
    }
}

export default withRouter(Google);