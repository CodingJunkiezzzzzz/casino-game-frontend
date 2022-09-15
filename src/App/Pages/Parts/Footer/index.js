import React from 'react';
import {Row, Col, Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import {Event, BRAND} from "../../../../Helper";

export default class Footer extends React.Component {
    
    userAgreement = () => {
        Event.emit('show_agreement');
    }

    privacyPolicy = () => {
        Event.emit('show_privacy');
    }

    verify = () => {
        Event.emit('show_verify');
    }

    render(){
        const { t } = this.props;
        return(
            <>
                <footer className="bgame-footer font-light bg-footer dtw hidden-sm">
                    <Row>
                        <Col md={6} className="">
                            <ul>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="#" onClick={this.privacyPolicy}>Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link to="#" onClick={this.userAgreement}>User Agreement</Link>
                                </li>
                            </ul>
                        </Col>
                        <Col md={6} className="">
                             <ul>
                                <li>
                                    <Link to="/affiliate">Affiliate</Link>
                                </li>
                                <li>
                                    <Link to="#" onClick={this.verify}>Verify Result</Link>
                                </li>
                                <li>
                                    <Link to="/support">Support</Link>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} md={12} className="text-center">
                            <span className="ml-5 my-3 d-block text-upper">{t('brand')} - All rights reserved</span>
                        </Col>
                    </Row>
                </footer>
            </>
        );
    }
}