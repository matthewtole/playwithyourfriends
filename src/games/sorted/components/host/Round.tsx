import * as React from 'react';

import {Button} from '../../../../components/Button';
import {Card} from '../../../../components/Card';
import {IPlayer} from '../../../../lib/room';
import {IRound} from '../../types';
import {hasPlayerSubmittedVotes, wordPositionForPlayer} from '../../utils';

export const RoundView: React.FC<{players: Array<IPlayer>; round: IRound}> = ({
  players,
  round,
}) => {
  const [revealedCards, setRevealedCard] = React.useState(0);
  const haveAllPlayersVoted = players.every(p =>
    hasPlayerSubmittedVotes(round, p.id)
  );

  function revealNext() {
    setRevealedCard(revealedCards + 1);
  }

  return (
    <>
      <ul className="flex w-full p-8 space-x-4 place-self-center">
        {round.words.map(w => (
          <Card className="relative w-1/5 h-32 font-title" key={w.word.id}>
            {w.word.word}
            {haveAllPlayersVoted &&
            revealedCards >=
              wordPositionForPlayer(round, w.word.id, round.judge.id)! ? (
              <span
                className="absolute top-0 right-0 z-10 flex items-center justify-center block w-12 h-12 text-2xl leading-none text-center text-white bg-red-600 rounded-full"
                style={{transform: 'translate(50%, -50%)'}}
              >
                {wordPositionForPlayer(round, w.word.id, round.judge.id)}
              </span>
            ) : null}
          </Card>
        ))}
      </ul>
      <div className="flex">
        <Button onClick={revealNext}>Reveal Next</Button>
      </div>
    </>
  );
};
