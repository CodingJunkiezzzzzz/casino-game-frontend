import React from 'react'
import * as Cookies from "js-cookie";
import {__, wait, decode, encode, getUID, sendNotfication, forceSatoshiFormat, Event} from "../../../../Helper";
import storage from "../../../../Storage";
import socket from "../../../../Socket";
import C from "../../../../Constant";

class Index extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            name: storage.getKey('name') ? storage.getKey('name') : null,
            token: storage.getKey('token') ? storage.getKey('token') : null,
            uid: getUID
        }
    }

    componentWillMount(){
        this._isMounted = true;
        socket.on(C.SEND_TIP, (data) => this.tipUpdate(decode(data)));
        socket.on(C.UPDATE_PAYMENT_STATUS, (data) => this.paymentUpdate(decode(data)));
        socket.on(C.ADD_MESSAGES, data => this.messageUpdate(decode(data)));
        socket.on('admin_notify', data => this.adminNotify(decode(data)));
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    adminNotify(data){
        if(this._isMounted)
        {
            sendNotfication(data.mesage, 'danger', 'top-center');
        }
    }

    tipUpdate = (data) => {
        if(this._isMounted)
        {
            let { token, uid } = this.state;
            let { coin, senderName, amount, target } = data;

            if(parseInt(target) === parseInt(uid))
            {
                let message = "You Received " + forceSatoshiFormat(amount, coin) + " " + coin + " by " + senderName;
                sendNotfication(message, 'success', 'top-right');
            }

            wait(1500).then(() => {
                if(token !== null)
                    socket.emit(C.CREDIT, encode({ token: token, coin: coin }));
            })
        }
    };

    paymentUpdate = (data) => {
        if(this._isMounted)
        {
            let { token, uid } = this.state;

            if(uid !== null)
            {
                if(parseFloat(data.uid) === parseFloat(uid))
                {
                    sendNotfication(data.message, 'success', 'top-right');
                    Event.emit('update_payment');
                }
            }

            wait(1000).then(() => {
                if(token !== null)
                    socket.emit(C.CREDIT, encode({ token: token, coin: data.coin }));
            })
        }
    };

    messageUpdate = (data) => {
        if(this._isMounted)
        {
            const myUid = parseFloat(this.state.uid);
            if(parseFloat(data.uid ) ===  myUid || parseFloat(data.target) === myUid){
                if(data.from_name !== this.state.name){
                    sendNotfication("You Have a unread message from " + data.from_name, 'info', 'top-right');
                }
            }
        }
    };

    render(){
        return null;
    }
}

export default Index;