import * as React from 'react';
import {firestore} from '../../lib/firebase';
import {formatRelative} from 'date-fns';
import {useCollection} from 'react-firebase-hooks/firestore';
import {Button} from '../../components/Button';
import cx from 'classnames';
import {Link} from 'react-router-dom';

export const Admin: React.FC = () => {
  // const [rooms, setRooms] = React.useState<any[]>([]);

  // React.useEffect(() => {
  //   return firestore.collection('rooms').onSnapshot(next => {
  //     setRooms(next.docs.map(snapshot => snapshot.data()));
  //   });
  // }, [setRooms]);
  const [rooms, loading, error] = useCollection(firestore.collection('rooms'));
  const [deleting, setDeleting] = React.useState<string | undefined>();

  function getRoom(id: string): firebase.firestore.DocumentReference {
    return firestore.collection('rooms').doc(id);
  }

  async function deleteRoom(id: string) {
    setDeleting(id);
    const room = getRoom(id);
    const players = await room.collection('players').get();
    while (players.size) {
      await players.docs.pop()?.ref.delete();
    }
    await room.delete();
    setDeleting(undefined);
  }

  return (
    <main className="flex w-screen h-screen p-8 overflow-none">
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
          {rooms && !rooms.docs.length && (
            <tr>
              <td
                colSpan={5}
                className="p-8 text-lg text-center text-gray-500 font-body"
              >
                It's quiet, too quiet...
              </td>
            </tr>
          )}
          {rooms &&
            rooms.docs
              .map(room => ({room: room.data(), id: room.id}))
              .map(({room, id}) => (
                <tr
                  className={cx('border-b hover:bg-orange-100', {
                    'bg-gray-200': deleting === id,
                  })}
                  key={id}
                >
                  <td className="p-2 border-r">
                    <Link to={`/admin/room/${room.code}`}>{room.code}</Link>
                  </td>
                  <td className="p-2 border-r">
                    {formatRelative(room.createdAt, Date.now())}
                  </td>
                  <td className="p-2 border-r">
                    {room.lastPing && formatRelative(room.lastPing, Date.now())}
                  </td>
                  <td className="p-2 border-r">{room.game?.name || '-'}</td>
                  <td className="p-2">
                    <Button
                      disabled={!!deleting}
                      size="small"
                      onClick={() => deleteRoom(id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </main>
  );
};
