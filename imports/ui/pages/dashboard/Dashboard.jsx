import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import Header from '../../components/header/Header.jsx';
import SeasonListContainer from '../../components/season-list/SeasonList';
import Season from '../../components/season/Season';
import AcceptInvite from '../../components/acceptInvite/AcceptInvite';

export default function Dashboard() {
  return (
    <div>
      <Route component={Header} />
      <Switch>
        <Route path="/invite/:token" component={AcceptInvite} />
        <Route path="/season/:slug" component={Season} />
        <Route exact path="/" component={SeasonListContainer} />
        <Route render={props => <Redirect to="/" />} />
      </Switch>
    </div>
  );
}
