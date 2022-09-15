import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Col, Row} from "react-bootstrap";
import Swal from "sweetalert2";
import Skeleton from "@material-ui/lab/Skeleton";
import storage from "../../../../Storage";
import socket from "../../../../Socket";
import coins from "../../../coins";
import {Event, wait, decode, encode, isValidNumber, forceSatoshiFormat, sendNotfication} from "../../../../Helper";
import {gameCoin} from "../../../../actions/gameCoin";
import C from "../../../../Constant";

class TipUser extends Component{
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            amount: forceSatoshiFormat(0.00000010),
            coin: 'btc',
            list: []
        };
    }

    componentDidMount() {
        this._isMounted = true;
        wait(500).then(() => {
            this.setState({ loading: false });
        });
        this.props.gameCoin();
        socket.on(C.SEND_TIP, data => this.sendTip(decode(data)));
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    submitForm(e){
        if(this._isMounted)
        {
            e.preventDefault();

            if(this.state.amount.trim() === '')
                return;

            this.setState({ amount: forceSatoshiFormat(this.state.amount) })

            Swal.fire({
                title: 'Are you sure to send tip to this user?',
                text: "",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!'
            }).then((result) => {
                if (result.value)
                {
                    wait(400).then(() => {
                        socket.emit(C.SEND_TIP, encode({
                            token: storage.getKey('token'),
                            target: this.props.name,
                            amount: this.state.amount,
                            coin: this.state.coin
                        }));
                    });
                }
            });
        }
    }

    sendTip(data){
        if(this._isMounted)
        {
            if(data.senderName === storage.getKey('name'))
            {
                wait(1000).then(() => {
                    if(data.status){
                        socket.emit(C.CREDIT, encode({ token: storage.getKey('token'), coin: this.props.coin }));
                        return sendNotfication(data.msg, 'success', 'top-center');
                    }
                    else {
                        return sendNotfication(data.msg, 'warning', 'top-center');
                    }
                });
            }
        }
    }

    handleInputChange = e => {
        let target = e.target;
        let value = target.value;
        this.setState({ coin: value});
    };

    handleChangeAmount = (event) => {
        let target = event.target;
        let value = target.value;

        if(!isValidNumber(value)) return;

        this.setState({ amount: value });
    };

    back = () => {
        Event.emit('force_modal_tip_close');
        this.setState({ loading: true });
    };

    render() {
        if(storage.getKey('name') === this.props.name) return null;
        return(
            <>
                {
                    this.state.loading ?
                    <>
                        <div className="text-center" style={{ minHeight: 500 }}>
                            <div class="spinner-border text-info my-2 user-loader" role="status"/>
                        </div>
                    </>
                    :
                        <>
                            <form onSubmit={(e) => this.submitForm(e)}>
                                <label className="text-center mt-3">
                                    Enter amount you want to send to user
                                </label>
                                <input type="text"
                                       name={'amount'}
                                       className="form-control mb-3"
                                       onChange={this.handleChangeAmount}
                                       value={this.state.amount}
                                />
                                <Row className="mb-3">
                                    <Col md={6} className={'col-6'}>
                                        <button type="submit" className="btn btn-s-2 btn-block">
                                            <i className="mdi mdi-send align-middle" /> Send Tip
                                        </button>
                                    </Col>
                                    <Col md={6} className={'col-6'}>
                                        <button type="button" className="btn bg-cs2 btn-block" onClick={this.back}>
                                            <i className="mdi mdi-refresh align-middle" /> Back
                                        </button>
                                    </Col>
                                </Row>
                            </form>
                        </>
                }
            </>
        );
    }
}

TipUser.propTypes = {
    coin: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    coin: state.items.coin
});

export default connect(mapStateToProps, { gameCoin })(TipUser);