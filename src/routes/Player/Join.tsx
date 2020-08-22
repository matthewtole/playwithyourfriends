import * as React from 'react';
import logo from '../../images/logo.svg';
import {Formik} from 'formik';
import {useParams} from 'react-router-dom';

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
              <input
                type="text"
                id="name"
                name="name"
                className="text-center rounded text"
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
              <input
                type="text"
                id="roomCode"
                name="roomCode"
                pattern="[0-9]*"
                className="text-lg tracking-widest text-center rounded"
                placeholder="000000"
                value={values.roomCode}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="pt-4">
              <button
                type="submit"
                className="block w-full p-2 text-xl text-white bg-black rounded font-title disabled:bg-gray-500 disabled:text-gray-300"
                disabled={isSubmitting || !isValid}
              >
                Join Room
              </button>
            </fieldset>
          </form>
        )}
      </Formik>
    </>
  );
};
