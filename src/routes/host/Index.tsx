import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  Redirect,
} from 'react-router-dom';
import {Hand} from '../../components/host/Hand';
import {Avatar} from '../../components/avatars/Avatar';

interface Player {
  id: string;
  name: string;
  avatar: number;
}

export const Host: React.FC = () => {
  let {path} = useRouteMatch();
  const roomCode = '12345';
  const players: Array<Player | null> = [
    {
      id: '0',
      name: 'MATTHEW',
      avatar: 1,
    },
  ];

  return (
    <main className="flex w-screen h-screen bg-forward-slices overflow-none">
      <div className="w-2/3">
        <ul className="flex flex-wrap m-8 space-x-4 space-y-4">
          {players.map((p, index) =>
            p ? (
              <li key={p.id}>
                <Avatar name={p.name} variant={p.avatar} />
              </li>
            ) : (
              <li key={index}>
                <Avatar />
              </li>
            )
          )}
        </ul>
      </div>
      <div className="flex-shrink w-1/3">
        <Hand roomCode={roomCode} />
      </div>
    </main>
  );
};
