import * as React from 'react';

import {useQuery} from '@apollo/client';

import {Header} from '../../../../components/Header';
import {Loading} from '../../../../components/Loading';
import {IPlayer} from '../../../../lib/room';
import {
  GET_GAME_FOR_PLAYER,
  IGetGameForPlayerQuery,
  IGetGameQuery,
} from '../../queries';
import {hasPlayerSubmittedVotes, numWordsForPlayer} from '../../utils';
import {RoundView} from './RoundView';
import {WordForm} from './WordForm';

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
    <main>
      <Header game="SORTED" name={player.name} />
      {currentRound &&
        (hasPlayerSubmittedVotes(currentRound, player.id) ? (
          <></>
        ) : (
          <RoundView round={currentRound} playerId={player.id} />
        ))}
      {!currentRound && numWordsForPlayer(game, player.id) < 5 ? (
        <WordForm game={game} playerId={player.id} />
      ) : null}
    </main>
  );
};
