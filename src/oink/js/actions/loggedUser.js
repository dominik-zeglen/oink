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
  loginUserAction,
  logoutUserAction,
};
