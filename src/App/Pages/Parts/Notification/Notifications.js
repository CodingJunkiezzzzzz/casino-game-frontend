import React, { Component } from "react";
import {Modal} from "react-bootstrap";
import socket from "../../../../Socket";
import {Event, decode, fixDate, wait} from "../../../../Helper";
import C from "../../../../Constant";

class Notification extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            notifications: []
        };
    }

    componentDidMount(){
        socket.emit(C.NOTIFICATION);
        socket.on(C.NOTIFICATION, data => this.getNotification(decode(data)));
    }

    getNotification(data){
        wait(1000).then(() => {
            this.setState({ loading: false});
        })

        data.forEach((news, i) => {
            this.setState(state => ({ notifications: [<OpenModal t={this.props.t} key={i} title={news.title} content={news.content} date={news.date}/>, ...state.notifications] }));
        });
    }

    render() {
        return(
            <>
                { this.state.loading ?
                <>
                    <b className={"mt-1 d-block text-center"}>
                        <div className="spinner-grow text-pink" role="status" />
                    </b>
                </>
                : this.state.notifications
                }
            </>
        );
    }
}

class OpenModal extends React.Component {
    send = (data) => {
        Event.emit('show_notify', this.props)
    }
    render() {
        let { title, date } = this.props;
        return(
            <>
                <button onClick={this.send} className="dropdown-item notify-item mb-2">
                    <div className="notify-icon bg-success"><i className="mdi mdi-dice-6"/></div>
                    <p className="notify-details">{title}<small className="text-muted">{fixDate(date)}</small></p>
                </button>
            </>
        );
    }
}

export default Notification;