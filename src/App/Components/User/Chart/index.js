import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Highcharts from "highcharts";
import socket from "../../../../Socket";
import {
  __,
  Event,
  decode,
  encode,
  wait,
  forceSatoshiFormat,
  fixDate,
} from "../../../../Helper";
import C from "../../../../Constant";

class ChartMaker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      lastPage: false,
      loading: false,
      result: false,
      coins: [],
    };
  }

  componentDidMount() {
    this.setState({ name: this.props.name, token: this.props.token });
    socket.on(C.USER_CHART, (data) => this.getChart(decode(data)));
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.chart_coin) {
      wait(700).then(() => {
        this.renderChart(this.props);
      });
    }
  }

  getChart(details) {
    let array = details.data;

    if (document.querySelector("#userChart") !== null) {
      if (__.isUndefined(array)) {
        return (document.querySelector("#userChart").innerText =
          "[ There is no data ]");
      } else document.querySelector("#userChart").innerText = "";
    }

    if (array.length === 0) {
      this.setState({ result: false });
    } else {
      this.setState({ result: true });
    }

    let Coin = [],
      Game = [],
      GameIDS = [],
      Bets = [],
      Profit = [],
      Dates = [];

    if (!array) return null;
    if (array === "undefined") return null;
    if (array.length < 1) return null;
    if (array.length === 0) return null;
    if (!__.isArray(array)) return null;

    array.forEach((arr, i) => {
      if (arr < 1) {
        this.setState({ lastPage: true });
      } else {
        this.setState({ lastPage: false });
      }
      Bets.push(null != arr.amount ? arr.amount : 0);
      GameIDS.push(null != arr.gid ? arr.gid : 0);
      Profit.push(null != arr.profit ? __.toNumber(arr.profit) : 0);
      Dates.push(arr.created ? arr.created : 0);
      Coin.push(arr.coin);
    });

    this.renderChart({
      full: array,
      ids: GameIDS,
      coin: Coin,
      dates: Dates,
      bets: Bets,
      profit: Profit,
    });

    this.setState({ loading: false });
  }

  showGame(data, id) {
    data.forEach((game, i) => {
      if (parseFloat(game.gid) === parseFloat(id)) {
        Event.emit("single_game_modal", { data: game });
      }
    });
  }

  renderChart(data) {
    const { ids, dates, bets, profit, game, coin, full } = data;
    let self = this;

    Event.emit("user_chart_modal");

    wait(100).then(() => {
      if (document.querySelector("#loadUserChart") !== null) {
        document.querySelector("#loadUserChart").innerHTML = "";

        let chartTag = document.querySelector("#loadUserChart");
        if (chartTag === null) return;

        return Highcharts.chart("loadUserChart", {
          chart: {
            backgroundColor: "transparent",
            type: "spline",
            scrollablePlotArea: {
              minWidth: 200,
              scrollPositionX: 0,
            },
          },
          title: {
            text: "",
          },
          xAxis: {
            categories: ids,
            allowDecimals: false,
          },
          yAxis: {
            title: false,
          },
          tooltip: {
            shared: false,
            useHTML: true,
            headerFormat: "<small>{series.key}</small>",
            formatter: function () {
              let color =
                profit[this.point.x] === 0 ? "text-danger" : "text-success";
              return (
                "Bet: <b>" +
                forceSatoshiFormat(bets[this.point.x]) +
                " " +
                __.upperCase(coin[this.point.x]) +
                "</b>  " +
                "<br/>  Profit: <b class='" +
                color +
                "'>" +
                forceSatoshiFormat(profit[this.point.x]) +
                "  " +
                __.upperCase(coin[this.point.x]) +
                "</b> <br/> " +
                "Date: <b>" +
                fixDate(dates[this.point.x]) +
                "</b> <br/> " +
                "ID: " +
                "<b>" +
                ids[this.point.x] +
                "</b>"
              );
            },
            borderColor: "#CCC",
          },
          plotOptions: {
            series: {
              label: {
                connectorAllowed: false,
              },
              cursor: "pointer",
              point: {
                events: {
                  click: function (e) {
                    self.showGame(full, this.category);
                  },
                },
              },
              marker: {
                enabled: false,
              },
            },
          },
          series: [
            {
              data: profit,
            },
          ],
          credits: {
            enabled: false,
          },
          legend: {
            enabled: false,
          },
          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 200,
                },
                chartOptions: {
                  legend: {
                    layout: "horizontal",
                    align: "center",
                    verticalAlign: "bottom",
                  },
                },
              },
            ],
          },
        });
      }
    });
  }

  render() {
    return (
      <>
        {this.state.result}
        {this.state.result && (
          <p className="text-center text-warning">
            Click on each point to see game info
          </p>
        )}
      </>
    );
  }
}

ChartMaker.propTypes = {
  chart_coin: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  chart_coin: state.items.chart_coin,
});

export default connect(mapStateToProps, {})(ChartMaker);
