import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';

import {HostActionType} from '../../data/host/actions';
import * as Selectors from '../../data/host/selectors';
import {generateRoomCode} from '../../data/host/utils';
import {HostLobby} from './Lobby';
import {useParams} from 'react-router-dom';

export const Host: React.FC = () => {
  const params = useParams<{roomCode?: string}>();
  const roomCode = useSelector(Selectors.roomCode);
  const dispatch = useDispatch();
  const history = useHistory();

  React.useEffect(() => {
    if (!roomCode) {
      const newRoomCode = params.roomCode || generateRoomCode();
      dispatch({
        type: HostActionType.SET_ROOM_CODE,
        data: {roomCode: newRoomCode},
      });
      history.replace(`/host/${newRoomCode}`);
    }
  });

  return (
    <main className="flex w-screen h-screen bg-forward-slices overflow-none">
      <HostLobby />
    </main>
  );
};
