import React from 'react';
import { NavLink } from 'react-router-dom';

export default class SeasonMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      seasonSlug: this.props.match.params.slug
    };
  }

  render() {
    return (
      <div className="navbar-start">
        <NavLink
          to={`/season/${this.state.seasonSlug}`}
          exact
          className="navbar-item"
          activeClassName="is-active"
        >
          Standings
        </NavLink>
        <NavLink
          to={`/season/${this.state.seasonSlug}/voting`}
          className="navbar-item"
          activeClassName="is-active"
        >
          Voting
        </NavLink>
        <NavLink
          to={`/season/${this.state.seasonSlug}/history`}
          className="navbar-item"
          activeClassName="is-active"
        >
          History
        </NavLink>
        <NavLink
          to={`/season/${this.state.seasonSlug}/settings`}
          className="navbar-item"
          activeClassName="is-active"
        >
          Settings
        </NavLink>
      </div>
    );
  }
}
