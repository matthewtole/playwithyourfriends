import {PlayerAction} from './actions';

export interface PlayerState {}

const initialState: PlayerState = {};

export default function reducer(
  state: PlayerState | undefined,
  action: PlayerAction
): PlayerState {
  if (!state) {
    return initialState;
  }
  return state;
}
