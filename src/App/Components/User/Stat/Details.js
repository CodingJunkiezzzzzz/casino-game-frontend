import React from "react";
import {Accordion, Button, Card, Col, Dropdown, Row, Media} from "react-bootstrap";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {setChartCoin} from "../../../../actions/gameCoin";
import {__, decode, encode, forceSatoshiFormat, wait, sendNotfication, Event} from "../../../../Helper";
import AddToFriend from "../Friend";
import Chart from "../Chart";
import coins from "../../../coins";
import games from "../../../games";
import socket from "../../../../Socket";
import C from "../../../../Constant";
import ReactTooltip from "react-tooltip";
import storage from "../../../../Storage";

class Details extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: true,
            showChart: false,
            openedChart: false,
            changeCoinLoader: false,
            medalView: false,
            coins: [],
            currentCoin: 'btc',
        };
    }

    componentWillMount() {
        coins.forEach((item, key) => {
            let coin = <Dropdown.Item key={key} onClick={e=> this.selectCoin(item.preffix)} className={'animated slideInUp'}>
                <span key={key} className={'dropdown-item'}>
                    <img src={'/assets/images/' + item.image} alt="coin" className={'mini-coin-8'}/>
                    {item.preffix}
                </span>
            </Dropdown.Item>;
            this.setState(state => ({ coins: [coin, ...state.coins] }));
        });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        wait(100).then(() => {
            if(nextProps.haveData === 'no'){
                this.setState({ loader: true })
            }
            else 
            {
                var props = nextProps;
                var dd = props.data;
                let chart = <Chart token={props.token} name={props.name} />;
                let since  = sinceConvert(dd.created);
                let color = dd.profit < 0 ? 'text-danger': 'text-success';
                let coin = dd.coin;
                let level = dd.level;
                let name = props.name;
                let highProfit = dd.high_profit;
                let lowProfit = dd.low_profit;

                this.setState({  changeCoinLoader: false,
                 since: since, lowProfit: lowProfit, highProfit: highProfit,
                    name: name, coin: coin, currentCoin: coin, level: level,
                    color: color, chart: chart, avatar: dd.avatar, profit: dd.profit,
                     date: dd.created, played: dd.played, wined: dd.wined, medal: dd.medal, _token: props.token })

                wait(200).then(() => {
                    if(!__.isEmpty(name) || !__.isUndefined(name))
                        this.setState({ loader: false })
                })
            }
        })
    }

    componentDidMount() {
        if(this.props.haveData === 'no')
        {
            this.setState({ loader: true })
        }
        else {
            var props = this.props;
            var dd = props.data;
            let chart = <Chart token={props.token} name={props.name} />;
            let since  = sinceConvert(dd.created);
            let color = dd.profit < 0 ? 'text-danger': 'text-success';
            let coin = dd.coin;
            let level = dd.level;
            let name = props.name;
            let highProfit = dd.high_profit;
            let lowProfit = dd.low_profit;

            this.setState({ since: since, lowProfit: lowProfit, highProfit: highProfit, currentCoin: coin,
                name: name, coin: coin, level: level, color: color, chart: chart, avatar: dd.avatar, profit: dd.profit, date: dd.created,
                played: dd.played, wined: dd.wined, medal: dd.medal, _token: props.token })

            wait(200).then(() => {
                if(!__.isEmpty(name) || !__.isUndefined(name))
                    this.setState({ loader: false })
            })
        }
    }

    componentWillUnmount() {
        this.props.setChartCoin(this.state.currentCoin);
    }

    selectCoin(coin) {
        //Set For Redux
        this.props.setChartCoin(coin);
        this.setState({ currentCoin: coin, changeCoinLoader: true });
        socket.emit(C.USER_INFO, encode({name: this.props.name, coin: coin, page: 1}));
    }

    getChart(game){
        wait(100).then(() => {
            if(document.querySelector("#userChart") !== null)
                document.querySelector("#userChart").innerText = "[ Please Wait... ]";
        })
        
        socket.emit(C.USER_CHART, encode({name: this.props.name, coin: this.state.currentCoin, game: game}));
        this.setState({ openedChart: true });
    }

    back = e => {
        this.setState({ openedChart: false });
    }

    showChart = e => {
        this.setState({ showChart: !this.state.showChart });
        this.getChart('crash');
    }

    handleShowTip = () => {
        if(storage.getKey('token') === null){
            return sendNotfication('Please Login to use this Option', 'warning', 'top-center');
        }
        Event.emit('force_modal_tip');
    }

    toggleMedalView = () => {
        this.setState({ medalView: !this.state.medalView });
    }

    render() {
        let { currentCoin, lowProfit, highProfit, name, coin, color, chart, since, avatar, profit, date, _token, level, played, wined, medal } = this.state;

        if(!__.isUndefined(date))
            date = date.substr(0,10);

        // if(!__.isUndefined(medal))
        //     return; //For security old version

        const makeStars = (num) => {
            let stars = 5;
            let userLevel = stars - parseFloat(num);
            var g = [], o = [], f = [];
            for(var i = 0; i < userLevel; i++){
                g.push(<i className={'mdi mdi-star font-25 text-purple'} />);
            }
            for(var i = 0; i < num; i++){
                o.push(<i className={'mdi mdi-star font-30 text-success'} />);
            }
            f.push(o, g);
            return f;
        }

        played = played ? played : null;
        wined = wined ? wined : 0;

        medal = parseInt(medal);

        return (
            <>
            {this.state.loader ?
                <>
                    <div className="text-center" style={{ minHeight: 500 }}>
                        <div class="spinner-border text-info my-5 user-loader" role="status"/>
                    </div>
                </>
            :
            <>
                {
                    this.state.medalView ?
                    <div className={ "animated fadeIn medals-view" }>

                        <div class="media mb-2">
                            <img src="/assets/images/badges/badge-2.svg" height="60" class="mr-3" />
                            <div class="media-body align-self-center">  
                                <div class="mb-2">
                                    <span class="badge badge-purple px-3">Deposit</span>
                                </div>
                                Required Minimum 100 USD Deposit
                            </div>
                        </div>

                        <div class="media mb-2">
                            <img src="/assets/images/badges/badge-3.svg" height="60" class="mr-3" />
                            <div class="media-body align-self-center">  
                                <div class="mb-2">
                                    <span class="badge badge-purple px-3">Deposit</span>
                                </div>
                                Required Minimum 500 USD Deposit
                            </div>
                        </div>

                        <div class="media mb-2">
                            <img src="/assets/images/badges/badge-7.svg" height="45" class="mr-3" />
                            <div class="media-body align-self-center">  
                                <div class="mb-2">
                                    <span class="badge badge-purple px-3">Deposit</span>
                                </div>
                                Required Minimum 2000 USD Deposit
                            </div>
                        </div>

                        <div class="media mb-2">
                            <img src="/assets/images/badges/badge-6.svg" height="60" class="mr-3" />
                            <div class="media-body align-self-center">  
                                <div class="mb-2">
                                    <span class="badge badge-purple px-3">Rain</span>
                                </div>
                                Required 10 Times Rain
                            </div>
                        </div>

                        <div class="media my-2">
                            <img src="/assets/images/badges/badge-8.svg" height="60" class="mr-3" />
                            <div class="media-body align-self-center">  
                                <div class="mb-2">
                                    <span class="badge badge-purple px-3">Profit</span>
                                </div>
                                Required 2500 USD Profit
                            </div>
                        </div>

                        <div className="text-center">
                            <button onClick={this.toggleMedalView} className={'btn btn-sm btn-cs-6 text-white my-1'}>
                                Back
                            </button>
                       </div>

                    </div>
                    :
                    <div className={ "animated fadeIn" }>
                        <div className="user-detail text-center mb-1">
                            <span className="hatA">
                                <img src={avatar} className={'thumb-lg user-av av-onmodal'} alt="Avatar"/>
                            </span>

                            <br/>

                            <h4 className={'mb-0 text-white uname'}>
                                {name}
                            </h4>

                            {makeStars(level)}

                            <div className={'button-items text-center mt-1'}>
                                <AddToFriend onModal={true} name={name} id={_token}/>
                                {this.props.name !== storage.getKey('name') &&
                                    <button onClick={this.handleShowTip} className="btn btn-cs-6 btn-xs shadow-none text-white rounded font-12 px-3 text-uppercase">
                                        <i className="mdi mdi-bank-transfer font-17 align-middle" /> Tip
                                    </button>
                                }
                            </div>
                        </div>

                        <Row>
                            <Col sm="12" md="12">
                                <Card className="mt-2 mb-1">
                                    <Card.Body onClick={this.toggleMedalView} className="p-1 medals text-center cpt">
                                        <h5 className="mt-2 mb-3 0 p-0 header-title font-14 text-white">
                                            <i className="mdi mdi-trophy align-middle" /> Medals
                                        </h5>
                                        <div className="img-group text-center">
                                            <ReactTooltip />
                                            <img data-tip="BGame User" className="img-fluid mx-1 active" src="/assets/images/badges/badge-1.svg" />
                                            {medal === 1 ?
                                                <img data-tip={"Deposited Below 100 USD"} className={"img-fluid mx-1 active"} src="/assets/images/badges/badge-2.svg" />
                                                :
                                                <img className={"img-fluid mx-1"} src="/assets/images/badges/badge-2.svg" />
                                            }

                                            {medal === 2 ?
                                                <img data-tip={"Deposited Below 500 USD"} className={"img-fluid mx-1 active"} src="/assets/images/badges/badge-3.svg" />
                                                :
                                                <img className={"img-fluid mx-1"} src="/assets/images/badges/badge-3.svg" />
                                            }
                                            {medal === 3 ?
                                                <img data-tip={"Deposited Below 2000 USD"} className={"img-fluid mx-1 active"} src="/assets/images/badges/badge-7.svg" />
                                                :
                                                <img className={"img-fluid mx-1"} src="/assets/images/badges/badge-7.svg" />
                                            }
                                            <img className={ "img-fluid mx-1" } src="/assets/images/badges/badge-6.svg" />
                                            <img className={ "img-fluid mx-1" } src="/assets/images/badges/badge-8.svg" />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <div className="details-parent">

                            <Row>
                                <Col lg="6" md="6" className="col-6">
                                    <Card className={'mb-1 brd15'}>
                                        <Card.Body className="p-1">
                                            Joined <br/>
                                            <span className={"num-style"}> {date} <span className="font-11 text-grey ">({since})</span></span>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col lg="6" md="6" className="col-6">
                                    <Card className={'mb-1 brd15'}>
                                        <Card.Body className="p-1">
                                            Total Profit<br/>
                                            {this.state.changeCoinLoader ?
                                                <div className="text-center"><div class="spinner-border spinner-border-sm" role="status"/></div>
                                            :
                                                <><img className="mini-coin-9" src={'/assets/images/' + __.upperCase(currentCoin) + '.png'} />
                                                <b className={'num-style ' + color}>{forceSatoshiFormat(profit)} {currentCoin}</b></>
                                            }
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col lg="6" md="6" className="col-6">
                                    <Card className={'mb-1 brd15'}>
                                        <Card.Body className="p-1">
                                            Profit All Time High <br/>
                                            {this.state.changeCoinLoader ?
                                                <div className="text-center"><div class="spinner-border spinner-border-sm" role="status"/></div>
                                            :
                                                <><img className="mini-coin-9" src={'/assets/images/' + __.upperCase(currentCoin) + '.png'} />
                                                <b className={'num-style text-success'}>{forceSatoshiFormat(highProfit)} {currentCoin}</b></>
                                            }
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col lg="6" md="6" className="col-6">
                                    <Card className={'mb-1 brd15'}>
                                        <Card.Body className="p-1">
                                            Profit All Time Low <br/>
                                            {this.state.changeCoinLoader ?
                                                <div className="text-center"><div class="spinner-border spinner-border-sm" role="status"/></div>
                                            :
                                                <><img className="mini-coin-9" src={'/assets/images/' + __.upperCase(currentCoin) + '.png'} />
                                                <b className={'num-style text-danger'}>{forceSatoshiFormat(lowProfit)} {currentCoin}</b></>
                                            }
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg="6" md="6" className="col-6">
                                    {
                                        played !== null &&
                                        <>
                                            <Card className={'mb-1 brd15'}>
                                                <Card.Body className="p-1">
                                                    Total Wins<br/>
                                                    <span className="font-15">{wined}</span>
                                                </Card.Body>
                                            </Card>
                                        </>
                                    }
                                </Col>
                                <Col lg="6" md="6" className="col-6">
                                    {
                                        played !== null &&
                                        <>
                                            <Card className={'mb-1 brd15'}>
                                                <Card.Body className="p-1">
                                                    Total Bets<br/>
                                                    <span className="font-15">{played}</span>
                                                </Card.Body>
                                            </Card>
                                        </>
                                    }
                                </Col>
                            </Row>

                        </div>

                        <Row>
                            <Col sm={12}>
                                {this.state.loader ?
                                    <>
                                        <div className="text-center">
                                            <div class="spinner-border text-info my-3" role="status"/>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className={'animated slideI8nDown my-1'}>
                                            <ul className={'list-inline ico-socials text-center mb-0'}>
                                                {this.state.loader ?
                                                    <>
                                                        <div className="text-center"><div class="spinner-border text-info my-3" role="status"/></div>
                                                    </>
                                                    :
                                                    <>
                                                        { !this.state.openedChart ?
                                                        <Accordion>
                                                            <Accordion.Toggle as={Button} variant="button" className={'btn btn-cs-6 btn-block mb-2 brd15'} 
                                                                eventKey="0" onClick={this.showChart}>
                                                                SHOW GAMES CHART
                                                                <span className={ this.state.showChart ? 'tran caret' : 'caret'}></span>
                                                            </Accordion.Toggle>
                                                        </Accordion> 
                                                        :
                                                            <>
                                                                <div id={'userChart'} />
                                                                <div id="loadUserChart" />
                                                                {chart}
                                                                <button onClick={this.back} className="btn btn-xs btn-outline-light mb-1 mt-2">
                                                                    Back
                                                                </button>
                                                            </>
                                                        }
                                                    </>
                                                }
                                            </ul>
                                        </div>
                                    </>
                                }
                            </Col>
                        </Row>
                    </div>
                }
                </>
                }
            </>
        );
    }
}

function sinceConvert(time, lang) {
    if(time === undefined) return;
    lang = lang || {
        postfixes: {
            '<': ' ago',
            '>': ' from now'
        },
        1000: {
            singular: 'a few moments',
            plural: 'a few moments'
        },
        60000: {
            singular: 'about a minute',
            plural: '# minutes'
        },
        3600000: {
            singular: 'about an hour',
            plural: '# hours'
        },
        86400000: {
            singular: 'a day',
            plural: '# days'
        },
        31540000000: {
            singular: 'a year',
            plural: '# years'
        }
    };

    var timespans = [1000, 60000, 3600000, 86400000, 31540000000];
    var parsedTime = Date.parse(time.replace(/\-00:?00$/, ''));

    if (parsedTime && Date.now) {
        var timeAgo = parsedTime - Date.now();
        var diff = Math.abs(timeAgo);
        var postfix = lang.postfixes[(timeAgo < 0) ? '<' : '>'];
        var timespan = timespans[0];

        for (var i = 1; i < timespans.length; i++) {
            if (diff > timespans[i]) {
                timespan = timespans[i];
            }
        }

        var n = Math.round(diff / timespan);

        return lang[timespan][n > 1 ? 'plural' : 'singular']
            .replace('#', n) + postfix;
    }
}

Details.propTypes = {
    coin: PropTypes.string
};

const mapStateToProps = state => ({
    coin: state.items.coin
});

export default connect(mapStateToProps, { setChartCoin })(Details);