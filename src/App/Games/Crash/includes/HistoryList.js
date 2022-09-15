import React from "react";
import GameModal from "../../../Components/Game/Stat/Modal";
import storage from "../../../../Storage";
import C from "../../../../Constant";
import Engine from "../Engine";
import {__, isMobile} from "../../../../Helper";

class HistoryList extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            games: [],
            name: storage.getKey('name'),
            token: storage.getKey('token'),
            game: this.props.game,
            gameRow: [],
            engine: Engine
        };
    }

    componentDidMount() {
        let { engine } = this.state;
        engine.trigger.on("busted_crash", data => this.busted(data));
        engine.trigger.on("game_status", data => this.gameSync(data));
    }

    busted(data){
        let busted  = (data.amount/100).toFixed(2);
        let color   = (busted >= 1.9 ? 'bg-succes-3' : 'bg-danger');
        
        if(isMobile()){
            if(this.state.gameRow.length === 4){
                this.state.gameRow.shift();
            }
        }
        else {
            if(this.state.gameRow.length === 10){
                this.state.gameRow.shift();
            }
        }

        let add = this.state.gameRow.concat([
            <li className={color}>
                <GameModal color={color} title={busted} game_id={data.game_id} font={13} />
            </li>
        ]);

        this.setState({ gameRow: add });
    }

    gameSync(list){
        if(list.crashes === undefined) return;
        if(list.crashes.length === 0) return;

        __.reverse(list.crashes).forEach((array, i) => {
            if(i < 10){
                let busted  = (array.amount/100).toFixed(2);
                let color   = (busted >= 1.9 ? 'bg-succes-3' : 'bg-danger');
                let row = <li className={color}>
                    <GameModal key={i} color={color} title={busted} game_id={array.game_id} font={13} />
                </li>;
                this.setState(state => ({ gameRow: [row, ...state.gameRow] }));
            }
        });
    }

    render () {
        if(isMobile()){
            if(this.state.gameRow.length >= 4)
                this.state.gameRow.length = 4;
        }
        else {
            if(this.state.gameRow.length >= 10)
                this.state.gameRow.length = 10;
        }
        return(
            <div className="nav font-14 font-weight-bold mybets">
                <ul>
                    {this.state.gameRow}
                </ul>
            </div>

        );
    }
}

export default HistoryList;