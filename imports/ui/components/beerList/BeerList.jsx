import React from 'react';
import BeerMedia from '/imports/ui/components/beerMedia/BeerMedia';

export default class BeerList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="box">
        {this.props.beers.map(beer => (
          <BeerMedia beer={beer} right={this.props.right} key={beer.id} />
        ))}
      </div>
    );
  }
}
