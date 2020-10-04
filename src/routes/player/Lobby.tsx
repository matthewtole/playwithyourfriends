import * as React from 'react';

import {ApolloProvider, useQuery} from '@apollo/client';

import {Loading} from '../../components/Loading';
import {createApolloClient} from '../../lib/apollo';
import {GET_PLAYER_BY_ID, IGetPlayerByIdQuery} from '../../lib/room';

export const LobbyWithApollo: React.FC<{id: string}> = ({id}) => {
  const client = createApolloClient();

  return (
    <ApolloProvider client={client}>
      <Lobby id={id} />
    </ApolloProvider>
  );
};

const Lobby: React.FC<{id: string}> = ({id}) => {
  const {data, loading, error} = useQuery<IGetPlayerByIdQuery>(
    GET_PLAYER_BY_ID,
    {variables: {id}}
  );

  if (loading) {
    return <Loading />;
  }
  if (!data) {
    return null;
  }

  const player = data?.room_players_by_pk;

  return (
    <main>
      <header className="flex px-4 py-3 text-xl text-white bg-blue-700 border-b-4 border-blue-800">
        <h1 className="leading-none opacity-75">pwyf</h1>
      </header>
      <section className="p-4">
        <div className="p-4 bg-yellow-400">
          <p className="mb-2">Hello, {player.name}!</p>
          <p>Waiting for the rest of the players to get here...</p>
        </div>
      </section>
    </main>
  );
};
