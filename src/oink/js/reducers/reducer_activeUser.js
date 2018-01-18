const defaultActiveUser = null;

function activeUser(state = defaultActiveUser, action) {
  switch (action.type) {
    case 'LOGOUT_USER':
      return null;
    case 'LOGIN_USER_SUCCESS':
      return action.user;
    default:
      return state;
  }
}

export {
  activeUser as default,
};
