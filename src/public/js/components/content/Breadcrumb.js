import React from 'react';
import {Link} from 'react-router-dom';

import {gQL} from '../../utils';

class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <nav className={'breadcrumbs'}>
      <div className={'col s12'}>
        <Link to={'-1'} className={'breadcrumb'}>Home</Link>
        {this.props.breadcrumb.map((b, i) => {
          return <Link to={b._id} key={i} onClick={this.props.fetchData} className={'breadcrumb'}>{b.name}</Link>;
        })}
      </div>
    </nav>;
  }
}

export default Breadcrumb;