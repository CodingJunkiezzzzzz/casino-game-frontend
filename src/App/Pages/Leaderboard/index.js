import React from 'react'
import {Helmet} from 'react-helmet'
import { Row, Col, Card, Table } from "react-bootstrap";
import storage from "../../../Storage";
import socket from "../../../Socket";
import { forceSatoshiFormat, wait, __} from "../../../Helper";
import C from "../../../Constant";
import UserModal from "../../Components/User/Stat/Modal";

class Leaderboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            players: []
        }
    }

    componentDidMount() {
        socket.emit(C.TOP_WINNERS);
        socket.on(C.TOP_WINNERS, data => this.makeList(data));
    }

    makeList = (data) => {
        wait(500).then(() => {
            this.setState({ loading: false, players: data });
        })
    };

    render(){
        const { t } = this.props;

        const list = this.state.players.map((player, i) =>
            <Players key={i} medal={i+1} player={player} />
        );

        return(
                <>
                <Helmet>
                    <title>Leaderboard - Original Crash Game</title>
                </Helmet>
                <div className={'table-responsive last-bets num-style mb-0'}>
                    {
                        this.state.loading ?
                            <div className="text-center">
                                <div class="spinner-grow text-white my-3" role="status"/>
                            </div>
                        :
                        <Table className={"mb-2"}>
                            <thead>
                            <tr>
                                <th>
                                   #
                                </th>
                                <th>
                                    {t('username')}
                                </th>
                                <th>
                                    {t('wagered')}
                                </th>
                                <th>
                                    {t('prize')}
                                </th>
                                <th>
                                   {t('medal')}
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {list}
                            </tbody>
                    </Table>
                    }
                </div>
                </>
        );
    }
}

class Players extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
        let { player, medal } = this.props;
        let num = medal;

        console.log(player)
        
        if(medal === 10){
            medal = 1
        }

        let coin = "btc"
        let username = player.name;
        let avatar = player.avatar;
        let wagered = forceSatoshiFormat(player.profit_high[coin]);
        let prize = forceSatoshiFormat(player.profit_high[coin] / 2);

        return(
            <tr className={'q-crash2'}>
                <td>
                    {num}
                </td>
                <td>
                    <img className="rounded thumb-xs mr-1" src={avatar} /> 
                    <UserModal username={username} isWinner={false} />
                </td>
                <td className={'num-style text-white'}>
                    <img src={'/assets/images/' + (coin) + '.png'} className={'mini-coin-2 hidden-sm'} alt={coin}/>
                    {wagered} {(__.upperCase(coin))}
                </td>
                <td className={'num-style text-success'}>
                    <img src={'/assets/images/' + (coin) + '.png'} className={'mini-coin-2 hidden-sm'} alt={coin}/>
                    {prize} {(__.upperCase(coin))}
                </td>
                <td>
                    <img className="rounded-circle thumb-xs ffi" src={'/assets/images/badges/badge-' + medal + '.svg'} /> 
                </td>
            </tr>
        );
    }
}

export default Leaderboard;