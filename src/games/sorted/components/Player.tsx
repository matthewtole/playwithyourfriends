import * as cx from 'classnames';
import {isDirective} from 'graphql';
import * as React from 'react';
import {
  DragDropContext, Draggable, Droppable, DropResult, ResponderProvided
} from 'react-beautiful-dnd';

import {useMutation, useQuery} from '@apollo/client';

import {Button} from '../../../components/Button';
import {Card} from '../../../components/Card';
import {Header} from '../../../components/Header';
import {Loading} from '../../../components/Loading';
import {SUBMIT_VOTE} from '../mutations';
import {GET_GAME, GET_GAME_FOR_PLAYER, IGetGameForPlayerQuery, IGetGameQuery} from '../queries';
import {IRound} from '../types';
import {hasPlayerSubmittedVotes} from '../utils';

export const SortedPlayer: React.FC<{id: string; playerId: string}> = ({
  id,
  playerId,
}) => {
  const {error, loading, data} = useQuery<IGetGameForPlayerQuery>(
    GET_GAME_FOR_PLAYER,
    {
      variables: {id, player: playerId},
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
      <Header />
      {currentRound &&
        (hasPlayerSubmittedVotes(currentRound, playerId) ? (
          <></>
        ) : (
          <RoundView round={currentRound} playerId={playerId} />
        ))}
    </main>
  );
};

const RoundView: React.FC<{round: IRound; playerId: string}> = ({
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
      <p className="p-2 m-2 text-sm text-center bg-white">
        Sort these items in order of how important {round.judge.name} thinks
        they are.
      </p>
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

const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const SortedCards: React.FC<{
  words: Array<{word: string; id: string}>;
  onUpdateOrder: (words: Array<{word: string; id: string}>) => void;
}> = ({words, onUpdateOrder}) => {
  const getListStyle = (isDraggingOver: boolean) => ({});
  const getItemStyle = (
    isDragging: boolean,
    draggableStyle?: React.CSSProperties
  ): React.CSSProperties => ({
    userSelect: 'none',
    ...draggableStyle,
  });

  const onDragEnd = (result: DropResult, provider: ResponderProvided) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(words, result.source.index, result.destination.index);

    onUpdateOrder(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            className="px-2 space-y-2"
          >
            {words.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <Card className={cx({'opacity-75': snapshot.isDragging})}>
                      {item.word}
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
