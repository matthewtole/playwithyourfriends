import * as React from 'react';

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
  if (error) {
    return <p>{error}</p>;
  }
  if (loading) {
    return <p>LOADING...</p>;
  }
  if (game?.rounds?.length) {
  } else {
    return (
      <>
        <p>
          Welcome to Sorted. Write down some words to build out the deck of
          cards.
        </p>
        <p>There are {game?.cards.length} cards</p>
      </>
    );
  }
  return (
    <>
      <pre>{JSON.stringify({game, loading, error})}</pre>
    </>
  );
};
