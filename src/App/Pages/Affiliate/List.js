import React from "react";
import { Table } from "react-bootstrap";
import storage from "../../../Storage";
import { encode, decode, wait } from "../../../Helper";
import C from "../../../Constant";
import socket from "../../../Socket";

export default class Affiliate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      list: [],
    };
  }

  componentDidMount() {
    wait(1700).then(() => {
      this.setState({ loading: false });
    });
    socket.emit(C.MY_AFF, encode({ token: storage.getKey("token") }));
    socket.on(C.MY_AFF, (data) => this.makeList(data));
  }

  makeList = (data) => {
    this.setState({ loading: false, list: data });
  };

  render() {
    const list = this.state.list.map((row, i) => <List key={i} row={row} />);

    return (
      <div className="table-responsive">
        {this.state.loading ? (
          <div className="text-center">
            <div class="spinner-border text-info my-3" role="status" />
          </div>
        ) : (
          <>
            {list.length === 0 ? (
              <>You have not introduced anyone yet</>
            ) : (
              <Table className={"mb-2"}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Earned</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>{list}</tbody>
              </Table>
            )}
          </>
        )}
      </div>
    );
  }
}

class List extends React.Component {
  render() {
    return (
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
      </tr>
    );
  }
}
