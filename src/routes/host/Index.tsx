import * as React from 'react';

import {ApolloProvider, useQuery} from '@apollo/client';
import {deleteFromStorage, useLocalStorage} from '@rehooks/local-storage';

import {Avatar} from '../../components/avatars/Avatar';
import {Hand} from '../../components/host/Hand';
import {Loading} from '../../components/Loading';
import {HOST_ROOM_ID} from '../../config/local-storage';
import {SortedHost} from '../../games/sorted/components/host/SortedHost';
import {createApolloClient} from '../../lib/apollo';
import {GET_ROOM, IGetRoomQuery, IPlayer} from '../../lib/room';
import {RoomCreation} from './Create';

export const Host: React.FC = () => {
  const [id] = useLocalStorage<string>(HOST_ROOM_ID);
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
    console.error(error);
    return null;
  }

  if (!data) {
    console.error(new Error('No data...'));
    return null;
  }

  if (!data.rooms_by_pk) {
    deleteFromStorage(HOST_ROOM_ID);
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

const RoomPlayers: React.FC<{players: Array<IPlayer>}> = ({players}) => {
  return (
    <div className="flex flex-wrap">
      {players.map(player => (
        <div className="w-1/6 m-2" key={player.id}>
          <Avatar name={player.name} emoji={player.emoji} />
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
