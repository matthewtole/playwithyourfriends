import * as React from 'react';

import {Button} from '../../components/Button';
import {Player} from '../../data/host/reducer';

interface PlayerLobbyProps {
  onLogout: () => void;
}

export const PlayerLobby: React.FC<PlayerLobbyProps> = ({onLogout}) => {
  return (
    <main>
      <Button onClick={onLogout}>Logout</Button>
    </main>
  );
};
