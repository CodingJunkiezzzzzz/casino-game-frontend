import React from 'react'
import {Row, Col, Card, Modal, Pagination} from "react-bootstrap";
import md5 from "md5";
import GameModal from "../../Components/Game/Stat/Modal";
import {__, isMobile, wait, Event, forceSatoshiFormat} from "../../../Helper";
import C from "../../../Constant";
import storage from "../../../Storage";
import Engine from "./Engine";

class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameRow: [],
            show: false
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleShow(){
        this.setState({ show: true, effect: 'zoomIn' });
    }

    handleClose(){
        this.setState({ show: false, effect: 'zoomOut' });
    }

    render() {
        return <Parent tab={true} clicked={this.handleClose} />;
    }
}

class Parent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            players: [],
            game_id: '',
            numbers: '',
            hash: '',
            md5: ''
        };
    }

    onChange(event, players, hash, md5, game_id, numbers) {
        this.setState({
            md5: md5,
            hash: hash,
            numbers: numbers,
            game_id: game_id,
            players: players,
            color: (numbers >= 1.9 ? 'success' : 'danger')
        });
    }

    render () {
        const { players, hash, md5, game_id, busted } = this.state;
        return <Child tab={this.props.tab} clicked={this.props.clicked.bind(this)} onChange={this.onChange.bind(this, players, hash, md5, game_id, busted)} />
    }
}

class Child extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            engine: Engine,
            loading: true,
            padding: 'p-3',
            token: storage.getKey('token') !== null ? storage.getKey('token') : null,
            historyRow: [],
            players: [],
            posts: [],
            postsLength: 0,
            current_page: 1,
            page: 1,
            perPage: 10,
            ndisabled: false,
            pdisabled: false
        };

        this.prevRef = React.createRef();
        this.nextRef = React.createRef();
    }

    componentDidMount(){
        this._isMounted = true;
        let { engine } = this.state;
        engine.getHistory();
        engine.trigger.on(C.HISTORY_CRASH, (data) => this.gameSync(data));

        if(isMobile()){
            this.setState({ padding: 'p-1' })
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    gameSync(list){
        if (this._isMounted) {

            wait(1000).then(() => {
                this.setState({ loading: false });
            })
    
            let data = list.history;
                data = __.xor(data);

            this.setState({ posts: data });
            this.setState({ postsLength: data.length });

            this.changePage(1);
        }
    }

    numPages = () => {
        return Math.ceil(this.state.postsLength / this.state.perPage);
    }

    prevPage = (e) => {
        e.preventDefault();
        var current_page = this.state.current_page;
        if (current_page > 1) {
            let p = current_page - 1;
            this.setState({ current_page: p })
            this.changePage(p);
        }
    }

    nextPage = (e) => {
        e.preventDefault();
        var current_page = this.state.current_page;
        if (current_page < this.numPages()) {
            let p = current_page + 1;
            this.setState({ current_page: p })
            this.changePage(p);
        }
    }

    changePage = (page) => {
        // Validate page
        if (page < 1) page = 1;
        if (page > this.numPages()) page = this.numPages();

        if(this.state.posts.length === 0) return;

        this.setState({ historyRow: [] });

        for (var i = (page-1) * this.state.perPage; i < (page * this.state.perPage); i++) {
            let array = this.state.posts[i];

            if(!__.isUndefined(array)) {
                let row = <Block key={__.toString(array.gid)} tab={true} clicked={this.props.clicked} array={array} />;
                this.setState(state => ({ historyRow: [row, ...state.historyRow] }));
            }
        }

        this.setState({ page: page })
        
        if (page == 1) {
            this.setState({ pdisabled: true });
        } else {
            this.setState({ pdisabled: false });
        }

        if (page == this.numPages()) {
            this.setState({ ndisabled: true });
        } else {
            this.setState({ ndisabled: false });
        }
    }

    render(){
        return (
            <>
                {this.state.loading ?
                    <div className="text-center">
                        <div className="spinner-grow text-white my-3" role="status"/>
                    </div>
                :
                <>
                    <Row className="px-4 pt-2 mt-4">
                        <Col xs="4" className="text-">Game ID</Col>
                        <Col xs="4" className="text-">Result</Col>
                        <Col xs="4" className="text-center">Hash</Col>
                    </Row>
                     <div className={this.state.padding}>
                        {this.state.historyRow}
                            <ul className="pagination oncenter">
                                <li className="page-item">
                                    <button className="btn bg-cs2 mr-1 btn-xs" role="button" disabled={this.state.pdisabled} onClick={this.prevPage}>Prev</button>
                                </li>
                                <li className="page-item">
                                    <button className="btn bg-cs2 btn-xs" role="button" disabled={this.state.ndisabled} onClick={this.nextPage}>Next</button>
                                </li>
                            </ul>
                            <span className="font-12">
                                Page: <span>{this.state.page}</span>
                            </span>
                    </div>
                </>
                }
            </>
        );
    }
}

class Block extends React.Component {
    verifyHash(hash){
        Event.emit('game_verify', hash)
    }
    render(){
        let { clicked, tab } = this.props;
        let { gid, busted, hash } = this.props.array;

        busted = __.toNumber(busted).toFixed(2);

        let color = (busted >= 1.9 ? 'success' : 'danger');

        return(
            <Row className="mt-1 pt-0">
                <Col xs="4" className="mt-2 text-left">
                    <GameModal clicked={clicked} game_id={gid} title={(gid)} color={color} />
                </Col>
                <Col xs="4" className="mt-2 text-left">
                    <GameModal clicked={clicked} game_id={gid} title={(busted + 'x')} color={color} />
                </Col>
                <Col xs="4" className="mt-1 cpt" onClick={() => { this.verifyHash(hash) }}>
                    <input
                        type="text"
                        className={ "form-control font-10 text-center h-100 no-radius cpt" }
                        value={hash.substr(0,60) + '...'}
                        readOnly={true}
                    />
                </Col>
            </Row>
        );
    }
}

export default History;