import React from "react";
import PropTypes from "prop-types";
import {Col, Row, Card} from "react-bootstrap";
import {connect} from "react-redux";
import Scroll from "react-scroll";
import Skeleton from '@material-ui/lab/Skeleton';
import {setName} from "../../../../actions/gameChat";
import socket from "../../../../Socket";
import storage from "../../../../Storage";
import UserModal from "../../../Components/User/Stat/Modal";
import { getElement, __, wait, encode, decode, defaultAvatar, isUTF8, Event, sendNotfication } from "../../../../Helper";
import C from "../../../../Constant";

const Element = Scroll.Element;
const SC = Scroll.scroller;

class Messages extends React.Component {
    bubble = 'none';
    bubbleMsg = 0;
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            alertSpam: false,
            messages: [],
            loader: [],
            clientCountry: storage.getKey('country') ? storage.getKey('country'): "GLOBAL",
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.setLoader();

        wait(2500).then(() => {
            var c = this.state.clientCountry;
            socket.emit(C.CHATS, c);
        });

        socket.on(C.CHATS, data => this.getChats((data)));
        socket.on(C.ADD_CHAT, data => this.getNewChats((data)));
        // Event.on('twitch', data => this.getNewChats(data));

        Event.on('scrolldone', () => this.updateScroll());
        this.updateScroll();
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(this._isMounted){
            if(nextProps.country)
            {
                this.setState({ clientCountry: nextProps.country, messages: []});
                this.setLoader();

                wait(500).then(() => {
                    var c = nextProps.country;

                    if(__.lowerCase(c) === "spam"){
                        this.setState({ alertSpam: true });
                        Event.emit('open_socket');
                    }
                    else {
                        this.setState({ alertSpam: false});
                        Event.emit('close_socket');
                    }

                    socket.emit(C.CHATS, c);
                });
            }
            this.updateScroll();
        }
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if(this._isMounted){
            let e = getElement('#messages'),
                t = e.clientHeight,
                n = e.scrollHeight,
                r = e.scrollTop;
            this.scrollBottom = n - r - t
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
		if(this._isMounted){
			this.updateScroll();
			if(this.state.messages.length >= 150){
				var slice = __.slice(this.state.messages, this.state.messages.length - 1 , this.state.messages.length);
				this.setState({ messages: slice })
				this.state.messages.length = 150;
			}
        }
    }

    updateScroll(){
        if(this._isMounted)
        {
           if(this.scrollBottom <= 150){
                SC.scrollTo('chatBarElement', {
                    delay: 3,
                    smooth: true,
                    containerId: 'messages',
                    offset: getElement('#sc').scrollHeight * 2,
                });
                getElement('.chat-bubble').classList.add('hidden');
                this.bubbleMsg = 0;
            }
            else {
                this.bubbleMsg += 1;
                if(this.bubbleMsg !== 0){
                    getElement('.chat-bubble').classList.remove('hidden');
                }
            }
        }
    }

    setLoader = () => {
        if(this._isMounted)
        {
			const icon = <div className="ycenter"><div class="spinner-border text-info" role="status" /></div>;
			this.setState({ loader: icon })
		}
    };

    getChats(data) {
        if(this._isMounted){
            this.setState({ messages: [], loader: [] });
            sortByTime(data).forEach((message, i) => {
                this.setState(state => ({ messages: [<Message t={this.props.t} key={i} message={message} redux={this.props} />, ...state.messages] }));
            });
        }
    }

    getNewChats(message) {
        if(this._isMounted){
            let { country } = this.props;
            let currentCountry = country ? country: this.state.clientCountry;

            if(__.upperCase(message.country) === __.upperCase(currentCountry))
            {
                let add = this.state.messages.concat([
                    <Message t={this.props.t} key={this.state.messages.length + 1} message={message} redux={this.props} />
                ]);
                this.setState({ messages: add });
            }
        }
    }

    hideBubble = () =>{
        if(this._isMounted)
        {
			SC.scrollTo('chatBarElement', {
				delay: 3,
				smooth: true,
				containerId: 'messages',
				offset: getElement('#sc').scrollHeight * 2,
			});
			getElement('.chat-bubble').classList.add('hidden');
			this.bubbleMsg = 0;
		}
    }

    render(){
        return(
                <Element name="chatBarElement">
                    <ul className="nav chats" id={'sc'}>
                        <div onClick={this.hideBubble} className={'chat-bubble'}>
                            {this.bubbleMsg}
                        </div>
                        {this.state.loader}
                        {this.state.messages}
                    </ul>
                </Element>
        );
    }
}

class Message extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: storage.getKey('name')
        }
    }

    callUser(name){
        Event.emit('call_user', '@' + name + ' ')
    }

    createMarkup(msg) {
        return { __html: msg };
    }

    isSharing = (value) => {
        if(__.isString(value)){
            let test = value.substr(0, 5);
            if( test === '{"gam' || test === '{"uid' )
                return true;
            else 
                return false;
        }
        else
			return true;
    }

    makeStars = (num) => {
            let stars = 5;
            let userLevel = stars - parseFloat(num);
            var g = [], o = [], f = [];
            for(var i = 0; i < userLevel; i++){
                g.push(<i className={'mdi mdi-star'} />);
            }
            for(var i = 0; i < num; i++){
                o.push(<i className={'mdi mdi-star text-success'} />);
            }
            f.push(o, g);
            return f;
    }

    hiddenAlert = () => {
        return sendNotfication('All users in the spam room are hidden!', 'warning', 'bottom-center');
    }

    render() {
        const { t, key } = this.props;
        let { name, message, avatar, time, level, twitch } = this.props.message;
        const content = message;
        let username = name;
        let style;
        let isNotSelf = false;
        let highlight = '';
        avatar = avatar !== 'false' ? avatar : defaultAvatar;

        // if(isUTF8(message)){
        //     style = {
        //         float: "right"
        //     }
        // }

        //System Message
        if(username === 'SystemBot'){
            style = {
                background: '#673ab7'
            }
        }

        if(this.state.name === username)
            isNotSelf = true;

        if(!this.isSharing(message))
        {
            let r = new RegExp('@' + this.state.name + '(?:$|[^a-z0-9_\-])', 'i');
            if (this.state.name !== username && r.test(message)){
                // new Audio('/assets/sounds/ding.mp3').play();
                highlight += 'highlight-on';
            }

            //Check Links
            var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
            var regex = new RegExp(expression);
            if (message.match(regex)) {
                let hidden = t('link_is_hidden');
                message = <div dangerouslySetInnerHTML={this.createMarkup(`<span className="text-danger">[ ${hidden} ]</span>`)} />;
            }

            var arr = [];
            
            //Check Usernames Calls
            let check = __.words(message, /@([a-zA-Z0-9]+)/gi);
            if(!twitch){
                if (check.length !== 0) {
                    for( let i = 0; i < check.length; i++)
                    {
                        let username = check[i];
                        let link = <span key={i} className="text-warning"> @<UserModal key={i} username={__.replace(username, '@', '')} cssClass="text-warning" /></span>;
                        // arr.push(link)
                        try {
                            message = message.split(" ").map((c) => (c === username ? link : " " + c));
                        } catch (e) {}
                    }
                }
            }
        }
        else {
            style = {
                width: '100%'
            }

            if(__.isString(message)){
                message = JSON.parse(message)
            }

            var isLost = false;
            var profit = parseFloat(message.profit);

            if (profit === 0 || profit === 0.00000000) {
                isLost = true;
            }

           message = <div className="share-result">
                { isLost ?
                    <h4 className="text-danger text-center mt-0 mb-3">{t('lost')}</h4>
                    :
                    <h4 className="text-warning text-center mt-0 mb-3 trmg">
                        <img src="/assets/images/contest.png" class="img-fluid" style={{ width: 40 }} /> <br/> {t('winner')}
                    </h4>
                }
                <Row>
                    <Col md="6" sm="6">
                        <div className="text-success bg-soft-info rounded py-2">{message.result}x <br/> {t('result')}</div>
                    </Col>
                    <Col md="6" sm="6">
                        <div className="text-white bg-soft-info rounded py-2">
                            <img className="mini-coin-8 mr-1" src={'/assets/images/' + __.lowerCase(message.coin) + '.png'} />
                            {message.profit} <br/> {t('profit')}
                        </div>
                    </Col>
                    <Col md="12" sm="12">
                        <div className="bg-soft-info text-white rounded mt-3 py-2">ID: {message.gid}</div>
                    </Col>
                </Row>
           </div>
        }

         // message = __.replace(message, /@([a-zA-Z0-9]+)/gi, `<a class="text-warning" href="/user/$1">@$1</a>`)

        return(
                <li key={__.toString(key)} className={'nav-item chat-part animated XfadeIn ' + highlight}>
                    <UserModal t={t} level={level} cssClass={'user-avatar ml-1'} username={username} chat={true} avatar={avatar} />
                    { (!isNotSelf && !twitch) && <>
                        <div className="chat-option float-right">
                            <span className={'font-15'} onClick={() => this.callUser(username)}>
                                 <span className={'list-inline-item mt-2 font-20'}>@</span>
                            </span>
                        </div>
                    </>}
                    <div className={'msg font-light'} style={ style }>
                        {message}
                        {/*{arr.length !== 0 ?
                            <div dangerouslySetInnerHTML={this.createMarkup(message)} />
                        :
                            message
                        }*/}
                    </div>
                    <span className={'chat-date'}>{time}</span>
                </li>
        );
    }
}

function sortByTime(input) {
    function r(c) {
        return c.sorter ? - c.sorter : null;
    }
    return __.sortBy(input, r);
}

Messages.propTypes = {
    country: PropTypes.string
};

const mapStateToProps = state => ({
    country: state.items.country
});

export default connect(mapStateToProps, { setName })(Messages);