import React from "react";
import {connect} from "react-redux";
import {Dropdown} from "react-bootstrap";
import {setCountry} from "../../../../actions/gameChat";
import storage from "../../../../Storage";
import {__} from "../../../../Helper";
import PropTypes from "prop-types";

const list = [
    {name: 'SPAM', code: 'BR'},
    {name: 'GLOBAL', code: 'GLOBAL'}
];

class Country extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            clientCountry: storage.getKey('country') ? storage.getKey('country'): "GLOBAL",
            countries: []
        }
    }

    componentDidMount() {
        list.forEach((country, i) => {
            this.setState(state => ({ countries: [<Flag key={i} country={country} redux={this.props} />, ...state.countries] }));
        });
    }

    render() {
        let { country } = this.props;
        let current = country ? country: this.state.clientCountry;
        return (
            <>
                <li className={'float-left'}>
                    <Dropdown className={""}>
                        <Dropdown.Toggle variant="button" className={'btn nohv btn-soft-light btn-xs p-0'}>
                            <span className={'font-12 mt-3 d-inline-block'}>{current}</span>
                            <img src={'/assets/images/flags/' + current + '.svg'} className="ml-2 rounded" height="18" alt=""/>
                            <span className="caret"></span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className={"dopdown-menu-right"}>
                            {this.state.countries}
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
            </>
        );
    }
}

class Flag extends React.Component {
    selectCountry(name){
        name = __.toUpper(name);
        storage.setKey('country', name);
        this.props.redux.setCountry(name);
    }
    render() {
        let { key } = this.props
        let { name } = this.props.country;
        return (
            <Dropdown.Item key={__.toString(key)} onClick={(e) => this.selectCountry(name)} className={'animated fadeIn'}>
                <span className={'d-block ml-2'}>
                    <img src={'/assets/images/flags/' + name + '.svg'} className="mr-1" height="12" alt="Room"/>
                    {name}
                </span>
            </Dropdown.Item>
        );
    }
}

Country.propTypes = {
    country: PropTypes.func
};

const mapStateToProps = state => ({
    country: state.items.country
});

export default connect(mapStateToProps, { setCountry })(Country);