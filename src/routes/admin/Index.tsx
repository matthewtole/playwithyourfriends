import * as React from 'react';
import {firestore} from '../../lib/firebase';
import {formatRelative} from 'date-fns';
import {useCollection} from 'react-firebase-hooks/firestore';

export const Admin: React.FC = () => {
  // const [rooms, setRooms] = React.useState<any[]>([]);

  // React.useEffect(() => {
  //   return firestore.collection('rooms').onSnapshot(next => {
  //     setRooms(next.docs.map(snapshot => snapshot.data()));
  //   });
  // }, [setRooms]);
  const [rooms, loading, error] = useCollection(firestore.collection('rooms'));

  return (
    <main className="flex w-screen h-screen p-8 overflow-none">
      <table className="w-full mb-4 bg-white border text-md">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left border-r">Code</th>
            <th className="p-2 text-left border-r">Created</th>
            <th className="p-2 text-left border-r">Last Ping</th>
            <th className="p-2 text-left">Current Game</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={4}>LOADING</td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan={4}>{error}</td>
            </tr>
          )}
          {rooms &&
            rooms.docs
              .map(room => room.data())
              .map(room => (
                <tr className="border-b hover:bg-orange-100">
                  <td className="p-2 border-r">{room.code}</td>
                  <td className="p-2 border-r">
                    {formatRelative(room.createdAt, Date.now())}
                  </td>
                  <td className="p-2 border-r">
                    {formatRelative(room.lastPing, Date.now())}
                  </td>
                  <td className="p-2">{room.game?.name}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </main>
  );
};
