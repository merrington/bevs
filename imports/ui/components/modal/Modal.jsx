import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';

class Modal extends React.Component {
  render() {
    if (this.props.show) {
      <div className="modal is-active">
        <div className="modal-background" onClick={this.props.closeModal} />
        <div className="modal-content">{children}</div>
        <button className="modal-close is-large" aria-label="close" />
      </div>;
    }
  }
}

export default withTracker(() => {
  return {};
})(Modal);
