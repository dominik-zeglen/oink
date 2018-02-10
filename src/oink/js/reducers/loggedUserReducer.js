export default (action, state) => {
  if (!action) {
    return state.loggedUser;
  }
  switch (action.type) {
    case 'GET_LOGGED_USER':
      return state.loggedUser;
    case 'LOGIN':
      return state.payload;
    case 'LOGOUT':
      return null;
    default:
      return state.loggedUser;
  }
};
