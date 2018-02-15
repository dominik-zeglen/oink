function getLoggedUserAction() {
  return {
    type: 'GET_LOGGED_USER',
  };
}

function loginUserAction(user) {
  return {
    type: 'LOGIN',
    user: {
      login: user,
    },
  };
}

function logoutUserAction() {
  return {
    type: 'LOGOUT',
  };
}

export {
  getLoggedUserAction,
  loginUserAction,
  logoutUserAction,
};
