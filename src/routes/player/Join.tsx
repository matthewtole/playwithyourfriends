import {Formik} from 'formik';
import * as React from 'react';
import {useParams} from 'react-router-dom';

import {
  ApolloProvider,
  useLazyQuery,
  useMutation,
  useQuery,
} from '@apollo/client';
import {useLocalStorage, writeStorage} from '@rehooks/local-storage';

import {Button} from '../../components/Button';
import {TextInput} from '../../components/form/TextInput';
import logo from '../../images/logo.svg';
import {createApolloClient} from '../../lib/apollo';
import {
  GET_ROOMS_BY_CODE,
  IGetRoomsByCodeQuery,
  JOIN_ROOM,
} from '../../lib/room';

const NAME_REGEX = /[a-zA-Z0-9_!?]{3,12}/;
const ROOM_REGEX = /[0-9]{6}/;

export const JoinWithApollo: React.FC = () => {
  const client = createApolloClient();

  return (
    <ApolloProvider client={client}>
      <PlayerJoin />
    </ApolloProvider>
  );
};

const PlayerJoin: React.FC = () => {
  const [joinRoom] = useMutation(JOIN_ROOM);

  async function handleJoin(
    roomId: string,
    player: {name: string; avatarKey: number}
  ) {
    const data = await joinRoom({
      variables: {roomId, name: player.name, avatarKey: player.avatarKey},
    });
    writeStorage('pwyf::player::room', data.data?.insert_room_players_one.id);
  }

  return <JoinForm onJoin={handleJoin} />;
};

interface JoinFormProps {
  onJoin: (roomId: string, player: {name: string; avatarKey: number}) => void;
}

const JoinForm: React.FC<JoinFormProps> = ({onJoin}) => {
  let {roomCode} = useParams<{roomCode?: string}>();

  const [roomId, setRoomId] = React.useState<string | undefined>();
  const [player, setPlayer] = React.useState<
    {name: string; avatarKey: number} | undefined
  >();

  const [getRoomsByCode, {loading, data}] = useLazyQuery<IGetRoomsByCodeQuery>(
    GET_ROOMS_BY_CODE
  );

  if (!roomId && data && data.rooms.length) {
    setRoomId(data.rooms[0].id);
  }

  React.useEffect(() => {
    if (!roomId) {
      return;
    }
    if (!player) {
      return;
    }

    onJoin(roomId, player);
  }, [roomId, player]);

  async function handleJoin(
    {name, roomCode}: {name: string; roomCode: string},
    setSubmitting: (submitting: boolean) => void
  ) {
    setPlayer({name: name.toUpperCase().trim(), avatarKey: 2});
    getRoomsByCode({variables: {code: roomCode}});
  }

  return (
    <section className="p-4">
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
          handleJoin(values, setSubmitting);
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
            <fieldset className="flex flex-col space-y-1">
              <label htmlFor="name" className="text-white">
                Your Name
              </label>
              <TextInput
                id="name"
                name="name"
                className="w-full text-center"
                autoComplete="off"
                autoCorrect="off"
                maxLength={12}
                minLength={3}
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </fieldset>
            <fieldset className="flex flex-col space-y-1">
              <label htmlFor="name" className="text-white">
                Room Code
              </label>
              <TextInput
                id="roomCode"
                name="roomCode"
                pattern="[0-9]*"
                className="w-full tracking-widest text-center"
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
    </section>
  );
};
