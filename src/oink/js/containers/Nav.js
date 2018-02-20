import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';

import { logoutUserAction } from '../actions/loggedUser';
import { logoutUser } from './queries';

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  currentUserLabel: {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: '1rem',
  },
};

function mapStateToProps(state) {
  return { loggedUser: state.loggedUser };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ logoutUserAction }, dispatch);
}
function handleLogout(client, done) {
  return () => {
    client.query({ query: logoutUser })
      .then(() => done())
      .catch(err => err);
  };
}
function Nav(props) {
  const { classes, loggedUser } = props;
  // this.props.getLoggedUserAction;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.flex} />
          {loggedUser && (
            <div>
              <Typography
                variant="body1"
                color="inherit"
                className={classes.currentUserLabel}
              >
                {loggedUser.login}
              </Typography>
              <IconButton
                onClick={handleLogout(props.client, props.logoutUserAction)}
                color="inherit"
              >
                <ExitToAppIcon />
              </IconButton>
            </div>
            )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withApollo(withStyles(styles)(Nav)));
