import React from 'react';

import ContainerList from './ContainerList';
import ObjectList from './ObjectList';

class ContainerChildren extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      <ContainerList categories={this.props.categories} fetchData={this.props.fetchData} />
      <hr />
      <ObjectList categories={this.props.objects} />
    </div>;
  }
}

export default ContainerChildren;