import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Reboot from 'material-ui/Reboot';
import { withStyles } from 'material-ui/styles';
import { withApollo } from 'react-apollo';

import Nav from './Nav';
import AppRouter from './AppRouter';
import Breadcrumbs from './Breadcrumbs';
import { loginUserAction } from '../actions/loggedUser';
import { getCurrentUser } from './queries';

function mapStateToProps(state) {
  return { loggedUser: state.loggedUser };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginUserAction }, dispatch);
}

const styles = {
  content: {
    margin: 'auto',
    maxWidth: '1200px',
    width: '100%',
  },
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withStyles(styles)
@withApollo
class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.client.query({ query: getCurrentUser })
      .then(({ data }) => {
        if (data.CurrentUser) {
          this.props.loginUserAction(data.CurrentUser);
        }
      })
      .catch(err => err);
  }

  render() {
    return (
      <div>
        <Reboot />
        <Nav />
        <div style={styles.content}>
          <Breadcrumbs />
          <AppRouter loggedUser={this.props.loggedUser} />
        </div>
      </div>
    );
  }
}

export default App;
