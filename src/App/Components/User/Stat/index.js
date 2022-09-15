import React, { Component } from 'react'
import {Row, Col, Card, Modal} from "react-bootstrap";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Helmet} from "react-helmet";
import Swal from 'sweetalert2';
import Details from "./Details";
import socket from "../../../../Socket";
import storage from "../../../../Storage";
import {decode, encode, wait} from "../../../../Helper";
import C from "../../../../Constant";

class Stat extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            user: null,
            loading: true,
            forUser: null
        };
    }

    componentDidMount() {
        this._isMounted = true;

        socket.on(C.USER_INFO, data => this.userInfo(decode(data)));

        this.setState({ user: null, data: [], loading: true });

        let username = this.props.params.pathname;
        username = username.replace('/user/','');
        this.getUserInfo(username);

        wait(500).then(() => {
            this.setState({ user: username, forUser: username });
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.setState({ user: null, loading: true, data: []});
    }
    
    userInfo(response){
        if(this._isMounted)
        {
            this.setState({ forUser: response.name });

            if(response.status === false){
                this.setState({ user: null, loading: true, data: []});
                return Swal.fire('User Not Found !');
            }

            //Prevent from opening other user on modal
            if(this.state.user === this.state.forUser){
                this.setState({ data: response, loading: false } );
            }
        }
    }

    getUserInfo(name){
        socket.emit(C.USER_INFO, encode({name: name, coin: this.props.coin, game: 'all'}));
    }

    render(){
        let {username, isWinner, chart_coin, cssClass} = this.props;
        chart_coin =  "btc";

        if(isWinner === true)
            cssClass = 'text-success';

        return (
            <>
                <Helmet>
                        <title>User Profile</title>
                </Helmet>
                <Row>
                    <Col xl={7} md={10}  sm={12} className={'m-auto'}>
                        <Card className="user-modal-bg">
                            <Card.Header style={{ background: '#2f3138', border: 0 }} closeButton>
                                <Card.Title>User Information</Card.Title>
                            </Card.Header>
                            {!this.state.loading && this.state.data &&
                            <Card.Body>
                                {this._isMounted && this.state.data.name &&
                                <div className="container-fluid">
                                    <Details t={this.props.t} changeCoinLoader={false} token={this.state.data.id} name={this.state.data.name} coin={chart_coin} data={this.state.data} />
                                </div>
                                }
                                {!this.state.data.name &&
                                    <h2 className="text-center">User Not Found</h2>
                                }
                            </Card.Body>
                            }
                            {this.state.loading &&
                                <Modal.Body>
                                    <div className="text-center">
                                        <div className="spinner-border text-info" role="status" />
                                    </div>
                                </Modal.Body>
                            }
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}

Stat.propTypes = {
    chart_coin: PropTypes.string
};

const mapStateToProps = state => ({
    chart_coin: state.items.chart_coin
});

export default connect(mapStateToProps, {})(Stat);