import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';


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
};

function mapStateToProps(state) {
  return { loggedUser: state.loggedUser };
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
                className={classes.flex}
              >
                {loggedUser.login}
              </Typography>
            </div>
            )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default connect(mapStateToProps)(withStyles(styles)(Nav));
