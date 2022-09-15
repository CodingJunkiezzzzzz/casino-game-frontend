import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import md5 from "md5";
import ReactTooltip from "react-tooltip";
import { Router, BrowserRouter } from "react-router-dom";
import { Col, Modal, Row, Card, Accordion, Button } from "react-bootstrap";
import ReactNotification from "react-notifications-component";
import i18next from "i18next";
import { I18nextProvider, useTranslation } from "react-i18next";
import history from "./history";
import Route from "./Router";
import socket from "./Socket";
import storage from "./Storage";
import {
  __,
  decode,
  encode,
  fixDate,
  forceSatoshiFormat,
  Event,
  wait,
  timeConvertor,
  sendNotfication,
  randomString,
  chkd,
  SOCKET,
  DEVELOPMENT,
} from "./Helper";
import Details from "./App/Components/User/Stat/Details";
import TipUser from "./App/Components/User/Tip";
import UserLink from "./App/Components/User/Stat/Modal";
import C from "./Constant";

i18next.init({
  interpolation: { escapeValue: false },
});

const delay = DEVELOPMENT ? 300 : 4300;

// loading component for suspense fallback
const Loader = () => (
  <>
    <></>
  </>
);

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Page />
    </Suspense>
  );
}

function Page() {
  const { t } = useTranslation();
  return <Application t={t} />;
}

class Application extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      welcome: storage.getKey("welcome") ? true : false,
      effect: "d-none",
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.security();

    wait(700).then(() => {
      this.setState({ effect: "zoomIn" });
    });

    wait(delay).then(() => {
      this.setState({ loading: false });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  security = () => {
    console.log(
      "%cStop! This is a browser feature intended for developers. If someone told you to copy and paste something here to enable a feature or do a" +
        ' "hack", it is a scam and will give them access to your account',
      "color:#FFF; background:red; font-family:system-ui; font-size:20px; font-weight:bold"
    );

    chkd();
  };

  render() {
    const { t } = this.props;
    return (
      <BrowserRouter>
        <I18nextProvider i18n={i18next}>
          {this.state.loading && (
            <div className="loading">
              <div className="loading-text">
                <img
                  className={"img-fluid animated " + this.state.effect}
                  src="/assets/images/logo.png"
                />
                <br />
                <span className="loading-text-words">L</span>
                <span className="loading-text-words">O</span>
                <span className="loading-text-words">A</span>
                <span className="loading-text-words">D</span>
                <span className="loading-text-words">I</span>
                <span className="loading-text-words">N</span>
                <span className="loading-text-words">G</span>
              </div>
            </div>
          )}
          <Router history={history}>
            {this._isMounted && (
              <>
                <ReactNotification />
                <UserModal t={t} />
                <GameModal t={t} />
                <SingleGameModal t={t} props={this.props} />
              </>
            )}
            <Route t={t} history={history} />
          </Router>
        </I18nextProvider>
      </BrowserRouter>
    );
  }
}

class SingleGameModal extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      effect: null,
      details: [],
      clientName: storage.getKey("name"),
      token: storage.getKey("token"),
      country: storage.getKey("country") ? storage.getKey("country") : "Global",
    };
  }

  componentDidMount() {
    this._isMounted = true;
    Event.on("single_game_modal", (result) => {
      this.setState({ details: result.data, show: true, effect: "pulse" });
    });

    Event.on("single_game_modal_close", (result) => {
      this.handleClose();
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleClose = () => {
    this.setState({
      detail: true,
      tip: false,
      show: false,
      loading: true,
      effect: "zoomOut",
    });
  };

  validate = () => {
    let { hash } = this.state.details;
    Event.emit("game_verify", hash);
  };

  render() {
    let {
      name,
      amount,
      game,
      profit,
      coin,
      created,
      hash,
      gid,
      id,
      result,
      slot,
      direct,
      force,
      cashout,
    } = this.state.details;
    let isLost = false;
    let listResult = false;
    let date = fixDate(created);

    if (direct) {
      date = timeConvertor(created);
    }

    // if is fake bot
    if (force) {
      date = "a few minutes ago";
    }

    profit = parseFloat(profit);

    if (profit === 0 || profit === 0.0) {
      isLost = true;
    }

    let flex = false;

    if (!__.isUndefined(cashout)) {
      listResult = cashout / 100;
    }

    const { t } = this.props;
    return (
      <>
        {this._isMounted && (
          <>
            <Modal
              size="md"
              backdrop={"static"}
              centered={true}
              show={this.state.show}
              onHide={this.handleClose}
              aria-labelledby="game-modal"
              className={"animated " + this.state.effect}
            >
              <Modal.Header>
                {t("game_details")}
                <button
                  type="button"
                  className="close p-2"
                  onClick={this.handleClose}
                >
                  <i className={"mdi mdi-close"} />
                </button>
              </Modal.Header>
              <Modal.Body
                className={
                  isLost ? "user-modal-bg p-1" : "user-modal-bg p-1 winImageX"
                }
              >
                <ReactTooltip />
                <h4 className="text-center text-white mt-0">
                  <UserLink username={name} />
                </h4>

                <Row className="text-center game-modal">
                  <Col md={6} className="col-6 text-success font-12">
                    <Card className={"mb-1 brd15 text-white"}>
                      <Card.Body className="p-1 text-uppercase text-success">
                        <i
                          className="mdi mdi-marker-check text-white"
                          data-tip={"Verified"}
                        />{" "}
                        {t("betting_id")} <br />{" "}
                        {gid !== undefined || !gid || gid !== "" ? gid : id}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} className="col-6 text-white font-12">
                    <Card className={"mb-1 brd15 text-white"}>
                      <Card.Body className="p-1 text-uppercase">
                        <i className="mdi mdi-clock" /> Time / Date <br />{" "}
                        {date}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} className="col-6">
                    <Card className={"mb-1 brd15 text-white"}>
                      <Card.Body className="p-1 text-uppercase">
                        <i className="mdi mdi-coin align-middle mr-1" />
                        BET {t("amount")} <br />
                        <img
                          className="mini-coin-9"
                          src={"/assets/images/" + __.upperCase(coin) + ".png"}
                        />
                        <b className={"num-style"}>
                          {forceSatoshiFormat(amount)} {__.upperCase(coin)}
                        </b>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} className="col-6">
                    <Card className={"mb-1 brd15 text-white"}>
                      <Card.Body className="p-1 text-uppercase">
                        <i className="mdi mdi-coins align-middle mr-1" />
                        {t("profit")} <br />
                        <img
                          className="mini-coin-9"
                          src={"/assets/images/" + __.upperCase(coin) + ".png"}
                        />
                        <b
                          className={
                            !isLost
                              ? "num-style text-success"
                              : "num-style text-danger"
                          }
                        >
                          {forceSatoshiFormat(profit)} {__.upperCase(coin)}
                        </b>
                      </Card.Body>
                    </Card>
                  </Col>
                  {listResult !== false && listResult !== null && (
                    <Col md={12} className="col-12">
                      <Card className={"mb-1 brd15"}>
                        <Card.Body className="p-1 text-white text-uppercase">
                          <img
                            src={"/assets/images/icons/" + game + ".png"}
                            className={"img-fluid w-15 single-game"}
                            data-tip={game}
                            alt={game}
                          />
                          {game === "crash" ? "Payout" : "Result"}
                          <br />
                          <div
                            className={
                              flex ? "mt-3 font-15 media" : "mt-3 font-15"
                            }
                          >
                            {listResult}x
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                  <Col md={12} sm={12}>
                    {__.toString(hash).length > 0 && (
                      <>
                        <Card className={"mb-1 brd15"}>
                          <Card.Body className="p-1 text-white text-uppercase">
                            <div className="form-group mb-1">
                              <i className="mdi mdi-code-tags align-middle font-30" />
                              <label className="text-white mt-1">
                                {t("game_hash")}
                              </label>
                              <input
                                type="text"
                                className="form-control text-white brd15 mb-2"
                                value={__.toString(hash)}
                                style={{ background: "rgb(23 24 27)" }}
                                readOnly={true}
                              />
                            </div>
                            {(__.isUndefined(slot) || slot === null) && (
                              <>
                                <button
                                  onClick={this.validate}
                                  className="btn btn-success-2 btn-block btn-md btn-block no-shadow"
                                >
                                  <i className="mdi mdi-shield nts" /> Verify
                                  Result
                                </button>
                              </>
                            )}
                          </Card.Body>
                        </Card>
                      </>
                    )}
                  </Col>
                </Row>
              </Modal.Body>
            </Modal>
          </>
        )}
      </>
    );
  }
}

class UserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      detail: true,
      tip: false,
      notFound: false,
      data: [],
      coin: storage.getKey("coin") !== null ? storage.getKey("coin") : "Bixea",
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.modal) {
      this.setState({ show: false });
    }
  }

  componentDidMount() {
    socket.on(C.USER_INFO, (data) => this.getUserInfo(decode(data)));

    Event.on("force_modal_user", () => {
      this.setState({ show: true, effect: "zoomIn", haveData: "no", data: [] });
    });

    Event.on("force_modal_tip", () => {
      this.setState({ tip: true, detail: false });
    });

    Event.on("force_modal_tip_close", () => {
      this.setState({ tip: false, detail: true });
    });
  }

  handleClose = () => {
    this.setState({
      detail: true,
      tip: false,
      notFound: false,
      show: false,
      effect: "zoomOut",
    });
  };

  getUserInfo = (data) => {
    if (data.status) {
      this.setState({ haveData: "ok", data: data });
    } else {
      this.setState({ notFound: true });
    }
  };

  render() {
    let { chart_coin, t } = this.props;
    chart_coin = chart_coin ? chart_coin : this.state.coin;
    return (
      <Modal
        size="md"
        backdrop={"static"}
        centered={true}
        show={this.state.show}
        onHide={this.handleClose}
        aria-labelledby="user-modal"
        className={"animated " + this.state.effect}
      >
        <Modal.Header>
          User Information
          <button
            type="button"
            className="close p-2"
            onClick={this.handleClose}
          >
            <i className={"mdi mdi-close"} />
          </button>
        </Modal.Header>
        <Modal.Body className={"user-modal-bg p-1"}>
          {this.state.notFound ? (
            <>
              <div
                className="text-center text-yellow"
                style={{ minHeight: 500 }}
              >
                User Not Found
              </div>
            </>
          ) : (
            <>
              {this.state.detail ? (
                <>
                  <div
                    className={
                      this.state.tip === true
                        ? "container-fluid mduser animated fadeOut"
                        : "container-fluid mduser"
                    }
                  >
                    <Details
                      haveData={this.state.haveData}
                      token={this.state.data.id}
                      name={this.state.data.name}
                      coin={chart_coin}
                      data={this.state.data}
                    />
                  </div>
                </>
              ) : (
                <>
                  {this.state.tip === true && (
                    <div className={"container-fluid animated fadeIn"}>
                      <TipUser name={this.state.data.name} />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    );
  }
}

class GameModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      loading: true,
      gid: null,
      playerRow: [],
      numbers: [],
      busted: null,
      date: null,
      sha256: null,
      hash: null,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.modal) {
      this.setState({ show: false });
    }
  }

  componentDidMount() {
    socket.on(C.GAME_DETAILS, (data) => this.gameInfo(decode(data)));

    Event.on("force_modal_game", () => {
      this.setState({
        haveData: "no",
        playerRow: [],
        busted: null,
        date: null,
        sha256: null,
        hash: null,
        gid: null,
        loading: true,
        show: true,
        effect: "pulse",
      });
    });
  }

  handleClose = () => {
    this.setState({ show: false, loading: true, effect: "zoomOut" });
  };

  gameInfo(response) {
    if (!response.info) {
      this.setState({ show: false, loading: true, effect: "zoomOut" });
      return;
    }
    this.setState({ loading: false, playerRow: [], haveData: "ok" });

    let gameInfo = response.info;
    let busted;

    if (
      gameInfo.busted !== null &&
      gameInfo.busted !== undefined &&
      gameInfo.busted !== "undefined" &&
      gameInfo.busted !== ""
    ) {
      busted = gameInfo.busted;
    } else {
      busted = gameInfo.numbers;
    }

    this.setState({
      busted: busted,
      sha256: md5(gameInfo.hash),
      hash: gameInfo.hash,
      date: gameInfo.date,
      gid: gameInfo.gid,
    });

    let sort = sortByWinner(response.data);
    sort = __.xor(sort);
    __.reverse(sort).forEach((array, i) => {
      let row = <PlayerRow clicked={this.handleClose} array={array} key={i} />;
      this.setState((state) => ({ playerRow: [row, ...state.playerRow] }));
    });
  }

  render() {
    const { t } = this.props;
    let { busted, date, sha256, hash, playerRow, gid, loading } = this.state;
    let heading = "h1";
    let color = busted >= 1.9 ? "success" : "danger";
    let arr;

    return (
      <Modal
        size="md"
        centered={true}
        backdrop={"static"}
        show={this.state.show}
        onHide={this.handleClose}
        aria-labelledby="game-md-modal"
        className={"animated " + this.state.effect}
      >
        <Modal.Header className="Header">
          {t("game_stats")}{" "}
          <button
            type="button"
            className="close p-2"
            onClick={this.handleClose}
          >
            <i className={"mdi mdi-close"} />
          </button>
        </Modal.Header>
        {playerRow && (
          <Modal.Body>
            {loading ? (
              <>
                <div className="text-center" style={{ minHeight: 200 }}>
                  <div class="text-info my-1 user-loader" role="status" />
                </div>
              </>
            ) : (
              <>
                <Row className="text-darker pt-0 mb-1 user-detail">
                  <Col md={12} sm={12}>
                    <div className="review-box text-center align-item-center p-0">
                      {heading === "h1" ? (
                        <>
                          <h1 className={"my-0 py-0 text-" + color}>
                            {busted}
                            <span className={"font-"}>x</span>
                          </h1>
                          <h5 className={"mt-1 pt-0 text-" + color}>
                            {t("busted")}
                          </h5>
                        </>
                      ) : (
                        <h2 className={"my-0 py-0 text-" + color}>{arr}</h2>
                      )}
                      <Row className="my-3">
                        <Col md={6} sm={6} className="text-success">
                          {t("betting_id")}: {gid}
                        </Col>
                        <Col md={6} sm={6} className="text-white">
                          {t("date")}: {fixDate(date)}
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col md={12} sm={12} className="text-center">
                    <div className="form-group">
                      <div className="input-group">
                        <div className="input-group-append">
                          <span className="input-group-text h-40 bg-cs44">
                            HASH
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control no-radius pointer mb-2"
                          value={__.toString(hash)}
                          readOnly={true}
                        />
                      </div>
                      <div className="input-group">
                        <div className="input-group-append">
                          <span className="input-group-text h-40 bg-cs44">
                            MD5
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control no-radius pointer"
                          value={__.toString(sha256)}
                          readOnly={true}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </>
            )}
            {loading ? (
              <>
                <div className="text-center" style={{ minHeight: 200 }}>
                  <div
                    class="spinner-border text-info my-2 user-loader"
                    role="status"
                  />
                </div>
              </>
            ) : (
              <>
                <h4 className={"mb-3 mt-0 text-yellow"}>Players List</h4>
                <div className="table-responsive game-stats">
                  <table className="table">
                    <thead className="table-header">
                      <tr>
                        <th>{t("player")}</th>
                        <th>{t("bet")}</th>
                        <th>{t("profit")}</th>
                      </tr>
                    </thead>
                    <tbody>{playerRow}</tbody>
                  </table>
                  {playerRow.length === 0 && (
                    <p className="text-center text-muted">
                      {t("no_one_playing_on_this_round")}
                    </p>
                  )}
                </div>
              </>
            )}
          </Modal.Body>
        )}
      </Modal>
    );
  }
}

class PlayerRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { array, key, clicked } = this.props;

    let color = "text-success";
    let profit = __.toNumber(array.profit);
    let coin = __.upperCase(array.coin);

    if (profit === 0 || profit === 0.0 || profit === "0.00000000") {
      profit = "-" + array.amount;
      color = "text-warning";
    }

    return (
      <>
        <tr className={color} key={key}>
          <td>
            <UserLink
              clicked={clicked}
              username={array.name}
              isWinner={color}
            />
          </td>
          <td className="num-style">
            <img
              src={"/assets/images/" + coin + ".png"}
              className={"mini-coin-8"}
              alt={coin}
            />
            {forceSatoshiFormat(array.amount)} {coin}
          </td>
          <td className="num-style">
            <img
              src={"/assets/images/" + coin + ".png"}
              className={"mini-coin-8"}
              alt={coin}
            />
            {forceSatoshiFormat(profit)} {coin}
          </td>
        </tr>
      </>
    );
  }
}

function sortByWinner(input) {
  function r(c) {
    return c.profit ? -c.profit : null;
  }
  return __.sortBy(input, r);
}

App.propTypes = {
  coin: PropTypes.string,
  chart_coin: PropTypes.string,
};

const mapStateToProps = (state) => ({
  coin: state.items.coin,
  chart_coin: state.items.chart_coin,
});

export default connect(mapStateToProps, {})(App);
