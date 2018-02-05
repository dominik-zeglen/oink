import { combineReducers } from 'redux';

import breadcrumbReducer from './breadcrumbReducer';


export default combineReducers({
  breadcrumb: breadcrumbReducer,
});

