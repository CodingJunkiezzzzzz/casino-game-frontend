import React from "react";
import { Modal, Row, Col, Card } from "react-bootstrap";
import { Helmet } from "react-helmet";
import storage from "../../../Storage";
import { SITE } from "../../../Helper";
import Terms from "./Terms";
import List from "./List";

export default class Affiliate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: storage.getKey("token") ? storage.getKey("token") : null,
      logged: false,
    };
  }

  componentWillMount() {
    if (this.state.token !== null) {
      this.setState({ logged: true });
    }
  }

  render() {
    let { logged } = this.state;

    return (
      <>
        <Helmet>
          <title>Affiliate - Original Crash Game</title>
        </Helmet>
        <div
          style={{
            background: "rgb(108 108 229) url(/assets/images/mountain.png)",
            backgroundSize: "cover",
          }}
          className={"p-4 wheel-content"}
        >
          <Terms />
          <h2
            className={"text-center text-upper text-warning font-weight-bold"}
          >
            Affiliate
          </h2>
          <p className={"text-center text-upper text-white"}>
            Invite your friends to get free coins.
          </p>
          <Row>
            <Col sm={12} xl={5} md={5} className={"m-auto"}>
              <Card>
                <Card.Body
                  className={"rounded text-center"}
                  style={{ background: "rgb(108 108 229)" }}
                >
                  <label className="text-white text-upper">Your Link</label>
                  {logged ? (
                    <input
                      type="text"
                      value={SITE + "/aff/" + this.state.token}
                      className={"form-control"}
                      style={{ background: "#47478e" }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={"Please login to see your link."}
                      className={"form-control"}
                      style={{ background: "#47478e" }}
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
        <Row>
          <Col sm={12} xl={12} md={12} className={"mx-auto mt-3"}>
            <Card>
              <Card.Body>
                {!logged ? (
                  <div className="text-center">[ Login to see your stats ]</div>
                ) : (
                  <List />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}
