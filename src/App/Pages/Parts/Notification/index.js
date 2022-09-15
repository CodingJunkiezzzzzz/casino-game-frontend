import React from "react";
import ReactTooltip from "react-tooltip";
import {Modal} from "react-bootstrap";
import Main from "./Notifications";
import {Event, fixDate} from "../../../../Helper";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

class Notifications extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            data: {
                title: null,
                date: null,
                content: null
            }
        };
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount(){
        Event.on('show_notify', data => this.showNotification(data));
    }

    showNotification = (data) => {
        this.setState({ show: true, effect: 'zoomIn', data: data });
    }

    handleClose() {
        this.setState({ show: false, effect: 'zoomOut' });
    }

    render() {
        let { title, date, content } = this.state.data;
        return (
            <>
                <ReactTooltip />
                <li className="dropdown notification-list user-dropdown" data-tip={'Notifications'}>
                    <Slide />
                </li>
                <Modal
                    size="md"
                    centered={true}
                    backdrop={'static'}
                    show={this.state.show}
                    onHide={this.handleClose}
                    aria-labelledby="notice-md-modal"
                    className={"animated " + this.state.effect}
                >
                    <Modal.Header>
                        {title}
                        <button type="button" className="close" onClick={this.handleClose}>
                            <i className={'mdi mdi-close'}/>
                        </button>
                    </Modal.Header>
                    <Modal.Body className={'font-light'}>
                        {content}
                        <hr/>
                        {fixDate(date)}
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

const useStyles = makeStyles({
  list: {
    width: 330,
    fontFamily: "Titillium Web"
  }
});

function Slide() {
  const classes = useStyles();
  const [state, setState] = React.useState({ right: false });
  
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <>
    <h6 className="dropdown-item-text px-2 nttitle">
        Notifications
    </h6>
    <div className={clsx(classes.list, {anchor})}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
    >
    <div className="notification-list">
        <Main />
    </div>
    </div>
    </>
  );

  const anchor = 'right';

  return (
    <div>
        <React.Fragment key={anchor}>
          <button className="dropdown-toggle dropdown-toggle-split btn btn-user mt-2 py-1-5 notif-btn" onClick={toggleDrawer(anchor, true)}>
             <i className="dripicons-bell noti-icon" />
          </button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
    </div>
  );
}

export default Notifications;