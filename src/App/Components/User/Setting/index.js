import React, { Component } from 'react'
import {Modal, Row, Col} from "react-bootstrap";
import storage from "../../../../Storage";
import {sendNotfication, wait} from "../../../../Helper";
import General from "./General";
import Avatar from "./Avatar";
import Security from "./Security";

class Setting extends Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            general: true
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(){
        this.setState({ show: false, effect: 'delayAn zoomOut' });
        wait(500).then(() => {
            this.setState({ general: true })
        })
    }

    handleShow(){
        if(storage.getKey('token') === null)
        {
            return sendNotfication('Please Login !', 'warning', 'top-center');
        }
        this.setState({ show: true, effect: 'delayAn pulse' });
    }

    changePage = (e) =>{
        this.setState({ general: !this.state.general })
    };

    render(){
        return (
            <>
                <span onClick={this.handleShow} className={"dropdown-item"}>
                    <i className="dripicons-gear text-muted mr-2 text-drop"/>
                    Settings
                </span>
                <Modal
                    size="md"
                    centered={true}
                    backdrop={'static'}
                    show={this.state.show}
                    onHide={this.handleClose}
                    aria-labelledby="setting-lg-modal"
                    className={"animated " + this.state.effect}
                >
                    <Modal.Header className="Header">
                        Setting <button type="button" className="close p-2" onClick={this.handleClose}>
                        <i className={'mdi mdi-close'}/>
                    </button>
                    </Modal.Header>
                    <Modal.Body>
                    {this.state.general &&
                        <Row>
                            <Col sm={12} md={12}>
                                <Avatar/>
                            </Col>
                            <Col sm={12} md={12} className="mt-2">
                                <General />
                            </Col>
                            <Col sm={12} md={12} className="text-center mt-3">
                                <button className="btn bg-cs no-shadow btn-sm" onClick={this.changePage}>
                                     <i className="mdi mdi-key align-middle"></i> Change Password
                                </button>
                            </Col>
                        </Row>
                       }
                        {!this.state.general &&
                            <Row>
                                <Col sm={12} md={12}>
                                    <Security clicked={this.changePage}/>
                                </Col>
                            </Row>
                        }
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default Setting;