import * as React from 'react';

import {useMutation} from '@apollo/client';

import {Button} from '../../../../components/Button';
import {SUBMIT_VOTE} from '../../mutations';
import {IRound} from '../../types';
import {SortedCards} from './SortableCards';

export const RoundView: React.FC<{round: IRound; playerId: string}> = ({
  round,
  playerId,
}) => {
  const [sortedWords, setSortedWords] = React.useState(
    round.words.map(w => w.word)
  );
  const [submitVoteMutation] = useMutation(SUBMIT_VOTE);

  async function submitOrder() {
    await Promise.all(
      sortedWords.map((w, index) =>
        submitVoteMutation({
          variables: {
            round: round.id,
            player: playerId,
            word: w.id,
            position: index + 1,
          },
        })
      )
    );
  }

  return (
    <div>
      {round.judge.id === playerId ? (
        <p className="p-2 m-2 text-sm text-center bg-white">
          Sort these items in order of how important YOU think they are.
        </p>
      ) : (
        <p className="p-2 m-2 text-sm text-center bg-white">
          Sort these items in order of how important {round.judge.name} thinks
          they are.
        </p>
      )}
      <p className="p-2 text-xl text-center text-white opacity-50 font-body">
        MOST IMPORTANT
      </p>
      <SortedCards words={sortedWords} onUpdateOrder={setSortedWords} />
      <p className="p-2 text-xl text-center text-white opacity-50 font-body">
        LEAST IMPORTANT
      </p>
      <Button onClick={submitOrder}>DONE</Button>
    </div>
  );
};
