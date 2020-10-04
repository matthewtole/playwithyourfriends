import * as React from 'react';

import {ApolloProvider, useQuery} from '@apollo/client';

import {Avatar} from '../../components/avatars/Avatar';
import {Hand} from '../../components/host/Hand';
import {createApolloClient} from '../../lib/apollo';
import {GET_ROOM, GET_ROOM_PLAYERS, IGetRoomPlayersQuery, IGetRoomQuery} from '../../lib/room';

export const Host: React.FC = () => {
  const id = 'a67aad96-38a1-4102-bb7d-aa24d6c6ebb0';

  return (
    <main className="flex w-screen h-screen bg-forward-slices overflow-none">
      <div className="w-2/3 p-4">
        <RoomPlayers id={id} />
      </div>
      <div className="w-1/3">
        <RoomHand id={id} />
      </div>
    </main>
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
        <div className="w-1/6 m-2"><Avatar
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
