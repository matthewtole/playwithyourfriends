import {Formik} from 'formik';
import * as React from 'react';
import {useParams} from 'react-router-dom';

import {Button} from '../../components/Button';
import {TextInput} from '../../components/form/TextInput';
import logo from '../../images/logo.svg';

const NAME_REGEX = /[a-zA-Z0-9_!?]{3,12}/;
const ROOM_REGEX = /[0-9]{6}/;

export interface PlayerJoinProps {
  onJoin: (data: {name: string; roomCode: string}) => void;
}

export const PlayerJoin: React.FC<PlayerJoinProps> = ({onJoin}) => {
  let {roomCode} = useParams<{roomCode?: string}>();

  return (
    <>
      <img src={logo} className="w-full my-8" />
      <Formik
        initialValues={{name: '', roomCode: roomCode ?? ''}}
        validateOnMount
        validate={values => {
          const errors: {[field: string]: string} = {};
          if (!NAME_REGEX.test(values.name)) {
            errors.name = 'Invalid name';
          }
          if (!ROOM_REGEX.test(values.roomCode)) {
            errors.roomCode = 'Invalid room code';
          }

          return errors;
        }}
        onSubmit={(values, {setSubmitting}) => {
          setTimeout(() => {
            setSubmitting(false);
            onJoin(values);
          }, 400);
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
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <fieldset className="flex flex-col">
              <label htmlFor="name" className="">
                Your Name
              </label>
              <TextInput
                id="name"
                name="name"
                className="text-center"
                autoComplete="off"
                autoCorrect="off"
                maxLength={12}
                minLength={3}
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="flex flex-col">
              <label htmlFor="name" className="">
                Room Code
              </label>
              <TextInput
                id="roomCode"
                name="roomCode"
                pattern="[0-9]*"
                className="tracking-widest text-center"
                placeholder="000000"
                value={values.roomCode}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                fullWidth
              >
                Join Room
              </Button>
            </fieldset>
          </form>
        )}
      </Formik>
    </>
  );
};
