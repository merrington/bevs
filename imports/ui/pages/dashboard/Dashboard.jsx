import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import Header from '../../components/header/Header.jsx';
import SeasonListContainer from '../../components/season-list/SeasonList';
import Season from '../../components/season/Season';

export default function Dashboard() {
  return (
    <Router>
      <div>
        <Route component={Header} />
        <Switch>
          <Route exact path="/" component={SeasonListContainer} />
          <Route path="/:slug" component={Season} />
        </Switch>
      </div>
    </Router>
  );
}
