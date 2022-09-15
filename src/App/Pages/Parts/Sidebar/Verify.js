import React from "react";
import { Link } from 'react-router-dom'
import {Modal} from "react-bootstrap";
import SHA256 from "crypto-js/sha256";
import { sendNotfication, Event, wait } from "../../../../Helper";

export default class Verify extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            effect: 'zoomIn',
            called: null,
            generalResult: null,
            color: null,
        };
    }

    componentDidMount() {
        this._isMounted = true;

        Event.on('show_verify', (hash) => {
            this.setState({ show: true, effect: 'zoomIn' });
        })
        
        Event.on('game_verify', (hash) => {
            this.setState({ called: true, show: true, hash: hash, effect: 'zoomIn' });
            let calc = calculateResult(hash, this.props.t);
            this.setState({ generalResult: calc.crash, color: calc.color });
            Event.emit('single_game_modal_close');
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    open = (e) =>{
        e.preventDefault();
        this.setState({ show: true, effect: 'zoomIn' });
    };

    close = (e) =>{
        this.setState({ show: false, effect: 'zoomOut'});
        wait(500).then(() => {
            this.setState({generalResult: null, color: null, called: null, hash: ""});
        })
    };

    submit = e => {
        if(this._isMounted){
            e.preventDefault();
            if(!this.state.hash) return;

            let calc = calculateResult(this.state.hash, this.props.t);
            this.setState({ generalResult: calc.crash, color: calc.color })
        }
    };

    render() {
        const { t } = this.props;
        return(
            <>
                <Link className="nav-link-x" to={'#'} onClick={ e => this.open(e) }>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M436.9 354.4L336 192V96h32V48H144v48h32v96L76.1 354.4C67.7 370.3 63.6 385.8 64 400c1.1 36.5 28.7 64 65.1 64H385c36.3 0 62.1-27.6 63-64 .3-14.2-2.6-29.7-11.1-45.6zM155.1 304l29.5-48h143.1l29.8 48H155.1z"></path></svg>
                    <span className={'menu-name cpt'}>
                        {t('verify_result')}
                    </span>
                </Link>
                <Modal
                    size="sm"
                    centered={true}
                    backdrop={'static'}
                    show={this.state.show}
                    onHide={this.close}
                    aria-labelledby="verify-modal"
                    className={"animated " + this.state.effect}
                >
                    <Modal.Header className={'font-light'}>
                        {t('verify_result')}
                        <button type="button" className="close p-2" onClick={this.close}>
                            <i className={'mdi mdi-close'}/>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        { this.state.called === null &&
                            <p className={'text-white mb-3 font-light font-15 tsn'}>
                                {t('v1')}
                                <br/>
                                {t('v2')}
                            </p>
                        }
                        <form onSubmit={ e => this.submit(e) }>
                            <div className="form-group">
                                <label htmlFor="hash"> <i className={'mdi mdi mdi-code-equal'} /> <span className={'text-warning'}>HASH</span> </label>
                                <input type="text" className={'form-control'} value={ this.state.hash } onChange={ e => this.setState( { hash: e.target.value }) } />
                            </div>

                            { this.state.called === null &&
                                <div className="form-group mt-2 text-center">
                                    <button className={'btn btn-s-2 btn-block'}>{t('check_result')}</button>
                                </div>
                            }
                        </form>
                        {this.state.generalResult &&
                            <div className={'alert text-center text-white bg-' + this.state.color }>
                                    {this.state.generalResult}
                            </div>
                        }
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

function calculateResult(hash, t) {
    if (hash.length !== 64){
        return sendNotfication( t('please_input_valid_game_hash'), 'danger', 'top-center');
    }

    let gameCrash = getGeneralResult(hash);
    let gameDice = getDiceResult(hash);
    let gameRoulette = getRouletteResult(hash);
    let gameHeads = getHeadsResult(hash);
    let gameMine = getMinesResult(hash);

    let color = gameCrash > 1.99 ? 'soft-success' : (gameCrash < 1.99 ? 'soft-danger' : 'soft-danger');

    return { color: color, crash: gameCrash, hash_dice: gameDice, roulette: gameRoulette, heads: gameHeads, mine: gameMine }
}

function getGeneralResult(seed) {
    let hash = SHA256(seed).toString();
    let h = parseInt(hash.slice(0, 13), 16);
    let e = Math.pow(2, 52);
    let result = Math.floor((98 * e) / (e - h));
    let max = (result / 100).toFixed(2);
    return max;
}

function getDiceResult(seed) {
    let hash =  SHA256(seed).toString();
    let h = parseInt(hash.slice(0, 13), 16);
    let e = Math.pow(2, 52);
    let result = Math.floor((98 * e) / (e - h));
    result = (result / 100).toFixed(2);
    result = result * 8880;
    result = result.toFixed(0);
    return result;
}

function getRouletteResult(hash) {
    hash = hash.substring(0, 10);
    var result = parseInt(hash, 16);
    var r = result % 100;
    var color;

    let bets = {
        "green": [2,3,0,1],
        "red": [18, 19,20,21,10,11,12,13,14,15,16,17],
        "black": [8,9,4,5,6,7,]
    };
    if (1 <= r && r < 30) color = "green";
    else if (30 <= r && r < 530) color = "red";
    else if (530 <= r && r < 1000) color = "black";
    return r;
}

function getHeadsResult(hash){
    let key = 10;
        
    let lucky = parseInt(hash.substr(0, key), 16);
        
    let result = 2, c;

    for(var i = 0; i < key; i++){
        c = lucky.toString()[i];
        if(parseInt(c) === 1) result = 1;
        else
        if(parseInt(c) === 2) result = 2;
    }
        
    return result;
}

function getMinesResult(hash){
    var arr = [];
    for(var i = 0; i < 3; i++){
        var r = parseInt(parseInt(hash.substr(i, 5), 16) / 10000);
        r /= 4;
        r = parseInt(r);
        r = Math.max(r, 1);
        if(arr.indexOf(r) === -1)
            arr.push(r);
        else {
            arr.push(r + i);
        }
    }
    return arr;
}