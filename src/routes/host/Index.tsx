import * as React from 'react';

import {ApolloProvider, useMutation, useQuery} from '@apollo/client';
import {useLocalStorage, writeStorage} from '@rehooks/local-storage';

import {Avatar} from '../../components/avatars/Avatar';
import {Button} from '../../components/Button';
import {Hand} from '../../components/host/Hand';
import {HOST_ROOM_ID} from '../../config/local-storage';
import {createApolloClient} from '../../lib/apollo';
import {
  CREATE_ROOM,
  generateRoomCode,
  GET_ROOM,
  GET_ROOM_PLAYERS,
  IGetRoomPlayersQuery,
  IGetRoomQuery,
} from '../../lib/room';

export const Host: React.FC = () => {
  const [id] = useLocalStorage(HOST_ROOM_ID);

  return (
    <main className="flex w-screen h-screen bg-forward-slices overflow-none">
      {!id && <RoomCreation />}
      {id && (
        <>
          <div className="w-2/3 p-4">
            <RoomPlayers id={id} />
          </div>
          <div className="w-1/3">
            <RoomHand id={id} />
          </div>
        </>
      )}
    </main>
  );
};

const RoomCreation: React.FC = () => {
  const [createRoomMutation] = useMutation(CREATE_ROOM);

  async function createRoom() {
    const {data, errors} = await createRoomMutation({
      variables: {code: generateRoomCode()},
      optimisticResponse: false,
      update: cache => {
        console.log(cache);
      },
    });
    if (data) {
      writeStorage(HOST_ROOM_ID, data.insert_rooms_one.id);
    } else if (errors) {
      console.error(errors);
    }
  }

  return (
    <div>
      <Button onClick={createRoom}>Create Room</Button>
    </div>
  );
};

const RoomPlayers: React.FC<{id?: string}> = ({id}) => {
  const {error, data} = useQuery<IGetRoomPlayersQuery>(GET_ROOM_PLAYERS, {
    variables: {id},
  });
  if (error) {
    return <div>{error.message}</div>;
  }
  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-wrap">
      {data.room_players.map(player => (
        <div className="w-1/6 m-2">
          <Avatar
            name={player.name}
            key={player.id}
            variant={player.avatar_key}
          />
        </div>
      ))}
    </div>
  );
};

const RoomHand: React.FC<{id?: string}> = ({id}) => {
  const {data} = useQuery<IGetRoomQuery>(GET_ROOM, {variables: {id}});

  return data ? <Hand roomCode={data.rooms_by_pk.code} /> : null;
};

export const HostWithApollo: React.FC = () => {
  const client = createApolloClient();

  return (
    <ApolloProvider client={client}>
      <Host />
    </ApolloProvider>
  );
};
