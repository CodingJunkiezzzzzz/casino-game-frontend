import React, {Component} from "react";
import storage from "../../../../Storage";
import socket from "../../../../Socket";
import {__, decode, encode, forceSatoshiFormat, fixDate} from "../../../../Helper";
import C from "../../../../Constant";

const C_ = React.createElement;

class DepositArchive extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            token: storage.getKey('token'),
            loading: true,
            deposits: []
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
            let array = data.deposit;
            this.setState({ loading: false });
            if(array) {
                array.forEach((deposit, i) => {
                    let block = <DepositTable data={deposit} key={i}/>;
                    this.setState(state => ({deposits: [block, ...state.deposits]}));
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
                            <table className="table table-hover deposit">
                                <thead>
                                <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Transaction</th>
                                </tr>
                                </thead>
                                {this.state.deposits.length > 0 &&
                                    this.state.deposits
                                }
                            </table>
                            {this.state.deposits.length === 0 &&
                            <div className="alert bg-soft-dark mt-2 w-100 font-13 text-center text-upper text-yellow">
                                [ Your deposit list is empty ]
                            </div>
                            }
                            <div className="text-center">
                                <button onClick={this.props.clicked} className="btn bg-cs2 btn-sm text-center font-13 cpt">
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

function DepositTable(props){
    const { amount, status, date, txtid, coin } = props.data;
    return(
            <tr>
                <td>{fixDate(date)}</td>
                <td>{forceSatoshiFormat(amount) + ' ' + __.upperCase(coin)}</td>
                <td>{status}</td>
                <td>
                    <input className="form-control" readOnly={true} value={txtid} />
                </td>
            </tr>
    );
}

export default DepositArchive;