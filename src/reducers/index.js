import { combineReducers } from 'redux';
import Users from './Users';

const rootReducer = combineReducers({  
  users: Users
});

export default rootReducer;