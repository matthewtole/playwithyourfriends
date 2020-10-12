import * as React from 'react';

import {useQuery} from '@apollo/client';

import {Header} from '../../../../components/Header';
import {Loading} from '../../../../components/Loading';
import {IPlayer} from '../../../../lib/room';
import {GET_GAME_FOR_PLAYER, IGetGameForPlayerQuery} from '../../queries';
import {hasPlayerSubmittedVotes, numWordsForPlayer} from '../../utils';
import {RoundView} from './RoundView';
import {WordForm} from './WordForm';

const WaitingForOtherPlayers: React.FC = ({children}) => (
  <>
    <div className="px-8 py-4 text-lg leading-tight text-center text-white bg-black">
      {children}
    </div>
    <div className="p-4">
      <img
        src="https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif"
        className="w-full"
      />
    </div>
  </>
);

export const SortedPlayer: React.FC<{
  id: string;
  player: Pick<IPlayer, 'id' | 'name'>;
}> = ({id, player}) => {
  const {error, loading, data} = useQuery<IGetGameForPlayerQuery>(
    GET_GAME_FOR_PLAYER,
    {
      variables: {id, player: player.id},
    }
  );

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
  const currentRound = game.rounds[0];

  return (
    <main className="flex flex-col h-screen">
      <Header game="SORTED" name={player.name} />
      {currentRound &&
        (hasPlayerSubmittedVotes(currentRound, player.id) ? (
          <WaitingForOtherPlayers>
            <p>Waiting for everyone else to submit their votes...</p>
          </WaitingForOtherPlayers>
        ) : (
          <RoundView round={currentRound} playerId={player.id} />
        ))}
      {!currentRound &&
        (numWordsForPlayer(game, player.id) < 5 ? (
          <WordForm game={game} playerId={player.id} />
        ) : (
          <WaitingForOtherPlayers>
            <p>
              Waiting for everyone else to submit their words before we can
              start the game...
            </p>
          </WaitingForOtherPlayers>
        ))}
    </main>
  );
};
