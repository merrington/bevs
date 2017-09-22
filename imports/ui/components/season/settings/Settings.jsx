import React from 'react';
import BeerList from '../../beerList/BeerList';
import BeerSearch from './BeerSearch';

export default function Settings() {
  return (
    <div className="container">
      <div className="columns">
        <div className="column">
          <div className="box">
            <p className="title">Beers</p>
            <div className="columns">
              <div className="column">
                <BeerSearch />
                <BeerList />
              </div>
            </div>
          </div>
        </div>

        <div className="column">
          <div className="box">
            <p className="title">Users</p>
          </div>
        </div>
      </div>

      <div className="columns">
        <div className="column">
          <div className="box">
            <p className="title">Starting Votes</p>

            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label">Positive</label>
                  <div className="control">
                    <input className="input" type="number" min="0" />
                  </div>
                </div>
              </div>

              <div className="column">
                <div className="field">
                  <label className="label">Negative</label>
                  <div className="control">
                    <input className="input" type="number" min="0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="box">
            <p className="title">Refresh Votes</p>

            <div className="columns">
              <div className="column">
                <div className="field">
                  <div className="control">
                    <label className="checkbox">
                      <input type="checkbox" />
                      Add refresh votes on person tie
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="columns">
              <div className="column">
                <div className="field">
                  <label className="label">Positive</label>
                  <div className="control">
                    <input className="input" type="number" min="0" />
                  </div>
                </div>
              </div>

              <div className="column">
                <div className="field">
                  <label className="label">Negative</label>
                  <div className="control">
                    <input className="input" type="number" min="0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="box">
        <p className="title">Winning</p>

        <div className="field">
          <label className="label">Points to win</label>
          <div className="control">
            <input className="input" type="number" min="1" />
          </div>
        </div>
      </div>
    </div>
  );
}
