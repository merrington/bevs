import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class Standings extends React.Component {
  constructor(props) {
    super(props);
    this.renderSeasonUsers = this.renderSeasonUsers.bind(this);
  }

  renderSeasonUsers() {
    return;
  }

  render() {
    return (
      <div className="container">
        <table className="table is-fullwidth">
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
