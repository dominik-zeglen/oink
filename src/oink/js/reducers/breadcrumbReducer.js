export default (state, action) => {
  switch (action.type) {
    case 'BREADCRUMBS_CHANGE':
      return action.payload;
    default:
      return [];
  }
};
