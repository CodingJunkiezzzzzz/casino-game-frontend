import React from 'react'
import {ButtonGroup, Row, Col} from "react-bootstrap";
import User from "./../User";
import Credit from "./../Credit";
import CreditMobile from "./../Credit/Mobile";
import Logo from "./../Logo";
import Chat from "./../Chat";
import RealTime from "./../RealTime";
import MobileMenu from "./../Menu/MobileMenu";
import Notifications from "./../Notification";
import {isMobile, Event, BRAND} from "../../../../Helper";

class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            header: null,
            show: true
        }
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize(){
        if(!isMobile()){
            this.setState({ header: this.desktop() })
        }
        else {
            this.setState({ header: this.mobile() })
        }
    }

    collapse = () =>{
        this.setState({ show: !this.state.show })
        Event.emit('toggle_sidebar', this.state.show);
    }

    desktop = () => {
        const { t } = this.props;
        return (
            <div className="topbar" id={'topbar'}>
                    <nav className="navbar-custom">
                        <RealTime t={t} />
                        <Row>
                            <Col md="5" sm="6">
                                <Logo brand={BRAND} />
                                <ul class="list-unstyled topbar-nav mb-0">
                                    <li>
                                        <button class="button-menu-mobile nav-link hidden-sm" onClick={this.collapse}>
                                            <i class="dripicons-menu nav-icon"></i>
                                         </button>
                                    </li>
                                </ul>
                            </Col>
                            <Col md="4" sm="6">
                                <Credit t={t} />
                            </Col>
                            <Col md="2" sm="6">
                                <ButtonGroup>
                                    <User t={t}/>
                                    <Notifications t={t} />
                                </ButtonGroup>
                            </Col>
                            <Col md="1" sm="6">
                              <ul className="list-unstyled topbar-nav mb-0 mr-1 float-right">
                                    <ButtonGroup>
                                        <Chat t={t} />
                                    </ButtonGroup>
                                </ul>
                            </Col>
                        </Row>
                    </nav>
                </div>
        );
    }

    mobile = () => {
        const { t } = this.props;
        return (
                <div className="topbar" id={'topbar'}>
                    <Logo brand={BRAND} />
                    <nav className="navbar-custom">
                        <MobileMenu t={t}/>
                        <ul className="list-unstyled topbar-nav float-right mb-0 mr-1">
                            <RealTime t={t} />
                            <CreditMobile t={t} />
                            <ButtonGroup>
                                <User t={t}/>
                                <Chat t={t} />
                            </ButtonGroup>
                        </ul>
                    </nav>
                </div>
        );
    }

    render() {
        return this.state.header;
    }
}

export default Header;