import * as React from 'react';

import {PlayerJoin} from './Join';

export const Player: React.FC = () => {
  return (
    <main className="h-screen bg-forward-slices font-title">
      <section className="max-w-xl mx-auto">
        <PlayerJoin onJoin={console.log} />
      </section>
    </main>
  );
};
