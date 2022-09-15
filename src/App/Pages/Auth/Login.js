import React, { Component, createRef } from "react";
import { withRouter } from "react-router-dom";
import { Modal, Row, Col } from "react-bootstrap";
import * as Cookies from "js-cookie";
import ReCAPTCHA from "react-google-recaptcha";
import storage from "../../../Storage";
import GoogleBtn from "./Google";
import Forget from "./Forget";
import socket from "../../../Socket";
import {
  Event,
  wait,
  decode,
  encode,
  randomString,
  RECAPTCHA,
} from "../../../Helper";
import C from "../../../Constant";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      forgetPage: false,
      username: "",
      password: "",
      recaptcha: false,
      status: false,
      submitted: false,
      disabled: false,
      effect: "zoomIn",
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.recaptchaRef = createRef();
  }

  componentDidMount() {
    socket.on(C.LOGIN_USER, (data) => this.setLogin(decode(data)));

    if (this.props.justModal) {
      this.setState({ show: true });
    }
  }

  setLogin = (data) => {
    if (data.status === true) {
      this.setState({ status: "Successfully Login, Please Wait..." });
      Cookies.remove("session");
      Cookies.set("session", data.token, { expires: 14 });
      storage.setKey("token", data.token);

      //FAKES
      storage.setKey("user_token", randomString(50));
      storage.setKey("jwt_token", randomString(50));
      storage.setKey("secret_user", randomString(44));
      storage.setKey("secret_realtime", randomString(50));
      storage.setKey("security_key", randomString(10));
      storage.setKey("token_key", randomString(64));
      storage.setKey("secret_token", randomString(64));

      //REALS
      storage.setKey("name", data.name);
      storage.setKey("avatar", data.avatar);
      storage.setKey("email", data.email);
      storage.setKey("credit", data.credit);
      storage.setKey("room", data.room);
      storage.setKey("friends", data.friends);

      this.setState({ show: false, effect: "zoomOut" });

      socket.emit(
        C.ONLINE,
        encode({
          jwt_token: storage.getKey("jwt_token"),
          user_token: storage.getKey("user_token"),
          security_key: storage.getKey("security_key"), //fake
          secret_user: storage.getKey("secret_user"), //fake
          secret_realtime: storage.getKey("secret_realtime"), //fake
          client_system: storage.getKey("client_system"), //fake
          token_key: storage.getKey("token_key"), //fake
          secret_token: storage.getKey("secret_token"), //fake
          token: data.token, // REAL
        })
      );

      this.props.history.push("/");

      wait(1000).then(() => {
        window.location.reload();
      });
    } else {
      this.setState({ status: data.status, submitted: false, disabled: false });
    }
  };

  handleShow(e) {
    this.setState({ show: true, effect: "zoomIn" });
  }

  handleClose() {
    this.setState({
      show: false,
      effect: "zoomOut",
      disabled: false,
      status: false,
      submitted: false,
    });
    Event.emit("showAuthModal", false);
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    this.setState({
      submitted: true,
      disabled: true,
      status: this.props.t("please_wait"),
    });

    const { username, password, recaptcha } = this.state;

    if (!(username && password)) {
      this.setState({ disabled: false, status: false });
      return;
    }

    //Execute Recaptcha Token
    // const token = await this.recaptchaRef.current.executeAsync();

    wait(1000).then(() => {
      socket.emit(
        C.LOGIN_USER,
        encode({
          username: username,
          password: password,
          recaptcha: "google",
        })
      );
    });
  };

  forgetPass = (e) => {
    this.setState({ forgetPage: !this.state.forgetPage });
  };

  recaptchaChange = (value) => {
    this.setState({ recaptcha: value });
  };

  render() {
    let { justModal, t } = this.props;
    return (
      <>
        {!justModal && (
          <button
            className={"btn btn-transparent w-100 text-left py-0"}
            onClick={(e) => this.handleShow(e)}
          >
            <i className="dripicons-user text-muted mr-2" />
            {t("login")}
          </button>
        )}
        <Modal
          size="md"
          centered={true}
          backdrop="static"
          show={this.state.show}
          onHide={this.handleClose}
          aria-labelledby="login-md-modal"
          className={"modalAuth animated " + this.state.effect}
        >
          <Modal.Header>
            {t("login")}
            <button
              type="button"
              className="close p-2"
              onClick={this.handleClose}
            >
              <i className={"mdi mdi-close"} />
            </button>
          </Modal.Header>
          <Modal.Body className="auth-modal p-0">
            <div className="m-auto">
              {!this.state.forgetPage && (
                <div>
                  <div className="px-3">
                    <div className="text-center">
                      {this.state.recaptcha}
                      <img
                        src="/assets/images/logo.png"
                        className={"img-fluid auth-logo"}
                        alt=""
                      />
                      <div className="text-center auth-logo-text">
                        <p className="mt-0 mb-3 mt-3 font-new text-white">
                          {t("mega_profit")}
                          <i className="mdi mdi-dots-horizontal mx-2 font-18 align-middle" />
                          {t("fair_games")}
                        </p>
                      </div>
                    </div>
                    <form
                      className="form-horizontal auth-form my-4"
                      onSubmit={(e) => {
                        this.handleSubmit(e);
                      }}
                    >
                      <div className="form-group mb-2">
                        <div className="input-group">
                          <div className="input-group-append">
                            <span className="input-group-text bgp">
                              {t("username")}
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            value={this.state.username}
                            autoComplete="off"
                            onChange={(e) =>
                              this.setState({ username: e.target.value })
                            }
                            style={{ height: 40 }}
                          />
                          {this.state.submitted && !this.state.username && (
                            <div className="help-block">
                              {t("username_is_required")}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="form-group mb-2">
                        <div className="input-group">
                          <div className="input-group-append">
                            <span className="input-group-text bgp">
                              {t("password")}
                            </span>
                          </div>
                          <input
                            type="password"
                            className="form-control"
                            value={this.state.password}
                            autoComplete="off"
                            onChange={(e) =>
                              this.setState({ password: e.target.value })
                            }
                            style={{ height: 40 }}
                          />
                          {this.state.submitted && !this.state.password && (
                            <div className="help-block">
                              {t("password_is_required")}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-center">
                        <button
                          className="btn btn-secondary btn-block font-weight-bold no-shadow"
                          disabled={this.state.disabled}
                        >
                          <i className="mdi mdi-login mr-1 float-left font-18" />{" "}
                          {t("login_to_site")}
                        </button>
                      </div>
                      <ReCAPTCHA
                        ref={this.recaptchaRef}
                        size="invisible"
                        sitekey={RECAPTCHA}
                      />
                    </form>
                    <Row className="text-center mb-4">
                      <Col md="6" className="my-1">
                        <GoogleBtn />
                      </Col>
                      <Col md="6" className="my-1">
                        <a
                          href={"#"}
                          onClick={this.forgetPass}
                          className="btn btn-block btn-info shadow-none"
                        >
                          <i className="mdi mdi-information mr-1" />{" "}
                          {t("rest_password")}
                        </a>
                      </Col>
                    </Row>
                    {this.state.status && (
                      <div className={"alert bg-secondary text-white"}>
                        {this.state.status}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {this.state.forgetPage && (
                <Forget t={t} clicked={this.forgetPass} />
              )}
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default withRouter(Login);
