import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LandingPage from './pages/landing/LandingPage.jsx';
import Dashboard from './pages/dashboard/Dashboard';
import 'bulma/css/bulma.css';
import 'font-awesome/css/font-awesome.css';

class App extends Component {
  render() {
    if (Meteor.user()) {
      return <Dashboard />;
    }
    return <LandingPage />;
  }
}

App.propTypes = {
  currentUser: PropTypes.object
};

export default createContainer(
  () => ({
    currentUser: Meteor.user()
  }),
  App
);
