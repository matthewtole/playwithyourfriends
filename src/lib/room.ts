import {gql} from '@apollo/client';

export interface IRoom {
  id: string;
  code: string;
  created_at: string;
  updated_at: string;
  game_id?: string;
}

export interface IPlayer {
  id: string;
  name: string;
  emoji: string;
}

export const GET_ROOMS = gql`
  query getRooms {
    rooms(order_by: {created_at: desc}) {
      id
      code
      created_at
      updated_at
      players_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export interface IGetRoomsQuery {
  rooms: Array<IRoom & {players_aggregate: {aggregate: {count: number}}}>;
}

export const DELETE_ROOM = gql`
  mutation deleteRoom($id: uuid!) {
    delete_rooms_by_pk(id: $id) {
      id
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation createRoom($code: String!) {
    insert_rooms_one(object: {code: $code}) {
      id
    }
  }
`;

export const GET_ROOM = gql`
  query getRoom($id: uuid!) {
    rooms_by_pk(id: $id) {
      id
      code
      game_id
      players {
        id
        name
        emoji
      }
    }
  }
`;
export interface IGetRoomQuery {
  rooms_by_pk: Pick<IRoom, 'id' | 'code' | 'game_id'> & {
    players: Array<IPlayer>;
  };
}

export const GET_ROOMS_BY_CODE = gql`
  query getRoomsByCode($code: String!) {
    rooms(limit: 1, where: {code: {_eq: $code}}) {
      id
    }
  }
`;
export interface IGetRoomsByCodeQuery {
  rooms: Array<Pick<IRoom, 'id'>>;
}

export function generateRoomCode(): string {
  return new Array(6)
    .fill(0)
    .map(() => Math.floor(10 * Math.random()).toString())
    .join('');
}

export const JOIN_ROOM = gql`
  mutation joinRoom($name: String!, $emoji: String!, $roomId: uuid!) {
    insert_players_one(object: {emoji: $emoji, name: $name, room_id: $roomId}) {
      id
    }
  }
`;

export const GET_PLAYER_BY_ID = gql`
  query getPLayer($id: uuid!) {
    players_by_pk(id: $id) {
      id
      name
      emoji
      room {
        id
        game_id
        game_key
      }
    }
  }
`;
export interface IGetPlayerByIdQuery {
  players_by_pk: Pick<IPlayer, 'name' | 'emoji' | 'id'> & {
    room: Pick<IRoom, 'game_id' | 'id'>;
  };
}

export const SET_ROOM_GAME = gql`
  mutation setRoomGame($room: uuid!, $game: uuid!) {
    update_rooms_by_pk(
      pk_columns: {id: $room}
      _set: {game_id: $game, game_key: "sorted"}
    ) {
      game_id
      game_key
    }
  }
`;
