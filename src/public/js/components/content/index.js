import React from 'react';
import {Route, Switch} from 'react-router-dom';

import ManageIndex from './ManageIndex';
import ManageCategoryList from './ManageCategoryList';

class Content extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className={'container-content'}>
      <Switch>
        <Route exact path={this.props.rootPath + '/'} component={ManageIndex} />
        <Route path={this.props.rootPath + '/list/:id'} component={ManageCategoryList} />
      </Switch>
    </div>;
  }
}

export default Content;