import React from 'react'
import { Link } from 'react-router-dom'
import Menu from "./Menu";
import {Event} from "../../../../Helper";

class SideBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: true
        };
    }

    componentDidMount() {
        Event.on('toggle_sidebar', () => {
            this.setState({ show: !this.state.show });
        })
    }

    render(){
        const { t } = this.props;
        return(
            <>  
                <div className={ this.state.show ? 'left-sidenav big' : 'left-sidenav min'}>
                    <div className={ this.state.show ? 'left-sidebar big' : 'left-sidebar min'}>
                        <Menu t={t} type={ this.state.show ? 'big' : 'min'} />
                    </div>
                </div>
            </>
        );
    }
}

export default SideBar;