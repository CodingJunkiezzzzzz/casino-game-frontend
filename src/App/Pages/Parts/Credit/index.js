import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Dropdown, Modal} from "react-bootstrap";
import PerfectScrollbar from 'perfect-scrollbar';
import coins from "../../../coins";
import socket from "../../../../Socket";
import storage from "../../../../Storage";
import {setCoin, gameCoin, setCredit} from "../../../../actions/gameCoin";
import {__, wait, decode, encode, forceSatoshiFormat, Event} from "../../../../Helper";
import C from "../../../../Constant";

class Credit extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            token: storage.getKey('token'),
            coin: "BTC",
            activeClientCoins: storage.getKey('active_coins') ? storage.getKey('active_coins') : null,
            selectedCoin: 'btc',
            credits: {},
            coins: [],
            different: [],
            credit: false
        };
        this.wrapperRef = React.createRef();
    }

    componentDidMount() {
        storage.setKey('coin', 'btc')
        
        //Get Redux Coin
        this.props.gameCoin();
        if(this.state.token !== null)
            socket.emit(C.CREDIT, encode({ token: this.state.token, coin: this.state.coin }));

        socket.on(C.CREDIT, data => this.getCredit(decode(data)));
        socket.on(C.UPDATE_CREDIT, data => this.updateCredit(decode(data)));
    }

    getCredit(data){
        let { credit } = data;
        
        this.setState({credits: credit});

        let currentCoin = __.lowerCase(this.props.coin);
        let currentCredit = forceSatoshiFormat(this.state.credits[currentCoin]);
        this.setState({ credit: currentCredit });
        storage.setKey('credit', currentCredit);
        
        //Set for Redux
        this.props.setCredit(currentCredit);
    }

    updateCredit(data){
        let credit = data.value;
        let coin   = data.coin;

        let different;
        let arr;

        if(__.toNumber(credit) > __.toNumber(this.state.credit)){
            different = __.toNumber(credit) - __.toNumber(this.state.credit);
            arr = {
                amount: different,
                color: 'text-success'
            }
        }
        else{
            different = __.toNumber(this.state.credit) - __.toNumber(credit);
            arr = {
                amount: different,
                color: 'text-danger'
            }
        }

        let check = forceSatoshiFormat(different);

        if(check.toString() !== '0.00000000'){
            this.setState(state => ({ different: [arr, ...state.different] }));
        }

        credit = forceSatoshiFormat(credit);

        this.setState({ credit: credit });
        storage.setKey('credit', credit);

        //Set for Redux
        this.props.setCredit(credit);
    }

    addDiff(data, i){
        let id = 'id_' + Math.floor(Math.random()*1000+1);

        wait(2000).then(() => {
            try {
                document.getElementById(id).classList.remove('frd');
                document.getElementById(id).classList.add('fadeOutDown');
            }
            catch (e) {}
            this.state.different.splice(i, 1);
        });

        return <li key={i} id={id} className={'list-inline w-100 text-right animated frd ' + data.color}> {(data.color === 'text-danger'? '-': '+')}
                    {forceSatoshiFormat(data.amount, this.state.coin)}
                </li>;
    }

    render() {
        let { credit, different, coin, coins, show } = this.state;
        credit = forceSatoshiFormat(credit, coin); // NEED TO REMOVE FOR FIX
        let diff = different.map((data, i) =>
            this.addDiff(data, i)
        );

        const { t } = this.props;
        return (
            <>
                <li>
                    <div className="crypto-balance" ref={this.wrapperRef}>
                       <ul id="cup2" className={'mt-2 mr-1'}>{diff}</ul>
                        <div className="btc-balance">
                            <div className={"clist mt-0 text-right float-right cpd"}>
                                <div variant="block" className={'p-0 mt-0'} id="dropdown-split-coins">
                                    <h5 className="m-0 text-left">
                                        <span className={'text-white'}>
                                            <img src={ '/assets/images/' + __.lowerCase(coin) + '.png' }  className={'mini-coin-2 mr-2'} alt=""/>
                                            {__.upperCase(coin)}
                                        </span>
                                    </h5>
                                    <span className="text-white d-block font-14">
                                        {credit} 
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </>
        );
    }
}

Credit.propTypes = {
    setCoin: PropTypes.func.isRequired,
    coin: PropTypes.string
};

const mapStateToProps = state => ({
    coin: state.items.coin
});

export default connect(mapStateToProps, { setCoin, gameCoin, setCredit })(Credit);