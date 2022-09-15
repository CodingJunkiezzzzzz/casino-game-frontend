import React, { Component } from 'react'
import Modal from "react-bootstrap/Modal";

class Menus extends Component{
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(){
        this.setState({ show: false, effect: 'zoomOut' });
    }

    handleShow(){
        this.setState({ show: true, effect: 'zoomIn' });
    }

    render() {
        return(
            <>
                <span onClick={this.handleShow} className={"btn btn-sm bg-cs2 cpt animated fadeInDown"}>
                    <i className={'mdi mdi-information mr-1'} />
                    Help
                </span>
                <Modal
                    size="md"
					backdrop="static"
                    centered={true}
                    show={this.state.show}
                    onHide={this.handleClose}
                    aria-labelledby="help-md-modal"
                    className={"animated " + this.state.effect}
                >
                    <Modal.Header className="Header">
                        Help
                        <button type="button" className="close p-2" onClick={this.handleClose}>
                            <i className={'mdi mdi-close'}/>
                        </button>
                    </Modal.Header>
                    <Modal.Body className="modal-helper">
                        <h4 className="text-white">
                            What Is this Game ?
                        </h4>
                        <p className={'font-light text-b2'}>
                            CRASH is an best online multiplayer blockchain guessing game that made as an increasing curve that may crash at any time.
                        </p>
                        <h4 className="text-white">
                            What Is HASH and MD5 ?
                        </h4>
                        <p className={'font-light text-b2'}>
                            Each round of the game has a <span className="text-success">HASH</span> that is used to verify the result. (you can use verify result link in the left sidebar). <br/>
                            <span className="text-warning">MD5</span> is the result of the <span className="text-success">HASH</span> conversion that you can see it during the game.<br/>
                            <span className="text-warning">MD5</span> value is just to confirm that the user knows that the result (busted value) can't change during the game.
                        </p>
                        <p className={'font-light text-b2'}>
                            Here is a example: <br/>
                            <code>
                                HASH: 7da1df045b5362b0297e20946c64a1c0e37de244c5abe63cf31bfa8d35cb0bae <br/>
                                MD5: e85770ef0eb25aaf15a04761c23d6cc0 <br/>
                                RESULT: 13.83
                            </code>
                            <br/>
                            First the game generates a random <span className="text-success">HASH</span>, then converts this value to the <span className="text-warning">MD5</span> and shows it to you, then the counter starts. <br/>
                        </p>
                        <h4 className="text-white">
                            How can validate MD5 ?
                        </h4>
                        <p className={'font-light text-b2'}>
                            Just need to convert <span className="text-success">HASH</span> value to <span className="text-warning">MD5</span> !
                            <br/>
                            <code>md5(HASH)</code>
                            <br/>
                            <a target="_blank" href="https://emn178.github.io/online-tools/md5.html">Here is a simple tool (click)</a>, put the <span className="text-success">HASH</span> value then you can see <span className="text-warning">md5</span> value. 
                        </p>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default Menus;