import * as React from 'react';

import {useLocalStorage, useRoom} from '../../lib/hooks';
import {addPlayerToRoom, getRoomByCode, removePlayerFromRoom} from '../../lib/room';
import {PlayerJoin} from './Join';
import {PlayerLobby} from './Lobby';

export const Player: React.FC = () => {
  const [roomId, setRoomId] = useLocalStorage<string | undefined>(
    'pwyf-player-room',
    undefined
  );
  const [playerId, setPlayerId] = useLocalStorage<string | undefined>(
    'pwyf-player-id',
    undefined
  );
  const [room, roomError] = useRoom(roomId);

  React.useEffect(() => {
    if (roomError && roomId) {
      setRoomId(undefined);
    }
  }, [roomError]);

  async function joinRoom(roomCode: string, playerInfo: {name: string}) {
    const room = await getRoomByCode(roomCode);
    const id = await addPlayerToRoom(room.id, playerInfo);
    setRoomId(room.id);
    setPlayerId(id);
  }

  async function handleLogout() {
    await removePlayerFromRoom(roomId!, playerId!);
    setRoomId(undefined);
    setPlayerId(undefined);
  }

  return (
    <main className="h-screen bg-forward-slices font-title">
      <section className="max-w-xl p-4 mx-auto">
        {room ? (
          <PlayerLobby onLogout={handleLogout} />
        ) : (
          <PlayerJoin
            onJoin={({roomCode, name}) => joinRoom(roomCode, {name})}
          />
        )}
      </section>
    </main>
  );
};
