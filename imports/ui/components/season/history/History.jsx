import React from 'react';
import VoteHistory from '../../voteHistory/VoteHistory';

export default function History({ history }) {
  return (
    <div className="container ">
      <div className="columns is-multiline is-mobile is-5 is-variable is-centered">
        {history && history.length ? (
          history.reverse().map((historyItem, historyIdx) => (
            <div
              className="column is-half-mobile is-one-third-tablet is-one-quarter-desktop"
              key={historyIdx}
            >
              <VoteHistory {...historyItem} />
            </div>
          ))
        ) : (
          <div className="column is-half has-text-centered">
            <span className="title">No history to show - go start a vote!</span>
          </div>
        )}
      </div>
    </div>
  );
}
