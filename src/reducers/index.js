import { combineReducers } from 'redux';
import Viewers from './Viewers';
import Channel from './Channel';

const rootReducer = combineReducers({  
  viewers: Viewers,
  channel: Channel
});

export default rootReducer;