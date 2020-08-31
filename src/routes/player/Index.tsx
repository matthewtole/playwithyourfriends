import * as React from 'react';

import {useLocalStorage, usePlayer, useRoom} from '../../lib/hooks';
import {
  addPlayerToRoom,
  getRoomByCode,
  removePlayerFromRoom,
  updatePlayerPing,
} from '../../lib/room';
import {PlayerGame} from './Game';
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
  const [player] = usePlayer(roomId, playerId);

  React.useEffect(() => {
    if (roomError && roomId) {
      setRoomId(undefined);
    }
  }, [roomError]);

  React.useEffect(() => {
    if (roomId && playerId) {
      const interval = setInterval(() => {
        updatePlayerPing(roomId, playerId);
      }, 60 * 1000);

      return () => clearInterval(interval);
    }
    return;
  }, [roomId, playerId]);

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

  const mode = room && player ? (room.game ? 'game' : 'lobby') : 'join';

  return (
    <main className="h-screen bg-forward-slices font-title">
      <section className="max-w-xl mx-auto">
        {mode === 'game' && (
          <PlayerGame room={room!} player={player!} playerId={playerId!} />
        )}
        {mode === 'lobby' && (
          <PlayerLobby onLogout={handleLogout} room={room!} player={player!} />
        )}
        {mode === 'join' && (
          <PlayerJoin
            onJoin={({roomCode, name}) => joinRoom(roomCode, {name})}
          />
        )}
      </section>
    </main>
  );
};
