import * as React from 'react';

import {useMutation, useQuery} from '@apollo/client';

import {Button} from '../../../../components/Button';
import {Header} from '../../../../components/Header';
import {Loading} from '../../../../components/Loading';
import {CREATE_ROUND} from '../../mutations';
import {GET_GAME, IGetGameQuery} from '../../queries';
import {FooterView} from './Footer';
import {RoundView} from './Round';

export const SortedHost: React.FC<{id: string}> = ({id}) => {
  const {error, loading, data} = useQuery<IGetGameQuery>(GET_GAME, {
    variables: {id},
  });
  const [createRoundMutation] = useMutation(CREATE_ROUND);

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

  async function startRound() {
    const judge = game.room.players[0].id;
    const words = [...game.words].slice(0, 5).map(w => w.id);

    await createRoundMutation({
      variables: {
        game: id,
        judge,
        number: game.rounds.length + 1,
        word1: words[0],
        word2: words[1],
        word3: words[2],
        word4: words[3],
        word5: words[4],
      },
    });
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      <Header game="SORTED" code={game.room.code} />

      {game.rounds.length ? (
        <RoundView round={game.rounds[0]} players={game.room.players} />
      ) : (
        <IntroView startRound={startRound} />
      )}
      <FooterView round={game.rounds[0]} players={game.room.players} />
    </div>
  );
};

const IntroView: React.FC<{startRound: () => void}> = ({startRound}) => {
  return (
    <>
      <div className="p-8 text-xl bg-white bg-opacity-50 border-4 border-black rounded place-self-center font-title">
        <p>Each player must write at least 5 cards to start the game!</p>
      </div>
      <Button onClick={startRound}>Start Round</Button>
    </>
  );
};
