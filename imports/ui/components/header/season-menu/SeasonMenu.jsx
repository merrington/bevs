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
          <span className="icon">
            <i className="fa fa-list-ol" />
          </span>
          <span>Standings</span>
        </NavLink>
        <NavLink
          to={`/season/${this.state.seasonSlug}/voting`}
          className="navbar-item"
          activeClassName="is-active"
        >
          <span className="icon">
            <i className="fa fa-check-square-o" />
          </span>
          <span>Voting</span>
        </NavLink>
        <NavLink
          to={`/season/${this.state.seasonSlug}/history`}
          className="navbar-item"
          activeClassName="is-active"
        >
          <span className="icon">
            <i className="fa fa-book" />
          </span>
          <span>History</span>
        </NavLink>
        <NavLink
          to={`/season/${this.state.seasonSlug}/settings`}
          className="navbar-item"
          activeClassName="is-active"
        >
          <span className="icon">
            <i className="fa fa-cogs" />
          </span>
          <span>Settings</span>
        </NavLink>
      </div>
    );
  }
}
