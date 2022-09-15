import React, { Component } from "react";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import Swal from 'sweetalert2';
import jQuery from "jquery";
import HelpScript from "./HelpScript";
import storage from "../../../../../Storage";
import {__, Event, wait, sendNotfication} from "../../../../../Helper";
import Engine from "../../Engine";
import AutoEngine from "./AutoEngine";
import Scriptor from "./Scriptor";

const E_ = React.createElement;

class Scripts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            engine: Engine,
            autoEngine: AutoEngine,
            scriptor: new Scriptor(),
            userScripts: this.parseScripts( this.scripts() ),
            script:{
                repeator: this.parseScripts( repeatorScript() )
            },
            showScriptPage: false,
            scriptData: false,
            disabled: false,
            show: false,
            active: false,
            scriptName: '',
            scriptContent: '',
            amount: null,
            payout: null
        };
        this.openScript = this.openScript.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        let { engine, scriptor } = this.state;
        engine.trigger.on("waiting_crash", () => this.checkPlaying());

        //Add User Scripts
        let s = this.scripts();
        if(s !== null)
            scriptor.add(s);
    }

    scripts(){
        return AutoEngine.getScripts();
    }

    handleShow(){
        let { scriptData } = this.state;
        this.setState({ show: true, effect: 'zoomIn', scriptName: scriptData.name, scriptContent: scriptData.content });
    }

    handleClose(){
        this.setState({ show: false, effect: 'zoomOut', scriptName: '', scriptContent: '', content: '' });
    }

    openScript(data){
        this.setState({ showScriptPage: true, scriptData: data });
    }

    parseScripts(data){
        var arr = [];
        if(data === null) return;

        data.forEach((item, i) => {
            let button = E_("button", {
                    key : i,
                    onClick: () => {this.openScript({ name: item.name, content: item.content })},
                    className: "btn btn-block btn-sm bg-cs2 mt-2"
                },
                item.name);
            arr[i] =  E_("DIV", { className: "col-lg-4 col-md-6 col-4" }, button);
        });

        return arr;
    }

    setUpUI(script){
        let loading = false;
        let run = 'Run';

        if(this.state.disabled){
            loading = E_('div', {
                className: "spinner-border spinner-border-sm mr-1",
                role: "status"
            });
            run = 'Stop';
        }

        const submitButton = E_('BUTTON', {
            className: "btn btn-sm bg-cs2 btn-block mt-2 mr-2",
            id: 'submitButton',
            type: "submit"
        }, [ loading, run ]);

        const backButton = E_('BUTTON', {
            className: "btn btn-sm bg-cs btn-block mt-2 ml-2",
            type: "button",
            disabled: this.state.disabled,
            onClick: () => this.setState({ showScriptPage: false })
        }, [ "Back" ]);

        const buttonPart = E_('div', { className: "col-md-5 m-auto d-flex"}, [submitButton, backButton]);

        const userInputs = E_('div', { className: "row" }, this.state.autoEngine.setUpinput(script) );

        return E_('form', {
            className:'col-md-10 mt-2 mx-auto',
            id: 'scriptFormed',
            onSubmit: (e) => {
                this.runScript(e)
            }
        }, [ userInputs, buttonPart ]);
    }

    checkPlaying = () => {
        if(this.state.active){
            var amount = this.state.amount;
            var payout = this.state.payout;
            Event.emit('auto_bet', { amount, payout });
        }
    }

    runScript(e){
        e.preventDefault();
        // return Swal('Auto playing will complete soon. please use manual bet.');

        var amount = false, payout = false;
        var i = 0;

        for(i in e.target){
            if(e.target[i] !== null && e.target[i].hasOwnProperty('value')){
                var name = e.target[i].name;
                var value = e.target[i].value;

                if(name === 'amount')
                    amount = value;

                if(name === 'payout')
                    payout = value;
            }
        }

        if(this.state.disabled)
        {
            this.setState({ disabled: false, active: false });
        }
        else {
            this.setState({ disabled: true, active: true, amount: amount, payout: payout });
            Event.emit('auto_bet', { amount, payout })
        }
    }

    syncScripts(){
        var scripts = this.state.scriptor.get();
        this.state.autoEngine.saveScripts(scripts);
        
        wait(1000).then(() => {
            this.setState({ userScripts: this.parseScripts( scripts ) });
        })
    }

    addScript(data){
        if(this.state.scriptName === "") return;
        if(this.state.scriptContent === "") return;

        this.state.scriptor.add(data);
        this.setState({ show: false });
        this.syncScripts();
    }

    editScript(data){
        if(this.state.scriptName === "") return;
        if(this.state.scriptContent === "") return;

        this.state.scriptor.edit(data);
        this.syncScripts();

        this.openScript({ name: data.name, content: data.content });

        sendNotfication('Saved !', null, null)
    }

    deleteScript(data){
        Swal.fire({
            title: 'Are you sure to delete this script?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.value) {
                this.state.scriptor.delete(data.name);
                this.syncScripts();
                this.setState({ showScriptPage: false });
            }
        });
    }

    render() {
        const { showScriptPage, scriptData } = this.state;

        if(showScriptPage){
            return <>
                <Row className={'ovh'}>
                    {this.setUpUI(scriptData)}
                </Row>
                <Row className={'ovh'}>
                    <Col md="6">
                        <Button disabled={this.state.disabled} onClick={this.handleShow} variant="soft-danger mt-2" size="sm" block>
                            <i className="mdi mdi-account-details" /> Edit Script
                        </Button>
                        <Modal
                            size="md"
                            backdrop="static"
                            centered={true}
                            show={this.state.show}
                            onHide={this.handleClose}
                            className={"animated " + this.state.effect}
                        >
                            <Modal.Header>
                                Edit Script
                                <button type="button" className="close p-2" onClick={this.handleClose}>
                                    <i className={'mdi mdi-close'}/>
                                </button>
                            </Modal.Header>
                            <Modal.Body>
                                <Form
                                    onSubmit={e => {
                                        e.preventDefault();
                                        this.editScript({ name: this.state.scriptName, content: this.state.scriptContent });
                                    }}
                                >
                                    <div className="form-group ">
                                        <label>Script Name</label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                readOnly={true}
                                                disabled={true}
                                                className="form-control"
                                                value={this.state.scriptName}
                                                onChange={e => this.setState({ scriptName: e.target.value })}
                                            />
                                            <span className="input-group-append" />
                                        </div>
                                    </div>
                                    <div className="form-group ">
                                        <label>Script Codes</label>
                                        <div className="input-group">
                                          <textarea
                                              rows="8"
                                              resizeable={true}
                                              resize={true}
                                              spellCheck={true}
                                              className="form-control"
                                              value={this.state.scriptContent}
                                              onChange={e => this.setState({ scriptContent: e.target.value })}
                                          />
                                            <span className="input-group-append" />
                                        </div>
                                    </div>
                                    <div className="form-group text-center mb-0">
                                        { (scriptData.name === 'Repeator') ?
                                            <Button disabled={true}
                                                    variant="purple" size="sm" block>
                                                <i className="mdi mdi-account-details" /> Save
                                            </Button>
                                            :
                                            <Button type="submit" variant="purple" size="sm" block>
                                                <i className="mdi mdi-content-save-all mr-1" />
                                                Save
                                            </Button>
                                        }
                                    </div>
                                </Form>
                            </Modal.Body>
                        </Modal>
                    </Col>
                    <Col xl={6} md="6" sm={6}>
                        { (scriptData.name === 'Repeator') ?
                            <Button disabled={true}
                                    variant="soft-warning mt-2" size="sm" block>
                                <i className="mdi mdi-account-details" /> Delete Script
                            </Button>
                            :
                            <Button disabled={this.state.disabled}
                                    onClick={ () => {this.deleteScript(scriptData)}}
                                    variant="soft-warning mt-2" size="sm" block>
                                <i className="mdi mdi-account-details" /> Delete Script
                            </Button>
                        }
                    </Col>
                </Row>
            </>
        }

        return (
            <>
                <Row className={"scripts ovh mt-4" }>
                    {!showScriptPage &&
                    <>
                        {this.state.script.repeator}
                        {this.state.userScripts}
                    </>
                    }
                </Row>
                <Row>
                    <Col md="6">
                        <Button onClick={this.handleShow} variant="soft-danger mt-2" size="sm" block>
                            <i className="mdi mdi-account-details" /> Add Script
                        </Button>
                        <Modal
                            size="md"
                            backdrop="static"
                            centered={true}
                            show={this.state.show}
                            onHide={this.handleClose}
                            className={"animated " + this.state.effect}
                        >
                            <Modal.Header>
                                Add Script
                                <button type="button" className="close p-2" onClick={this.handleClose}>
                                    <i className={'mdi mdi-close'}/>
                                </button>
                            </Modal.Header>
                            <Modal.Body>
                                <Form
                                    onSubmit={e => {
                                        e.preventDefault();
                                        this.addScript({ name: this.state.scriptName, content: this.state.scriptContent });
                                    }}
                                >
                                    <div className="form-group ">
                                        <label>Script Name</label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={this.state.name}
                                                onChange={e => this.setState({ scriptName: e.target.value })}
                                            />
                                            <span className="input-group-append" />
                                        </div>
                                    </div>
                                    <div className="form-group ">
                                        <label>Script Codes</label>
                                        <div className="input-group">
                                          <textarea
                                              rows="5"
                                              resizeable={true}
                                              resize={true}
                                              spellCheck={true}
                                              className="form-control"
                                              value={this.state.name}
                                              onChange={e => this.setState({ scriptContent: e.target.value })}
                                          />
                                            <span className="input-group-append" />
                                        </div>
                                    </div>
                                    <div className="form-group text-center mb-0">
                                        <Button type="submit" variant="purple" size="sm" block>
                                            <i className="mdi mdi-content-save-all mr-1" />
                                            Save Script
                                        </Button>
                                    </div>
                                </Form>
                            </Modal.Body>
                        </Modal>
                    </Col>
                    <Col md="6">
                        <HelpScript />
                    </Col>
                </Row>
            </>
        );
    }
}

/**
 * Get Repeator Script
 * @return {string}
 */
function repeatorScript() {

const content = `
var amount = engine.input('amount');
var payout = engine.input('payout');

engine.on('waiting', onWaiting);
engine.on('started', onStarted);
engine.on('busted', onBusted);

function onWaiting(){
    // Event when game is waiting for players bet
    engine.bet(amount, payout)
}

function onBusted(){
    // Event when game was busted
}

function onStarted(){
    // Event when game was started
}

`;

    return [{
        name: "Repeator",
        content: content
    }];
}

export default Scripts;