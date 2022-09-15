import React, {Component} from "react";
import ReactTooltip from "react-tooltip";
import socket from "../../../../Socket";
import {__, Event, decode, encode, wait, sendNotfication} from "../../../../Helper";
import storage from "../../../../Storage";
import C from "../../../../Constant";

class AddToFriend extends Component{
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            friends: storage.getKey('friends') !== null ? storage.getKey('friends') : null,
            token: storage.getKey('token'),
            button: "Add",
            loading: false
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.setUpFriends();
        socket.on(C.ADD_FRIEND, data => this.updateFriends(decode(data)));
    }

    componentWillUnmount(){
        this._isMounted = false;
    }
    
    setUpFriends(){
        if(this._isMounted)
        {
            wait(500).then(() => {
                if(this.state.friends !== null) {
                    const friends = __.split(this.state.friends, ',');
                    if(friends.includes(this.props.name)){
                        this.setState({ button: "Remove" })
                    }
                }
            })
        }
    }

    updateFriends(response){
        if(this._isMounted)
        {
            wait(350).then(() => {
                if(response.status)
                    this.setState({ button: "Remove" });
                else
                    this.setState({ button: "Add" });

                storage.setKey('friends', response.data);

                this.setState({ friends: response.data });

                this.setState({ loading: false });
                sendNotfication('Friend list updated', 'success', 'top-center');

                this.setUpFriends();

                //Update Private Message Users
                Event.emit('pm_update');
            });
        }
    }

    setFriend(name){
        if(this._isMounted)
        {
            if(name === null) return;

            if(this.state.token === null){
                return sendNotfication('Please Login to Use this Option', 'info', 'top-center');
            }

            this.setState({ loading: true });

            socket.emit(C.ADD_FRIEND, encode({ token: this.state.token, name: name }));
        }
    }

    render() {
        if(storage.getKey('name') === this.props.name) return null;
        if(this.props.name === null || !this.props.name) return null;
        if(this.props.name === 'SystemBot') return null;

        let { pv, onModal, onChat } = this.props;

        return(
            <>
                <ReactTooltip />
                {
                    onModal === true ?
                       <button className="btn btn-cs-6 btn-xs shadow-none text-white rounded font-12 px-3 text-uppercase"
                            onClick={() => this.setFriend(this.props.name)}
                            disabled={this.state.loading}>
                          {
                            this.state.loading ?
                                <div class="spinner-grow spinner-grow-sm align-middle mr-1" /> 
                                :
                                <i className="mdi mdi-account-plus font-17 align-middle mr-1" />  
                          }
                          {this.state.button}
                      </button>
                    :
                    <>
                        { onChat === true ?
                            <>
                                <div className={'list-inline-item ml-2'}>
                                    <span className="cpt" data-tip={this.state.button} onClick={() => this.setFriend(this.props.name)}>
                                        <i className="mdi mdi-account-plus font-18 align-middle"/>
                                    </span>
                                </div>
                            </>
                            :
                            <>
                                { pv !== true ?
                                    <div className={'list-inline-item ml-2'}>
                                        <button className="btn btn-cs btn-xs shadow-none" onClick={() => this.setFriend(this.props.name)}>
                                            <i className="mdi mdi-account-plus font-14" /> {this.state.button}
                                        </button>
                                    </div>
                                    :
                                    <button className="btn btn-soft-danger btn-xs m-1" data-tip={this.state.button} onClick={() => this.setFriend(this.props.name)}>
                                        <i className="mdi mdi-account-alert font-20"/>
                                    </button>
                                }
                            </>
                        }
                    </>
                }
            </>
        );
    }
}

export default AddToFriend;