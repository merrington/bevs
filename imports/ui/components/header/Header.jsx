import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Switch, Route } from 'react-router-dom';
import SeasonMenu from './season-menu/SeasonMenu';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  logoutHandler() {
    Meteor.logout();
    this.props.history.push('/');
  }

  render() {
    return (
      <nav
        className="navbar navbar-expand-lg is-dark"
        style={{ marginBottom: 15 }}
      >
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
          <Route path={'/season/:slug'} component={SeasonMenu} />
          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">
                {this.props.currentUser.profile.name}
              </a>
              <div className="navbar-dropdown is-right">
                <NavLink className="navbar-item" to="/profile">
                  Profile
                </NavLink>
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

export default (HeaderContainer = withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(Header));
