import React from 'react'
import PropTypes from "prop-types";
import {connect} from "react-redux";
import * as Cookies from "js-cookie";
import UserHeader from './Parts/Header/Header-User';
import GuestHeader from './Parts/Header/Header-Guest';
import Sidebar from './Parts/Sidebar';
import Footer from './Parts/Footer';
import socket from "../../Socket";
import {Event, decode, encode, wait} from "../../Helper";
import WalletAlert from "../../App/Components/User/Wallet/Alert";
import C from "../../Constant";
import Login from "./Auth/Login";
import storage from "../../Storage";

class Index extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            header: <GuestHeader t={this.props.t} location={this.props.location} />,
            auth: false
        }
    }

    componentDidMount(){
        socket.on(C.ONLINE, (status) => this.loginUser(decode(status)));
        Event.on('showAuthModal', (status) => this.activeAuth(status));

        /**
         * Initialize Authentication
         */
        const sessionCookie = Cookies.get("auth");

        if(storage.getKey('token') !== null && sessionCookie)
        {
            socket.emit(C.ONLINE, encode({
                jwt_token: storage.getKey('jwt_token'), //fake
                user_token: storage.getKey('user_token'), //fake
                security_key: storage.getKey('security_key'), //fake
                secret_user: storage.getKey('secret_user'), //fake
                secret_realtime: storage.getKey('secret_realtime'), //fake
                client_system: storage.getKey('client_system'), //fake
                token_key: storage.getKey('token_key'), //fake
                secret_token: storage.getKey('secret_token'), //fake
                token: storage.getKey('token'), // REAL
            }));
        }
    }

    activeAuth = (status) => {
        this.setState({ auth: status });
    }

    loginUser = (data) => {
        wait(500).then(() => {
            if(data.status === true)
            {
                this.setState({ header: <UserHeader t={this.props.t} location={this.props.location} /> });
                Cookies.set("uid", data.id, {expires: 14});
                Cookies.set("auth", true, {expires: 14});
                storage.setKey('name', data.name);
                storage.setKey('email', data.email);
                storage.setKey('credit', data.credit);
                storage.setKey('avatar', data.avatar);
                storage.setKey('friends', data.friends);
                storage.setKey('room', data.room);
            }
            else {
                wait(7000).then(() => {
                    localStorage.clear();
                })
            }
        })
    }

    render(){
        let { header, auth } = this.state;
        let { content } = this.props; // Pages / Games Contents
        let wallet; // Show Wallet if User don't Have Cash

        try {
            wallet = this.props.get_wallet.show;
        }
        catch (e) {}

        const { t } = this.props;
        return(
            <>
                {header}
                <div className="page-wrapper">
                    <Sidebar t={t} />
                    <div className="page-content" id={'page-content'}>
                        {wallet &&
                            <WalletAlert t={t} uid={this.props.get_wallet.uid} />
                        }
                        {auth === true &&
                            <Login t={t} justModal="true" />
                        }
                        {content}
                        <Footer t={t} />
                    </div>
                </div>
            </>
        );
    }
}

Index.propTypes = {
    get_wallet: PropTypes.string
};

const mapStateToProps = state => ({
    get_wallet: state.items.get_wallet
});

export default connect(mapStateToProps, null)(Index);