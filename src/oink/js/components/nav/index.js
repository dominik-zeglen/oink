import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';
import PersonIcon from 'material-ui/svg-icons/social/person';

import Sidebar from './Sidebar';
import { logoutUser, logoutUserSuccess, logoutUserError } from '../../actions';
import { THEME_COLORS } from '../../misc';

const appBarStyle = {
  position: 'relative',
  height: '66px',
  backgroundColor: THEME_COLORS.primary,
};
const currentUserNameLabelStyle = {
  position: 'relative',
  top: '16px',
  marginRight: '1rem',
  color: '#fff',
};
const iconStyle = {
  position: 'relative',
  top: '20px',
  fill: '#fff',
  cursor: 'pointer',
  marginLeft: '.5rem',
};

class NavVisual extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.handleToggle = this.handleToggle.bind(this);
  }
  handleToggle() {
    this.setState(prevState => ({ open: !prevState.open }));
  }

  render() {
    return (
      <div>
        <AppBar title="Oink!" style={appBarStyle} onLeftIconButtonClick={this.handleToggle}>
          {this.props.activeUser && (
            <div>
              <span style={currentUserNameLabelStyle}>{this.props.activeUser}</span>
              <PersonIcon style={iconStyle} />
              <ExitIcon style={iconStyle} onClick={this.props.logoutUser} />
            </div>
          )}
        </AppBar>
        <Sidebar open={this.state.open} />
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
  return bindActionCreators({ logoutUser, logoutUserSuccess, logoutUserError }, dispatch);
}

const Nav = connect(mapStateToProps, mapDispatchToProps)(NavVisual);

export {
  appBarStyle,
  Nav as default,
};
