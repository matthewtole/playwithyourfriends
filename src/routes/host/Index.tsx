import * as React from 'react';

import {Player} from '../../data/host/reducer';
import {firestore} from '../../lib/firebase';
import {HostLobby} from './Lobby';

export interface Room {
  code: string;
  createdAt: number;
  lastPing?: number;
}

function useRoom(roomId?: string): Room | null {
  const [room, setRoom] = React.useState<Room | null>(null);
  React.useEffect(() => {
    if (!roomId) {
      return;
    }
    return firestore
      .collection('rooms')
      .doc(roomId)
      .onSnapshot(next => {
        setRoom(next.data() as Room);
      });
  }, [roomId]);

  return room;
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
  const [roomId, setRoomId] = React.useState<string | undefined>();

  const room = useRoom(roomId);
  const players = useRoomPlayers(roomId);

  React.useEffect(() => {
    setRoomId('JTkWEtSL5sukS8VQgN1m');
  }, []);

  return (
    <main className="flex w-screen h-screen bg-forward-slices overflow-none">
      {room && <HostLobby room={room} players={players} />}
    </main>
  );
};
