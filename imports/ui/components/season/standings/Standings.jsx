import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class Standings extends React.Component {
  constructor(props) {
    super(props);
    this.renderSeasonUsers = this.renderSeasonUsers.bind(this);
  }

  renderSeasonUsers() {
    getUserSeason = user =>
      user.seasons.find(season => season.slug === this.props.season.slug);

    return this.props.users
      .sort((u1, u2) => getUserSeason(u1).points - getUserSeason(u2).points)
      .map((user, idx) => {
        const userSeason = getUserSeason(user);
        return (
          <tr key={user._id}>
            <td>{idx + 1}</td>
            <td>{user.profile.name}</td>
            <td>{userSeason.points}</td>
            <td colSpan={4} />
          </tr>
        );
      });
  }

  render() {
    return (
      <div className="container">
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              <th>Points</th>
              <th>Wins</th>
              <th>Current Streak</th>
              <th>Longest Win Streak</th>
              <th>Longest Lose Streak</th>
            </tr>
          </thead>
          <tbody>{this.renderSeasonUsers()}</tbody>
        </table>
      </div>
    );
  }
}

export default (StandingsContainer = withTracker(() => {
  return {};
})(Standings));
