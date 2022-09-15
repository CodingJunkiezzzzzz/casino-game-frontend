import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Dropdown} from "react-bootstrap";
import coins from "../../../coins";
import socket from "../../../../Socket";
import storage from "../../../../Storage";
import {setCoin, gameCoin, setCredit} from "../../../../actions/gameCoin";
import {__, wait, decode, encode, forceSatoshiFormat} from "../../../../Helper";
import C from "../../../../Constant";

class Credit extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            token: storage.getKey('token'),
            coin: storage.getKey('coin') ? storage.getKey('coin'): "BTC",
            credits: {},
            coins: [],
            different: [],
            credit: false
        };
        this.selectCoin = this.selectCoin.bind(this);
    }

    componentDidMount() {
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
        this.updateAllCoins();
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

        this.setState({ credit: forceSatoshiFormat(credit) });
        storage.setKey('credit', credit);
        this.updateCoin(__.lowerCase(coin), credit);

        //Set for Redux
        this.props.setCredit(forceSatoshiFormat(credit));
    }

    updateCoin(coin, amount){
        this.setState({ coins: [] });

        coins.forEach((item, i) => {
            if(__.lowerCase(item.preffix) === coin)
            {
                let update = <Dropdown.Item onClick={ e => this.selectCoin(__.upperCase(coin)) } key={__.toString(i)} className={"animated slideInDown num-style"}>
                    <img src={'/assets/images/' + item.image} alt="coin" className={'mini-coin-2'}/>
                    {item.preffix}: {forceSatoshiFormat(amount)}</Dropdown.Item>;
                this.setState(state => ({ coins: [update, ...state.coins] }));
            }
            else {
                let value = forceSatoshiFormat(this.state.credits[__.lowerCase(item.preffix)]);
                let update = <Dropdown.Item onClick={ e => this.selectCoin(item.preffix) } key={__.toString(i)} className={"animated slideInDown num-style"}>
                    <img src={'/assets/images/' + item.image} alt="coin" className={'mini-coin-2'}/>
                    {item.preffix}: {value}</Dropdown.Item>;
                this.setState(state => ({ coins: [update, ...state.coins] }));
            }
        });
    }

    updateAllCoins(){
        this.setState({ coins: [] });
        coins.forEach((item, i) => {
            let value = forceSatoshiFormat(this.state.credits[__.lowerCase(item.preffix)]);
            let coin = <Dropdown.Item onClick={ e => this.selectCoin(item.preffix) } key={__.toString(i)} className={"animated slideInDown num-style"}>
                <img src={'/assets/images/' + item.image} alt="coin" className={'mini-coin-2'}/>
                {item.preffix}: {value}</Dropdown.Item>;
            this.setState(state => ({ coins: [coin, ...state.coins] }));
        });
    }

    selectCoin(name){
        //Fix For Double selection
        if(storage.getKey('coin') === name) return;
        storage.setKey('coin', name);

        let credit = this.state.credits[__.lowerCase(name)];
        this.setState({ coin: name, credit: credit});

        //Set Coin For Redux
        this.props.setCoin(name);
        this.props.setCredit(credit);
    }

    addDiff(data, i){
        let id = 'id_' + Math.floor(Math.random()*1000+1);

        wait(2000).then(() => {
            this.state.different.splice(i, 1);
            try {
                document.getElementById(id).classList.remove('frd');
                document.getElementById(id).classList.add('fadeOutDown');
            }
            catch (e) {}

        });

        return(
            <>
                <li id={id} className={'list-inline w-100 text-right animated frd ' + data.color}> {(data.color === 'text-danger'? '-': '+')}
                    {forceSatoshiFormat(data.amount, this.state.coin)}
                </li>
            </>
        );
    }

    render() {
        let { credit, different, coin, coins } = this.state;
        credit = forceSatoshiFormat(credit, coin);
        let diff = different.map((data, i) =>
            this.addDiff(data, i)
        );
        return (
            <>
                <li className="">
                    <div className="crypto-balance">
                        <span id="cup" className={'mt-2 mr-1'}>{diff}</span>
                        <img src={ '/assets/images/' + __.lowerCase(coin) + '.png' }  className={'mini-coin-5 mr-1'} alt=""/>
                        <div className="btc-balance">
                            <Dropdown className={"clist mt-0"}>
                                <Dropdown.Toggle split variant="block" className={'p-0 mt-0'} id="dropdown-split-coins">
                                    <h5 className="m-0"> <span className={'text-white'}>{credit} {coin}</span></h5>
                                    <span className="text-muted text-center d-block">
                                        <i className={'mdi mdi-chevron-down font-10'} />
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className={"dopdown-menu-right num-style"}>
                                    {coins}
                                </Dropdown.Menu>
                            </Dropdown>
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