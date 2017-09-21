import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export function CardModalHeader(props) {
  return (
    <header className="modal-card-head">
      <p className="modal-card-title">{props.title}</p>
      <button
        className="delete"
        aria-label="close"
        onClick={props.closeModal}
      />
    </header>
  );
}

export function CardModalBody(props) {
  return <section className="modal-card-body">{props.children}</section>;
}

export function CardModalFooter(props) {
  return <footer className="modal-card-foot">{props.children}</footer>;
}

class CardModal extends React.Component {
  componentDidMount() {
    this.modalDiv = document.createElement('div');
    document.body.appendChild(this.modalDiv);
    this._renderPopup();
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.modalDiv);
    document.body.removeChild(this.modalDiv);
  }

  componentDidUpdate() {
    this._renderPopup();
  }

  _renderPopup() {
    ReactDOM.render(
      <div className="modal is-active">
        <div className="modal-background" onClick={this.props.closeModal} />
        <div className="modal-card">{this.props.children}</div>
      </div>,
      this.modalDiv
    );
  }

  render() {
    return null;
  }
}

CardModal.propTypes = {
  show: PropTypes.bool,
  closeModal: PropTypes.func
};

export const CardModalContainer = withTracker(() => {
  return {};
})(CardModal);
