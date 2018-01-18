import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import ManageIndex from './ManageIndex';
import ManageCategoryList from './ManageCategory';
import ManageModule from './ManageModule';
import ManageObject from './ManageObject';
import { loginUser, loginUserError, loginUserSuccess } from '../../actions';

function renderContentContainer(props) {
  return (
    <div className="container-content">
      <Switch>
        <Route
          exact
          path={`${props.rootPath}/`}
          component={ManageIndex}
        />
        {props.activeUser && (
          <div>
            <Route
              exact
              path={`${props.rootPath}/list/`}
              component={props.activeUser ? ManageCategoryList : ManageIndex}
            />
            <Route
              path={`${props.rootPath}/list/:id`}
              component={props.activeUser ? ManageCategoryList : ManageIndex}
            />
            <Route
              exact
              path={`${props.rootPath}/modules/`}
              component={props.activeUser ? ManageModule : ManageIndex}
            />
            <Route
              path={`${props.rootPath}/modules/:id`}
              component={props.activeUser ? ManageModule : ManageIndex}
            />
            <Route
              path={`${props.rootPath}/object/:id`}
              component={props.activeUser ? ManageObject : ManageIndex}
            />
          </div>
        )}
      </Switch>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    activeUser: state.activeUser,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginUser, loginUserSuccess, loginUserError }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(renderContentContainer);
