import {Formik} from 'formik';
import * as React from 'react';

import {useMutation} from '@apollo/client';

import {Button} from '../../../../components/Button';
import {Card} from '../../../../components/Card';
import {TextInput} from '../../../../components/form/TextInput';
import {SUBMIT_WORDS} from '../../mutations';
import {IGame} from '../../types';

export const WordForm: React.FC<{
  game: Pick<IGame, 'id' | 'words'>;
  playerId: string;
}> = ({game, playerId}) => {
  const [words, setWords] = React.useState<Array<string>>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [submitWordsMutation] = useMutation(SUBMIT_WORDS);

  async function submitWords() {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    await Promise.all(
      words.map(w =>
        submitWordsMutation({
          variables: {
            game: game.id,
            player: playerId,
            word: w,
          },
        })
      )
    );
    setIsSubmitting(false);
  }

  return (
    <div className="p-4">
      <div>
        <p>
          Please come up with at least five words to build out the deck of
          cards.
        </p>
      </div>

      <Formik
        initialValues={{word: ''}}
        validate={values => {
          const errors: {[field: string]: string} = {};
          if (values.word.length <= 1) {
            errors.word = 'The word cannot be shorter than 2 characters';
          } else if (values.word.length > 20) {
            errors.word = 'The word cannot be more than 20 characters';
          } else if (words.includes(values.word.toUpperCase().trim())) {
            errors.word = 'You cannot submit the same word twice';
          }
          return errors;
        }}
        onSubmit={(values, {resetForm}) => {
          setWords([...words, values.word.toUpperCase().trim()]);
          resetForm();
        }}
      >
        {({values, handleChange, handleBlur, handleSubmit, isValid}) => (
          <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
            <fieldset className="flex flex-col space-y-1">
              <TextInput
                id="word"
                name="word"
                className="w-full text-center"
                autoComplete="off"
                autoCorrect="off"
                maxLength={20}
                minLength={2}
                value={values.word}
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </fieldset>
            <fieldset>
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                fullWidth
              >
                Add Word
              </Button>
            </fieldset>
          </form>
        )}
      </Formik>
      <ul>
        {words.map(w => (
          <li>
            <Card key={w}>{w}</Card>
          </li>
        ))}
      </ul>
      <Button
        className="w-full my-4"
        onClick={submitWords}
        disabled={words.length < 5}
      >
        Done!
      </Button>
    </div>
  );
};
