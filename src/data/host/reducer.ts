import {HostAction, HostActionType, SetRoomCodeAction} from './actions';

export interface Player {
  id: string;
  name: string;
  avatar: number;
}

export interface HostState {
  roomCode?: string;
  players?: ReadonlyArray<Player>;
}

export const initialState: HostState = {};

function handleSetRoomCode(
  state: HostState,
  data: SetRoomCodeAction['data']
): HostState {
  return {
    ...state,
    roomCode: data.roomCode,
  };
}

export default function reducer(
  state: Readonly<HostState> | undefined,
  action: HostAction
): Readonly<HostState> {
  if (!state) {
    return initialState;
  }
  switch (action.type) {
    case HostActionType.SET_ROOM_CODE:
      return handleSetRoomCode(state, action.data);
    default:
      return state;
  }
}
