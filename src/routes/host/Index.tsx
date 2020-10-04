import * as React from 'react';

import {
  ApolloProvider,
  useLazyQuery,
  useMutation,
  useQuery,
} from '@apollo/client';
import {useLocalStorage, writeStorage} from '@rehooks/local-storage';

import {Avatar} from '../../components/avatars/Avatar';
import {Button} from '../../components/Button';
import {Hand} from '../../components/host/Hand';
import {Loading} from '../../components/Loading';
import {HOST_ROOM_ID} from '../../config/local-storage';
import {SortedHost} from '../../games/sorted/components/Host';
import {createApolloClient} from '../../lib/apollo';
import {
  CREATE_ROOM,
  generateRoomCode,
  GET_ROOM,
  IGetRoomQuery,
  IPlayer,
} from '../../lib/room';

export const Host: React.FC = () => {
  const [id] = useLocalStorage(HOST_ROOM_ID);
  const {data, loading, error} = useQuery<IGetRoomQuery>(GET_ROOM, {
    variables: {id},
    skip: !id,
  });

  if (!id) {
    return <RoomCreation />;
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return null;
  }

  if (!data) {
    return null;
  }

  if (data.rooms_by_pk.game_id) {
    return <SortedHost id={data.rooms_by_pk.game_id} />;
  }

  return (
    <>
      <div className="w-2/3 p-4">
        <RoomPlayers players={data.rooms_by_pk.players} />
      </div>
      <div className="w-1/3">
        <Hand roomCode={data.rooms_by_pk.code} />
      </div>
    </>
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

const RoomPlayers: React.FC<{players: Array<IPlayer>}> = ({players}) => {
  return (
    <div className="flex flex-wrap">
      {players.map(player => (
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

export const HostWithApollo: React.FC = () => {
  const client = createApolloClient();

  return (
    <ApolloProvider client={client}>
      <main className="flex w-screen h-screen bg-forward-slices overflow-none">
        <Host />
      </main>
    </ApolloProvider>
  );
};
