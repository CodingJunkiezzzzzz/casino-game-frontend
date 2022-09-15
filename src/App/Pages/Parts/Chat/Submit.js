import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import socket from "../../../../Socket";
import storage from "../../../../Storage";
import { encode, __, Event} from "../../../../Helper";
import C from "../../../../Constant";

class Submit extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            message: '',
            token: storage.getKey('token'),
            country: storage.getKey('country') ? storage.getKey('country'): "GLOBAL"
        }
    }

    componentDidMount() {
        Event.on('call_user', data => {
            this.setState({ message: data })
        });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.country){
            this.setState({ country: nextProps.country })
        }
    }

    handleChange = (e) => {
        let target = e.target;
        let value = target.value;
        let name = target.name;
        this.setState({ [name]: value });
    };

    submit = (e) => {
        e.preventDefault();

        if(this.state.message.trim() === '')
            return;

        var c = this.state.country;
        
        socket.emit(C.ADD_CHAT, {
            token: this.state.token,
            message: this.state.message,
            country: c
        });

        this.setState({ message: '' });
        Event.emit('scrolldone');
    };

    handleSubmit = (e) => {
        let char = e.which || e.keyCode;
        if(char === 13){
            this.submit(e);
        }
    };

    render() {
        const { t } = this.props;
        return (
            <>
                <div className="chat-input">
                    <form onKeyPress={ e =>  this.handleSubmit(e)}>
                        <div className="form-group mb-0">
                            <div className="input-group">
                                
                                { (this.state.token !== null) ?
                                    <>
                                        <textarea style={{background:'#2f3138', color: '#F8F8F8', fontSize: 12 }}
                                         onChange={this.handleChange} autoComplete={'off'} name={'message'} 
                                        className="form-control" placeholder={t('message')} value={this.state.message} />
                                    </>
                                    :
                                    <>
                                        <textarea style={{background:'#2f3138', color: '#F8F8F8', fontSize: 12 }}
                                        disabled={true} autoComplete={'off'} className="form-control" placeholder={t('message')} value={t('please_login_to_use_chat')} />
                                    </>
                                }
                                {/*
                                    <Gif />
                                */}
                                <span className="input-group-append">
                                    <button className="btn btn-send-chat" type="submit" onClick={e => this.submit(e)}>
                                        <i className={"mdi mdi-send align-middle"} />
                                    </button>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </>
        );
    }
}

Submit.propTypes = {
    name: PropTypes.string,
    country: PropTypes.string,
};

const mapStateToProps = state => ({
    name: state.items.name,
    country: state.items.country,
});

export default connect(mapStateToProps, {})(Submit);