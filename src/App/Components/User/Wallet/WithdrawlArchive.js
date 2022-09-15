import React, {Component} from "react";
import storage from "../../../../Storage";
import socket from "../../../../Socket";
import {__, decode, encode, forceSatoshiFormat, fixDate} from "../../../../Helper";
import C from "../../../../Constant";

const C_ = React.createElement;

class WithdrawlArchive extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            token: storage.getKey('token'),
            loading: true,
            withdrawls: []
        };
    }

    componentDidMount(){
        this._isMounted = true;
        socket.emit(C.WALLET_HISTORY, encode({ token: this.state.token}));
        socket.on(C.WALLET_HISTORY, data => this.makeHistory(decode(data)));
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    makeHistory(data){
        if(this._isMounted)
        {
            let array = data.withdrawl;
            this.setState({ loading: false });
            if(array) {
                array.forEach((withdraw, i) => {
                    let block = <WithdrawlTable data={withdraw} key={i}/>;
                    this.setState(state => ({withdrawls: [block, ...state.withdrawls]}));
                });
            }
        }
    }

    render() {
        let { loading } = this.state;
        return(
            <>
                {loading ?
                    <div className="text-center">
                         <div class="spinner-border text-info my-3" role="status" />
                    </div>
                :
                    <>
                        <div className="table-responsive mt-2">
                            <table className="table table-hover fix-table deposit">
                                <thead>
                                <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Wallet</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Status</th>
                                </tr>
                                </thead>
                                {this.state.withdrawls.length > 0 &&
                                    this.state.withdrawls
                                }
                            </table>
                            {this.state.withdrawls.length === 0 &&
                                <div className="alert bg-soft-dark mt-2 w-100 font-13 text-center text-upper text-yellow">
                                    [ Your Withdrawal List is Empty ]
                                </div>
                            }
                            <div className="text-center mb-2">
                                <button onClick={this.props.clicked} className="btn bg-cs2 btn-xs text-center font-13 cpt">
                                    <i className={'mdi mdi-arrow-left-bold-circle'} /> Back
                                </button>
                            </div>
                        </div>
                    </>
                }
            </>
        );
    }
}

class WithdrawlTable extends Component {
    createMarkup(str) {
        return { __html: str };
    }
    render(){
        let { id, amount, wallet, status, date, coin } = this.props.data;
        amount = forceSatoshiFormat(amount);
        status = <div dangerouslySetInnerHTML={this.createMarkup(status)} />;
        let A = C_( 'td', {}, fixDate(date));
        let B = C_( 'td', {}, wallet);
        let C = C_( 'td', {}, amount + ' ' + __.upperCase(coin));
        let D = C_( 'td', {className: "text-warning"}, status);

        return C_( 'tr',  {}, [ A, B, C, D ])
    }
}

export default WithdrawlArchive;