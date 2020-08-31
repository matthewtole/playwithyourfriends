import {Formik} from 'formik';
import * as React from 'react';

import {Button} from '../../components/Button';
import {Card} from '../../components/Card';
import {TextInput} from '../../components/form/TextInput';
import {Player} from '../../data/host/reducer';
import * as Sorted from '../../games/sorted';
import {firestore} from '../../lib/firebase';
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
    return <p>LOADING...</p>;
  }
  if (game?.rounds?.length) {
  } else {
    return (
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
            await Sorted.addCard(values.word, room.game!.id, playerId);
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
              <fieldset className="flex flex-row space-x-2">
                <TextInput
                  className="flex-1"
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
                  className="px-4"
                  disabled={!isValid || isSubmitting}
                  type="submit"
                >
                  +
                </Button>
              </fieldset>
            </form>
          )}
        </Formik>
        <ul className="flex flex-col px-4 space-y-2">
          {game?.cards
            .filter(c => c.createdBy === playerId)
            .map(card => (
              <Card key={card.word}>{card.word}</Card>
            ))}
        </ul>
      </>
    );
  }
  return (
    <>
      <pre>{JSON.stringify({game, loading, error})}</pre>
    </>
  );
};
