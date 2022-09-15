import React from "react";
import {Button} from "react-bootstrap";
import SocketIOFileUpload from 'socketio-file-upload';
import socket from "../../../../Socket";
import storage from "../../../../Storage";
import {__, API, getElement, defaultAvatar, getUID, decode} from "../../../../Helper";
import C from "../../../../Constant";

let _defaultAvatar = defaultAvatar;

class Avatar extends React.Component {
    _isMounted = false;
    instance = null;
    constructor (props) {
        super(props);
        this.state = {
            disabled: false,
            avatar: storage.getKey('avatar') !== 'null' ? storage.getKey('avatar'): _defaultAvatar
        };
        this.responseStatus = this.responseStatus.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.instance = new SocketIOFileUpload(socket);
        this.instance.addEventListener("start", function(event){
            event.file.meta.token = storage.getKey('token');
        });
        this.instance.listenOnInput(getElement("#avatar-button-file"));
        socket.on(C.SAVE_AVATAR, data => this.responseStatus(decode(data)));
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.instance.removeEventListener("start", this.instance.prompt, false);
        this.instance.destroy();
        this.instance = null;
    }

    responseStatus(data){
        if(this._isMounted){
            let { status, file } = data;
            if(status === true){
                let avatar = API + '/uploads/' + file;
                storage.setKey('avatar', avatar);
                this.setState({ avatar: avatar });
            }
        }
    }

    chooseAvatar = () => {
        if(this._isMounted){
            getElement("#avatar-button-file").click();
        }
    };

    render() {
        let { avatar } = this.state;
        if(avatar === null || !avatar){
            avatar = "/assets/images/avatar.png";
        }
        return (
            <div className={"avatar-upload my-4 text-center"}>
                <img src={avatar} className={'thumb-lg bg-dark rounded-circle'} alt="Avatar" />
                <br/>
                <Button
                    size={'sm'}
                    onClick={(e)=> this.chooseAvatar(e)}
                    variant="- bg-cs2"
                    className={'mt-2 btn-sm no-shadow'}
                >
                    <i className={"fas fa-upload mr-1"}/>
                    Upload Avatar
                </Button>
                <input
                    accept="image/*"
                    id="avatar-button-file"
                    type="file"
                    className="d-none"
                    onChange={this.upload}
                />
            </div>
        );
    }
}

export default Avatar;