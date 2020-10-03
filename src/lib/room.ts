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
