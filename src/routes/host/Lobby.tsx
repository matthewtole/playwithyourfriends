import * as React from 'react';

import {Avatar} from '../../components/avatars/Avatar';
import {Button} from '../../components/Button';
import {Hand} from '../../components/host/Hand';
import {Player} from '../../data/host/reducer';
import {Room} from './Index';

export interface HostLobbyProps {
  players: Player[];
  room: Room;
  onStartGame: () => void;
}

export const HostLobby: React.FC<HostLobbyProps> = ({
  players,
  room,
  onStartGame: startGame,
}) => {
  return (
    <>
      <div className="w-2/3">
        <ul className="flex flex-wrap m-8 space-x-4">
          {players.map((p, index) => (
            <li key={p.name}>
              <Avatar name={p.name} variant={p.avatar || 1} />
            </li>
          ))}
        </ul>
        <div>
          <Button onClick={startGame}>Start Game</Button>
        </div>
      </div>
      <div className="flex-shrink w-1/3">
        <Hand roomCode={room.code} />
      </div>
    </>
  );
};
