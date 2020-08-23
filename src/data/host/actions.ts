export const enum HostActionType {
  SET_ROOM_CODE = 'HOST/SET_ROOM_CODE',
}

export interface SetRoomCodeAction {
  type: HostActionType.SET_ROOM_CODE;
  data: {
    roomCode: string;
  };
}

export type HostAction = SetRoomCodeAction;
