// import { VisibilityFilters } from './actions'

import {combineReducers} from 'redux';

import hostReducer from './host/reducer';
import playerReducer from './player/reducer';

export default combineReducers({
  HOST: hostReducer,
  PLAYER: playerReducer,
});
