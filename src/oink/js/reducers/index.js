import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import activeUser from '../reducers/reducer_activeUser';

const rootReducer = combineReducers({
  activeUser,
  routing: routerReducer,
});

export {
  rootReducer as default,
};
