import { searchBeer } from '/imports/api/brewerydb/methods.js';
import debounce from 'lodash/debounce';
import Select from 'react-select';
import React from 'react';
import BeerMedia from '/imports/ui/components/beerMedia/BeerMedia';
import 'react-select/dist/react-select.css';

export default class BeerSearch extends React.Component {
  searchOptions = debounce((input, callback) => {
    searchBeer.call({ input }, (err, res) => {
      callback(err, { options: res });
    });
  }, 500);

  optionRenderer(item) {
    return <BeerMedia beer={item.beer} />;
  }

  render() {
    return (
      <div className="control">
        <Select.Async
          name="beerSearch"
          placeholder="Search for beer to add..."
          loadOptions={this.searchOptions}
          optionRenderer={this.optionRenderer}
          filterOption={() => true}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}
