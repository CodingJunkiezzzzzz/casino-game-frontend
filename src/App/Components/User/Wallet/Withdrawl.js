import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import {Button, Row, Col, Dropdown} from "react-bootstrap";
import socket from "../../../../Socket";
import {__, decode, encode, isValidNumber, forceSatoshiFormat, wait, sendNotfication} from "../../../../Helper";
import storage from "../../../../Storage";
import coins from "../../../coins";
import WithdrawlArchive from "./WithdrawlArchive";
import C from "../../../../Constant";

//_isMounted can prevent from double socket response

class Withdrawl extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            token: storage.getKey('token'),
            credit: storage.getKey('credit'),
            showArchive: false,
            slide: false,
            final: false,
            pass: null,
            wallet: '',
            amount: 0,
            im: true,
            error: false,
            error2: false,
            loading: false,
            loader: true,
            list: [],
            coin: 'btc',
            fee_withdrawal: 0
        };
        this.setMaxBits = this.setMaxBits.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount(){
        this._isMounted = true;
        socket.emit(C.CREDIT_COIN, encode({ token: this.state.token, coin: this.state.coin }));
        socket.on(C.CREDIT_COIN, data => this.setCreditCoin(decode(data)));
        socket.on(C.SUBMIT_NEW_WITHDRAWL, data => this.addWithdrawal(decode(data)));
        wait(500).then(() => {
            this.setState({ loader: false })
        })
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    addWithdrawal(data){
        if(this._isMounted){
            wait(1000).then(() => {
                if(!data){
                    sendNotfication('Something is wrong !', 'info', 'top-center');
                }
                let message = __.toString(data.status);
                sendNotfication(message, 'info', 'top-center');
                socket.emit(C.CREDIT, encode({ token: this.state.token }));
                this.setState({ final: false, pass: null, showArchive: false, loading: false });
            })
        }
    }

    handleInputChanges = (event) => {
        let target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;

        if(target.name === 'coin'){
            socket.emit(C.CREDIT_COIN, encode({ token: this.state.token, coin: value }));
        }

        if(target.name === 'amount'){
            if(!isValidNumber(value)) return false;

            if(value.length > 20){
                return false;
            }
        }

        if(target.name === 'amount'){
            let error = false;

            if(Number(value) > Number(this.maxUserCredit()))
                error = true;

            this.setState({ error: error })
        }

        this.setState({ [target.name]: value });
    }

    getUserCredit(){
        return forceSatoshiFormat(this.state.credit);
    }

    setCreditCoin(data){
        let { credit, fee } = data;
        this.setState({credit: credit, amount: credit, fee_withdrawal: fee });
    }

    maxUserCredit(){
        this.setState({ error: false, error2: false });
        return this.getUserCredit();
    };

    setMaxBits(){
        this.setState({ amount: this.maxUserCredit()});
    }

    submitForm(e){
        if(this._isMounted)
        {
            e.preventDefault();

            let { token, error, coin, pass, wallet, amount, credit, fee_withdrawal } = this.state;

            if(!wallet && !amount)
                return;

            let finalMoney = forceSatoshiFormat(amount - fee_withdrawal);

            if(__.toNumber(finalMoney) <= 0) return console.log('-4');

            let restrecFee = true, minFee;

            //Check for minimum amount
            coins.forEach((item, key) => 
            {
               if(__.lowerCase(item.preffix) === __.lowerCase(coin))
               {
                    let min = forceSatoshiFormat(item.min);
                    finalMoney = __.toNumber(finalMoney);
                    min = __.toNumber(min);
                    if(finalMoney < min){
                        minFee = forceSatoshiFormat(min);
                        restrecFee = false;
                    }
                }
            });

            if(!restrecFee) {
                this.setState({ error2: true, minFee: minFee });
                return console.log('-5');
            };

            //Show Second Form [ Final ]
            if(pass === null){
                this.setState({ final: true });
                return console.log('-7');
            }

            this.setState({ loading: true });

            wait(500).then(() => {
                socket.emit(C.SUBMIT_NEW_WITHDRAWL, encode({
                    token: token,
                    coin: coin,
                    wallet: wallet,
                    amount: amount,
                    immed: fee_withdrawal,
                    password: pass,
                    network: 'BEP20'
                }));
            })
        }
    }

    onChange(event, list){
        this.setState({list: list});
    }

    back(e){
        e.preventDefault();
        this.setState({ final: false, pass: null })
    }

    enterPass(e){
        this.setState({ pass: e.target.value })
    }

    showArchive = e => {
        this.setState({ slide: !this.state.slide });
        wait(500).then(() => {
            this.setState({ showArchive: !this.state.showArchive });
        })
    };

    handleInputCoin = (active, value) => {
        if(active){
            socket.emit(C.CREDIT_COIN, encode({ token: this.state.token, coin: value }));
        }
        else {
            this.setState({ amount: forceSatoshiFormat(0) });
        }
        this.setState({ coin: value,  error: false, error2: false })
    };

    render() {
        let UNIT = this.state.coin;
        let { loader, final, error, showArchive, amount, credit, error2, minFee, fee_withdrawal } = this.state;
        let details = withdrawlDetail(amount, fee_withdrawal, UNIT, credit, error);
        return (
            <>
                {
                    showArchive ?
                        <div className={this.state.slide === false ? 'animated slideOutLeft' : ''}>
                            <WithdrawlArchive clicked={this.showArchive} />
                        </div>
                        :
                        <>
                            <div className={this.state.slide ? 'animated slideOutLeft mt-1' : ' mt-1'}>
                                {final ?
                                    <>
                                        <div className={"m-auto text-center"}>
                                            <h5 className={"text-success"}>Total Amount to Withdrawl:
                                                <b className="ml-2">{forceSatoshiFormat(parseFloat(this.state.amount))} {__.upperCase(UNIT)}</b>
                                            </h5>
                                        </div>
                                        <div className={"m-auto text-center"}>
                                            <form className="w-100" onSubmit={(e) => {this.submitForm(e)}}>
                                                <div className="form-group text-center text-darker">
                                                    <label>Enter Your Password</label>
                                                    <input
                                                        name={"password"}
                                                        type="password"
                                                        value={this.state.pass}
                                                        onChange={e => this.enterPass(e) }
                                                        className={"form-control bgl2"}
                                                        required={true}
                                                    />
                                                </div>
                                                <div className="form-group mt-3 text-center">
                                                    <Button variant="btn btn-info no-shadow mr-2" type="button" onClick={(e) => this.back(e)}>
                                                        <i className="mdi mdi-refresh" /> Back
                                                    </Button>
                                                    <Button variant="btn btn-purple shadow-none" type="submit" disabled={this.state.loading}>
                                                        <i className="mdi mdi-send" /> Send To Wallet
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className={"m-auto text-center pt-3"}>
                                            {loader ?
                                                    <div className="ycenter text-center">
                                                        <div class="spinner-border text-info" role="status" />
                                                    </div>
                                                :
                                                <>
                                                    <p>
                                                        <div onClick={this.showArchive} className={'text-record ml-0'}>View All Transactions</div>
                                                    </p>
                                                </>
                                            }
                                        </div>
                                        <div className={"m-auto wallet"}>
                                            <form className="w-100" onSubmit={(e) => {this.submitForm(e)}}>

                                                {loader ?
                                                    <>
                                                    </>
                                                    :
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="targetWallet" className="text-white">Enter Your Wallet Address</label>
                                                        <div className="input-group">
                                                            <input
                                                                type="text"
                                                                value={this.state.wallet}
                                                                className="form-control bgl2"
                                                                name="wallet"
                                                                id="targetWallet"
                                                                placeholder="..."
                                                                onChange={this.handleInputChanges}
                                                                required={true}
                                                                autoComplete={'off'}
                                                            />
                                                        </div>
                                                    </div>
                                                }

                                                {loader ?
                                                    <>
                                                    </>
                                                    :
                                                    <>
                                                        <label htmlFor="targetAmount" className="text-white">Enter Amount ({__.upperCase(UNIT)})</label>
                                                        <div className="input-group">
                                                            <input type="text"
                                                                   value={this.state.amount}
                                                                   className="form-control bgl2"
                                                                   name="amount"
                                                                   id="targetAmount"
                                                                   placeholder="0"
                                                                   onChange={this.handleInputChanges}
                                                                   required={true}
                                                                   autoComplete={'off'}
                                                            />
                                                            <div className="input-group-append">
                                                                <Button variant="btn bg-greys no-shadow btn-sm btn-clipboard" onClick={this.setMaxBits}>
                                                                    <i className="mdi mdi-coins mr-1" /> Max
                                                                </Button>
                                                            </div>
                                                            {error &&
                                                            <ul className="mt-2 d-inline-block w-100 p-0">
                                                                <li className="text-yellow font-12">You don't have enough balance.</li>
                                                            </ul>}
                                                            {error2 &&
                                                            <ul className="mt-2 d-inline-block w-100 p-0">
                                                                <li className="text-yellow font-12">Minimum withdrawal amount is {minFee} {UNIT}</li>
                                                            </ul>}
                                                        </div>
                                                    </>
                                                }

                                                {loader ?
                                                    <>
                                                        <div className="form-group mt-3 text-center">
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <div className="form-group mt-3 text-center">
                                                            <Button variant="btn btn-btn bg-cs shadow-none" type="submit" disabled={this.state.loading}>
                                                                <i className="far fas fa-dot-circle mr-1" /> Send Amount
                                                            </Button>
                                                        </div>
                                                    </>
                                                }
                                            </form>
                                            <div className="form-group mt-2 mb-0">
                                                {loader ?
                                                    <div className="ycenter text-center">
                                                    </div>
                                                    :
                                                    <div className="withdrawl-detail p-1 bg-soft-dark text-white">
                                                        {details}
                                                    </div>
                                                }
                                                {loader ?
                                                    <>
                                                    </>
                                                    :
                                                    <p className="mt-1 mb-0 p-2 bg-soft-dark text-white">
                                                        <b className="text-yellow">NOTICE: </b> Your withdrawal will be sent from the hot wallet, do not withdraw
                                                        to any site that uses the sending address, or returns to sender,
                                                        because any returns will probably be credited to a different player.<br/>
                                                        <b>Tip:</b> For maximal privacy make sure to use a segwit enabled address and use a fresh address for each receive.<br/>
                                                    </p>
                                                }
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </>
                }
            </>
        );
    }
}

function withdrawlDetail(amount, fee, coin, credit, error){

    let total = forceSatoshiFormat(amount);

    coin = __.upperCase(coin)

    return (
        <>
            <ul className={"p-2 m-0"}>
                <li>Balance available for withdrawal: <b>{forceSatoshiFormat(credit)}</b> {coin}</li>
                <li>Amount to Withdraw: <b>{forceSatoshiFormat(amount)}</b> {coin}</li>
                <li>Withdrawal Fee: <b>{forceSatoshiFormat(fee)}</b> {coin}</li>
                <li>Total: {total} {coin}</li>
            </ul>
        </>
    );
}

export default Withdrawl;