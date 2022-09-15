import React, {Component} from "react";
import Scripts from "./Script";
import {Alert} from "react-bootstrap";

class AutoBet extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        let { isLogged } = this.props;
        return <>
            { isLogged ?
                <Scripts/>
                :
                <Alert className="alert-purple text-darker rounded-0 mx-2 mt-4">
                    You most be logged to use this option.
                </Alert>
            }
        </>;
    }
}

export default AutoBet;