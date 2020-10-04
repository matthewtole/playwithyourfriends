import cx from 'classnames';
import {formatRelative} from 'date-fns';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {ApolloProvider, gql, useMutation, useQuery} from '@apollo/client';

import {Button} from '../../components/Button';
import {createApolloClient} from '../../lib/apollo';
import {DELETE_ROOM, GET_ROOMS, IGetRoomsQuery} from '../../lib/room';

/* istanbul ignore next */
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

export const RoomList: React.FC = () => {
  const {loading, error, data} = useQuery<IGetRoomsQuery>(GET_ROOMS, {
    pollInterval: 5000,
  });
  const [deleteRoomMutation] = useMutation(DELETE_ROOM);

  function deleteRoom(id: string) {
    deleteRoomMutation({
      variables: {id},
      optimisticResponse: true,
      update: cache => {
        const rooms = cache.readQuery<IGetRoomsQuery>({query: GET_ROOMS});
        const updatedRooms = rooms!.rooms.filter(room => room.id !== id);
        cache.writeQuery({
          query: GET_ROOMS,
          data: {rooms: updatedRooms},
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
              {error.message}
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
            <tr className={cx('border-b hover:bg-orange-100')} key={room.id}>
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
                <Button size="small" onClick={() => deleteRoom(room.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
