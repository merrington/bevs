import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

class Voting extends React.Component {
  render() {
    return <div className="container" />;
  }
}

export default withTracker(() => {
  return {};
})(Voting);
