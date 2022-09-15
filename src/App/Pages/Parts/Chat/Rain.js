import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Modal, Row, Col, Dropdown} from "react-bootstrap";
import coins from "../../../coins";
import storage from "../../../../Storage";
import socket from "../../../../Socket";
import isLogged from "../../../../Auth";
import C from "../../../../Constant";
import {__, wait, decode, encode, forceSatoshiFormat, isValidNumber, sendNotfication} from "../../../../Helper";

class Rain extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            loader: true,
            loading: false,
            show: false,
            disabled: false,
            coins: [],
            players: 2,
            amount: forceSatoshiFormat(.00000050),
            coin: 'btc',
            clientCountry: storage.getKey('country') ? storage.getKey('country'): "GLOBAL",
            currentCoin: "BTC"
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted){
            socket.on(C.RAIN, data => this.rain((data)));
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    selectCoin = (e, coin) => {
        e.preventDefault();
        this.setState({ currentCoin: coin })
    }

    handleShow = () => {
        if(this._isMounted){
            if(!isLogged()){
                return sendNotfication(this.props.t('t0'), 'warning', 'top-center');
            }
            this.setState({ show: true, effect: 'zoomIn'});

            wait(500).then(() => {
                this.setState({ loader: false });
            })
        }
    };

    handleClose = () => {
        if(this._isMounted){
            this.setState({ show: false, effect: 'zoomOut', loader: true });
        }
    };

    rain(data){
        if(this._isMounted){
            let { message } = data;
            this.setState({ loading: false, disabled: false });
            sendNotfication(message, 'info', 'top-center');
            socket.emit(C.CREDIT);
        }
    }

    handleInputChange = (e) => {
        if(this._isMounted){
            let target = e.target;
            let value = target.value;
            let name = target.name;

            if(name === 'amount'){
                let toNumber = __.toNumber(value);
                if(toNumber < 50e-8) {
                    this.setState({ amount: '0.00000050' });
                    return;
                }
                if(value >= 999999999) return;
                if(value.length > 10) return;
                if(!isValidNumber(value)) return;
            }

            if(name === 'players'){
                if(value > 4)
                    return;
                if(value < 2)
                    return;
            }

            this.setState({ [name]: value });
        }
    };

    submit = e => {
        if(this._isMounted){
            e.preventDefault();
            this.setState({ loading: true, disabled: true });

            var c = this.state.clientCountry;

            if(__.lowerCase(c)=== 'spam')
                c = 'brazil';

            wait(500).then(() => {
                socket.emit(C.RAIN, ({
                    amount: this.state.amount,
                    coin: 'btc',
                    players: parseInt(this.state.players),
                    room: c
                }));
            })
        }
    };

    render() {
        const { t } = this.props;
        return (
            <>
                   <li className={'float-right'}>
                    <button className={'btn btn-soft-light btn-xs grayh'} onClick={this.handleShow}>
                        <svg className="svg-rain" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M256 421.6c-18.1 0-33.2-6.8-42.9-10.9-5.4-2.3-11.3 1.8-10.9 7.6l3.5 51c.2 3.1 3.8 4.7 6.3 2.8l14.5-11c1.8-1.4 4.5-.9 5.7 1l20.5 32.1c1.5 2.4 5.1 2.4 6.6 0l20.5-32.1c1.2-1.9 3.9-2.4 5.7-1l14.5 11c2.5 1.9 6.1.3 6.3-2.8l3.5-51c.4-5.8-5.5-10-10.9-7.6-9.8 4.1-24.8 10.9-42.9 10.9z"></path><path d="M397.7 293.1l-48-49.1c0-158-93.2-228-93.2-228s-94.1 70-94.1 228l-48 49.1c-1.8 1.8-2.6 4.5-2.2 7.1L130.6 412c.9 5.7 7.1 8.5 11.8 5.4l67.1-45.4s20.7 20 47.1 20c26.4 0 46.1-20 46.1-20l67.1 45.4c4.6 3.1 10.8.3 11.8-5.4l18.5-111.9c.2-2.6-.6-5.2-2.4-7zM256.5 192c-17 0-30.7-14.3-30.7-32s13.8-32 30.7-32c17 0 30.7 14.3 30.7 32s-13.7 32-30.7 32z"></path>
                    </svg>
                    </button>
                </li>
                <Modal
                    size="md"
                    backdrop="static"
                    centered={true}
                    show={this.state.show}
                    onHide={this.handleClose}
                    aria-labelledby="rain-md-modal"
                    className={"animated " + this.state.effect}
                >
                    <Modal.Header>
                        {t('rain')} <button type="button" className="close p-2" onClick={this.handleClose}>
                        <i className={'mdi mdi-close'}/>
                    </button>
                    </Modal.Header>
                    <Modal.Body className={'rain'}>
                        { this.state.loader ?
                            <>
                                <div className="text-center">
                                    <div className="spinner-grow text-white my-3" role="status" />
                                </div>
                            </>
                            :
                            <><form onSubmit={ e => this.submit(e)}>
                                <Row>
                                    <Col sm={12} md={4} xl={4}>
                                        <label htmlFor="coin">Coin</label>
                                         <Dropdown bottom="true">
                                            <Dropdown.Toggle split variant="x mt-1 text-white btn-block cpd" id="dropdown-split-coins">
                                                <span stle={{ fontSize: 17 }}>
                                                    <img src={"/assets/images/btc.png"} className={"img-fluid mini-coin-12 mr-2"} alt="Coin" />
                                                    {this.state.currentCoin}
                                                </span>
                                            </Dropdown.Toggle>
                                        </Dropdown>
                                    </Col>
                                    <Col sm={12} md={5} xl={5}>
                                        <label htmlFor="amount">{t('amount')}</label>
                                        <input type="text" name={'amount'} className={'form-control'} onChange={this.handleInputChange} value={this.state.amount} />
                                    </Col>
                                    <Col sm={12} md={3} xl={3}>
                                        <label htmlFor="players">#{t('players_num')}</label>
                                        <input required={true} type="number" min={2} max={4} name={'players'} className={'form-control'} onChange={this.handleInputChange} value={this.state.players} />
                                    </Col>
                                    <Col sm={12} md={12} xl={12}>
                                        <button disabled={this.state.disabled} type={'submit'} className={'btn btn-block btn-purple mt-2 no-shadow'}>
                                            { this.state.loading ?
                                                <>
                                                    <div className="spinner-border spinner-border-sm mr-1" role="status"/>
                                                </>
                                                :
                                                <i className={'mdi mdi-parachute mr-1'} />
                                            }
                                            {t('send_rain')}
                                        </button>
                                    </Col>
                                </Row>
                            </form>
                                <p className={'mt-2 text-white text-center mb-0'}>
                                    {t('t1')}
                                    <br/>
                                    {t('t2')}
                                </p>
                            </>
                        }
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

Rain.propTypes = {
    country: PropTypes.func
};

const mapStateToProps = state => ({
    country: state.items.country
});

export default connect(mapStateToProps, {})(Rain);