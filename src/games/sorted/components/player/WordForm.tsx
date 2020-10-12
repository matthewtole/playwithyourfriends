import {Formik} from 'formik';
import * as React from 'react';

import {useMutation} from '@apollo/client';

import {Button} from '../../../../components/Button';
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
    for (const word of words) {
      await submitWordsMutation({
        variables: {
          game: game.id,
          player: playerId,
          word,
        },
      });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="px-8 py-4 text-lg leading-tight text-center text-white bg-black">
        <p>
          Please come up with at least five words to build out the deck of
          cards.
        </p>
      </div>

      <Formik
        initialValues={{word: ''}}
        validate={values => {
          const errors: {[field: string]: string} = {};
          if (values.word.trim().length <= 1) {
            errors.word = 'The word cannot be shorter than 2 characters';
          } else if (values.word.trim().length > 20) {
            errors.word = 'The word cannot be more than 20 characters';
          } else if (words.includes(values.word.toUpperCase().trim())) {
            errors.word = 'You cannot submit the same word twice';
          }
          return errors;
        }}
        onSubmit={(values, {resetForm}) => {
          setWords([values.word.toUpperCase().trim(), ...words]);
          resetForm();
        }}
      >
        {({values, handleChange, handleBlur, handleSubmit, isValid}) => (
          <form
            className="flex flex-row px-4 space-x-2"
            onSubmit={handleSubmit}
          >
            <fieldset className="flex-1">
              <TextInput
                id="word"
                name="word"
                className="w-full text-center font-title"
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
                Add
              </Button>
            </fieldset>
          </form>
        )}
      </Formik>
      <ul className="flex flex-col flex-1 px-4 space-y-2">
        {words.map(word => (
          <li
            key={word}
            className="flex items-center justify-center max-w-lg p-2 text-lg bg-gray-200 border-2 border-black rounded font-title"
          >
            {word}
          </li>
        ))}
      </ul>
      <div className="p-4">
        <Button
          className="w-full"
          onClick={submitWords}
          disabled={words.length < 5}
        >
          Done
        </Button>
      </div>
    </div>
  );
};
