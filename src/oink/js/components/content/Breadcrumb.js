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
        <Link to={this.props.home._id} className={'breadcrumb'}>{this.props.home.name}</Link>
        {this.props.breadcrumb && this.props.breadcrumb.map((b, i) => {
          return <Link to={(this.props.returnPath || '') + b._id} key={i} onClick={this.props.fetchData} className={'breadcrumb'}>{b.name}</Link>;
        })}
      </div>
    </nav>;
  }
}

export default Breadcrumb;