import {Formik} from 'formik';
import * as React from 'react';
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';

import {Button} from '../../components/Button';
import {Card} from '../../components/Card';
import {TextInput} from '../../components/form/TextInput';
import {Loading} from '../../components/Loading';
import {Player} from '../../data/host/reducer';
import * as Sorted from '../../games/sorted';
import {useFirestoreDoc} from '../../lib/hooks';
import {Room} from '../host/Index';

export interface PlayerGameProps {
  player: Player;
  playerId: string;
  room: Room;
}

export const PlayerGame: React.FC<PlayerGameProps> = ({
  room,
  player,
  playerId,
}) => {
  const [game, loading, error] = useFirestoreDoc<Sorted.Game>(
    'sorted',
    room.game!.id
  );

  async function addWord(event: React.FormEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (loading) {
    return <Loading />;
  }

  if (game?.rounds?.length) {
    if (playerId in game?.rounds[0].orders) {
      return <p>WAIT</p>;
    }
    return <CardSort game={game} gameId={room.game!.id} playerId={playerId} />;
  }

  return (
    <CardForm
      gameId={room.game?.id!}
      playerId={playerId}
      cards={game?.cards.filter(c => c.createdBy === playerId) || []}
    />
  );
};

interface CardSortProps {
  game: Sorted.Game;
  gameId: string;
  playerId: string;
}

const CardSort: React.FC<CardSortProps> = ({game, gameId, playerId}) => {
  const [order, setOrder] = React.useState<Sorted.Card[]>([]);
  const cards = game.rounds[0].cards;

  React.useEffect(() => {
    if (cards) {
      setOrder([...cards]);
    } else {
      setOrder([]);
    }
  }, [cards]);

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    const newOrder = Array.from(order!);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    setOrder(newOrder);
  }

  async function submitOrder() {
    await Sorted.submitOrder(game, gameId, playerId, order!);
  }

  return (
    <div>
      <div className="p-2 text-sm text-center text-white bg-black font-body">
        <p>
          Drag to sort these cards in order of how important{' '}
          <u>{game.rounds[0].judge === playerId ? 'you' : 'they'}</u> think they
          are.
        </p>
      </div>
      <h3 className="p-2 text-3xl font-thin text-center text-white opacity-25 font-body">
        MOST IMPORTANT
      </h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="px-2"
            >
              {order!.map((card, index) => (
                <Draggable
                  key={card.word}
                  draggableId={card.word}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="py-1"
                    >
                      <Card>{card.word}</Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <h3 className="p-2 text-3xl font-thin text-center text-white opacity-25 font-body">
        LEAST IMPORTANT
      </h3>
      <div className="p-2">
        <Button size="large" onClick={submitOrder} className="w-full">
          DONE
        </Button>
      </div>
    </div>
  );
};

interface CardFormProps {
  gameId: string;
  playerId: string;
  cards: Sorted.Card[];
}

const CardForm: React.FC<CardFormProps> = ({gameId, playerId, cards}) => (
  <>
    <Formik
      initialValues={{word: ''}}
      validateOnMount
      validate={values => {
        const errors: {[field: string]: string} = {};
        if (values.word.length === 0) {
          errors.word = 'Word is required';
        }
        return errors;
      }}
      onSubmit={async (values, {setSubmitting, resetForm}) => {
        await Sorted.addCard(values.word, gameId, playerId);
        resetForm();
        setSubmitting(false);
      }}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        isValid,
      }) => (
        <form className="p-4" onSubmit={handleSubmit}>
          <fieldset className="relative">
            <TextInput
              className="w-full"
              id="word"
              name="word"
              autoComplete="off"
              autoCorrect="on"
              value={values.word}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
            <Button
              className="absolute top-0 bottom-0 right-0 px-4"
              disabled={!isValid || isSubmitting}
              type="submit"
            >
              Add
            </Button>
          </fieldset>
        </form>
      )}
    </Formik>
    <ul className="flex flex-col px-4 space-y-2">
      {cards.map(card => (
        <Card key={card.word}>{card.word}</Card>
      ))}
    </ul>
  </>
);
