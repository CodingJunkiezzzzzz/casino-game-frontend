import React, { Component } from 'react'
import {Card, Row, Col} from "react-bootstrap";
import socket from "../../../../Socket";
import UserModal from "../../User/Stat/Modal";
import {forceSatoshiFormat, decode, encode, __} from "../../../../Helper";
import C from "../../../../Constant";

class Index extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            gid: null,
            show: false,
            loading: true,
            playerRow: []
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.setState({ gid: this.props.game_id, loading: true, playerRow: [], show: this.props.show });
        socket.on(C.GAME_DETAILS, data => this.gameInfo(decode(data)));

        let id = this.props.params.pathname;
        id = id.replace('/game/','');
        this.getGameInfo(id);
    }

    getGameInfo(id){
        socket.emit(C.GAME_DETAILS, encode({id: id}));
    }

    gameInfo(response){
        if(this._isMounted) {
            this.setState({ loading: false });
            if(response.data !== null) {
                let gameInfo = response.info;

                this.setState({ busted: gameInfo.bust, sha256: gameInfo.hash, hash: gameInfo.md5, date: gameInfo.date });
                var sort = sortByWinner(response.data);
                    sort = __.xor(sort);
                __.reverse(sort).forEach((array, i) => {
                    var row = <PlayerRow array={array} key={i} />;
                    this.setState(state => ({ playerRow: [row, ...state.playerRow] }));
                });
            }
        }
    }

    render(){
        let { busted, date, sha256, hash, playerRow, loading } = this.state;
        let color   = (busted >= 1.9 ? 'success' : 'danger');

        if(busted !== undefined && busted.length > 5){
            busted = __.replace(busted, '{', '');
            busted = __.replace(busted, '}', '');
            busted = __.split(busted, ',');
            busted = __.split(busted, '"');
            busted = __.toArray(busted);
        }

        return (
            <>
                <Card>
                    <Card.Header>Game Stats</Card.Header>
                    {this._isMounted && playerRow &&
                    <Card.Body>
                        {busted &&
                        <>
                            <Row className="text-darker pt-0 mb-1 user-detail">
                                <Col md={6} sm={12}>
                                    <div className="review-box text-center align-item-center pb-0">
                                        <h1 className={ "my-0 py-0 text-" + color }>{busted} <span className={"font-20"}>x</span> </h1>
                                        <h5 className={ "mt-1 pt-0 text-" + color}>Busted</h5>
                                        <h5 className="text-darker">
                                            {sinceConvert(date)}
                                        </h5>
                                    </div>
                                </Col>
                                <Col md={6} sm={12} className="text-center">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <div className="input-group-append">
                                                <span className="input-group-text h-40">SHA256</span>
                                            </div>
                                            <input type="text" className="form-control no-radius pointer mb-3"
                                                   value={__.toString(sha256)} readOnly={true} />
                                        </div>
                                        <div className="input-group">
                                            <div className="input-group-append">
                                                <span className="input-group-text h-40">HASH</span>
                                            </div>
                                            <input type="text" className="form-control no-radius pointer"
                                                   value={__.toString(hash)} readOnly={true} />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </>
                        }
                        <hr className={"user-border"}/>
                        <h4 className={"my-4 font-20"}>Players List</h4>
                        <div className="table-responsive game-stats">
                            <table className="table table-striped table-bordered table-condensed table-hover">
                                <thead className="table-header">
                                    <tr>
                                        <th>PLAYER</th>
                                        <th>BET</th>
                                        <th>PROFIT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {playerRow}
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                    }
                    {loading &&
                        <div>
                            <div className="text-center pb-3">
                                <div className="spinner-border text-danger" role="status" />
                            </div>
                        </div>
                    }
                </Card>
            </>
        );
    }
}

class PlayerRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render(){
        const { array, key } = this.props;
        let color = 'text-success';
        let profit = null != array.profit ? array.profit : 0;
        if (profit === 0) {
            profit = '-' + array.amount;
            color = 'text-danger';
        }
        let coin = __.upperCase(array.coin);
        return (
            <>
                <tr className={ color } key={key}>
                    <td>
                        <UserModal username={array.username} isWinner={color} />
                    </td>
                    <td>
                        <img src={'/assets/images/' + coin + '.png'} className={'mini-coin-2'} alt={coin}/>
                        {forceSatoshiFormat(array.amount)} {coin}
                    </td>
                    <td>
                        <img src={'/assets/images/' + coin + '.png'} className={'mini-coin-2'} alt={coin}/>
                        {forceSatoshiFormat(profit)} {coin}
                    </td>
                </tr>
            </>
        );
    }
}

function sortByWinner(input) {
    function r(c) {
        let profit = null != c.profit ? c.profit : null;
        if(profit === 0)
            return null;
        else return profit;
    }
    return __.sortBy(input, r);
}

function sinceConvert(unixTimestamp) {
    const milliseconds = unixTimestamp * 1000;
    const dateObject = new Date(milliseconds);
    return dateObject.toLocaleString();
}

export default Index;