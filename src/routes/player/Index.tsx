import * as React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import {useLocalStorage} from '../../lib/hooks';
import {addPlayerToRoom, getRoomByCode} from '../../lib/room';
import {PlayerJoin} from './Join';

export const Player: React.FC = () => {
  let {path} = useRouteMatch();
  const [roomId, setRoomId] = useLocalStorage<string | undefined>(
    'pwyf-player-room',
    undefined
  );
  const [playerId, setPlayerId] = useLocalStorage<string | undefined>(
    'pwyf-player-id',
    undefined
  );

  async function joinRoom(roomCode: string, playerInfo: {name: string}) {
    const room = await getRoomByCode(roomCode);
    const id = await addPlayerToRoom(room.id, playerInfo);
    setRoomId(room.id);
    setPlayerId(id);
  }

  const hasRoom = roomId && playerId;

  return (
    <main className="h-screen bg-forward-slices font-title">
      <section className="max-w-xl p-4 mx-auto">
        <Switch>
          <Route exact path={path}>
            {!hasRoom ? <Redirect to={`${path}/join`} /> : <>LOBBY</>}
          </Route>
          <Route path={`${path}/join/:roomCode?`}>
            {hasRoom ? (
              <Redirect to={path} />
            ) : (
              <PlayerJoin
                onJoin={({roomCode, name}) => joinRoom(roomCode, {name})}
              />
            )}
          </Route>
        </Switch>
      </section>
    </main>
  );
};
