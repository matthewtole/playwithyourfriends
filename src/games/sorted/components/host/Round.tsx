import {pl} from 'date-fns/locale';
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

  function showScores() {}

  return (
    <>
      <section className="grid flex-1">
        <ul className="flex flex-1 w-full p-8 space-x-4 place-self-center">
          {round.words.map(w => (
            <div className="w-1/5 ">
              <Card
                className="relative h-32 text-2xl font-title"
                key={w.word.id}
              >
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
              <ul>
                {players
                  .filter(p => p.id !== round.judge.id)
                  .map(p =>
                    revealedCards >=
                    wordPositionForPlayer(round, w.word.id, round.judge.id)! ? (
                      <li className="text-white">
                        {p.emoji} {p.name}&nbsp;
                        {wordPositionForPlayer(round, w.word.id, p.id)}
                      </li>
                    ) : null
                  )}
              </ul>
            </div>
          ))}
        </ul>
      </section>
      <div className="flex items-center justify-center h-24 p-4 space-x-4">
        {haveAllPlayersVoted && (
          <>
            <Button
              onClick={revealNext}
              className="px-4 text-xl"
              disabled={revealedCards >= 5}
            >
              Reveal Next
            </Button>
            <Button
              onClick={showScores}
              className="px-4 text-xl"
              disabled={revealedCards < 5}
            >
              Show Scores
            </Button>
          </>
        )}
      </div>
    </>
  );
};
