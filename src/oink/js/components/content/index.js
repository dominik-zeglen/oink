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
               render={(props) => (
                 <ManageIndex userActions={{
                   changeUser: this.props.changeUser,
                   user: this.props.user
                 }} {...props} />)}/>
        {this.props.user &&
        <div>
          <Route exact path={this.props.rootPath + '/list/'}
                 component={this.props.user ? ManageCategoryList : ManageIndex}/>
          <Route path={this.props.rootPath + '/list/:id'}
                 component={this.props.user ? ManageCategoryList : ManageIndex}/>
          <Route exact path={this.props.rootPath + '/modules/'}
                 component={this.props.user ? ManageModule : ManageIndex}/>
          <Route path={this.props.rootPath + '/modules/:id'}
                 component={this.props.user ? ManageModule : ManageIndex}/>
          <Route path={this.props.rootPath + '/object/:id'}
                 component={this.props.user ? ManageObject : ManageIndex}/>
        </div>
        }
      </Switch>
    </div>;
  }
}

export default Content;