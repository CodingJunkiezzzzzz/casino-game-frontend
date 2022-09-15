import React from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from "react-tooltip";
import PerfectScrollbar from 'perfect-scrollbar';
import Social from "./Social";
import {Event} from "../../../../Helper";
import PrivacyPolicy from "./PrivacyPolicy";
import UserAgreement from "./UserAgreement";
import Verify from "./Verify";

class Menu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            home: false,
			activeHome: true
        };
    }

    componentDidMount() {
        const ps = new PerfectScrollbar('#lss', {
            wheelSpeed: 1,
            suppressScrollX: true,
            wheelPropagation: true,
            minScrollbarLength: 2
        });
        ps.update();
    }

    active = (link) => {
        this.setState({ activeHome: false, activeLive: false, activeAff: false, activeSupport: false, activeGames: false, leaderboard: false });
        this.setState({ [link]: true });
    }

    render(){
        const {t, type} = this.props;
        const location = this.state.home ? 'animated d-none' : 'animated d-min';
        const { activeSupport, activeAff, activeLive, activeHome, activeGames, leaderboard } = this.state;
        return(
                <>
                    {type === 'min' && <ReactTooltip /> }
                    <div id="lss" className="menu-body" onMouseLeave={ () => this.setState({ show: false }) }>
                        <div className="menu-pane">
                            <ul className="nav">
                                <li className={ activeHome ? 'active nav-item' : 'nav-item' } data-tip={ type === 'min' ? 'Crash' : "" }>
                                    <Link onClick={ () => this.active('activeHome') } className="nav-link-x" to={'/'}>
                                        <div className="avatar-box thumb-xs align-self-center mr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 421.6c-18.1 0-33.2-6.8-42.9-10.9-5.4-2.3-11.3 1.8-10.9 7.6l3.5 51c.2 3.1 3.8 4.7 6.3 2.8l14.5-11c1.8-1.4 4.5-.9 5.7 1l20.5 32.1c1.5 2.4 5.1 2.4 6.6 0l20.5-32.1c1.2-1.9 3.9-2.4 5.7-1l14.5 11c2.5 1.9 6.1.3 6.3-2.8l3.5-51c.4-5.8-5.5-10-10.9-7.6-9.8 4.1-24.8 10.9-42.9 10.9z"></path><path d="M397.7 293.1l-48-49.1c0-158-93.2-228-93.2-228s-94.1 70-94.1 228l-48 49.1c-1.8 1.8-2.6 4.5-2.2 7.1L130.6 412c.9 5.7 7.1 8.5 11.8 5.4l67.1-45.4s20.7 20 47.1 20c26.4 0 46.1-20 46.1-20l67.1 45.4c4.6 3.1 10.8.3 11.8-5.4l18.5-111.9c.2-2.6-.6-5.2-2.4-7zM256.5 192c-17 0-30.7-14.3-30.7-32s13.8-32 30.7-32c17 0 30.7 14.3 30.7 32s-13.7 32-30.7 32z"></path></svg>
                                        </div>
                                        <span className="menu-name">Crash</span>
                                     </Link>
                                </li>
                                <li className={ leaderboard ? 'active nav-item' : 'nav-item' } data-tip={ type === 'min' ? 'Leaderboard' : "" }>
                                    <Link onClick={ () => this.active('leaderboard') } className="nav-link-x" to={'/leaderboard'}>
                                        <div className="avatar-box thumb-xs align-self-center mr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M256 372.686L380.83 448l-33.021-142.066L458 210.409l-145.267-12.475L256 64l-56.743 133.934L54 210.409l110.192 95.525L131.161 448z"></path>
                                        </svg>
                                        </div>
                                        <span className="menu-name">Leaderboard</span>
                                     </Link>
                                </li>
                                <li className={ activeAff ? 'active nav-item' : 'nav-item' } data-tip={ type === 'min' ? t('affiliate') : "" }>
                                    <Link onClick={ () => this.active('activeAff') } className="nav-link-x" to={'/affiliate'}>
                                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 176c-44.004 0-80.001 36-80.001 80 0 44.004 35.997 80 80.001 80 44.005 0 79.999-35.996 79.999-80 0-44-35.994-80-79.999-80zm190.938 58.667c-9.605-88.531-81.074-160-169.605-169.599V32h-42.666v33.067c-88.531 9.599-160 81.068-169.604 169.599H32v42.667h33.062c9.604 88.531 81.072 160 169.604 169.604V480h42.666v-33.062c88.531-9.604 160-81.073 169.605-169.604H480v-42.667h-33.062zM256 405.333c-82.137 0-149.334-67.198-149.334-149.333 0-82.136 67.197-149.333 149.334-149.333 82.135 0 149.332 67.198 149.332 149.333S338.135 405.333 256 405.333z"></path></svg>
                                        <span className="menu-name">{t('affiliate')}</span>
                                     </Link>
                                </li>
                                <li className="nav-item" data-tip={ type === 'min' ? t('privacy_policy') : "" }>
                                    <PrivacyPolicy t={t} />
                                </li>
                                <li className="nav-item" data-tip={ type === 'min' ? t('user_agreement') : "" }>
                                     <UserAgreement t={t} />
                                </li>
                                <li className="nav-item" data-tip={ type === 'min' ? t('verify_result') : "" }>
                                  <Verify t={t} />
                                </li>
                                {type !== 'min' &&
                                    <>
                                        <hr className="side-border mx-0" />
                                        <li className="nav-item">
                                            <Social t={t}/>
                                        </li>
                                    </>
                                }
                            </ul>
                        </div>
                    </div>
            </>
        );
    }
}

export default Menu;