import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import get from 'lodash/get';

class Standings extends React.Component {
  constructor(props) {
    super(props);
  }

  sortUsersByPoints = (u1, u2) => {
    return getUserSeason(u2).points - getUserSeason(u1).points;
  };

  winsForUser = user => {
    const history = get(this.props.season, 'history', []);

    const wins = history.filter(history => {
      const winningBeers = history.winningBeer;
      if (winningBeers.length === 1) {
        const winningUsers = winningBeers[0].highest;
        if (winningUsers.length === 1) {
          return winningUsers[0].user === user.id;
        }
      }
      return false;
    });

    return wins.length;
  };

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
          <tbody>
            {this.props.users.sort(this.sortUsersByPoints).map((user, idx) => {
              const userSeason = user.seasons.find(
                season => season.slug === this.props.season.slug
              );
              return (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{user.profile.name}</td>
                  <td>{userSeason.points}</td>
                  <td>{this.winsForUser(user)}</td>
                  <td colSpan={3} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default (StandingsContainer = withTracker(() => {
  return {};
})(Standings));
