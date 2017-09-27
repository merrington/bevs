import React from 'react';

export default function BeerMedia(props) {
  const beer = props.beer;
  const imgsrc = beer.labels.icon
    ? beer.labels.icon
    : beer.labels.medium
      ? beer.labels.medium
      : beer.labels.large ? beer.labels.large : '';

  return (
    <div className="media">
      <figure className="media-left">
        <p className="image is-64x64">
          <img src={imgsrc} />
        </p>
      </figure>
      <div className="media-content">
        <p className="subtitle is-4">{beer.name}</p>
      </div>
      {props.right ? (
        <div className="media-right">{props.right(beer)}</div>
      ) : (
        ''
      )}
    </div>
  );
}
