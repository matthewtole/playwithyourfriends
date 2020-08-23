import {HostAction} from './actions';

export interface HostState {}

const initialState: HostState = {};

export default function reducer(
  state: HostState | undefined,
  action: HostAction
): HostState {
  if (!state) {
    return initialState;
  }
  return state;
}
