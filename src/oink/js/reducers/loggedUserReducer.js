export default (state, action) => {
  switch (action.type) {
    case 'GET_LOGGED_USER':
      return state.loggedUser;
    case 'LOGIN':
      return action.user;
    case 'LOGOUT':
      return null;
    default:
      return null;
  }
};
