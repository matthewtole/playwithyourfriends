// import { VisibilityFilters } from './actions'

import {combineReducers} from '@reduxjs/toolkit';

import hostReducer from './host/reducer';
import playerReducer from './player/reducer';

const reducer = combineReducers({
  HOST: hostReducer,
  PLAYER: playerReducer,
});

export default reducer;

export type State = ReturnType<typeof reducer>;
