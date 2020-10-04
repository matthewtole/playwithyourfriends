import {gql} from '@apollo/client';

export interface IRoom {
  id: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export const GET_ROOMS = gql`
  query getRooms {
    rooms(order_by: {created_at: desc}) {
      id
      code
      created_at
      updated_at
    }
  }
`;

export interface IGetRoomsQuery {
  rooms: Array<IRoom>;
}

export const DELETE_ROOM = gql`
  mutation deleteRoom($id: uuid!) {
    delete_rooms_by_pk(id: $id) {
      id
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation createRoom($id: String!) {
    insert_rooms_one(object: {code: "000000"}) {
      id
    }
  }
`;

export const GET_ROOM = gql`
  query getRoom($id: uuid!) {
    rooms_by_pk(id: $id) {
      id
      code
    }
  }
`;
export interface IGetRoomQuery {
  rooms_by_pk: Pick<IRoom, 'id' | 'code'>;
}

export interface IRoomPlayer {
  id: string;
  name: string;
  avatar_key: number;
}

export const GET_ROOM_PLAYERS = gql`
  query getRoomPlayers($id: uuid!) {
    room_players(where: {room_id: {_eq: $id}}) {
      id
      name
      avatar_key
    }
  }
`;
export interface IGetRoomPlayersQuery {
  room_players: Array<IRoomPlayer>;
}
