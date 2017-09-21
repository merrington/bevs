import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Switch, Route } from 'react-router-dom';
import Header from '../../components/header/Header.jsx';
import SeasonListContainer from '../../components/season-list/SeasonList';
import Season from '../../components/season/Season';

export default function Dashboard({ match }) {
  console.log(match);
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={SeasonListContainer} />
        <Route path="/:slug" component={Season} />
      </Switch>
    </div>
  );
}
