import * as React from 'react';

import {Button} from '../../components/Button';
import {Player} from '../../data/host/reducer';
import {Room} from '../host/Index';

interface PlayerLobbyProps {
  onLogout: () => void;
  player: Player;
  room: Room;
}

export const PlayerLobby: React.FC<PlayerLobbyProps> = ({
  onLogout,
  player,
  room,
}) => {
  return (
    <main>
      <header className="flex px-4 py-3 text-xl text-white bg-blue-700 border-b-4 border-blue-800">
        <h1 className="leading-none opacity-75">pwyf</h1>
      </header>
      <section className="p-4">
        <div className="p-4 bg-yellow-400">
          <p className="mb-2">Hello, {player.name}!</p>
          <p>Waiting for the rest of the players to get here...</p>
        </div>
      </section>
      <footer>
        <Button size="small" onClick={onLogout}>
          Logout
        </Button>
      </footer>
    </main>
  );
};
