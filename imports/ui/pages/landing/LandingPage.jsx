import { Meteor } from "meteor/meteor";
import React from "react";
import styled from "styled-components";

const Background = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  background-image: url(/images/bg-resized.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.5;
`;

const fonts = { fontFamily: "Bebas, sans-serif" };

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

export default function LandingPage() {
  const onGoogleLoginClick = () => {
    Meteor.loginWithGoogle();
  };

  function Greeting() {
    if (Meteor.loggingIn()) {
      return <div>Loading...</div>;
    }
    return <GoogleSignInBtn onClick={onGoogleLoginClick} />;
  }

  return (
    <div>
      <Background />
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
                <Greeting />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
