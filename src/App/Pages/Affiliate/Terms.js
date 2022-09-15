import React from "react";
import { Modal } from "react-bootstrap";
import { BRAND } from "../../../Helper";

export default class Terms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  handleShow = () => {
    this.setState({ show: true, effect: "zoomIn" });
  };

  handleClose = () => {
    this.setState({ show: false, effect: "zoomOut" });
  };

  render() {
    return (
      <>
        <button
          onClick={this.handleShow}
          className={"btn btn-white btn-sm text-dark font-weight-bold"}
        >
          <i className="mdi mdi-alert-circle-outline align-middle font-14 mr-1" />
          Affiliate Terms
        </button>
        <Modal
          size="lg"
          backdrop="static"
          centered={true}
          show={this.state.show}
          onHide={this.handleClose}
          aria-labelledby="affiliate-lg-modal"
          className={"animated " + this.state.effect}
        >
          <Modal.Header className={"font-light"}>
            Affiliate Terms
            <button type="button" className="close" onClick={this.handleClose}>
              <i className={"mdi mdi-close"} />
            </button>
          </Modal.Header>
          <Modal.Body className={"modal-reader"}>
            <p className={"text-white font-light mb-2 font-14"}>
              The website is supported by the {BRAND} prediction platform.
              Platform games include crash, dice and so on.
              <br />
              By completing the {BRAND} Affiliate Program (the "Affiliate
              Program") application and clicking "I agree to the Terms and
              Conditions (the “Terms”)” within the registration form, you
              (hereinafter the "Affiliate") hereby agree to abide by all the
              terms and conditions set out in this Agreement. The commission
              structure of the "commission rules" is also an integral part of
              this agreement. {BRAND} reserves the right to amend, alter, delete
              or extend any provisions of this Agreement, at any time and at its
              sole discretion, without giving any advance notice to the
              Affiliate subject to the Terms set out in this Agreement. You
              hereby agree to:
              <br />
              1. Participate in the Affiliate Program
              <br />
              2. Use of the {BRAND} affiliate website and/or {BRAND} marketing
              tools (as hereafter defined).
              <br />
              3. The condition that the acceptance of any affiliate commissions
              from {BRAND} confirms your irrevocable acceptance of this
              Agreement and any modifications thereto.
              <br />
              Therefore you shall be obliged to continuously comply with the
              Terms of this Agreement as well as to comply with the General
              Terms and Conditions and Privacy Policy of the website {BRAND}, as
              well as with any other rules and/or guidelines brought forward
              from time to time. An Agreement between the Company and the
              Affiliate comes into effect on the date the affiliate application
              is approved.
              <br />
              1. Purpose
              <br />
              1.1. The Affiliate maintains and operates one or more websites on
              the Internet (hereinafter collectively referred to as "the
              Website"), and/or refers potential customers through other
              channels.
              <br />
              1.2. This Agreement governs the terms and conditions which are
              related to the promotion of the website {BRAND} by the Affiliate,
              hereinafter referred to as "{BRAND}", whereby the Affiliate will
              be paid a commission as defined in this Agreement depending on the
              traffic sent to {BRAND} and the terms of this Agreement.
              <br />
              1.3. The definition of the term Net Gaming Revenue can be found
              within Article 20 of this Agreement. In case of an introduction of
              another product, or group of products in the future, {BRAND}{" "}
              reserves the right to use an individual definition of the term Net
              Gaming Revenue for each product.
              <br />
              2. Acceptance of an Affiliate
              <br />
              2.1. The Company reserves the right to refuse any registration in
              its sole and absolute discretion.
              <br />
              3. Qualifying Conditions
              <br />
              3.1. The Affiliate hereby warrants that he/she:
              <br />
              a) Is of legal age in the applicable jurisdiction in order to
              agree to and to enter into an Agreement.
              <br />
              b) Is competent and duly authorized to enter into binding
              Agreements.
              <br />
              c) Is the proprietor of all rights, licences and permits to
              market, promote and advertise {BRAND} in accordance with the
              provisions of this Agreement.
              <br />
              d) Will comply with all applicable rules, laws and regulations in
              correlation with the promotion of {BRAND}.
              <br />
              e) Fully understands and accepts the Terms of the Agreement.
              <br />
              4. Responsibilities and Obligations of the Company
              <br />
              4.1. The Company shall provide the Affiliate with all required
              information and marketing material for the implementation of the
              tracking link.
              <br />
              4.2. The Company shall administrate the turnover generated via the
              tracking links, record the revenue and the total amount of
              commission earned via the link, provide the Affiliate with
              commission statistics, and handle all customer services related to
              the business. A unique tracking identification code will be
              assigned to all referred customers.
              <br />
              4.3. The Company shall pay the Affiliate the amount due depending
              on the traffic generated subject to the Terms of this Agreement.
              <br />
              5. Responsibilities and Obligations of the Affiliate
              <br />
              5.1. The Affiliate hereby warrants:
              <br />
              a) To use its best efforts to actively and effectively advertise,
              market and promote {BRAND} as widely as possible in order to
              maximize the benefit to the parties and to abide by the guidelines
              of the Company as they may be brought forward from time to time
              and/or as being published online.
              <br />
              b) To market and refer potential players to {BRAND} at its own
              cost and expense. The Affiliate will be solely responsible for the
              distribution, content and manners of its marketing activities. All
              of the Affiliate's marketing activities must be professional,
              proper and lawful under applicable laws and must be in accordance
              with this Agreement.
              <br />
              c) To use only the tracking link provided within the scope of the
              affiliate program, otherwise no guarantee whatsoever can be given
              for proper registration and sales accounting. Also, not to change
              or modify in any way any link or marketing material without prior
              written authorization from the Company.
              <br />
              d) To be responsible for the development, operation and
              maintenance of its website as well as for all material appearing
              on its website.
              <br />
              5.2. The Affiliate hereby warrants:
              <br />
              a) That it will not perform any act which is libelous,
              discriminatory, obscene, unlawful or otherwise unsuitable or which
              contains sexually explicit, pornographic, obscene or graphically
              violent materials.
              <br />
              b) That it will not actively target any person who is under the
              legal age for gambling.
              <br />
              c) That it will not actively target any jurisdiction where
              gambling and the promotion thereof is illegal.
              <br />
              d) That it will not generate traffic to {BRAND} by illegal or
              fraudulent activity, particularly but not limited to:
              <br />
              I. Sending spam.
              <br />
              II. Incorrect metatags.
              <br />
              ]III. Registering as a player or making deposits directly or
              indirectly to any player account through his/her tracker(s) for
              their own personal use and/or the use of its relatives, friends,
              employees or other third parties, or in any other way attempt to
              artificially increase the commission payable or to otherwise
              defraud the Company. Violation of this provision shall be deemed
              to be fraud.
              <br />
              e) That it will not present its website in such a way that it
              might evoke any risk of confusion with {BRAND} and/or the Company
              and or convey the impression that the website of the contracting
              party is partly or fully originated with {BRAND} and/or the
              Company.
              <br />
              f) Without prejudice to the marketing material as may be forwarded
              by the Company and/or made available online through the website
              http://{BRAND}/ the affiliate may not use {BRAND} or other terms,
              trademarks and other intellectual property rights that are vested
              in the Company unless the Company consents to such use in writing.
              <br />
              6. Payment
              <br />
              6.1. The Company agrees to pay the Affiliate a commission based on
              the Game bet amount generated from new customers referred by the
              Affiliate’s website and/or other channel. New customers are those
              customers of the Company who do not yet have a gaming account and
              who access the Website via the tracking link and who properly
              register and make bitcoin transfers at least equivalent to the
              minimum deposit into their {BRAND} betting account. The commission
              shall be deemed to be inclusive of value added tax or any other
              tax if applicable.
              <br />
              6.2. The commission shall be a percentage of the Game bet amount
              in accordance with what is set out in the commission structures
              for the particular product. The calculation is product specific
              and it is set out in every product-specific commission structure.
              (see "commission rules" for details)
              <br />
              6.3. Users can withdraw commissions from the agent system at any
              time. The commissions will be withdrawn into the platform wallet.
              Users can also withdraw the platform wallet to any address at any
              time. (you can check the Commission extraction in the agent system
              and view transaction records in the platform wallet).
              <br />
              6.4. The commissions will be collected in digital currency and
              will only be received on the platform wallet.When applying for
              Withdraw, you must submit the correct wallet address on the
              “Withdraw” page.If there is an error in calculating the
              commission, the company has the right to amend the amount at any
              time and immediately settle the underpaid difference to the agent
              or recover the overpaid balance from the agent.
              <br />
              6.5. Agent Withdraw commission by the Affiliate shall be deemed to
              be full and the final settlement of the balance due for the period
              indicated.
              <br />
              6.6. If the Affiliate disagrees with the balance due as reported,
              it shall within a period of seven (7) days send an email to the
              Company to admin@{BRAND} and indicate the reasons for the dispute.
              Or contact customer service through Telegram .Failure to send an
              email Or contact customer service through Telegram within the
              prescribed time limit shall be deemed to be considered as an
              irrevocable acknowledgment of the balance due for the period
              indicated.
              <br />
              6.7. May delay the Withdraw request through the agent for up to
              sixty (60) days, while it investigates and verifies that the
              relevant transactions comply with the provisions of the Terms.
              <br />
              6.8. No payment shall be due when the traffic generated is illegal
              or contravenes any provision of these Terms.
              <br />
              6.9. The Affiliate agrees to return all commissions received based
              on fraudulent or falsified transactions, plus all costs for legal
              causes or actions that may be brought against the Affiliate to the
              fullest extent of the law.
              <br />
              6.10. For the sake of clarity the parties specifically agree that
              upon termination of this Agreement by either party, In addition to
              the previous unsettled Commissions, the Commissions of the agent
              will no longer be settled.
              <br />
              6.11. The Affiliate shall be exclusively responsible for the
              payment of any and all taxes, levies, fees, charges and any other
              money payable or due both locally and abroad (if any) to any tax
              authority, department or other competent entity by the Affiliate
              as a result of the commission generated under this Agreement. The
              Company shall in no manner whatsoever be held liable for any
              amounts unpaid but found to be due by the Affiliate and the
              Affiliate hereby indemnifies the Company in that regard.
              <br />
              7. Termination
              <br />
              7.1. This Agreement may be terminated by either party by giving a
              thirty (30) day written notification to the other party. Written
              notification may be given by email.
              <br />
              7.2. The contracting parties hereby agree that upon termination of
              this Agreement:
              <br />
              a) The Affiliate must remove all references to {BRAND} from the
              Affiliate's websites and/or other marketing channels and
              communications, irrespective of whether the communications are
              commercial or non-commercial.
              <br />
              b) All rights and licenses granted to the Affiliate under this
              Agreement shall immediately terminate and all rights shall revert
              to the respective licensors, and the Affiliate will cease the use
              of any trademarks, service marks, logos and other designations
              vested in the Company.
              <br />
              c) The Affiliate will be entitled only to those earned and unpaid
              commissions as of the effective date of termination;however
              provided, the Company may withhold the Affiliate's final payment
              for a reasonable time to ensure that the correct amount is paid.
              The Affiliate will not be eligible to earn or receive commissions
              after this termination date.
              <br />
              d) If this Agreement is terminated by the Company on the basis of
              the Affiliate's breach, the Company shall be entitled to withhold
              the Affiliate’s earned but unpaid commissions as of the
              termination date as collateral for any claim arising from such a
              breach. It is further specified that termination by the Company
              due to a breach by the Affiliate of any of the clauses in this
              Agreement shall not require a notice period and such termination
              shall have immediate effect upon simple notification by the
              Company to the Affiliate.
              <br />
              e) The Affiliate must return to the Company any and all
              confidential information (and all copies and derivations thereof)
              in the Affiliate's possession, custody and control.
              <br />
              f) The Affiliate will release the Company from all obligations and
              liabilities occurring or arising after the date of such a
              termination, except with respect to those obligations that by
              their nature are designed to survive termination. Termination will
              not relieve the Affiliate from any liability arising from any
              breach of this Agreement, which occurred prior to termination
              and/or to any liability arising from any breach of confidential
              information even if the breach arises at any time following the
              termination of this Agreement. The Affiliate’s obligation of
              confidentiality towards the Company shall survive the termination
              of this Agreement.
              <br />
              7.3. Automatic termination by us if your account is inactive. If
              your Affiliate Account is inactive, your Agreement and
              participation in the Affiliate Network will automatically
              terminate. In this Section, "Inactive" means where you have not
              registered new Real Money Players for one hundred and eighty (180)
              days or more;. Where automatic termination occurs, we will notify
              you that your Fees will be frozen. If we do not receive any
              response from you within one hundred and eighty (180) days, any
              funds remaining within your Affiliate Account will revert to us.
              <br />
              8. Warranties
              <br />
              8.1. The Affiliate expressly acknowledges and agrees that the use
              of the Internet is at its own risk and that this affiliate program
              is provided "as is" and "as available" without any warranties or
              conditions whatsoever, even if expressed or implied. No guarantee
              is made that it will make access to its website possible at any
              particular time or any particular location.
              <br />
              8.2. The Company shall in no event be liable to the Affiliate or
              anyone else for any inaccuracy, error or omission in, or loss,
              injury or damage caused in whole or in part by failures, delays or
              interruptions of the {BRAND} website or the affiliate program.
              <br />
              9. Indemnification
              <br />
              9.1. The Affiliate agrees to defend, indemnify and hold the
              Company and its affiliates, successors, officers, employees,
              agents, directors, shareholders and attorneys, free and harmless
              from and against any and all claims and liabilities, including
              reasonable attorneys' and experts' fees, related to or arising
              from:
              <br />
              a) Any breach of the Affiliate's representations, warranties or
              covenants under this Agreement.
              <br />
              b) The Affiliate's use (or misuse) of the marketing materials.
              <br />
              c) All conduct and activities occurring under the Affiliate's user
              ID and password.
              <br />
              d) Any defamatory, libelous or illegal material contained within
              the Affiliate’s website or as part of the Affiliate's information
              and data.
              <br />
              e) Any claim or contention that the Affiliate’s website or the
              Affiliate's information and data infringes any third party's
              patent, copyright, trademark, or other intellectual property
              rights or violates any third party's rights of privacy or
              publicity.
              <br />
              f) Third party access or use of the Affiliate’s website or to the
              Affiliate's information and data.
              <br />
              g) Any claim related to the Affiliate website.
              <br />
              h) Any violation of this Agreement.
              <br />
              9.2. The Company reserves the right to participate, at its own
              expense in the defense of any matter.
              <br />
              10. Company Rights
              <br />
              10.1. In order to comply with company or {BRAND} policies, and to
              protect the company or {BRAND}'s interests, the company or {BRAND}{" "}
              can reject any player or close the player account.
              <br />
              10.2. The Company may refuse any applicant and/or may close any
              Affiliate’s account if it is necessary to comply with the
              Company's policy and/or protect the interest of the Company. If
              the Affiliate is in breach of this Agreement or the Company’s
              Terms or other rules, policies and guidelines of the Company, the
              Company may besides closing the Affiliate’s account take any other
              steps in law to protect its interests.
              <br />
              11. Commission structure
              <br />
              11.1. The commission settled to the agent is a percentage of the
              game betting amount.The exact commission structure is part of this
              agreement. For details, see the "commission rules" clause.In this
              case, the Commission is withdrawn to the player's platform wallet
              (digital currency), but not directly to other addresses.
              <br />
              12. Assignment
              <br />
              12.1. The Affiliate may not assign this Agreement, by operation of
              law or otherwise, without obtaining the prior written consent of
              the Company. In the event that the affiliate acquires or otherwise
              obtains control of another affiliate of {BRAND}, then accounts
              will coexist on individual terms.
              <br />
              12.2. The Company may assign this Agreement, by operation of the
              law or otherwise, at any time without obtaining the prior consent
              of the Affiliate.
              <br />
              13. Non-Waiver
              <br />
              13.1. The Company's failure to enforce the Affiliate's adherence
              to the Terms outlined in this Agreement shall not constitute a
              waiver of the right of the Company to enforce said terms at any
              time.
              <br />
              14. Force Majeure
              <br />
              14.1. Neither party shall be liable to the other for any delay or
              failure to perform its obligations under this Agreement if such
              delay or failure arises from a cause beyond the reasonable control
              of and is not the fault of such party, including but not limited
              to labour disputes, strikes, industrial disturbances, acts of God,
              acts of terrorism, floods, lightning, utility or communications
              failures, earthquakes or other casualty. If a force majeure event
              occurs, the non-performing party is excused from whatever
              performance is prevented by the force majeure event to the extent
              prevented. Provided that, if the force majeure event subsists for
              a period exceeding thirty (30) days then either party may
              terminate the Agreement without notice.
              <br />
              15. Relationship of the Parties
              <br />
              15.1. Nothing contained in this Agreement, nor any action taken by
              any party to this Agreement, shall be deemed to constitute either
              party (or any of such party's employees, agents, or
              representatives) an employee, or legal representative of the other
              party, nor to create any partnership, joint venture, association,
              or syndication among or between the parties, nor to confer on
              either party any express or implied right, power or authority to
              enter into any Agreement or commitment on behalf of (nor to impose
              any obligation upon) the other party.
              <br />
              16. Severability/Waiver
              <br />
              16.1. Whenever possible, each provision of this Agreement shall be
              interpreted in such a manner as to be effective and valid under
              applicable law but, if any provision of this Agreement is held to
              be invalid, illegal or unenforceable in any respect, such
              provision will be ineffective only to the extent of such
              invalidity, or unenforceability, without invalidating the
              remainder of this Agreement. No waiver will be implied from
              conduct or failure to enforce any rights and must be in writing to
              be effective.
              <br />
              17. Confidentiality
              <br />
              17.1. All information, including but not limited to business and
              financial, lists of customers and buyers, as well as price and
              sales information and any information relating to products,
              records, operations, business plans, processes, product
              information, business know-how or logic, trade secrets, market
              opportunities and personal data of the Company shall be treated
              confidentially. Such information must not be used for own
              commercial or other purposes or divulged to any person or third
              party neither directly nor indirectly unless prior explicit and
              written consent has been provided by the Company. This provision
              shall survive the termination of this Agreement.
              <br />
              17.2. The Affiliate obliges himself/herself not to use the
              confidential information for any purpose other than the
              performance of its obligations under this Agreement.
              <br />
              18. Changes to this Agreement
              <br />
              18.1. The Company reserves the right to amend, alter, delete or
              add to any of the provisions of this Agreement, at any time and at
              its sole discretion, without giving any advance notice to the
              Affiliate subject to the Terms set out in this Agreement. Any such
              changes will be published on {BRAND}.
              <br />
              18.2. In case of any discrepancy between the meanings of any
              translated versions of this Agreement, the English language
              version shall prevail.
              <br />
              19. Trademarks
              <br />
              19.1. Nothing contained in this Agreement will grant either party
              any right, title or interest in the trademarks, trade names,
              service marks or other intellectual property rights [hereinafter
              referred to simply as ‘Marks’] of the other party. At no time
              during or after the term will either party attempt or challenge or
              assist or allow others to challenge or to register or to attempt
              to register the Marks of the other party or of any company within
              the group of companies of the other party. Provided also that
              neither of the parties will register nor attempt to register any
              Mark which is basically similar to and/or confusingly similar to
              any Mark which belongs to the other party or to any company
              contained within the other party’s group of companies.
              <br />
            </p>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
