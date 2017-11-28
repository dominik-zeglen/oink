import React from 'react';
import {Route, Switch} from 'react-router-dom';

import ManageIndex from './ManageIndex';
import ManageCategoryList from './ManageCategory';
import ManageModule from './ManageModule';
import ManageObject from './ManageObject';

class Content extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className={'container-content'}>
      <Switch>
        <Route exact path={this.props.rootPath + '/'}
               render={(props) => (<ManageIndex userActions={{changeUser: this.props.changeUser,
                 user: this.props.user}} {...props} />)} />
        <Route exact path={this.props.rootPath + '/list/'} component={ManageCategoryList} />
        <Route path={this.props.rootPath + '/list/:id'} component={ManageCategoryList} />
        <Route exact path={this.props.rootPath + '/modules/'} component={ManageModule} />
        <Route path={this.props.rootPath + '/modules/:id'} component={ManageModule} />
        <Route path={this.props.rootPath + '/object/:id'} component={ManageObject} />
      </Switch>
    </div>;
  }
}

export default Content;