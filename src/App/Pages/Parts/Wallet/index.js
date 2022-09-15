import React from "react";
import ReactTooltip from "react-tooltip";
import {Dropdown} from "react-bootstrap";
import Wallet from "../../../Components/User/Wallet";

class Index extends React.Component {
    render() {
        return (
            <>
                <ReactTooltip />
                <li className="dropdown notification-list user-dropdown hide-phone hidden-sm">
                    <Dropdown>
                        <Wallet t={this.props.t} menu={"true"} />
                    </Dropdown>
                </li>
            </>
        );
    }
}

export default Index;