import React from 'react';
import { newSeason } from '/imports/api/seasons/methods';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import {
  CardModalContainer,
  CardModalHeader,
  CardModalBody,
  CardModalFooter
} from '../modal/CardModal';

export default class NewSeasonModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creating: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  handleCreate() {
    this.setState({
      creating: true
    });

    newSeason.call(
      {
        name: this.state.newSeasonName
      },
      (err, res) => {
        if (err) {
          this.setState({
            newSeasonError: err.details,
            creating: false
          });
        } else {
          this.props.history.push(`/season/${res}`);
        }
      }
    );
  }

  printErrors(errors) {
    return errors.map(error => (
      <div>
        <p>
          {error.name} {error.type}
        </p>
      </div>
    ));
  }

  render() {
    return (
      <CardModalContainer
        show={this.state.showNewSeasonModal}
        closeModal={this.props.closeModal}
      >
        <CardModalHeader
          title="New Season"
          closeModal={this.props.closeModal}
        />
        <CardModalBody>
          <div className="field">
            <label className="label">Name</label>
            <div className="control is-expanded">
              <input
                className="input"
                type="text"
                name="newSeasonName"
                onChange={this.handleChange}
              />
            </div>
          </div>
          {this.state.newSeasonError ? (
            <div className="notification is-danger">
              <p className="title is-5">Error</p>
              <p>Please fix the following issues</p>
              {this.printErrors(this.state.newSeasonError)}
            </div>
          ) : (
            ''
          )}
        </CardModalBody>
        <CardModalFooter>
          <a
            className={`button is-primary ${this.state.creating
              ? 'is-loading'
              : ''}`}
            onClick={this.handleCreate}
            disabled={this.state.creating}
          >
            Create
          </a>
        </CardModalFooter>
      </CardModalContainer>
    );
  }
}
