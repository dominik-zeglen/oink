import React from 'react';
import {Link} from 'react-router-dom';

class ContainerList extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return <div className={'row'}>
      <div className={'col s12 m6 l5'}>
        <div className={'collection'}>
          {(this.props.categories && this.props.categories.length > 0) ? (this.props.categories.map((c, i) => {
            return <div key={i} className={'collection-item'}>
              <Link to={c._id} onClick={this.fetchData}>
                <div className={'collection-item-name'}>{c.name}</div>
                <div className={'collection-item-desc'}>{c.description}</div>
              </Link>
            </div>;
          })) : 'Looks like it\'s empty.'}
        </div>
      </div>
    </div>;
  }
}

export default ContainerList;