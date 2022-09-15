import React, { Component } from 'react'
import {Link} from "react-router-dom";
import socket from "../../../../Socket";
import {Event, encode} from "../../../../Helper";
import C from "../../../../Constant";

class GameModal extends Component {
    constructor(props) {
        super(props);
    }

    getDetail = (e, id) => {
        e.preventDefault();

        if(this.props.clicked !== undefined)
            this.props.clicked(); // can close game modal

        Event.emit('force_modal_game');
        socket.emit(C.GAME_DETAILS, encode({id: id}));
    };

    render(){
        let {game_id, title, font} = this.props;
        var color = "white";
        font = font ? font : 14;
        return (
            <>
                <Link to={ '/game/' + game_id} onClick={ e => this.getDetail(e, game_id) } className={"text-" + color + " font-" + font}>
                    {title}
                </Link>
            </>
        );
    }
}

export default GameModal;