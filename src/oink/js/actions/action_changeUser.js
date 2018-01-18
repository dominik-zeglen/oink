function loginUser() {
  return {
    type: 'LOGIN_USER',
  };
}

function loginUserSuccess(user) {
  return {
    type: 'LOGIN_USER_SUCCESS',
    user,
  };
}

function loginUserError(error) {
  return {
    type: 'LOGIN_USER_ERROR',
    error,
  };
}

function logoutUser() {
  return {
    type: 'LOGOUT_USER',
  };
}

function logoutUserSuccess() {
  return {
    type: 'LOGOUT_USER_SUCCESS',
  };
}

function logoutUserError(error) {
  return {
    type: 'LOGOUT_USER',
    error,
  };
}

export {
  loginUserSuccess,
  loginUserError,
  loginUser,
  logoutUserSuccess,
  logoutUserError,
  logoutUser
};
