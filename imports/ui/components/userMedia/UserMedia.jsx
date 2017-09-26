import React from 'react';

export default function UserMedia(props) {
  return (
    <div className="media">
      <figure className="media-left">
        <p className="image is-64x64">
          <img src={props.user.profile.picture} />
        </p>
      </figure>
      <div className="media-content">{props.user.profile.name}</div>
      {props.right ? (
        <div className="media-right">{props.right(props.user)}</div>
      ) : (
        ''
      )}
    </div>
  );
}
