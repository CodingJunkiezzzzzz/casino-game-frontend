import React from "react";
import {Card, Col, Dropdown, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { __, isMobile, wait, BRAND } from "../../../../Helper";

class MobileMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false
        }
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        wait(500).then(() => {
            this.handleResize();
        });
        window.addEventListener('resize', this.handleResize);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize(){
        if(isMobile()){
            this.setState({ show: true });
        }
        else {
            this.setState({ show: false });
        }
    }

    render() {
        return (
            <>
                { this.state.show &&
                <ul className="list-unstyled topbar-nav mb-0 menu-items">
                    <MobileDrawer t={this.props.t}/>
                </ul>
                }
            </>
        );
    }
}

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    drawer: {
        color: '#FFF',
        background: 'rgb(29 44 49 / 91%)',
    },
    logo: {
        margin: 0,
        padding: '10px 12px 0',
        background: 'rgb(29 44 49 / 91%)',
        borderBottom: '1px solid #555'
    },
    links: {
        marginTop: 5,
        padding: '10px 12px',
        display: 'block',
        background: 'rgb(29 44 49 / 91%)'
    }
});

function MobileDrawer(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        left: false
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const anchor = 'left';
    const { t } = props;
    
    return (
        <>
            <React.Fragment key={anchor}>
                <li className={'nav-link ml-3'} onClick={toggleDrawer(anchor, true)}>
                    <i className={'mdi mdi-menu text-white font-20'} />
                </li>
                <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                    <ul className={clsx(classes.logo)}>
                        <li>
                            <Link to="/" className="logo">
                                <span>
                                    <img src="/assets/images/logo.png" alt="logo-small" className="logo-50" />
                                    <b className="text-white font-20 d-inline-block">{t('brand')}</b>
                                </span>
                            </Link>
                        </li>
                        <li className="d-block">
                            <Link to="/leaderboard" className={clsx(classes.links)}>
                                <span>
                                  {t('leaderboard')}
                                </span>
                            </Link>
                        </li>
                        <li className="d-block">
                            <Link to="/affiliate" className={clsx(classes.links)}>
                                <span>
                                  {t('affiliate')}
                                </span>
                            </Link>
                        </li>
                        <li className="d-block">
                            <Link to="/support" className={clsx(classes.links)}>
                                <span>
                                   {t('support')}
                                </span>
                            </Link>
                        </li>
                    </ul>
                </Drawer>
            </React.Fragment>
        </>
    );
}

export default MobileMenu;