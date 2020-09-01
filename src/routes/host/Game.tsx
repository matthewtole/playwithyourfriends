import * as React from 'react';

import {Button} from '../../components/Button';
import {Card} from '../../components/Card';
import {Player} from '../../data/host/reducer';
import * as Sorted from '../../games/sorted';
import {useFirestoreDoc} from '../../lib/hooks';
import {Room} from './Index';

export interface HostGameProps {
  players: Player[];
  room: Room;
}

export const HostGame: React.FC<HostGameProps> = ({players, room}) => {
  const [game, loading, error] = useFirestoreDoc<Sorted.Game>(
    'sorted',
    room.game!.id
  );

  async function startRound() {
    Sorted.startRound(game!, room.game!.id);
  }

  if (error) {
    return <p>{error}</p>;
  }
  if (loading) {
    return <p>LOADING...</p>;
  }
  if (game?.rounds?.length) {
    const round = game?.rounds[0];
    return (
      <section className="flex flex-row items-center justify-center w-screen h-screen space-x-4 font-title">
        {round.cards.map(c => (
          <Card className="w-1/6 h-48 text-4xl">{c.word}</Card>
        ))}
      </section>
    );
  } else {
    return (
      <section className="flex flex-col items-center justify-center w-screen h-screen">
        <p>
          Welcome to Sorted. Write down some words to build out the deck of
          cards.
        </p>
        <p>There are {game?.cards.length} cards</p>
        <p>
          <Button onClick={() => startRound()}>Start</Button>
        </p>
      </section>
    );
  }
  return (
    <>
      <pre>{JSON.stringify({game, loading, error}, null, 2)}</pre>
    </>
  );
};