import React from "react";
import {Link} from "react-router-dom";
import {BRAND} from "../../../../Helper";

class Logo extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return(
            <>
                <div className="topbar-left">
                    <Link to="/" className="logo">
                            <span>
                                <img src="/assets/images/logo.png" className="logo-sm" alt="Logo" />
                                <span className={"ml-1 font-25 text-logo"}>
                                    <span>{BRAND}</span>
                                </span>
                            </span>
                    </Link>
                </div>
            </>
        );
    }
}

export default Logo;