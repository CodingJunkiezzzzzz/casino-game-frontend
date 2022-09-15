import React from "react";
import ReactTooltip from "react-tooltip";
import {Modal, Row, Col, ListGroup} from "react-bootstrap";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Swal from "sweetalert2";
import Skeleton from '@material-ui/lab/Skeleton';
import AddToFriend from "../../../Components/User/Friend";
import storage from "../../../../Storage";
import socket from "../../../../Socket";
import {__, Event, encode, decode, wait, getUID, fixDate} from "../../../../Helper";
import {targetUser} from "../../../../actions/gameMessage";
import C from "../../../../Constant";

class Message extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            show: false,
            showButton: false,
            loadingUsers: true, 
            refresh: false,
            users: [],
            message: [],
            myMessage: '',
            uid: getUID,
            friends:  storage.getKey('friends') !== null ? storage.getKey('friends'): null,
            token: storage.getKey('token')
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        socket.on(C.MY_FRIENDS, data => this.getFriends(decode(data)));
        socket.on(C.MESSAGES, data => this.getMessages(decode(data)));
        socket.on(C.ADD_MESSAGES, data => this.addMessage(decode(data)));
        socket.on(C.ADD_FRIEND, () => this.refreshFriend());
        Event.on('pm_update', () => this.getFriendList());
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.target && nextProps.target !== ""){
            this.setState({ showButton: true })
        }
    }

    getFriendList(){
        if(this._isMounted){
            this.setState({ message: [] });
            socket.emit(C.MY_FRIENDS, encode({ token: this.state.token }));
        }
    }

    getFriends = (data) => {
        if(this._isMounted){
            this.setState({ friends: data });
            storage.setKey('friends', data)
            return this.refreshFriend();
        }
    }

    refreshFriend = () =>{
        if(this._isMounted){
            this.setState({ refresh: true, loadingUsers: true });
            wait(1000).then(() => {
                this.makeList()
                this.setState({ refresh: false });
            })
        }
    }

    getMessages(data){
        if(this._isMounted){
            this.setState({message: []});
            if(data.message === undefined || data.message === 'undefined' || data.message.length === 0) return;
            __.reverse(data.message).forEach((message, i) => {
                this.setState(state => ({ message: [<MakeMessage message={message} />, ...state.message] }));
            });
        }
    }

    addMessage(data){
        if(this._isMounted){
            let myUid = parseFloat(this.state.uid);
            if(parseFloat(data.uid) === myUid || parseFloat(data.target) === myUid){
                var add = this.state.message.concat([
                    <MakeMessage message={data} />
                ]);
                this.setState({ message: add });
            }
        }
    }

    makeList() {
        if(this._isMounted)
        {
            let self = this;
            this.setState({ users: [] });
            if(this.state.friends !== null) {
                const friends = __.split(self.state.friends, ',');
                friends.forEach((name, i) => {
                    if(!__.isEmpty(name)){
                        self.setState(state => ({users: [<Friends redux={self.props} token={self.state.token} name={name}/>, ...state.users]}));
                      }
                });
            }
            this.setState({ loadingUsers: false });
        }
    }

    handleShow(){
        if(storage.getKey('token') === null){
            return Swal.fire({
                title: 'Error',
                text: 'Please Login to use this Option',
                type: 'error'
            });
        }
        this.getFriendList();
        this.setState({ show: true, effect: 'zoomIn' });
    }

    handleClose(){
        this.setState({ show: false, loadingUsers: true, effect: 'zoomOut', users: [], message: [], showButton: false });
    }

    handleChange = (e) => {
        var target = e.target;
        var value = target.value;
        var name = target.name;
        this.setState({
            [name]: value
        });
    };

    submit = (e) => {
        if(this._isMounted)
        {
            e.preventDefault();

            if(this.state.myMessage.trim() === '')
                return;

            socket.emit(C.ADD_MESSAGES, encode({
                token: this.state.token,
                to: this.props.target,
                message: this.state.myMessage
            }));

            this.setState({ myMessage: '' })
        }
    };

    render(){
        const { t, desktop } = this.props;
        return(
                <li>
                    <span className="_user-message">
                        <div className="">
                            <ReactTooltip />
                            {
                                desktop ?
                                <span className={"p-1"} onClick={this.handleShow}>
                                    <i className="mdi mdi-comment-text-multiple text-drop mr-1"/> Messages
                                </span>
                                :
                                <button className={"btn btn-transparent tbtn py-1 mt-2-5"} onClick={this.handleShow} data-tip={'Private Messages'}>
                                    <i className={'mdi mdi-wechat mt-0'} />
                                </button>
                            }
                            <Modal
                                size="md"
                                centered={true}
                                backdrop={'static'}
                                id="pv-md-modal"
                                show={this.state.show}
                                onHide={this.handleClose}
                                aria-labelledby="pv-md-modal"
                                className={"animated " + this.state.effect}
                            >
                                <Modal.Header>
                                    {t('private_messages')}
                                    <button type="button" className="close" onClick={this.handleClose}>
                                        <i className={'mdi mdi-close'}/>
                                    </button>
                                </Modal.Header>
                                <Modal.Body className="pt-0">
                                    <div className={'chat-box-center'} id="privateMessage">
                                        <Row>
                                            <Col sm={6} md={3} className={ this.state.users.length === 0 ? "ycenter border-right pl-0 chat-box-left" : "border-right pl-0 chat-box-left"}>
                                                <ListGroup as={'ul'}>
                                                    {
                                                        this.state.loadingUsers ? 
                                                            <>
                                                            <div className="text-center">
                                                                <div class="spinner-border text-info my-5" role="status"/>
                                                            </div>
                                                            </>
                                                            :
                                                            <>
                                                                {
                                                                    this.state.users.length !== 0 ?
                                                                        this.state.users
                                                                    :
                                                                    <div>{t('no_friends')}</div>
                                                                }
                                                            </>
                                                    }
                                                </ListGroup>
                                            </Col>
                                            <Col sm={6} md={9} className="chat-box-right">
                                                {
                                                    this.state.showButton &&
                                                    <div className="text-right border-bottom">
                                                        { !this.state.refresh &&
                                                            <AddToFriend t={t} name={this.props.target} pv={true} />
                                                        }
                                                    </div>
                                                }
                                                <div className="media-body reverse gm">
                                                {
                                                    this.state.message
                                                }
                                                {this.state.showButton ?
                                                    <>
                                                        { this.state.message.length < 1 &&
                                                            <div className={'alert rounded-0'}> {t('there_is_no_any_messages')}</div>
                                                        }
                                                    </>
                                                    :
                                                    <div className={'alert rounded-0'}> {t('please_select_a_friend_to_start_chat')}</div>
                                                }
                                                </div>
                                                <hr/>
                                                {this.state.showButton &&
                                                    <div className="w-100">
                                                        <form onSubmit={e=>this.submit(e)}>
                                                            <div className="form-group mb-0">
                                                                <div className="input-group">
                                                                    <textarea onChange={this.handleChange} autoComplete={'off'} name={'myMessage'}
                                                                              className="form-control" value={this.state.myMessage} />
                                                                    <span className="input-group-append">
                                                                        <button className="btn btn-outline-light" type="submit">
                                                                            <i className={"mdi mdi-send align-middle"} />
                                                                        </button>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                }
                                            </Col>
                                        </Row>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </div>
                    </span>
                </li>
        );
    }
}

class Friends extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            active: ''
        }
    }

    componentWillUnmount() {
        //Set For Redux
        this.props.redux.targetUser(null);
    }

    selectUser(current, name){
        //Set For Redux (for using parent class)
        this.props.redux.targetUser(name);
        socket.emit(C.MESSAGES, encode({token: current, name: name}));
        this.setState({active: 'active'})
    }

    render() {
        let { name, token } = this.props;
        return <ListGroup.Item as="li" onClick={e => this.selectUser(token, name)} id={"d"+token} className={'cpt hv ' + this.state.active}>
            <i className={'mdi mdi-dots-vertical-circle mx-1'} />
            {name}
        </ListGroup.Item>;
    }
}

class MakeMessage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: storage.getKey('name')
        }
    }
    render(){
        let {message, time, date, from_name, to_name} = this.props.message;
        let align = 'right';
        let color = 'rgb(42 43 47)';
        let username = from_name;
        time = fixDate(time);

        if(from_name === this.state.name) {
            align = 'left';
            color = 'rgb(42 43 47)';
        }

        return(
            <>
                <div className={'pv'} style={{ textAlign: align }}>
                    <div className="chat-msg" style={{ background: color }}>
                        <h5>{username}</h5>
                        <p className={'font-light text-white'}>{message}</p>
                        <span>{date} - {time}</span>
                    </div>
                </div>
            </>
        );
    }
}

Message.propTypes = {
    targetUser: PropTypes.func.isRequired,
    target: PropTypes.string
};

const mapStateToProps = state => ({
    target: state.items.target
});

export default connect(mapStateToProps, { targetUser })(Message);