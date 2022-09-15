import React, { Component } from 'react'
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import socket from "../../../../Socket";
import storage from "../../../../Storage";
import C from "../../../../Constant";
import {__, defaultAvatar, encode, Event} from "../../../../Helper";

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coin: 'btc'
        };
    }

    getDetail = (e) => {
        e.preventDefault();

        if(this.props.clicked !== undefined)
            this.props.clicked(); // close game modal

        Event.emit('single_game_modal_close');
        Event.emit('force_modal_user');
        socket.emit(C.USER_INFO, encode({name: this.props.username, coin: this.state.coin,  game: 'all', first: true }));
    };

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

    render(){
        let {username, isWinner, cssClass, queue, menu, avatar, chat, level} = this.props;

        if(isWinner === true)
            cssClass = 'text-success';

        let link = <>
            <Link to={'/user/' + username} onClick={ e => this.getDetail(e) } className={cssClass}>
                {username}
            </Link>
        </>;

        if(menu)
        {
            link = <>
                <Link to={'/user/' + username} onClick={ e => this.getDetail(e) } className={'text-muted ng'}>
                    <p className="p-0 m-0">
                        <img src={avatar} alt="profile-user" className="thumb-md rounded-circle" />
                    </p>
                </Link>
            </>;
        }

        else if(queue)
        {
           let fixAvatar = (avatar !== undefined && avatar !== false && avatar !== "" && avatar !== null) ? avatar : defaultAvatar;
            link = <>
                <Link to={'/user/' + username} onClick={ e => this.getDetail(e) } className={cssClass}>
                    <img src={fixAvatar} alt="user" className="rounded-circle thumb-xs mr-1 hidden-sm" />
                    {username}
                </Link>
            </>;
        }
        else
        {
            if(avatar){ // Chats
                link = <>
                    <Link to={'/user/' + username} onClick={ e => this.getDetail(e) } className={cssClass}>
                        <img src={avatar} alt="user" className="thumb-lg" />
                        <ul className={'ml-2 mt-0 d-flex'}>
                            <span>{username}</span>
                             <b className="user-level">
                                {this.makeStars(level)}
                            </b>
                        </ul>
                    </Link>
                </>;
            }

            if(chat)
            {
                if(avatar === null){
                    link = <>
                        <Link to={'/user/' + username} onClick={ e => this.getDetail(e) } className={cssClass}>
                            <img src={'/assets/images/avatar.png'} alt="user" className="rounded-circle thumb-sm" />
                            <ul className={'ml-1 mt-0 d-flex'}>
                                <span>{username}</span>
                                 <b className="user-level">
                                    {this.makeStars(level)}
                                </b>
                            </ul>
                        </Link>
                    </>;
                }
            }
        }

        return link;
    }
}

Modal.propTypes = {
    coin: PropTypes.string
};

const mapStateToProps = state => ({
    coin: state.items.coin
});

export default connect(mapStateToProps, {})(Modal);