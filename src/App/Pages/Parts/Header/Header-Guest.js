import React from 'react'
import { Dropdown } from "react-bootstrap";
import Login from "../../Auth/Login";
import Chat from "./../Chat";
import Logo from "./../Logo";
import Register from "../../Auth/Register";
import {Event, BRAND} from "../../../../Helper";

var show = true;

class Header extends React.Component {
    collapse = () =>{
        show = !show;
        Event.emit('toggle_sidebar', show);
    }
    render() {
        const { t } = this.props;
        return (
                        <div className="topbar" id={'topbar'}>
                            <Logo brand={BRAND} />
                            <nav className="navbar-custom">
                                <ul className="list-unstyled topbar-nav float-right mb-0 ml-auto">
                                    <li className={"guest-dropdown mt-1"}>
                                        <Dropdown>
                                            <Dropdown.Toggle split variant="" id="dropdown-split-user">
                                                <img src="/assets/images/avatar.svg" alt="profile-user" className="rounded-circle w-40" />
                                                <span className="ml-1 nav-user-name hidden-sm">{t('login_register')} <span className="caret"></span> </span>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className={"droper"}>
                                                <Dropdown.Item as={'button'} className={"btn animated fadeIn"}>
                                                    <Login t={t} />
                                                </Dropdown.Item>
                                                <Dropdown.Item as={'button'} className={"btn animated fadeIn"}>
                                                    <Register t={t} />
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </li>
                                    <li className={"chat-sidebar"}>
                                        <Chat t={t} location={this.props.location} />
                                    </li>
                                </ul>
                                <ul className="list-unstyled topbar-nav mb-0">
                                    <li>
                                        <button className="button-menu-mobile nav-link hidden-sm" onClick={this.collapse}>
                                            <i className="dripicons-menu nav-icon"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
        );
    }
}

export default Header;