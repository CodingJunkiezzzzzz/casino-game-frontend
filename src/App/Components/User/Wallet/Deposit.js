import React from "react";
import ReactTooltip from "react-tooltip";
import {Col, Row, Tab, Nav, Dropdown} from "react-bootstrap";
import storage from "../../../../Storage";
import coins from "../../../coins";
import socket from "../../../../Socket";
import {__, isMobile, encode, decode, getElement, wait, forceSatoshiFormat, sendNotfication, Event} from "../../../../Helper";
import DepositArchive from "./DepositArchive";
import C from "../../../../Constant";

class Deposit extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            token: storage.getKey('token'),
            currentCoin: 'BTC',
            loading: true,
            credits: {},
            list: [],
            content: [],
            wallet: 'Please Wait...',
            deposit: true,
            slide: false,
            height: 573,
            margin: 'mt-1'
        };
    }

    componentDidMount() {
        this._isMounted = true;
        socket.emit(C.CREDIT, encode({ token: this.state.token, coin: this.state.currentCoin }));
        socket.on(C.GET_ADDRESS, data => this.getAddress(decode(data)));
        socket.on(C.CREDIT, data => this.getCreditAndCoins(decode(data)));

        wait(400).then(() => {
            this.loadAddress(true, this.state.currentCoin);
        })
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    getCreditAndCoins = (data) => {
        if(this._isMounted)
        {
            let { credit } = data;
            this.setState({ credits: credit, loading: false });
            this.setUpCoins();
        }
    };

    getFee = (coin) => {
        coin = __.upperCase(coin);

        let min;
        coins.forEach((item, key) => {
            if(item.preffix === coin)
                min = item.min;
        })

        return min;
    }

    setUpCoins = () => {
        if(isMobile()){
            this.setState({ height: 685, margin: 'mt-1' });
        }
        
        coins.forEach((item, key) => {
            let credit = forceSatoshiFormat(this.state.credits[__.lowerCase(item.preffix)]);
            let list = <Dropdown.Item as={'button'} className={"animated fadeIn"} onClick={ (e) => this.loadAddress(item.active, item.preffix) }>
                            <span><img src={"/assets/images/" + item.image} className={"img-fluid mini-coin mr-1"} alt="Coin" /> {item.preffix}</span>
                        </Dropdown.Item>;
            this.setState(state => ({ list: [list, ...state.list] }));
        });
    };

    showArchive = e => {
        this.setState({ slide: !this.state.slide });
        wait(500).then(() => {
            this.setState({ deposit: !this.state.deposit });
        })
        wait(500).then(() => {
            this.loadAddress(true, this.state.currentCoin);
        })
    };

    copyAddress(id){
        var address = getElement('#' + id);
        address.select();
        address.setSelectionRange(0, 99999); /*For mobile devices*/
        document.execCommand("copy");
        sendNotfication('Copied !', 'success', 'top-right')
    }

      loadAddress(active, coin) {
        if (this._isMounted) {
          this.setState({ currentCoin: coin, depositAddress: "Please Wait ..." });
          if (active) socket.emit(C.GET_ADDRESS, encode({ coin: coin, token: storage.getKey('token') }));
          else {
            this.setState({ depositAddress: `${coin} not Supported yet` });
          }
        }
      }

    getAddress(data){
        if(!data) return;
        let { address } = data;
        this.setState({ wallet: address, qr: 'https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=' + this.state.currentCoin + ':' + address });
    }

    render() {
        let { height, margin, loading } = this.state;
		let style;
        let size = 'w-25';
		
		if(isMobile()){
			style = "col-2";
            size = 'w-50'
		}

        return (
            <>
                    {
                        this.state.deposit ?
                        <div className={this.state.slide ? 'animated slideOutLeft ' : ' ffont-14'}>
                            { this.state.loading ?
                                <div className="ycenter text-center">
                                    <div class="spinner-border text-info" role="status" />
                                </div>
                                :
                                <> 
                                    <div className="lrow text-center text-white p-1 ycenter">
                                            <div className="border-right">
                                                  
                                                    <span stle={{ fontSize: 17 }}>
                                                      <img src={
                                                          "/assets/images/" + this.state.currentCoin + ".png"
                                                        }
                                                        className={"img-fluid mini-coin-12 mr-2"}
                                                        alt="Coin"
                                                      />
                                                      {this.state.currentCoin}
                                                    </span>
                                                </div>
                                                <div className="text-center mt-1">
                                                    <span>Balance</span>
                                                    <p className="text-white font-15">{forceSatoshiFormat(this.state.credits[__.lowerCase(this.state.currentCoin)])}</p>
                                                </div>                                        
                                            </div>
                                            <hr/>
                                            <div className="form-group">
                                                <p className="text-white">
                                                    Deposit Address
                                                    - 
                                                    <span className={'text-yellow font-weight-bold'}> ( Minimum 0.00008000 ) </span>
                                                </p>
                                                <div className="input-group">
                                                    <input type="text" id={this.state.currentCoin} className={'form-control mspace'} style={{background: "#34363e"}} readOnly={true} value={this.state.wallet} />
                                                    <div className="input-group-append">
                                                        <button onClick={e => this.copyAddress(this.state.currentCoin)} type="button" className="btn bg-greys no-shadow btn-clipboard hv">
                                                            <i className="far fa-copy text-white"/>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div onClick={this.showArchive} className={'text-record font-10'}>View Archive</div>
                                            </div>
                                            <div className="text-center mb-3">
                                                <img id={'qr'} src={this.state.qr} className={"img-thumbnail qri " + size} alt=""/>
                                            </div>
                                            <div className="alert bg-cs">
                                                <p className="text-white font-12">
                                                    <span className="text-yellow">IMPORTANT: </span>
                                                    Send only {this.state.currentCoin} to this deposit address.
                                                    Sending any other currency to this address may result in the loss of your deposit.
                                                    Please be careful with the minimum deposit amount.
                                                </p>
                                                <p className="text-white font-12">
                                                    <span className="text-yellow">NOTICE: </span>
                                                    We don't need to check payments network confirmation.
                                                    After making a deposit, you account should be charge quickly.
                                                    But at the time of withdrawal, your deposit must have at least 1 confirmation.
                                                </p>
                                            </div>
                                </>
                            }
                        </div>
                        :
                        <>
                            <div className={this.state.slide == false ? 'animated slideOutLeft' : ''}>
                                <DepositArchive clicked={this.showArchive} />
                            </div>
                        </>
                    }
            </>
        );
    }
}

export default Deposit;