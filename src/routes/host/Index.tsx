import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import {Avatar} from '../../components/avatars/Avatar';
import {Hand} from '../../components/host/Hand';
import {HostActionType} from '../../data/host/actions';
import * as Selectors from '../../data/host/selectors';

export const Host: React.FC = () => {
  let {path} = useRouteMatch();
  const roomCode = useSelector(Selectors.roomCode);
  const players = useSelector(Selectors.players);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!roomCode) {
      dispatch({type: HostActionType.SET_ROOM_CODE, data: {roomCode: '12345'}});
    }
  }, []);

  return (
    <main className="flex w-screen h-screen bg-forward-slices overflow-none">
      <div className="w-2/3">
        <ul className="flex flex-wrap m-8 space-x-4 space-y-4">
          {players.map((p, index) =>
            p ? (
              <li key={p.id}>
                <Avatar name={p.name} variant={p.avatar} />
              </li>
            ) : (
              <li key={index}>
                <Avatar />
              </li>
            )
          )}
        </ul>
      </div>
      <div className="flex-shrink w-1/3">
        {roomCode ? <Hand roomCode={roomCode} /> : null}
      </div>
    </main>
  );
};
