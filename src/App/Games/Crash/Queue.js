import React from "react";
import PropTypes from "prop-types";
import md5 from "md5";
import { Table } from "react-bootstrap";
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import socket from "../../../Socket";
import storage from "../../../Storage";
import UserModal from "../../Components/User/Stat/Modal";
import {__, fixDate, Event, isMobile, wait, decode, encode, forceSatoshiFormat, timeConvertor} from "../../../Helper";
import C from "../../../Constant";
import History from "./History";
import Engine from "./Engine";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={0}>
                    <Typography component={'span'}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    tab: {
        overflowX: 'hidden',
    },
}));


function Queue(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    let { game } = props;
    let token = storage.getKey('token');

    const engine = Engine;

    function load(){
        wait(500).then(() => {
            engine.getPlayers();
        });
    }

    return(
            <div className={classes.root}>
                <AppBar position="static" color="transparent">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs"
                        centered
                    >
                        <Tab onClick={load} icon={<i className={'mdi mdi-chart-bar'} />} label="All Bets" {...a11yProps(0)} />
                        <Tab icon={<i className={'mdi mdi-chart-areaspline'} />} label="My Bets" {...a11yProps(1)} />
                        <Tab icon={<i className={'mdi mdi-chart-donut'} />} label="History" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        <AllBets engine={engine} t={props.t} game={game} />
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        { (token !== null) &&
                            <MyBets engine={engine} t={props.t} game={game} />
                        }
                        { (token === null) &&
                            <div className={'alert bg-soft-purple mt-2 font-13 text-white text-center'}>You must be logged to see your stats</div>
                        }
                    </TabPanel>
                    <TabPanel className={classes.tab} value={value} index={2} dir={theme.direction}>
                        <History tab={true} engine={engine} t={props.t} game={game} />
                    </TabPanel>
                </SwipeableViews>
            </div>
    );
}

class AllBets extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            players: [],
            winners: [],
            failed:  [],
            isWinner: false
        };
    }

    onChange(event, players, winner) {
        this.setState({ players: players, isWinner: winner } )
    }

    onWinner(event, winners) {
        this.setState({ winners: winners } )
    }

    render () {
        const { players, winners } = this.state;
        return <Child engine={this.props.engine} onChange={this.onChange.bind(this, players)} onWinner={this.onWinner.bind(this, winners)} />
    }
}

class Child extends React.Component {
    _isMounted = false;
    constructor (props) {
        super(props);
        this.state = {
            playersObject: [],
            winnersObject: []
        };
    }

    componentDidMount(){
        this._isMounted = true;
        if(this._isMounted){
            let { engine } = this.props;
            
            engine.trigger.on("finish_crash", data => this.syncFinishPlayer(data));
            engine.trigger.on("play_crash", data => this.syncPlayPlayer(data));
            engine.trigger.on("busted_crash", data => this.busted(data));
            engine.trigger.on("waiting_crash", data => this.isWaiting(data));
            engine.trigger.on("game_status", data => this.gameSync(data));
            engine.trigger.on("game_players", data => this.gameSync(data));
        }
    }
    
    componentWillUnmount(){
        this._isMounted = false;
    }

    syncPlayPlayer(data){
        if (this._isMounted) {
            let add = this.state.playersObject.concat(data);
            this.setState({ playersObject: add });
            this.props.onChange(this.state.playersObject)
        }
    }

    syncFinishPlayer(data){
        if (this._isMounted) {
            let index = __.findIndex(this.state.playersObject, function(o) { return o.uid === data.uid; });
            this.state.playersObject.splice(index, 1);
            let add = this.state.winnersObject.concat(data);
            this.setState({ winnersObject: add });
            this.props.onWinner(this.state.winnersObject)
        }
    }

    gameSync(data){
        if (this._isMounted) {
            sortByAmount(data.players).forEach((item, i) => {
                this.state.playersObject.push(item);
            });
            this.props.onChange(this.state.playersObject);

            sortByCashout(data.winners).forEach((item, i) => {
                this.state.winnersObject.push(item);
            });
            this.props.onWinner(this.state.winnersObject, true);
        }
    }

    busted(data){
        if (this._isMounted) {
            this.setState({ playersObject: [], winnersObject: []} );
            this.state.playersObject.shift();
            this.state.winnersObject.shift();

            sortByAmount(data.players).forEach((item, i) => {
                this.state.playersObject.push(item);
            });

            this.props.onChange(this.state.playersObject);

            sortByCashout(data.winners).forEach((item, i) => {
                this.state.winnersObject.push(item);
            });

            this.props.onWinner(this.state.winnersObject,true);
        }
    }

    isWaiting(data){
        if (this._isMounted) {
            this.setState({playersObject: [], winnersObject: []});
            
            sortByAmount(data.players).forEach((item, i) => {
                this.state.playersObject.push(item);
            });
            this.props.onChange(this.state.playersObject);
        }
    }

    render () {
        return(
            <ShowUserTable
                engine={this.props.engine}
                players={this.state.playersObject}
                winners={this.state.winnersObject}
            />
        )
    }
}

class UsersTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if(isMobile()){
            this.setState({ font: 'font-10' })
        }
    }

    render() {
        let playerRows = [];
        let winnerRows = [];
        let checkExists = [];

        if(this.props.players.length > 0) {
            this.props.players.forEach((currentPlayer, i) => {
                if(!checkExists.includes(currentPlayer.name)){
                    checkExists.push(currentPlayer.name);
                    if(currentPlayer.session === 'crash')
                        playerRows.push(<UserRow engine={this.props.engine} currentPlayer={currentPlayer} key={i} isWinner={false} isFailed={false}/>);
                }
            });
        }

        if(this.props.winners.length > 0){
            this.props.winners.forEach((currentPlayer, i) => {
                if(!checkExists.includes(currentPlayer.name)) {
                    checkExists.push(currentPlayer.name);
                    if(currentPlayer.session === 'crash')
                        winnerRows.push(<UserRow engine={this.props.engine} currentPlayer={currentPlayer} key={i} isWinner={true} isFailed={false}/>);
                }
            });
        }

        return (
            <>
                <div className={'table-responsive last-bets cq num-style mb-0'}>
                    <Table className={"game-table mb-0 " + this.state.font}>
                        <thead>
                        <tr>
                            <th>
                                PLAYER
                            </th>
                            <th>
                                PAYOUT
                            </th>
                            <th className={'text-left'}>
                                BET
                            </th>
                            <th className={'text-left'}>
                                PROFIT
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {playerRows}
                        {winnerRows}
                        </tbody>
                    </Table>
                </div>
            </>
        );
    }
}

class ShowUserTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        var size = 50;
        var players = sortByAmount(this.props.players);
        var winners = sortByCashout(this.props.winners);
        players.length = Math.min(players.length, size);
        winners.length = Math.min(winners.length, size);
        return (
            <UsersTable
                engine={this.props.engine}
                players={players}
                winners={winners}
            />
        );
    }
}


class UserRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render(){
        if(this.props.currentPlayer.uid === undefined || this.props.currentPlayer.name === undefined)
            return null;

        let profit = (this.props.currentPlayer.won) ? forceSatoshiFormat(this.props.currentPlayer.won) : '-';

        let self = '', type = 'white text-warning', cashout = '-';

        let bet = this.props.currentPlayer.amount;

        if(this.props.currentPlayer.token === storage.getKey('token'))
            self = 'bg-soft-warning';

        if(this.props.engine.gameStatus === 'busted')
        {
            if(profit === '-')
                type = 'text-danger';
        }

        if(profit !== '-'){
            type = 'text-success';
            cashout = (this.props.currentPlayer.current/100).toFixed(2) +  'x';
        }

        return (
            <tr key={this.props.currentPlayer.uid} className={type + ' ' + self + ' q-crash text-center'}>
                <td className="text-left">
                    <UserModal username={this.props.currentPlayer.name} queue={true} avatar={this.props.currentPlayer.avatar} isWinner={profit} />
                </td>
                <td className="text-left" size="20"> {cashout}</td>
                <td className="text-left num-style">
                    <img src={'/assets/images/' + this.props.currentPlayer.coin + '.png'} alt="COIN" className={'mini-coin-2'}/>
                    {forceSatoshiFormat(bet)} <span className={'hidden-sm'}>{__.upperCase(this.props.currentPlayer.coin)}</span> </td>
                <td className="text-left num-style">
                    <img src={'/assets/images/' + this.props.currentPlayer.coin + '.png'} alt="COIN" className={'mini-coin-2'}/>
                    {profit} <span className={'hidden-sm'}>{__.upperCase(this.props.currentPlayer.coin)}</span>
                </td>
            </tr>
        )
    }
}

class MyBets extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            loading: true,
            players: [],
            game: 'crash',
            token: storage.getKey('token'),
            name: storage.getKey('name'),
            gameCode: md5('crash')
        };
    }

    componentDidMount(){
        socket.emit(C.MY_BETS, encode({token: this.state.token, game: this.state.game}));
        socket.on(C.MY_BETS, data => this.makeList(decode(data)));
        socket.on(C.ADD_BET, data => this.addList(decode(data)));
    }

    addList(player){
        if(player.name === this.state.name){
            let row = <Players forMy={true} player={player} />;
            this.setState(state => ({ players: [row, ...state.players] }));
        }
    }

    makeList(arr){
        if(typeof arr.history === "undefined") return;
        this.setState({ loading: false });
        arr.history.forEach((player, i) => {
            let row = <Players key={i} forMy={true} player={player} />;
            this.setState(state => ({ players: [row, ...state.players] }));
        });
    }

    render () {
        if(this.state.players.length !== 0)
            this.state.players.length = 10;

        return(
                <>
                    <div className={'table-responsive last-bets num-style mb-0'}>
                        {this.state.loading ?
                        <>
                            <div className="text-center">
                               <div className="spinner-grow text-white my-3" role="status"/>
                            </div>
                        </>
                        :
                        <>
                        <Table className={"mb-0"}>
                            <thead>
                                <tr>
                                    <th>
                                        ID
                                    </th>
                                    <th>
                                        Amount
                                    </th>
                                    <th>
                                        Profit
                                    </th>
                                    <th>
                                        Date/Time
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.players}
                            </tbody>
                        </Table>
                            {
                                (this.state.players.length === 0) &&
                                    <>
                                        <div className={'alert text-uppercase bg-cs mt-2 font-13 text-white text-center'}>Not Played Yet</div>
                                    </>
                            }
                        </>

                        }
                    </div>
                </>
        );
    }
}

class Players extends React.Component{
    gameDetail = () => {
        Event.emit('single_game_modal', { data: this.props.player })
    }

    render() {
        let {name, amount, profit, coin, created, gid, direct, forMy} = this.props.player;
        let isWinner = false;
        let date = fixDate(created);

        if(direct){
            date = timeConvertor(created);
        }

        if(__.toNumber(profit) !== 0.00000000)
            isWinner = true;

        return(
            <tr className={'q-crash cpt'}>
                <td onClick={this.gameDetail}>
                    {gid}
                </td>
                {forMy === false &&
                    <td>
                        <UserModal username={name} isWinner={isWinner} />
                    </td>
                }
                <td onClick={this.gameDetail} className={(isWinner===true) ? 'text-success-2 num-style': 'num-style'}>
                    <img src={'/assets/images/' + (coin) + '.png'} className={'mini-coin-2 hidden-sm'} alt={coin}/>
                    {forceSatoshiFormat(amount)} {__.upperCase(coin)}
                </td>
                <td onClick={this.gameDetail} className={(isWinner===true) ? 'text-success-2 num-style': 'num-style'}>
                    <img src={'/assets/images/' + (coin) + '.png'} className={'mini-coin-2 hidden-sm'} alt={coin}/>
                    {forceSatoshiFormat(profit)} {__.upperCase(coin)}
                </td>
                <td onClick={this.gameDetail}>
                    {date}
                </td>
            </tr>
        );
    }
}

function sortByAmount(input) {
    function r(c) {
        return c.amount ? - c.amount : null;
    }
    return __.sortBy(input, r);
}

function sortByCashout(input) {
    function r(c) {
        return c.current ? - c.current : null;
    }
    return __.sortBy(input, r);
}

export default Queue;