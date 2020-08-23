// import { VisibilityFilters } from './actions'

import {combineReducers} from 'redux';

import hostReducer from './host/reducer';
import playerReducer from './player/reducer';
import {Reducer} from 'react';

const reducer = combineReducers({
  HOST: hostReducer,
  PLAYER: playerReducer,
});

export default reducer;

export type State = ReturnType<typeof reducer>;
