import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { generateAPIKey } from '/imports/api/users/methods';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showKey: false
    };

    this.toggleShowKey = this.toggleShowKey.bind(this);
  }

  toggleShowKey() {
    this.setState({
      showKey: !this.state.showKey
    });
  }

  render() {
    return (
      <div className="container">
        <p className="title">Profile</p>

        <div className="columns">
          <div className="column is-half-desktop is-full-tablet is-full-mobile">
            <div className="field">
              <label className="label">Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placholder="Name"
                  value={this.props.user.profile.name}
                  readOnly
                />
              </div>
            </div>

            <label className="label">API Key</label>
            <div className="field has-addons">
              <p className="control is-expanded">
                {this.state.showKey ? (
                  <input
                    className="input"
                    type="text"
                    placholder="API Key"
                    value={`${this.props.user.apiKey}`}
                    readOnly
                  />
                ) : (
                  <input
                    className="input"
                    type="password"
                    placholder="API Key"
                    value={`${this.props.user.apiKey}`}
                    readOnly
                  />
                )}
              </p>
              <p className="control">
                <a className="button" onClick={this.toggleShowKey}>
                  <span className="icon">
                    <i className="fa fa-eye" />
                  </span>
                </a>
              </p>
              <p className="control">
                <a className="button" onClick={() => generateAPIKey.call()}>
                  <span className="icon">
                    <i className="fa fa-refresh" />
                  </span>
                  <span>New Token</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('userData');

  return {
    user: Meteor.user()
  };
})(Profile);
