export default (action, state) => {
  if (!action) {
    return state.breadcrumbs;
  }
  switch (action.type) {
    case 'CHANGE':
      return action.payload;
    default:
      return state.breadcrumbs;
  }
};
