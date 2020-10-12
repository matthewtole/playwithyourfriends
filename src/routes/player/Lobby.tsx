import * as React from 'react';

import {ApolloProvider, useMutation, useQuery} from '@apollo/client';

import {Button} from '../../components/Button';
import {Header} from '../../components/Header';
import {Loading} from '../../components/Loading';
import {SortedPlayer} from '../../games/sorted/components/player/SortedPlayer';
import {CREATE_GAME} from '../../games/sorted/mutations';
import {createApolloClient} from '../../lib/apollo';
import {GET_PLAYER_BY_ID, IGetPlayerByIdQuery, SET_ROOM_GAME} from '../../lib/room';

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
  const [createGame] = useMutation(CREATE_GAME);
  const [setRoomGame] = useMutation(SET_ROOM_GAME);

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return null;
  }

  async function createSortedGame() {
    const game = await createGame({
      variables: {room: data?.players_by_pk.room.id},
    });
    const id = game.data?.insert_sorted_games_one.id;
    if (!id) {
      return;
    }
    await setRoomGame({
      variables: {
        room: data?.players_by_pk.room.id,
        game: id,
      },
    });
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
      <section className="p-4">
        <Button onClick={createSortedGame}>Create Game</Button>
      </section>
    </main>
  );
};
