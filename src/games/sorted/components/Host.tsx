import * as React from 'react';

import {gql, useQuery} from '@apollo/client';

import {Loading} from '../../../components/Loading';
import {IPlayer, IRoom} from '../../../lib/room';

const GET_GAME = gql`
  query getGame($id: uuid!) {
    sorted_games_by_pk(id: $id) {
      words {
        word
      }
      room {
        players {
          name
          avatar_key
          id
        }
      }
      rounds(order_by: {number: desc}) {
        words {
          word {
            word
          }
        }
      }
    }
  }
`;
interface IGetGameQuery {
  sorted_games_by_pk: {
    words: Array<{word: string}>;
    room: {players: Array<IPlayer>};
    rounds: Array<{words: {word: {word: string}}}>;
  };
}

export const SortedHost: React.FC<{id: string}> = ({id}) => {
  const {error, loading, data} = useQuery<IGetGameQuery>(GET_GAME, {
    variables: {id},
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data) {
    return null;
  }

  const game = data.sorted_games_by_pk;

  if (game.rounds.length) {
    // TODO: Render the current round
  }

  // TODO: Render the pre-game UI

  return (
    <div className="flex flex-col w-screen h-screen">
      <header className="w-full h-8 text-white bg-black">SORTED</header>
      <section className="grid flex-1">
        <div className="p-8 text-xl bg-white bg-opacity-50 border-4 border-black rounded place-self-center font-title">
          <p>Each player must write at least 5 cards to start the game!</p>
        </div>
      </section>
      <footer className="w-full h-16 text-black bg-white">
        <ul className="flex items-center justify-center h-full space-x-4">
          {game.room.players.map(player => (
            <li key={player.id}>
              <span>{player.name}</span>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );

  return <pre>{JSON.stringify({error, loading, data}, null, 2)}</pre>;
};
