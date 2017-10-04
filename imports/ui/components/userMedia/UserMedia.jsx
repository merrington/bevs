import React from 'react';

export default function UserMedia({ user, right }) {
  return (
    <div className="media">
      <figure className="media-left">
        <p className="image is-64x64">
          <img src={user.profile.picture} />
        </p>
      </figure>
      <div className="media-content">{user.profile.name}</div>
      {right ? <div className="media-right">{right(user)}</div> : ''}
    </div>
  );
}
