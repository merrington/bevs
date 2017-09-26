import React from 'react';
import Portal from 'react-portal';
import Modal from '../modal/Modal';
import { Invites } from '/imports/api/invites/Invites';
import { Seasons } from '/imports/api/seasons/Seasons';
import { acceptInvite, declineInvite } from '/imports/api/invites/methods';
import { withTracker } from 'meteor/react-meteor-data';

class AcceptInvite extends React.Component {
  constructor(props) {
    super(props);

    this.acceptInvite = this.acceptInvite.bind(this);
    this.declineInvite = this.declineInvite.bind(this);
  }

  acceptInvite() {
    const slug = this.props.season.slug;
    acceptInvite.call(
      {
        slug,
        token: this.props.match.params.token
      },
      err => {
        if (!err) {
          //redirect to the season
          this.props.history.push(`/season/${slug}`);
        }
      }
    );
  }

  declineInvite() {
    declineInvite.call({ token: this.props.match.params.token }, err => {
      if (!err) {
        //redirect to the dashboard
        this.props.history.push('/');
      }
    });
  }

  render() {
    if (this.props.ready) {
      return (
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <div className="card">
                <div className="card-header">
                  <p className="card-header-title is-centered">Accept Invite</p>
                </div>
                <div className="card-content">
                  <div className="content">
                    Join Season {this.props.season.name}?
                  </div>
                </div>
                <div className="card-footer">
                  <a className="card-footer-item" onClick={this.acceptInvite}>
                    Join
                  </a>
                  <a className="card-footer-item" onClick={this.declineInvite}>
                    Decline
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div>Loading</div>;
  }
}

export default withTracker(props => {
  const token = props.match.params.token;
  const tokenSub = Meteor.subscribe('invites.token', token);
  const invite = Invites.findOne({ token });
  const slug = invite ? invite.slug : undefined;
  const seasonSubHandle = Meteor.subscribe('season.slug', slug);

  return {
    ready: tokenSub.ready() && seasonSubHandle.ready(),
    season: Seasons.findOne({ slug })
  };
})(AcceptInvite);
