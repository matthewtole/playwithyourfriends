import * as React from 'react';

import {useLocalStorage} from '@rehooks/local-storage';

import {PLAYER_ROOM_ID} from '../../config/local-storage';
import {JoinWithApollo} from './Join';
import {LobbyWithApollo} from './Lobby';

export const Player: React.FC = () => {
  const [id] = useLocalStorage(PLAYER_ROOM_ID);

  return (
    <main className="h-screen bg-forward-slices">
      <section className="max-w-xl mx-auto">
        {!id && <JoinWithApollo />}
        {id && <LobbyWithApollo id={id} />}
      </section>
    </main>
  );
};

export default Player;
