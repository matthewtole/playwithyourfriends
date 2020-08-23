import * as React from 'react';
import {useSelector} from 'react-redux';

import {Avatar} from '../../components/avatars/Avatar';
import {Hand} from '../../components/host/Hand';
import * as Selectors from '../../data/host/selectors';

export const HostLobby: React.FC = () => {
  const players = useSelector(Selectors.players);
  const roomCode = useSelector(Selectors.roomCode);

  return (
    <>
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
        {roomCode ? <Hand roomCode={roomCode} /> : null}
      </div>
    </>
  );
};
