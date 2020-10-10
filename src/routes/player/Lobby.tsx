import * as React from 'react';

import {ApolloProvider, useQuery} from '@apollo/client';

import {Header} from '../../components/Header';
import {Loading} from '../../components/Loading';
import {SortedPlayer} from '../../games/sorted/components/player/SortedPlayer';
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

  const player = data?.players_by_pk;
  if (player.room.game_id) {
    return <SortedPlayer id={player.room.game_id} player={player} />;
  }

  return (
    <main>
      <Header />
      <section className="p-4">
        <div className="p-4 bg-yellow-400">
          <p className="mb-2">Hello, {player.name}!</p>
          <p>Waiting for the rest of the players to get here...</p>
        </div>
      </section>
    </main>
  );
};
