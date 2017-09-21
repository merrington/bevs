import React from 'react';

export default class Season extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.match.params.slug);
  }

  render() {
    return <div />;
  }
}
