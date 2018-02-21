import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import grey from 'material-ui/colors/grey';

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
  drawerItem: {
    padding: '16px 24px',
    transitionTime: '200ms',
    '&:hover': {
      backgroundColor: grey[100],
    },
  },
  list: {
    '& a': {
      textDecoration: 'none',
    },
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

const menuData = [
  [
    { link: '/', label: 'Home' },
  ],
  [
    { link: '/objects', label: 'Objects' },
    { link: '/modules', label: 'Modules' },
  ],
  [
    { link: '/users', label: 'Users' },
  ],
];

@connect(mapStateToProps, mapDispatchToProps)
@withApollo
@withStyles(styles)
class Nav extends Component {
  static propTypes = {
    classes: PropTypes.object,
    client: PropTypes.object,
    loggedUser: PropTypes.shape({
      login: PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);
    this.state = { opened: false };
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
  }

  handleToggleMenu() {
    this.setState(prevState => ({ opened: !prevState.opened }));
  }

  render() {
    const {
      classes,
      loggedUser,
      client,
    } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.handleToggleMenu}
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
                  onClick={handleLogout(client, logoutUserAction)}
                  color="inherit"
                >
                  <ExitToAppIcon />
                </IconButton>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          open={this.state.opened}
          onClose={this.handleToggleMenu}
        >
          {menuData.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <List className={classes.list}>
                {section.map(menu => (
                  <Link
                    to={menu.link}
                    key={menu.label}
                  >
                    <ListItem
                      className={classes.drawerItem}
                    >
                      <ListItemText primary={menu.label} />
                    </ListItem>
                  </Link>
                ))}
              </List>
              {(sectionIndex !== 0) && (
                <Divider />
              )}
            </div>
          ))}
        </Drawer>
      </div>
    );
  }
}

export default Nav;
