import { searchBeer } from '/imports/api/brewerydb/methods.js';
import debounce from 'lodash/debounce';
import Select from 'react-select';
import React from 'react';
import 'react-select/dist/react-select.css';

export default class BeerSearch extends React.Component {
  constructor(props) {
    super(props);
  }

  searchOptions = debounce((input, callback) => {
    searchBeer.call({ input }, (err, res) => {
      callback(err, { options: res });
    });
  }, 500);

  optionRenderer(item, index, b) {
    const imgsrc = item.labels.icon
      ? item.labels.icon
      : item.labels.medium
        ? item.labels.medium
        : item.labels.large ? item.labels.large : '';
    return (
      <div className="media" key={item.value}>
        <figure className="media-left">
          <p className="image is-64x64">
            <img src={imgsrc} />
          </p>
        </figure>
        <div className="media-content">{item.label}</div>
      </div>
    );
  }

  render() {
    return (
      <Select.Async
        name="beerSearch"
        loadOptions={this.searchOptions}
        optionRenderer={this.optionRenderer}
        filterOption={() => true}
      />
    );
  }
}
