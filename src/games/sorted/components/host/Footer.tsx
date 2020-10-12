import * as React from 'react';

import {IPlayer} from '../../../../lib/room';
import {IRound} from '../../types';

export const FooterView: React.FC<{
  round?: IRound;
  players: Array<IPlayer>;
}> = ({round, players}) => {
  return (
    <footer className="w-full h-16 text-black bg-white">
      <ul className="flex items-center justify-center h-full space-x-4">
        {players.map(player => (
          <li key={player.id}>
            <span className="text-4xl">{player.emoji}</span>
          </li>
        ))}
      </ul>
    </footer>
  );
};
