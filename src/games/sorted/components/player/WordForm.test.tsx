import '@testing-library/jest-dom';

import * as React from 'react';

import randomEmoji from '@0xadada/random-emoji';
import {MockedProvider, MockedResponse} from '@apollo/react-testing';
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {IPlayer} from '../../../../lib/room';
import {SUBMIT_VOTE, SUBMIT_WORDS} from '../../mutations';
import {IGame, IWord} from '../../types';
import {WordForm} from './WordForm';

function createPlayers(count: number = 5): Array<IPlayer> {
  return new Array(count).fill(null).map((_, index) => ({
    emoji: randomEmoji(),
    name: `Player ${index}`,
    id: `player-${index}`,
  }));
}

function createWords(playerCounts: Array<[IPlayer, number]>): Array<IWord> {
  const words: Array<IWord> = [];
  playerCounts.forEach(([player, count]) => {
    for (let i = 0; i < count; i += 1) {
      words.push({
        id: `word-${player.id}-${i + 1}`,
        word: `${player.name} ${i + 1}`,
        player_id: player.id,
      });
    }
  });
  return words;
}

describe('WordForm', () => {
  const [p1, p2, p3] = createPlayers(3);
  const game: Pick<IGame, 'id' | 'words'> = {
    id: 'game1',
    words: createWords([[p2, 5]]),
  };

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  async function addWord(word: string) {
    userEvent.type(screen.getByRole('textbox'), word);
    expect(screen.getByText('Add')).toBeEnabled();
    userEvent.click(screen.getByText('Add'));
    expect(await screen.findByText(word.toUpperCase()));
    expect(screen.getByRole('textbox')).toHaveValue('');
  }

  describe('adding a word', () => {
    it('should disable the add button until the word is valid', async () => {
      render(
        <>
          <MockedProvider>
            <WordForm game={game} playerId={p1.id} />
          </MockedProvider>
        </>
      );

      userEvent.type(screen.getByRole('textbox'), ' ');
      userEvent.clear(screen.getByRole('textbox'));

      await waitFor(() => expect(screen.getByText('Add')).toBeDisabled());

      userEvent.type(screen.getByRole('textbox'), 'a');
      await waitFor(() => expect(screen.getByText('Add')).toBeDisabled());

      userEvent.type(screen.getByRole('textbox'), 'ab');
      await waitFor(() => expect(screen.getByText('Add')).toBeEnabled());
    });

    it('should let you add a word', async () => {
      render(
        <>
          <MockedProvider>
            <WordForm game={game} playerId={p1.id} />
          </MockedProvider>
        </>
      );
      userEvent.type(screen.getByRole('textbox'), 'alpha');
      expect(screen.getByText('Add')).toBeEnabled();
      userEvent.click(screen.getByText('Add'));

      expect(await screen.findByText('ALPHA')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('should not let you add the same word twice', async () => {
      render(
        <>
          <MockedProvider>
            <WordForm game={game} playerId={p1.id} />
          </MockedProvider>
        </>
      );
      userEvent.type(screen.getByRole('textbox'), 'alpha');
      expect(screen.getByText('Add')).toBeEnabled();
      userEvent.click(screen.getByText('Add'));

      expect(await screen.findByText('ALPHA'));

      userEvent.type(screen.getByRole('textbox'), 'alpha');
      await waitFor(() => expect(screen.getByText('Add')).toBeDisabled());
    });
  });

  describe('submitting the words', () => {
    it('should not enable the button until there are five words', async () => {
      render(
        <>
          <MockedProvider>
            <WordForm game={game} playerId={p1.id} />
          </MockedProvider>
        </>
      );

      expect(screen.getByText('Done')).toBeDisabled();

      await addWord('alpha');
      expect(screen.getByText('Done')).toBeDisabled();
      await addWord('bravo');
      expect(screen.getByText('Done')).toBeDisabled();
      await addWord('charlie');
      expect(screen.getByText('Done')).toBeDisabled();
      await addWord('delta');
      expect(screen.getByText('Done')).toBeDisabled();
      await addWord('echo');
      await waitFor(() => expect(screen.getByText('Done')).toBeEnabled());
    });
  });

  it('should submit the words when the Done button is clicked', async () => {
    const words = ['alpha', 'bravo', 'charlie', 'delta', 'echo'];
    render(
      <>
        <MockedProvider
          mocks={words.map(word => ({
            request: {
              query: SUBMIT_WORDS,
              variables: {
                game: game.id,
                player: p1.id,
                word: word.toUpperCase(),
              },
            },
            result: {data: {id: word}},
          }))}
        >
          <WordForm game={game} playerId={p1.id} />
        </MockedProvider>
      </>
    );

    expect(screen.getByText('Done')).toBeDisabled();

    for (const word of words) {
      await addWord(word);
    }

    await waitFor(() => expect(screen.getByText('Done')).toBeEnabled());
    userEvent.click(screen.getByText('Done'));
  });
});
