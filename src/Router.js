import React from "react";
import { Switch, Route, useLocation } from "react-router-dom";

import Index from "./App/Pages";
import NotFound from "./App/Pages/404";
import Support from "./App/Pages/Support";
import Affiliate from "./App/Pages/Affiliate";
import Bonus from "./App/Pages/Affiliate/Bonus";

import UserStat from "./App/Components/User/Stat";
import GameStat from "./App/Components/Game/Stat";
import UserSetting from "./App/Components/User/Setting";
import Leaderboard from "./App/Pages/Leaderboard";

import Crash from "./App/Games/Crash";

function Router(props) {
  let location = useLocation();
  let background = location.state && location.state.background;

  const { t } = props;

  return (
    <>
      <Switch history={props.history} location={background || location}>
        <Route
          exact
          path="/"
          children={
            <Index t={t} location={location} content={<Crash t={t} />} />
          }
        />
        <Route
          path="/leaderboard"
          children={<Index t={t} content={<Leaderboard t={t} />} />}
        />
        <Route
          path="/support"
          children={<Index t={t} content={<Support t={t} />} />}
        />
        <Route
          path="/affiliate"
          children={
            <Index
              t={t}
              content={<Affiliate t={t} history={props.history} />}
            />
          }
        />
        <Route
          path="/aff"
          children={
            <Index
              t={t}
              content={
                <Bonus params={location} history={props.history} t={t} />
              }
            />
          }
        />
        <Route
          path="/setting"
          children={<Index t={t} content={<UserSetting t={t} />} />}
        />
        <Route
          path="/user/:id"
          children={
            <Index t={t} content={<UserStat t={t} params={location} />} />
          }
        />
        <Route
          path="/game/:id"
          children={
            <Index t={t} content={<GameStat t={t} params={location} />} />
          }
        />
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </>
  );
}

export default Router;
