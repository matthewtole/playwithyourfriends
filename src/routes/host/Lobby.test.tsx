import '@testing-library/jest-dom/extend-expect';

import * as React from 'react';
import * as faker from 'faker';

import {fireEvent, render, screen, waitFor} from '@testing-library/react';

import {HostLobby} from './Lobby';
import {Player} from '../../data/host/reducer';

const createMockPlayer = (player: Partial<Player>): Player => {
  return {
    name: faker.name.firstName(),
    id: faker.random.uuid(),
    avatar: faker.random.number(1),
    ...player,
  };
};

const createMockPlayers = (count: number): Array<Player> => {
  const players = [];
  while (players.length < count) {
    players.push(createMockPlayer({avatar: players.length - 1}));
  }
  return players;
};

describe('HostLobby', () => {
  it('renders an avatar for each of the players', () => {
    const players = createMockPlayers(3);
    render(
      <HostLobby
        players={players}
        room={{code: '12345', createdAt: Date.now()}}
      />
    );
    players.forEach(({name}) => {
      expect(screen.findByText(name));
    });
  });
});
