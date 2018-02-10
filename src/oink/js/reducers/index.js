import { combineReducers } from 'redux';

import breadcrumbReducer from './breadcrumbReducer';
import loggedUserReducer from './loggedUserReducer';

export default combineReducers({
  breadcrumb: breadcrumbReducer,
  loggedUser: loggedUserReducer,
});

