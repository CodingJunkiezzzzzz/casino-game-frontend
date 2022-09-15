import React from "react";
import {Button, Modal} from "react-bootstrap";

class Help extends React.Component {
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

const eg_config = `
var amount = engine.input('amount');
var payout = engine.input('payout');
`;

const eg_1 = `
engine.on('waiting', onWaiting);
engine.on('started', onStarted);
engine.on('busted', onBusted);

function onWaiting(){
    // Waiting for players bet
}

function onStarted(){
    // Event when game was started
}

function onBusted(){
    // Event when game was busted
}`;

 const eg_2 = `
engine.bet(amount, payout)
`;

        return (
            <>
                <Button onClick={this.handleShow} variant="soft-warning mt-2" size="sm" block>
                    <i className="mdi mdi-help-box" /> Help
                </Button>
                <Modal
                    size="sm"
                    backdrop="static"
                    centered={true}
                    show={this.state.show}
                    onHide={this.handleClose}
                    className={"animated " + this.state.effect}
                >
                    <Modal.Header>
                        Script Help
                        <button type="button" className="close p-2" onClick={this.handleClose}>
                            <i className={'mdi mdi-close'}/>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        <h5 className="m-0 mb-2">Script Config</h5>

                        <p className={'text-warning m-0'}>At the first, 2 input (amount, payout) in the top of all script is important:</p>

                        <code className="script-pre">
                            { eg_config }
                        </code>

                        <hr/>

                        <h5 className="my-3 text-yellow">Game Engine (enigne)</h5>

                        <p className={'text-warning m-0'}>Game engine have three status:</p>

                        <ul className={'m-0 my-2 p-0 text-success'}>
                            <li>waiting</li>
                            <li>started</li>
                            <li>busted</li>
                        </ul>

                        <p className={'text-warning m-0'}>Add your function in each status:</p>

                        <code className="script-pre">
                            { eg_1 }
                        </code>

                        <p className={'text-warning m-0 mt-2'}>For playing round, you need to use "engine.bet" function in the "waiting" status:</p>

                        <code className="script-pre">
                            { eg_2 }
                        </code>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default Help;