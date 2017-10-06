import React from 'react';
import UserMedia from '../userMedia/UserMedia';
import BeerList from '../beerList/BeerList';
import format from 'date-fns/format';

export default function VoteHistory({
  date,
  winningBeer,
  pointsAwarded,
  beerTotals
}) {
  let winningBeerImage;
  let winningUser;
  switch (winningBeer.length) {
    case 0:
      winningBeerImage = '/images/pepsi.svg';
      winningUser = <div>No winning beer</div>;
      break;
    case 1:
      winningBeerImage = winningBeer[0].beer.labels.medium;
      winningUser =
        winningBeer[0].highest.length === 1 ? (
          <UserMedia
            style={{ width: '100%' }}
            user={Meteor.users.findOne(winningBeer[0].highest[0].user)}
            right={() => (
              <span className="tag is-success is-large is-pulled-right">
                +{pointsAwarded}
              </span>
            )}
          />
        ) : (
          <div>Person tie!</div>
        );
      break;
    default:
      winningBeerImage = '/images/tie.png';
      winningUser = <div>Beer Tie!</div>;
      break;
  }

  return (
    <div className="card">
      <div className="card-header box">{winningUser}</div>
      <div className="card-image">
        <figure className="image is-1by1">
          <img src={winningBeerImage} alt="Winning beer" />
        </figure>
      </div>
      <div className="card-content" style={{ padding: 0 }}>
        <BeerList
          beers={beerTotals
            .sort((b1, b2) => b2.total - b1.total)
            .map(b => b.beer)}
          right={beer => (
            <span className="tag is-medium">
              {
                beerTotals.find(beerTotal => beerTotal.beer.id === beer.id)
                  .total
              }
            </span>
          )}
        />
      </div>
      <div className="card-footer">{format(date, 'MMMM Do, YYYY')}</div>
    </div>
  );
}
