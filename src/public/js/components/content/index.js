import React from 'react';
import {Route, Switch} from 'react-router-dom';

import ManageIndex from './ManageIndex';
import ManageCategoryList from './ManageCategory';
import ManageModule from './ManageModule';

class Content extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className={'container-content'}>
      <Switch>
        <Route exact path={this.props.rootPath + '/'} component={ManageIndex} />
        <Route exact path={this.props.rootPath + '/list/'} component={ManageCategoryList} />
        <Route path={this.props.rootPath + '/list/:id'} component={ManageCategoryList} />
        <Route exact path={this.props.rootPath + '/modules/'} component={ManageModule} />
        <Route path={this.props.rootPath + '/modules/:id'} component={ManageModule} />
      </Switch>
    </div>;
  }
}

export default Content;