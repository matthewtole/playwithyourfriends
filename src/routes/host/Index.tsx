import * as React from 'react';

import {Player} from '../../data/host/reducer';
import {generateRoomCode} from '../../data/host/utils';
import * as Sorted from '../../games/sorted';
import {firestore} from '../../lib/firebase';
import {useLocalStorage, useRoom} from '../../lib/hooks';
import {HostGame} from './Game';
import {HostLobby} from './Lobby';

export interface Room {
  code: string;
  createdAt: number;
  lastPing?: number;
  game?: {
    name: string;
    id: string;
  };
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
        setPlayers(
          next.docs.map(doc => ({...doc.data(), id: doc.id} as Player))
        );
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

  async function startGame() {
    const id = await Sorted.create(players.map(p => p.id));
    await firestore
      .collection('rooms')
      .doc(roomId)
      .update({
        game: {
          name: 'sorted',
          id,
        },
      });
  }

  return (
    <main className="flex w-screen h-screen bg-forward-slices overflow-none">
      {room && !room.game && (
        <HostLobby room={room} players={players} onStartGame={startGame} />
      )}
      {room && room.game && <HostGame room={room} players={players} />}
    </main>
  );
};
