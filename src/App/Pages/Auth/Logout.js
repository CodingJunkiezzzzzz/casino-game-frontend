import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import * as Cookies from "js-cookie";
import Swal from 'sweetalert2';
import storage from "../../../Storage";
import {encode} from "../../../Helper";
import socket from "../../../Socket";
import C from "../../../Constant";

class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    ask(){
        Swal.fire({
            title: 'Are you sure to logout?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.value)
            {
                socket.emit(C.LOGOUT_USER, encode({ token: storage.getKey('token')}));
                localStorage.clear();
                Cookies.remove("session");
                Cookies.remove("auth");
                Cookies.remove("uid");
                window.location.replace('./');
            }
        });
    }

    render(){
        return(<>
                <button onClick={this.ask} className={"dropdown-item"}>
                    <i className="dripicons-exit text-muted ml-1 mr-2 text-drop"/>
                    Logout
                </button>
        </>);
    }
}

export default withRouter(Logout);