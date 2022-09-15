import Swal from "sweetalert2";
import storage from "../../../Storage";
import socket from "../../../Socket";
import {Event, encode, decode, forceSatoshiFormat, randomString} from "../../../Helper";
import C from "../../../Constant";

/**
 * Game Engine
 */
function Engine(){

    var self = this;

    /**
     * Socket Connection
     */
    self.ws = socket;

    /**
     * Gamr Name
     */
    self.game = 'crash';

    /**
     * Event Trigger
     * @type {module:events.internal}
     */
    self.trigger = Event;
    // self.trigger.setMaxListeners();

    /**
     * Intialize Player
     * @type {boolean}
     */
    self.init = false;

    /**
     * Current Player
     * @type {null}
     */
    self.token = null;

    /**
     * Script Form Data
     * including 2 value ( amount / Payout )
     * name / value / type
     * @type {Array}
     */
    self.formData = [];

    /**
     * Amount for the round
     * @type {null}
     */
    self.amount = null;

    /**
     * Payout value for the round
     * @type {null}
     */
    self.payout = null;

    /**
     * Target User for following
     * @type {null}
     */
    self.targetUser = null;

    /**
     * Game Status
     * 3 type: waiting | started | busted
     */
    self.gameStatus = null;

    /**
     * Player coin
     */
    self.coin = 'btc';

    /**
     * Player Status
     * 3 type: playing | Waiting | null
     */
    self.playerStatus = null;

    /**
     * Game History
     */
    self.history = [];

    /**
     * User Is Playing Game
     */
    self.isPlaying = false;

    /**
     * User Is Holding for Game
     */
    self.isHolding = false;

    /**
     * Game Options
     */
    self.time = null
    self.md5 = null;
    self.amount = null;
    self.force = null;

    /**
     * Event on Getting Status game
     */
    self.ws.on(C.STATUS_CRASH, function (data) {
        data =  decode(data);
        self.gameStatus = data.status;
        self.history.push(data.crashes);
        self.time = data.time
        data.md5 = (data.md5 !== undefined) ? data.md5: null;
        data.force = data.force;
        data.amount = data.amount;
        self.trigger.emit('game_status', data);
    });

    /**
     * Event on Getting History
     */
    self.ws.on(C.HISTORY_CRASH, function (data) {
        data =  decode(data);
        self.trigger.emit(C.HISTORY_CRASH, data);
    });

    /**
     * Event on Getting All Players
     */
    self.ws.on(C.PLAYERS_CRASH, function (data) {
        data =  decode(data);
        self.trigger.emit('game_players', data);
    });

    /**
     * Event on Playing Game by User
     */
    self.ws.on(C.PLAY_CRASH, function (data) {
        data = decode(data);
        self.isPlaying = true;
        self.trigger.emit('play_crash', data);
    });

    /**
     * Event on CashOut Game by User
     */
    self.ws.on(C.FINISH_CRASH, function (data) {
        data = decode(data);
        self.isPlaying = false;
        self.trigger.emit('finish_crash', data);
    });

    /**
     * Event on busted game
     */
    self.ws.on(C.BUSTED_CRASH, function (data) {
        data = decode(data);
        self.isPlaying = false;
        self.gameStatus = 'busted';
        // self.history.unshift(data);
        self.history.unshift(data);
        self.time = data.time
        data.md5 = (data.md5 !== undefined) ? data.md5: null;
        data.force = data.force;
        data.amount = data.amount;
        self.trigger.emit('busted_crash', data);
        self.trigger.emit('busted_crash_history', data);
    });

    /**
     * Event on started game
     */
    self.ws.on(C.STARTED_CRASH, function (data) {
        data = decode(data);
        self.gameStatus = 'started';
        self.time = data.time
        data.md5 = (data.md5 !== undefined) ? data.md5: null;
        data.force = data.force;
        data.amount = data.amount;
        self.trigger.emit('started_crash', data);
    });

    /**
     * Event on waiting game
     * Script Excution from here
     */
    self.ws.on(C.WAITING_CRASH, function (data) {
        data = decode(data);
        self.gameStatus = 'waiting';
        self.time = data.time
        data.md5 = (data.md5 !== undefined) ? data.md5: null;
        data.force = data.force;
        data.amount = data.amount;
        self.trigger.emit('waiting_crash', data);
    });

    /**
     * Event on Error
     */
    self.ws.on(C.ERROR_CRASH, function (data) {
        data = decode(data);
        self.trigger.emit('error_crash', data);
    });
}

/**
 * Add Player for playing game
 */
Engine.prototype.play = function () {
    let self = this;

    if(self.amount < 0.00000010){
        self.amount = forceSatoshiFormat(0.00000010)
    }

    self.ws.emit(C.PLAY_CRASH, encode({
        token: self.token,
        amount: self.amount,
        payout: self.payout,
        coin: 'btc'
    }));
}

/**
 * Payout / Finish Round
 */
Engine.prototype.finish = function (time) {
    let self = this;
    self.ws.emit(C.FINISH_CRASH, encode({
        token: self.token,
        token2: randomString(25) + parseFloat(time).toFixed(2),
    }));
}

/**
 * Get Game Status
 */
Engine.prototype.getStatus = function () {
    let self = this;
    self.ws.emit(C.STATUS_CRASH);
}

/**
 * Get Game Players
 */
Engine.prototype.getPlayers = function () {
    let self = this;
    self.ws.emit(C.PLAYERS_CRASH);
}

/**
 * Get the Game History
 */
Engine.prototype.getHistory = function () {
    let self = this;
    self.ws.emit(C.HISTORY_CRASH);
}

/** Start Engine **/
export default new Engine();