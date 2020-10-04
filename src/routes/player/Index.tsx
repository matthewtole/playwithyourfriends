import * as React from 'react';

import {useLocalStorage, writeStorage} from '@rehooks/local-storage';

import {JoinWithApollo} from './Join';
import {LobbyWithApollo} from './Lobby';

export const Player: React.FC = () => {
  const [id] = useLocalStorage('pwyf::player::room');
  
  return (
    <main className="h-screen bg-forward-slices font-title">
      <section className="max-w-xl mx-auto">
        {!id && <JoinWithApollo />}
        {id && <LobbyWithApollo id={id} />}
      </section>
    </main>
  );
};
