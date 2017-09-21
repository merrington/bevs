import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';
import LoginBtn from './login-btn/LoginBtn.jsx';

class Header extends Component {
  logoutHandler() {
    Meteor.logout();
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg is-dark">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item is-size-5">
            <i className="fa fa-beer fa-lg" /> &nbsp; BEVS 3.0
          </Link>
        </div>

        <button className="navbar-burger">
          <span />
          <span />
          <span />
        </button>

        <div className="navbar-menu" id="navbarToggle">
          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">
                {this.props.currentUser.profile.name}
              </a>
              <div className="navbar-dropdown is-right">
                <a className="navbar-item" onClick={this.logoutHandler}>
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default createContainer(
  () => ({
    currentUser: Meteor.user()
  }),
  Header
);
