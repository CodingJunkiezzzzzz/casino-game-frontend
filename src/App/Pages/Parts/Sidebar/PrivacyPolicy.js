import React from "react";
import {Modal} from "react-bootstrap";
import { Link } from 'react-router-dom'
import {Event} from "../../../../Helper";

export default class PrivacyPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }

    componentDidMount() {
        Event.on('show_privacy', () => {
            this.setState({ show: true, effect: 'pulse' });
        })
    }

    showPrivacy = (e) =>{
        e.preventDefault();
        this.setState({ show: true, effect: 'pulse' });
    };

    closePrivacy = () =>{
        this.setState({ show: false, effect: 'zoomOut'});
    };

    render() {
        return(
            <>
               <Link className="nav-link-x" to={'#'} onClick={this.showPrivacy}>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M168.531 215.469l-29.864 29.864 96 96L448 128l-29.864-29.864-183.469 182.395-66.136-65.062zm236.802 189.864H106.667V106.667H320V64H106.667C83.198 64 64 83.198 64 106.667v298.666C64 428.802 83.198 448 106.667 448h298.666C428.802 448 448 428.802 448 405.333V234.667h-42.667v170.666z"></path>
                     </svg>
                    <span className={'cpt menu-name'}>
                        Privacy Policy
                    </span>
                </Link>
                <Modal
                    size="lg"
                    centered={true}
                    backdrop={'static'}
                    show={this.state.show}
                    onHide={this.closePrivacy}
                    aria-labelledby="general-lg-modal"
                    className={"animated " + this.state.effect}
                >
                    <Modal.Header className={'font-light'}>
                        Privacy Policy
                        <button type="button" className="close p-2" onClick={this.closePrivacy}>
                            <i className={'mdi mdi-close'}/>
                        </button>
                    </Modal.Header>
                    <Modal.Body className={'modal-reader'}>
                        <p className={'text-white font-light mb-2 font-14'}>
                            You hereby acknowledge and accept that if we deem necessary, we are able to collect and otherwise use your personal data in order to allow you access and use of the Websites and in order to allow you to participate in the Games.
                            <br/>
                            We hereby acknowledge that in collecting your personal details as stated in the previous provision, we are bound by the Data Protection Act. We will protect your personal information and respect your privacy in accordance with best business practices and applicable laws.
                            <br/>

                            We will use your personal data to allow you to participate in the Games and to carry out operations relevant to your participation in the Games. We may also use your personal data to inform you of changes, new services and promotions that we think you may find interesting. If you do not wish to receive such direct marketing correspondences, you may opt out of the service.

                            <br/>
                            Your personal data will not be disclosed to third parties, unless it is required by law. As our site business partners or suppliers or service providers may be responsible for certain parts of the overall functioning or operation of the Website, personal data may be disclosed to them. The employees of our site have access to your personal data for the purpose of executing their duties and providing you with the best possible assistance and service. You hereby consent to such disclosures.
                            <br/>

                            We shall keep all information provided as personal data. You have the right to access personal data held by us about you. No data shall be destroyed unless required by law, or unless the information held is no longer required to be kept for the purpose of the relationship.
                            <br/>

                            In order to make your visit to the Websites more user-friendly, to keep track of visits to the Websites and to improve the service, we collect a small piece of information sent from your browser, called a cookie. You can, if you wish, turn off the collection of cookies. You must note, however, that turning off cookies may severely restrict or completely hinder your use of the Websites.
                            <br/>

                            <h4 className="mt-3 pt-3 text-yellow">Cookies Policy</h4>

                            <br/>
                            1.What are cookies?
                            <br/>

                            A cookie is a piece of information in the form of a very small text file that is placed on an internet user's computer. It is generated by a web page server (which is basically the computer that operates the website) and can be used by that server whenever the user visits the site. A cookie can be thought of as an internet user's identification card, which tells a website when the user has returned. Cookies can't harm your computer and we don't store any personally identifiable information about you on any of our cookies.

                            <br/>
                            2.Why do we use cookies on our site?

                            <br/>
                            our site uses two types of cookies: cookies set by us and cookies set by third parties (i.e. other websites or services). our site cookies enable us to keep you signed in to your account throughout your visit and to tailor the information displayed on the site to your preferences.

                            <br/>
                            3.What cookies do we use on our site?

                            <br/>
                            Below is a list of the main cookies set by our site, and what each is used for:

                            <br/>
                            _fp - stores browser's fingerprint. Lifetime: forever.

                            <br/>
                            _t - stores timestamp when user firstly visited site in current browsing session. Needed for unique visits statistic. Lifetime: browsing session.

                            <br/>
                            _r - stores http referrer for current browsing session. Needed in order to external track traffic sources. Lifetime: browsing session.

                            <br/>
                            _c - stores identifier of affiliate campaign. Needed for affiliate statistic. Lifetime: forever.

                            <br/>
                            Cookies set by third parties for wildcard domain: *.our site

                            <br/>
                            Google analytics: _ga, _gat, _gid

                            <br/>
                            Zendesk：__ zlcmid

                            <br/>
                            Cloudflare：__ cfuid

                            <br/>
                            Please keep in mind that some browsers (i.e. chrome on mac) keep background processes running even if no tabs opened due to this session cookies may left set between sessions.
                            <br/>
                            There are also cookies set by third party scripts to their domains.

                            <br/>
                            4.How can I manage my cookies on our site?

                            <br/>
                            If you wish to stop accepting cookies, you can do so through the Privacy Settings option in your browser.

                            <br/>
                            5.Personal Data Protection Policy

                            <br/>
                            our site’s mission is to keep your Data safe and for this matter we protect your data in various ways. We provide our customers with high security standards, such as encryption of data in motion over public networks, encryption of data in database, auditing standards, Distributed Denial of Service mitigations, and a Live Chat available on-site.

                            <br/>
                            6.Server Protection Policy

                            <br/>
                            All servers have full encryption;

                            <br/>
                            All backups have encryption;

                            <br/>
                            Firewalls, VPN Access;

                            <br/>
                            Access to servers allowed only over VPN;

                            <br/>
                            All http/s services work over Cloudflare;

                            <br/>
                            Connections to nodes over VPN;

                            <br/>
                            SSH port forwarding tunnels;

                            <br/>
                            Services allowed only over VPN;

                            <br/>
                            Server have firewall and allowed only SSH port;

                            <br/>
                            Alerts on critical services.

                            <br/>
                            Data Breach Notification

                            <br/>
                            When our site will be made aware of personal data breaches we will notify relevant users in accordance with GDPR timeframes.

                            <br/>
                            7.Data International Transfer

                            <br/>
                            We only disclose personal data to third parties where it is necessary to provide the high-quality service or in order to respond lawful requests from authorities.

                            <br/>
                            We share the following data to third party systems:

                            <br/>
                            Zendesk Inc. – username and e-mail information is transferred if user sends a message to live-chat or sends an e-mail to support mailbox.
                        </p>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}