import React, { useEffect, useState, useRef } from 'react';
import safeEval from "safe-eval";
import socket from "../../../../../Socket";
import C from "../../../../../Constant";
import { Event, encode, forceSatoshiFormat, __ } from "../../../../../Helper";
import storage from "../../../../../Storage";

/*
 * Make Fields
*/
class MakeFields extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amount : forceSatoshiFormat(0.00000010),
            payout: (2).toFixed(2)
        };
    }

    setChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        if(name === 'amount'){
            if(parseFloat(value) <= 0){
                value = forceSatoshiFormat(0.00000010);
            }
        }

        this.setState({ [name]: value })
    }

    render(){
        const { script } = this.props;

        var fields = __.words(script, /engine.input/gi);

        if(fields.length === 0) return null;

        let input = [];

        for(var i = 0; i < fields.length; i++){
            var name;

            if(i === 0)
                name = "amount";
            else if(i === 1)
                name = "payout"
            else
                name = `field_${i}`;

            let field = <div className="col-6 mt-1">
                <input className="form-control" placeholder={__.upperCase(name)} id={'_'+name} type="text" name={name} value={this.state[name]} 
                onChange={this.setChange} />
            </div>
            input.push(field)
        }
        return input;
    }
}

/**
 * Auto Bet Engine
 */
function AutoEngine(){
    let self = this;
    self.ws = socket;
    self.token = null;
    self.coin = null;
    self.script = null;
    self.gameStatus = null;
    self.event = Event;
    self.playing = false;
}

/*
 * Idle Game Events
*/
AutoEngine.prototype.idle = function () {
    let self = this;

    self.ws.on(C.WAITING_CRASH, () => {
        self.gameStatus = "waiting";
        self.event.emit('waiting')
    });

    self.ws.on(C.STARTED_CRASH, () => {
        self.gameStatus = "started";
        self.event.emit('started')
    });

    self.ws.on(C.BUSTED_CRASH, () => {
        self.gameStatus = "busted";
        self.event.emit('busted')
    });
}

/*
 * Save User Scripts
*/
AutoEngine.prototype.saveScripts = function (data) {
    let self = this;
    data = __.flattenDeep(data);
    let json = JSON.stringify(data);
    storage.setKey('scripts', json);
}

/*
 * Get User Scripts
*/
AutoEngine.prototype.getScripts = function () {
    const userScripts = storage.getKey('scripts');

    if(userScripts === null)
        return null;

    if(!__.isString(userScripts))
        return null;

    if(__.isEmpty(userScripts))
        return null;

    return JSON.parse(userScripts);
}

/*
 * Make input Fields
*/
AutoEngine.prototype.setUpinput = function (script) {
    return <MakeFields name={script.name} script={script.content} />;
}

/*
 * Support inputs
*/
AutoEngine.prototype.input = function (name) {
    name = `_${name}`;
    if(document.getElementById(name) !== null){
        return document.getElementById(name).value;
    }
}

/*
 * Support inherts
*/
AutoEngine.prototype.on = function (name, callback) {
    let self = this;
    return self.event.on(name, callback)
}

/*
 * Start Script
*/
AutoEngine.prototype.start = function () {
    let self = this;
    self.playing = true;

    var script = __.toString(self.script);
        script = "let self = this;" + script;
        script = __.replace(script, /engine/gi, "self");

    try {
     eval(script);
    } catch(e){
        console.log(e)
    }
}

/*
 * Stop Script
*/
AutoEngine.prototype.stop = function () {
    let self = this;
    self.playing = false;
}

/*
 * Play Game
*/
AutoEngine.prototype.bet = function (amount, payout) {
    let self = this;

    if(self.gameStatus !== 'waiting') return;
    if(!self.playing) return;

    amount = parseFloat(amount);
    payout = parseFloat(payout * 100).toFixed(2);

    if(isNaN(amount)) return;

    console.log('bet', forceSatoshiFormat(amount))
    console.log('payout', payout)

    self.ws.emit(C.PLAY_CRASH, encode({
        token: self.token,
        amount: forceSatoshiFormat(amount),
        payout: payout,
        coin: self.coin
    }));
}

/** Start Auto Bet Engine **/
export default new AutoEngine();