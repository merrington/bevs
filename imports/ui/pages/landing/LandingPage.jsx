import { Meteor } from 'meteor/meteor';
import { Switch, Route, Link } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';
import SignInAndRegister from '/imports/ui/components/signInAndRegister/SignInAndRegister';

const Background = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  background-image: url(/images/bg-resized.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.5;
`;

const fonts = { fontFamily: 'Bebas, sans-serif' };

const GoogleSignInBtn = styled.button`
  border: 0;
  padding: 0;
  height: 46px;
  width: 191px;
  background-repeat: no-repeat;
  background: url(/images/google-signin/dark_normal.png);
  &:hover {
    background: url(/images/google-signin/dark_focus.png);
  }
  &:active {
    background: url(/images/google-signin/dark_pressed.png);
  }
`;

const PasswordSignInBtn = styled(Link)`
  border: 0;
  padding: 0;
  height: 46px;
  width: 191px;
`;

export default function LandingPage() {
  const onGoogleLoginClick = () => {
    Meteor.loginWithGoogle();
  };

  function Greeting() {
    return (
      <section className="hero is-medium">
        <div className="hero-body">
          <div className="container">
            <div className="columns">
              <div className="column is-three-quarters">
                <h1 className="title" style={fonts}>
                  BEVS
                </h1>
                <h2 className="subtitle">
                  Beer &nbsp; Experience &nbsp; Voting &nbsp; System
                </h2>
              </div>
              <div className="column">
                <div className="box has-text-centered">
                  <GoogleSignInBtn onClick={onGoogleLoginClick} />
                  <PasswordSignInBtn to="/signin" className="button is-primary">
                    Sign In with password
                  </PasswordSignInBtn>
                  <br />
                  <Link to="/register" className="is-size-7">
                    Register with password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div>
      <Background />
      {Meteor.loggingIn() ? (
        <div>Loading...</div>
      ) : (
        <Switch>
          <Route
            path="/register"
            render={props => <SignInAndRegister register={true} />}
          />
          <Route
            path="/signin"
            render={props => <SignInAndRegister register={false} />}
          />
          <Route path="/" component={Greeting} />
        </Switch>
      )}
    </div>
  );
}
