import * as React from 'react';

import {Player} from '../../data/host/reducer';
import {generateRoomCode} from '../../data/host/utils';
import {firestore} from '../../lib/firebase';
import {useLocalStorage, useRoom} from '../../lib/hooks';
import {HostLobby} from './Lobby';

export interface Room {
  code: string;
  createdAt: number;
  lastPing?: number;
}

export async function createRoom(code?: string): Promise<string> {
  if (!code) {
    code = generateRoomCode();
  }
  const doc = await firestore.collection('rooms').add({
    code,
    createdAt: Date.now(),
  });
  return doc.id;
}

function useRoomPlayers(roomId?: string): Player[] {
  const [players, setPlayers] = React.useState<Player[]>([]);
  React.useEffect(() => {
    if (!roomId) {
      return;
    }
    return firestore
      .collection('rooms')
      .doc(roomId)
      .collection('players')
      .onSnapshot(next => {
        setPlayers(next.docs.map(doc => doc.data() as Player));
      });
  }, [roomId]);

  return players;
}

export const Host: React.FC = () => {
  const [roomId, setRoomId] = useLocalStorage<string | undefined>(
    'pwyf-host-room',
    undefined
  );

  const [room, roomError] = useRoom(roomId);
  const players = useRoomPlayers(roomId);

  React.useEffect(() => {
    (async () => {
      if (!roomId) {
        const id = await createRoom();
        setRoomId(id);
      }
    })();
  }, [roomId]);

  React.useEffect(() => {
    console.log(roomError, roomId);
    if (roomError && roomId) {
      setRoomId(undefined);
    }
  }, [roomError]);

  return (
    <main className="flex w-screen h-screen bg-forward-slices overflow-none">
      {room && <HostLobby room={room} players={players} />}
    </main>
  );
};
