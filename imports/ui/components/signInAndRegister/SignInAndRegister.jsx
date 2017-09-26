import React from 'react';
import { Accounts } from 'meteor/accounts-base';

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      name: '',
      password: ''
    };

    this.changeRegisterField = this.changeRegisterField.bind(this);
    this.clickActionBtn = this.clickActionBtn.bind(this);
  }

  changeRegisterField(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  clickActionBtn() {
    const username = this.state.username;
    const password = this.state.password;

    if (this.props.register) {
      const profile = {
        name: this.state.name
      };

      Accounts.createUser(
        {
          username,
          password,
          email: username,
          profile
        },
        err => {
          if (err) {
            this.setState({ loading: false });
          }
        }
      );
    } else {
      Meteor.loginWithPassword(username, password, err => {
        if (err) {
          console.error(err);
          this.setState({ loading: false });
        }
      });
    }

    this.setState({ loading: true });
  }

  render() {
    return (
      <div className="hero is-medium">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-half">
                <div className="box">
                  <div className="field">
                    <p className="control has-icons-left">
                      <input
                        className="input"
                        type="email"
                        placeholder="Email"
                        name="username"
                        onChange={this.changeRegisterField}
                      />
                      <span className="icon is-small is-left">
                        <i className="fa fa-envelope" />
                      </span>
                    </p>
                  </div>

                  {this.props.register ? (
                    <div className="field">
                      <p className="control has-icons-left">
                        <input
                          className="input"
                          type="text"
                          placeholder="Name (First and Last)"
                          name="name"
                          onChange={this.changeRegisterField}
                        />
                        <span className="icon is-small is-left">
                          <i className="fa fa-user" />
                        </span>
                      </p>
                    </div>
                  ) : (
                    ''
                  )}

                  <div className="field">
                    <p className="control has-icons-left">
                      <input
                        className="input"
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={this.changeRegisterField}
                      />
                      <span className="icon is-small is-left">
                        <i className="fa fa-lock" />
                      </span>
                    </p>
                  </div>

                  <a
                    className={`button is-success is-medium ${this.state.loading
                      ? 'is-loading'
                      : ''} `}
                    onClick={this.clickActionBtn}
                  >
                    {this.props.register ? 'Register' : 'Login'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
