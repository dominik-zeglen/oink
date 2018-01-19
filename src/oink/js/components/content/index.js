import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import ManageIndex from './ManageIndex';
import ManageCategoryList from './ManageCategory';
import ManageModule from './ManageModule';
import ManageObject from './ManageObject';
import { loginUser, loginUserError, loginUserSuccess } from '../../actions';

class ContentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeUser: props.activeUser };
  }

  componentWillReceiveProps(props) {
    this.setState({ activeUser: props.activeUser });
  }

  render() {
    return (
      <div className="container">
        <Switch>
          <Route
            exact
            path={`${this.props.rootPath}/`}
            component={ManageIndex}
          />
          <Route
            path={`${this.props.rootPath}/list/:id`}
            component={this.state.activeUser ? ManageCategoryList : ManageIndex}
          />
          <Route
            path={`${this.props.rootPath}/modules/:id`}
            component={this.state.activeUser ? ManageModule : ManageIndex}
          />
          <Route
            path={`${this.props.rootPath}/modules/`}
            component={this.state.activeUser ? ManageModule : ManageIndex}
          />
          <Route
            path={`${this.props.rootPath}/object/:id`}
            component={this.state.activeUser ? ManageObject : ManageIndex}
          />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeUser: state.activeUser,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginUser, loginUserSuccess, loginUserError }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContentContainer));
