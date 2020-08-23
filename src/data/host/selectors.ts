import {HostState} from './reducer';
import {State} from '../reducer';
import {initialState, Player} from './reducer';

function getHostState(state: State): HostState {
  return state.HOST ?? initialState;
}

export function roomCode(state: State): string | undefined {
  return getHostState(state).roomCode;
}

const noPlayers: ReadonlyArray<Player> = [];
export function players(state: State): ReadonlyArray<Player> {
  return getHostState(state).players || noPlayers;
}
