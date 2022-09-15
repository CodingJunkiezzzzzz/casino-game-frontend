import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Swal from "sweetalert2";
import { Button, Modal, Row, Col } from "react-bootstrap";
import storage from "../../../../Storage";
import RangeCredit from "../../../Components/Game/Addons";
import Engine from "../Engine";
import {gameCoin} from "../../../../actions/gameCoin";
import {setWallet} from "../../../../actions/gameWallet";
import {setWinnerText, setMeToGame} from "../../../../actions/crashGame";
import {Event, __, isValidNumber, forceSatoshiFormat, User, wait, Game, sendNotfication} from "../../../../Helper";

class ManualBet extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            engine: null,
            buttonText: 'BET',
            buttonType: 'btn-bet',
            inputDisabled: false,
            buttonProgress: null,
            gameStatus: null,
            clicked: false,
            added: false,
            holding: false,
            payout: '2.00',
            amount: forceSatoshiFormat(storage.getKey('lam') ? storage.getKey('lam') : .01),
            token: storage.getKey('token') ? storage.getKey('token') : null,
            hotkey:  storage.getKey('hotkey') ? storage.getKey('hotkey') : "OFF"
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBet = this.handleBet.bind(this);
        this.setBet = this.setBet.bind(this);
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount(){
        if(this._isMounted){
            const engine = Engine

            this.setState({ engine: engine })

            //Load Coin From Redux
            this.props.gameCoin();

            window.addEventListener('keypress', this.handleHotKey.bind(this));
            document.addEventListener('mousedown', this.handleClickOutside);

            // Game Event
            engine.trigger.on("game_status", (data) => this.checkStatus(data));

            engine.trigger.on("waiting_crash", () => this.checkWaitingGame());
            engine.trigger.on("busted_crash", () => this.checkBustedGame());
            engine.trigger.on("started_crash", () => this.checkStartedGame());

            // User Event
            engine.trigger.on("play_crash", data => this.handlePlay(data));
            engine.trigger.on("finish_crash", data => this.handleFinish(data));

            //Error
            engine.trigger.on("error_crash", data => this.handleError(data));

            // Stop manual bet
            engine.trigger.on("stop_playing", () => this.stopManual());

            //Events on auto bet
            engine.trigger.on("auto_bet", data => this.handleAuto(data));
        }
    }

    componentWillMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        window.removeEventListener('keypress', this.handleHotKey.bind(this));
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {

            let value = parseFloat(this.state.payout);

            if(value < 1.01)
                value = 1.01;

            if(value > 1000000)
                value = 1000000;

            this.setState({ payout: parseFloat(value).toFixed(2) });

            var amount = this.wrapperRef.current.value;

            if (amount === '') {
                this.setState({ amount: 0.00000010 });
            }

            if(parseFloat(amount) < 0.00000010){
                this.setState({ amount: forceSatoshiFormat(0.00000010) });
            }

            if(parseFloat(amount) <= 0){
                this.setState({ amount: forceSatoshiFormat(0.00000010) });
            }
            else {
                if(amount === "NaN") amount = 0.00000010;
                this.setState({ amount: forceSatoshiFormat(amount) });
            }
        }
    }

    handleInputChange(event){
        let target = event.target;
        let value = target.value;
        let name = target.name;

        if(name === 'amount'){
            if(!isValidNumber(value)) return;
        }

        if(name === 'payout'){
            if(value >= 999999) return;
        }

        if(name === 'amount'){
            storage.setKey('lam', value);
        }

        this.setState({ [name]: value });
    }
    
    stopManual() {
        this.setState({ started: false, buttonText: 'BET', inputDisabled: false });
    }

    checkStatus(data)
    {
        if(this._isMounted){
            switch (data.status)
            {
                case 'waiting':
                    this.checkWaitingGame();
                    break;
                case 'started':
                    this.checkStartedGame();
                    break;
                case 'busted':
                    this.checkBustedGame();
                    break;
                default:
            }
        }
    }

    handleAuto = (data) => {
        if(this._isMounted){

            let { amount, payout } = data;

            if(!payout) return alert('payout is empty.');
            if(!amount) return alert('amount is empty.');

            this.setState({ amount: amount, payout: payout });

            if(this.state.gameStatus === 'started'){
                this.holdBet();
            }
            else if(this.state.gameStatus === 'waiting'){
                this.setBet();
            }
        }
    };

    handleError(data) {
        if(this._isMounted){
            this.props.setMeToGame(false);
            
            this.setState({ holding: false, added: false, inputDisabled: false });
            clearInterval(this.state.buttonProgress);
            this.setDefaultButton();

            if(!__.isUndefined(data.code)){
                if(data.code === 'credit')
                    this.props.setWallet(true, data.uid);
            }

            this.setState({ clicked: false })
            sendNotfication(data.message, 'info', 'top-center');
        }
    }

    setDefaultButton = () => {
        if(this._isMounted){
            clearInterval(this.state.buttonProgress);
            this.setState({
                added: false,
                holding: false,
                inputDisabled: false,
                buttonType: 'btn-bet',
                buttonText: "BET"
           });
        }
    };

    setWaitingButton = () => {
        if(this._isMounted){
            this.setState({
                added: true,
                inputDisabled: true,
                buttonType: 'btn-bet-success-crash text-white btn-p no-shadow',
                buttonText: "Please Wait..."
            });
        }
    };

    setOutButton = () => {
        if(this._isMounted){
            this.setState({
                inputDisabled: false,
                buttonType: 'btn-bet-success',
                buttonText: "CANCEL (Next Round)"
            });
        }
    };

    setBet(){
        if(this._isMounted){
            this.setState({ clicked: true });
            let { engine, amount, payout, token } = this.state;
            engine.coin   = 'btc';
            engine.token  = token;
            engine.amount = amount;
            engine.payout = parseInt(payout * 100);
            engine.play();
        }
    }

    cashOut(){
        if(this._isMounted){
            let { engine } = this.state;
            engine.finish(Game['current_amount']);
        }
    }

    handlePlay(data){
        if(this._isMounted){
            if(data.token === this.state.token){
                this.props.setMeToGame(true);
            }
        }
    }

    handleFinish(data){
        if(this._isMounted){
            if(data.token === this.state.token){
                clearInterval(this.state.buttonProgress);
                this.props.setWinnerText("   You Cashed Out at " + data.current / 100);
                this.props.setMeToGame(false);
                this.setDefaultButton();
            }
        }
    }

    checkWaitingGame(){
        if(this._isMounted){
            this.props.setWinnerText('');

            this.setState({ gameStatus: 'waiting' });

            if(this.state.holding)
            {
                this.setState({ holding: false });
                this.placeBet();
            }
        }
    }

    checkStartedGame(){
        if(this._isMounted){
            let { im_in_game } = this.props;
            let { engine } = this.state;

            let coin = 'btc';
            let amount = engine.amount
            
            this.setState({ gameStatus: 'started' });

            if(im_in_game === true || this.state.clicked)
            {
                this.setState({ inputDisabled: false, buttonType: "btn-bet-success-crash", clicked: false });

                let counter = 0;
                let self = this;
                this.state.buttonProgress = setInterval(function() {
                        let calc = amount * (Game['current_amount'] - 1);
                        self.setState({ buttonText: 'CashOut ' + forceSatoshiFormat(calc) + ' ' + coin });
                        counter++;

                        //Helper
                        if(Game['current_amount'] >= this.state.payout)
                        this.cashOut();
                    }
                        .bind(this),
                    50
                );
            }
        }
    }

    checkBustedGame(){
        if(this._isMounted){
            this.setState({ gameStatus: 'busted', clicked: false });

            let { im_in_game } = this.props;

            if(!this.state.holding)
            {
                this.props.setMeToGame(false);
                clearInterval(this.state.buttonProgress);
                this.setDefaultButton();
            }

            if(im_in_game)
            {
                this.props.setMeToGame(false);
                clearInterval(this.state.buttonProgress);
                this.setDefaultButton();
            }
        }
    }

    isCorrectBet(){
        let { amount, payout } = this.state;

        if(!isValidNumber(amount))
            return false;

        if((payout * 100) < 100)
            return false;

        if((payout * 100) === 100)
            return false;

        return true;
    }

    placeBet(){
        if(this._isMounted){
            let { engine } = this.state;

            engine.isHolding = false;
            this.setWaitingButton();
            this.setBet();
        }
    }

    holdBet(){
        if(this._isMounted){
            let { engine } = this.state;
            engine.isHolding = true;
            this.setState({ holding: true });
            this.setOutButton();
        }
    }

    handleBet(e){
        if(this._isMounted){
            e.preventDefault();

            let { amount, payout, holding, gameStatus, token } =  this.state;
            let { im_in_game } = this.props;

           // Check User
            if(!token){
               return Event.emit('showAuthModal', true);
            }

            // Check is Correct Bet
            if(!this.isCorrectBet())
                return false;

            this.setState({ payout: (payout * 1).toFixed(2) });

            // Check Game Status to Play
            switch (gameStatus)
            {
                case 'waiting':
                    this.placeBet();
                break;

                case 'busted':
                    if(holding){
                        this.setDefaultButton();
                    }
                    else this.holdBet();
                break;

                case 'started':

                    if(im_in_game)
                        this.cashOut();

                    else if(holding)
                        this.setDefaultButton();

                    else
                        this.holdBet();
                break;
            }
        }
    }

    hotkeyChange(){
        if(this._isMounted){
            if(this.state.hotkey === "OFF"){
                User['denied_hotkey'] = false;
                storage.setKey("hotkey", 'ON');
                this.setState({ hotkey: "ON"})
            }
            else {
                storage.setKey("hotkey", 'OFF');
                this.setState({ hotkey: "OFF"})
            }
        }
    }

    handleHotKey(e){
        if(this._isMounted){
            if(User['denied_hotkey'])
            {
                User['denied_hotkey'] = false;
                storage.setKey('hotkey', "OFF");
                this.setState({ hotkey: 'OFF'})
            }

            if(storage.getKey('hotkey') === "ON")
            {
                var char = e.which || e.keyCode;
                if(char === 98){
                   this.handleBet(e);
                }
                if(char === 102){
                    var calc = parseFloat(this.state.payout * 2);
                    var max = Math.max(1.00, calc);
                    this.setState({ payout: max.toFixed(2)})
                }
                if(char === 101){
                    var calc = parseFloat(this.state.payout / 2);
                    var max = Math.max(1.00, calc);
                    this.setState({ payout: max.toFixed(2)})
                }

                this.handleInputChange(e);
            }
        }
    }

    setMax = (e) => {
        e.preventDefault();
        let max = this.props.credit;
        if(max === null) return;

        this.setState({ amount: max });
        storage.setKey('lam', max);
    };

    setMin = (e) => {
        e.preventDefault();
        this.setState({ amount: '0.00000010' });
        storage.setKey('lam', '0.00000010');
    };

    multi = (e) => {
        var max = this.state.amount * 2
        this.setState({ amount: forceSatoshiFormat(max) });
        storage.setKey('lam', forceSatoshiFormat(max));
    }

    devide = (e) => {
        var max = this.state.amount / 2
        max = Math.max(max, 0.00000010)
        this.setState({ amount: forceSatoshiFormat(max) });
        storage.setKey('lam', forceSatoshiFormat(max));
    }

    render(){
        let { amount, inputDisabled, payout, buttonType, buttonText, hotkey } = this.state;
        let { mobile, coin } = this.props;
        let hotKeyColor = (hotkey === "OFF") ? 'label-grey': 'label-success';

        if(amount === "NaN") amount = 0.00000010;

        return(
            <div onKeyPress={ (e) => this.handleHotKey(e)}>
                <form className="w-100 mt-1" onSubmit={(e) => { this.handleBet(e) }}>
                    <Row>
                        <Col xl={6} md={7} sm={12}>
                            <div className={"form-group mb-1 bet-input payout"}>
                                <div className="input-group">
                                    <div className="input-group-append">
                                        <span className="input-group-text">
                                            <img src={"assets/images/btc.png"} className="mini-coin-2 mr-2" />
                                             BET
                                        </span>
                                    </div>
                                    <input
                                        ref={this.wrapperRef}
                                        disabled={inputDisabled}
                                        type="text"
                                        className="form-control text-left"
                                        id="amount"
                                        name="amount"
                                        placeholder="..."
                                        value={amount}
                                        autoComplete={"off"}
                                        onKeyUp={this.handleInputChange}
                                        onChange={this.handleInputChange} />
                                    <div className="input-group-append">
                                        <RangeCredit 
                                            multi={this.multi}
                                            devide={this.devide}
                                            max={this.setMax}
                                            min={this.setMin}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xl={6} md={5} sm={12}>
                            <div className={ "form-group mb-1 bet-input payout mb-2"}>
                                <div className="input-group">
                                    <div className="input-group-append">
                                        <span className="input-group-text">PAYOUT</span>
                                    </div>
                                    <input
                                        disabled={inputDisabled}
                                        type="number"
                                        className="form-control text-left"
                                        id="payout"
                                        name="payout"
                                        min="1.01"
                                        max="99999"
                                        step="0.01"
                                        placeholder=".."
                                        value={payout}
                                        autoComplete={"off"}
                                        onKeyUp={this.handleInputChange}
                                        onChange={this.handleInputChange} />
                                    <div className="input-group-append">
                                        <span className="input-group-text">X</span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={5} sm={12} className="m-auto text-center">
                            <div className={ "form-group rev mt-0 mb-0"}>
                                <Button variant={'btn btn-block ' + buttonType}
                                        disabled={inputDisabled}
                                        type="submit">
                                    {buttonText}
                                </Button>
                            </div>
                        </Col>
                        { !mobile &&
                        <Col md={12} sm={12} className="m-auto">
                            <div className="form-inline">
                                <Col md={12} sm={12} className="font-12 text-grey">
                                    <span className={'badge badge-info rounded cp'} onClick={ () => this.hotkeyChange() }>
                                        <span>HotKeys:</span> <span className={"label"}>{hotkey}</span>
                                    </span>
                                    <HotKey />
                                </Col>
                            </div>
                        </Col>
                        }
                    </Row>
                </form>
            </div>
        );
    }
}

class HotKey extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            show: false,
            effect: 'pulse'
        };
    }

    toggleModal = (e) => {
        if(e !== undefined)
            e.preventDefault();
        
        this.setState({ show: !this.state.show, effect: !this.state.show ? 'zoomIn' : 'zoomOut' });
    };

    render(){
        return(
            <>
                 <button className={'btn btn-xs stc mt-1 pl-1'} onClick={e => this.toggleModal(e)}>
                    <i className={'cp mdi mdi-information text-info font-15'}/>
                </button>
                <Modal
                    size="md"
                    centered={true}
                    backdrop="static"
                    show={this.state.show}
                    onHide={this.toggleModal}
                    aria-labelledby="help-lg-modal"
                    className={"animated " + this.state.effect}
                >
                    <Modal.Header>
                        Hot Keys
                        <button type="button" className="close p-2" onClick={e => this.toggleModal(e)}>
                            <i className={'mdi mdi-close'}/>
                        </button>
                    </Modal.Header>
                    <Modal.Body closeButton className="modal-helper text-center">
                    <Row className="shortcut-helper">
                        <Col sm="12">
                            <span className="badge badge-soft-danger">B</span>
                            <i className="mdi mdi-arrow-right align-middle"></i>
                            <span className="badge badge-soft-secondary"> BET</span>
                        </Col>
                        <Col sm="12" className="my-2">
                            <span className="badge badge-soft-danger"> E</span>
                            <i className="mdi mdi-arrow-right align-middle"></i>
                            <span className="badge badge-soft-secondary"> HALF PAYOUT</span>
                        </Col>
                        <Col sm="12">
                            <span className="badge badge-soft-danger"> F</span>
                            <i className="mdi mdi-arrow-right align-middle"></i>
                            <span className="badge badge-soft-secondary"> DOUBLE PAYOUT</span>
                        </Col>
                    </Row>
                    </Modal.Body>
                </Modal>
            </>    
            );
    }
}

ManualBet.propTypes = {
    coin: PropTypes.string,
    im_in_game: PropTypes.string,
    credit: PropTypes.string
};

const mapStateToProps = state => ({
    coin: state.items.coin,
    im_in_game: state.items.im_in_game,
    credit: state.items.credit
});

export default connect(mapStateToProps, { gameCoin, setWinnerText, setMeToGame, setWallet })(ManualBet);