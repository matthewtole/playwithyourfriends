import cx from 'classnames';
import {formatRelative} from 'date-fns';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {
  ApolloClient, ApolloProvider, gql, HttpLink, InMemoryCache, useMutation, useQuery
} from '@apollo/client';

import {Button} from '../../components/Button';
import {Room} from '../host/Index';

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://willing-skunk-92.hasura.app/v1/graphql',
    }),

    cache: new InMemoryCache(),
  });
};

export const Admin: React.FC = () => {
  const client = createApolloClient();

  return (
    <ApolloProvider client={client}>
      <main className="flex w-screen h-screen p-8 overflow-none">
        <RoomList />
      </main>
    </ApolloProvider>
  );
};

const RoomList: React.FC = () => {
  const GET_ROOMS = gql`
    query getRooms {
      rooms(order_by: {created_at: desc}) {
        id
        code
        created_at
        updated_at
      }
    }
  `;

  const DELETE_ROOM = gql`
    mutation deleteRoom($id: uuid!) {
      delete_rooms_by_pk(id: $id) {
        id
      }
    }
  `;

  const {loading, error, data} = useQuery<{rooms: Array<Room>}>(GET_ROOMS, {pollInterval: 5000});
  const [deleteRoomMutation] = useMutation(DELETE_ROOM);

  const deleting = null;

  function deleteRoom(id: string) {
    deleteRoomMutation({
      variables: {id},
      optimisticResponse: true,
      update: cache => {
        const rooms = cache.readQuery<{rooms: Array<Room>}>({ query: GET_ROOMS });
        const updatedRooms = rooms!.rooms.filter(room => room.id !== id);
        cache.writeQuery({
          query: GET_ROOMS,
          data: {rooms: updatedRooms}
        });
      },
    });
  }

  return (
    <table className="w-full mb-4 bg-white border text-md">
      <thead>
        <tr className="border-b">
          <th className="p-2 text-left border-r">Code</th>
          <th className="p-2 text-left border-r">Created</th>
          <th className="p-2 text-left border-r">Last Ping</th>
          <th className="p-2 text-left border-r">Current Game</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <td
              colSpan={5}
              className="p-8 text-lg text-center text-gray-500 font-body"
            >
              LOADING
            </td>
          </tr>
        )}
        {error && (
          <tr>
            <td
              colSpan={5}
              className="p-8 text-lg text-center text-red-500 font-body"
            >
              {error}
            </td>
          </tr>
        )}
        {data && data.rooms.length === 0 && (
          <tr>
            <td
              colSpan={5}
              className="p-8 text-lg text-center text-gray-500 font-body"
            >
              It's quiet, too quiet...
            </td>
          </tr>
        )}
        {data &&
          data.rooms.map(room => (
            <tr
              className={cx('border-b hover:bg-orange-100', {
                'bg-gray-200': deleting === room.id,
              })}
              key={room.id}
            >
              <td className="p-2 border-r">
                <Link to={`/admin/room/${room.code}`}>{room.code}</Link>
              </td>
              <td className="p-2 border-r">
                {formatRelative(Date.parse(room.created_at), Date.now())}
              </td>
              <td className="p-2 border-r">
                {room.updated_at &&
                  formatRelative(Date.parse(room.updated_at), Date.now())}
              </td>
              <td className="p-2 border-r">&mdash;</td>
              <td className="p-2">
                <Button
                  disabled={!!deleting}
                  size="small"
                  onClick={() => deleteRoom(room.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
