import React, {Component, createRef} from "react";
import ReactDOM from "react-dom";
import PerfectScrollbar from 'perfect-scrollbar';
import ReactTooltip from "react-tooltip";
import socket from "../../../../Socket";
import storage from "../../../../Storage";
import UserModal from "../Stat/Modal";
import {__, forceSatoshiFormat, decode, encode, wait, sendNotfication, fixDate, Event} from "../../../../Helper";
import games from "../../../games";
import C from "../../../../Constant";

class History extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            token: storage.getKey('token'),
            loading: true,
            next: false,
            history: []
        };
    }

    componentDidMount(){
        this._isMounted = true;
        loadScroll();
        wait(500).then(() => {
            socket.emit(C.MY_HISTORY, encode({token: this.state.token }));
        })
        socket.on(C.MY_HISTORY, data => this.makeHistory(decode(data)));
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    makeHistory = (arr) => {
        if(this._isMounted)
        {
            if(typeof arr.history === "undefined") return;
            this.setState({ loading: false });
            
            var result = arr.history;

            result.forEach((player, i) => {
                let row = <HistoryTable key={i} result={player.result} hash={player.hash} self={true} 
                            id={player.gid} game={player.game} created={player.created} coin={player.coin} username={player.username}
                                        amount={forceSatoshiFormat(player.amount)} profit={player.profit ? forceSatoshiFormat(player.profit): '0.00000000'}  />;
                this.setState(state => ({ history: [row, ...state.history] }));
            });
        }
    };

    nextPage = () => {
        if(this._isMounted)
        {
            this.setState({ next: true });
        }
    };

    render() {
        let { loading, history, next } = this.state;

        let counts = history.length;
        let reduce = counts / 2;

        if(!next)
            history = history.slice(reduce);

        if(history.length > 1)
        history.length = 10

        return (
            <>
                <>
                    { loading &&
                    <div className="text-center my-3">
                        <div className="spinner-border text-info" role="status" />
                    </div>
                    }
                    { !loading &&
                    <>
                        <div className="user-history" id={'list'} style={{ height: 400 }}>
                            <div className="table-responsive mt-2">
                                <table className="table table-hover font-13">
                                    <thead>
                                    <tr>
                                        <th scope="col">Game</th>
                                        <th scope="col">BET ID</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Profit</th>
                                        <th scope="col">Date/Time</th>
                                        <th scope="col">HASH</th>
                                    </tr>
                                    </thead>
                                    {history.length > 0 &&
                                     history
                                    }
                                </table>
                                {history.length === 0 &&
                                    <div className="alert bg-soft-dark mt-2 w-100 font-13 text-center">
                                        Your history list is empty
                                    </div>
                                }
                                { history.length > 0 &&
                                    <div onClick={this.nextPage} className={'text-center font-13 cpt mb-2'}>
                                        <i className={'mdi mdi-arrow-right-bold-circle'} /> Next Page
                                    </div>
                                }
                            </div>
                        </div>
                    </>
                    }
                </>
            </>
        );
    }
}

class HistoryTable extends React.Component{
    constructor(props){
        super(props);
        this.myRef = createRef();
    }
    
    copy(){
        let hash = this.myRef.current.getAttribute('data-tip');
        let input = React.createElement('input', { id: 'id' + hash, value: hash });
        ReactDOM.render(
            input,
            document.getElementById('helper')
        );
        let value = document.getElementById('id' + hash);
        if(value !== null){
            wait(1000)
                .then( () => {
                    value.select();
                    value.setSelectionRange(0, 99999);
                    document.execCommand("copy");
                    sendNotfication('Hash Copied !', 'info', 'bottom-center');
                });
        }
    }

    gameDetail = () => {
        Event.emit('single_game_modal', { data: this.props })
    }

    render() {
        let {username, amount, profit, coin, created, hash, id, self, game} = this.props;
        let isWinner = false;

        if(__.toNumber(profit) !== 0.00000000)
            isWinner = true;

        let code;

        try {
            code = hash.substr(0,10) + '...';
        } catch (e) {}

        return(
            <tr className="cpt">
                <td onClick={this.gameDetail}>
                    {game}
                </td>
                <td onClick={this.gameDetail}>
                    {id}
                </td>
                {!self &&
                <td>
                    <UserModal username={username} isWinner={isWinner} />
                </td>
                }
                <td onClick={this.gameDetail} className={(isWinner===true) ? 'text-success-2 num-style': 'num-style'}>
                    <img src={'/assets/images/' + __.upperCase(coin) + '.png'} className={'mini-coin-2 hidden-sm'} alt={coin}/>
                    {amount} {__.upperCase(coin)}
                </td>
                <td onClick={this.gameDetail} className={(isWinner===true) ? 'text-success-2 num-style': 'num-style'}>
                    <img src={'/assets/images/' + __.upperCase(coin) + '.png'} className={'mini-coin-2 hidden-sm'} alt={coin}/>
                    {profit} {__.upperCase(coin)}
                </td>
                <td onClick={this.gameDetail}>
                    {fixDate(created)}
                </td>
                {self &&
                <td onClick={this.gameDetail}>
                    <ReactTooltip/>
                    <span ref={this.myRef} onClick={e => this.copy(hash)} data-tip={hash}>
                            {code}
                    </span>
                </td>
                }
            </tr>
        );
    }
}

function loadScroll(){
    if(document.getElementById('list') !== null){
        let ps = new PerfectScrollbar('#list', {
            wheelSpeed: 1,
            suppressScrollX: true,
            wheelPropagation: true,
            minScrollbarLength: 2
        });
        ps.update();
    }
}

export default History;