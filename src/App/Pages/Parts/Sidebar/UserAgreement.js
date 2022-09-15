import React from "react";
import {Modal} from "react-bootstrap";
import { Link } from 'react-router-dom'
import {Event} from "../../../../Helper";

export default class UserAgreement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }

    componentDidMount() {
        Event.on('show_agreement', () => {
            this.setState({ show: true, effect: 'pulse' });
        })
    }

    showUserAgg = (e) =>{
        e.preventDefault();
        this.setState({ show: true, effect: 'pulse' });
    };

    closeAgg = () =>{
        this.setState({ show: false, effect: 'zoomOut'});
    };

    render() {
        return(
            <>
               <Link className="nav-link-x" to={'#'} onClick={this.showUserAgg}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M428 269c-21.5 0-40.6 13.1-48.4 33h-41.2L307 221.3c-2.7-8.2-10.3-13.7-19-13.7h-.4c-8.8.2-16.4 6-18.8 14.5l-33.6 135.4-55.5-291.8C178 55.6 169.6 48 160 48c-9.5 0-16.9 6.2-19.4 16.2L90.3 302H32v40h74c9.2 0 17.2-6.2 19.4-15.2l30.7-160.6 54.1 282.1c1.5 8.8 8.9 15.1 18.6 15.7h1.2c9.3 0 16.9-5.3 19.2-13.5l40.2-162.9 15.5 40.7c2.7 8.2 10.3 13.7 19 13.7h56.4c8.3 19 27.1 31 47.6 31 13.9 0 26.9-5.6 36.8-15.8 9.8-10.1 15.2-23.3 15.2-37.2.1-28.6-22.7-51-51.9-51z"></path></svg>
                    <span className={'cpt menu-name'}>
                        User Agreement
                    </span>
                </Link>
                <Modal
                    size="lg"
                    centered={true}
                    backdrop={'static'}
                    show={this.state.show}
                    onHide={this.closeAgg}
                    aria-labelledby="general-lg-modal"
                    className={"animated " + this.state.effect}
                >
                    <Modal.Header className={'font-light'}>
                        User Agreement
                        <button type="button" className="close p-2" onClick={this.closeAgg}>
                            <i className={'mdi mdi-close'}/>
                        </button>
                    </Modal.Header>
                    <Modal.Body className={'modal-reader'}>
                        <p className={'text-white font-light font-14'}>
                            1. General
                            <br/>
                            1.1. These User Agreement apply to the usage of games accessible through www.our site.
                            <br/>

                            1.2. These User Agreement come into force as soon as you complete the registration process, which includes checking the box accepting these User Agreement and successfully creating an account. By using any part of the Website following account creation, you agree to these User Agreement.
                            <br/>

                            1.3. You must read these User Agreement carefully in their entirety before creating an account. If you do not agree with any provision of these User Agreement, you must not create an account or continue to use the Website.
                            <br/>

                            1.4. We are entitled to make amendments to these User Agreement at any time and without advanced notice. If we make such amendments, we may take appropriate steps to bring such changes to your attention (such as by email or placing a notice on a prominent position on the Website, together with the amended User Agreement) but it shall be your sole responsibility to check for any amendments, updates and/or modifications. Your continued use of our site services and Website after any such amendment to the User Agreement will be deemed as your acceptance and agreement to be bound by such amendments, updates and/or modifications.
                            <br/>

                            1.5. These User Agreement may be published in several languages for informational purposes and ease of access by players. The English version is the only legal basis of the relationship between you and us and in the case of any discrepancy with respect to a translation of any kind, the English version of these User Agreement shall prevail.
                            <br/>

                            2.2. Binding Declarations
                            <br/>
                            2.1. By agreeing to be bound by these User Agreement, you also agree to be bound by the our site Rules and Privacy Policy that are hereby incorporated by reference into these User Agreement. In the event of any inconsistency, these User Agreement will prevail. You hereby represent and warrant that:
                            <br/>

                            2.2. You are over (a) 18 or (b) such other legal age or age of majority as determined by any laws which are applicable to you, whichever age is greater;

                            <br/>
                            2.3. You have full capacity to enter into a legally binding agreement with us and you are not restricted by any form of limited legal capacity;

                            <br/>
                            2.4. All information that you provide to us during the term of validity of this agreement is true, complete, correct, and that you shall immediately notify us of any change of such information;
                            <br/>

                            2.5. You are solely responsible for reporting and accounting for any taxes applicable to you under relevant laws for any winnings that you receive from us;

                            <br/>
                            2.6. You understand that by using our services you take the risk of losing money deposited into your Member Account and accept that you are fully and solely responsible for any such loss;
                            <br/>

                            2.7. You are permitted in the jurisdiction in which you are located to use online casino services;

                            <br/>
                            2.8. In relation to deposits and Withdraws of funds into and from your Member Account, you shall only use Ethereum that are valid and lawfully belong to you;

                            <br/>
                            2.9. You understand that the value of Ethereum can change dramatically depending on the market value;

                            <br/>
                            2.10. The computer software, the computer graphics, the Websites and the user interface that we make available to you is owned by our site or its associates and is protected by copyright laws. You may only use the software for your own personal, recreational uses in accordance with all rules, User Agreement we have established and in accordance with all applicable laws, rules and regulations;
                            <br/>

                            2.11. You understand that Ethereum is not considered a legal currency or tender and as such on the Website they are treated as virtual funds with no intrinsic value.

                            <br/>
                            2.12. You affirm that you are not an officer, director, employee, consultant or agent of our site or working for any company related to our site, or a relative or spouse of any of the foregoing;
                            <br/>

                            2.13. You are not diagnosed or classified as a compulsive or problem gambler. We are not accountable if such problem gambling arises whilst using our services, but will endeavour to inform of relevant assistance available. We reserve the right to implement cool off periods if we believe such actions will be of benefit.

                            <br/>
                            2.14. You accept and acknowledge that we reserve the right to detect and prevent the use of prohibited techniques, including but not limited to fraudulent transaction detection, automated registration and signup, gameplay and screen capture techniques. These steps may include, but are not limited to, examination of Players device properties, detection of geo-location and IP masking, transactions and blockchain analysis;
                            <br/>

                            2.15. You accept our right to terminate and/or change any games or events being offered on the Website, and to refuse and/or limit bets.

                            <br/>
                            2.16. You accept that we have the right to ban/block multiple accounts and freely control the assets in such accounts.

                            <br/>
                            3. RESTRICTED TERRITORIES
                            3.1. Blacklisted Territories: China,Netherlands, Dutch Caribbean Islands, Curacao, France, United States and/or any other restricted by law country or state. Note that it is strictly forbidden to play on our site games in blacklisted countries mentioned above.your personal data for the purpose of executing their duties and providing you with the best possible assistance and service. You hereby consent to such disclosures.

                            <br/>
                            4. General Betting Rules
                            <br/>
                            4.1. A bet can only be placed by a registered account holder.
                            <br/>

                            4.2. A bet can only be placed over the internet.
                            <br/>

                            4.3. You can only place a bet if you have sufficient Ethereum in your account with our site.
                            <br/>

                            4.4. The bet, once concluded, will be governed by the version of the User Agreement valid and available on the Website at the time of the bet being accepted.

                            <br/>
                            4.5. Any payout of a winning bet is credited to your account, consisting of the stake multiplied by the odds at which the bet was placed.

                            <br/>
                            4.6. our site reserves the right to adjust a bet payout credited to a our site account if it is determined by our site in its sole discretion that such a payout has been credited due to an error.
                            <br/>

                            4.7. A bet, which has been placed and accepted, cannot be amended, withdrawn or cancelled by you.

                            <br/>
                            4.8. The list of all the bets, their status and details are available to you on the Website.

                            <br/>
                            4.9. When you place a bet you acknowledge that you have read and understood in full all of these User Agreement regarding the bet as stated on the Website.

                            <br/>
                            4.10. our site manages your account, calculates the available funds, the pending funds, the betting funds as well as the amount of winnings. Unless proven otherwise, these amounts are considered as final and are deemed to be accurate.
                            <br/>

                            4.11. You are fully responsible for the bets placed.
                            <br/>

                            4.12. Winnings will be paid into your account after the final result is confirmed.
                            <br/>

                            5. Bonuses and Promotions
                            <br/>
                            5.1. our site reserves the right to cancel any promotion, bonus or bonus program (including, but not limited to top-up rewards, invite friends to reward bonuses and loyalty programs) with immediate effect if we believe the bonus has been set up incorrectly or is being abused, and if said bonus has been paid out, we reserve the right to decline any Withdraw request and to deduct such amount from your account. Whether or not a bonus is deemed to be set up incorrectly or abused shall be determined solely by our site.
                            <br/>

                            5.2. If you use a Deposit Bonus, no Withdraw of your original deposit will be accepted before you have reached the requirements stipulated under the User Agreement of the Deposit Bonus.
                            <br/>

                            5.3. Where any term of the offer or promotion is breached or there is any evidence of a series of bets placed by a customer or group of customers, which due to a deposit bonus, enhanced payments, free bets, risk free bets or any other promotional offer results in guaranteed customer profits irrespective of the outcome, whether individually or as part of a group, our site reserves the right to reclaim the bonus element of such offers and in their absolute discretion either settle bets at the correct odds, void the free bet bonus and risk free bets or void any bet funded by the deposit bonus. In addition, our site reserves the right to levy an administration charge on the customer up to the value of the deposit bonus, free bet bonus, risk free bet or additional payment to cover administrative costs. We further reserve the right to ask any customer to provide sufficient documentation for us to be satisfied in our absolute discretion as to the customer's identity prior to us crediting any bonus, free bet, risk free bet or offer to their account.
                            <br/>

                            5.4. All our site offers are intended for recreational players and our site may in its sole discretion limit the eligibility of customers to participate in all or part of any promotion.
                            <br/>

                            5.5. our site reserves the right to amend, cancel, reclaim or refuse any promotion at its own discretion.

                            <br/>
                            5.6. Bonuses can only be received once per person/account, family, household, address, e-mail address, IP addresses and environments where computers are shared (university, fraternity, school, public library, workplace, etc.). The Operator reserves the right to close your account and confiscate any existing funds if evidence of abuse/fraud is found.

                            <br/>
                            5.7. You acknowledge and understand that separate User Agreement exist with respect to promotions, bonuses and special offers, and are in addition to these User Agreement. These User Agreement are set forth in the respective content page on this website, or have been made available to you personally, as the case may be. In the event of a conflict between the provisions of such promotions, bonuses and special offers, and the provisions of these User Agreement, the provisions of such promotions, bonuses and special offers will prevail.

                            <br/>
                            5.8. We may insist that you bet a certain amount of your own deposit before you can bet with any free/bonus funds we credit to your account.

                            <br/>
                            5.9. You accept that certain promotions may be subject to Withdraw restrictions and/or requirements which need to be met before funds credited under the promotion can be withdrawn. Such terms shall be duly published and made available as part of the promotion. If you opt to make a Withdraw before the applicable wagering requirements are fulfilled, we will deduct the whole bonus amount as well as any winnings connected with the use of the bonus amounts before approving any Withdraw.
                            <br/>

                            6. Live Chat
                            <br/>
                            6.1. As part of your use of the Website we may provide you with a live chat facility, which is moderated by us and subject to controls. We reserve the right to review the chat and to keep a record of all statements made on the facility. Your use of the chat facility should be for recreational and socialising purposes.
                            <br/>

                            6.2. We have the right to remove the chat room functionality or immediately terminate your Member Account and refund your account balance if you:

                            <br/>
                            (a) make any statements that are sexually explicit or grossly offensive, including expressions of bigotry, racism, hatred or profanity;

                            <br/>
                            (b) make statements that are abusive, defamatory or harassing or insulting;

                            <br/>
                            (c) use the chat facility to advertise, promote or otherwise relate to any other online entities;

                            <br/>
                            (d) make statements about our site, or any other Internet site(s) connected to the Website that are untrue and/or malicious and/or damaging to our site;

                            <br/>
                            (e) user the chat facility to collude, engage in unlawful conduct or encourage conduct we deem seriously inappropriate. Any suspicious chats will be reported to the competent authority.
                            <br/>

                            6.3. Live Chat is used as a form of communication between us and you and should not be copied or shared with any forums or third parties.

                            <br/>
                            7. Limitation of Liability
                            <br/>
                            7.1. You enter the Website and participate in the Games at your own risk. The Websites and the Games are provided without any warranty whatsoever, whether expressed or implied.
                            <br/>

                            7.2. Without prejudice to the generality of the preceding provision, we, our directors, employees, partners, service providers

                            <br/>
                            7.3. Do not warrant that the software, Games and the Websites are fit for their purpose;

                            <br/>
                            7.4. Do not warrant that the software, Games and the Websites are free from errors;

                            <br/>
                            7.5. Do not warrant that the software, Games and the Websites will be accessible without interruptions

                            <br/>
                            7.6. Shall not be liable for any loss, costs, expenses or damages, whether direct, indirect, special, consequential, incidental or otherwise, arising in relation to your use of the Websites or your participation in the Games.
                            <br/>

                            7.7. You understand and acknowledge that, if there is a malfunction in a Game or its interoperability, any bets made during such a malfunction shall be void. Funds obtained from a malfunctioning Game shall be considered void, as well as any subsequent game rounds with said funds, regardless of what Games are played using such funds.
                            <br/>

                            7.8. You hereby agree to fully indemnify and hold harmless us, our directors, employees, partners, and service providers for any cost, expense, loss, damages, claims and liabilities howsoever caused that may arise in relation to your use of the Website or participation in the Games.
                            <br/>

                            7.9. To the extent permitted by law, our maximum liability arising out of or in connection with your use of the Websites, regardless of the cause of actions (whether in contract, tort, breach of warranty or otherwise), will not exceed €100.
                            <br/>

                            8. Breaches, Penalties and Termination
                            <br/>
                            8.1. If you breach any provision of these User Agreement or we have a reasonable ground to suspect that you have breached them, we reserve the right to not open, to suspend, or to close your Member Account, or withhold payment of your winnings and apply such funds to any damages due by you.
                            <br/>
                        </p>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}