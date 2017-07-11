import { combineReducers } from 'redux';
import Viewers from './Viewers';

const rootReducer = combineReducers({  
  viewers: Viewers
});

export default rootReducer;