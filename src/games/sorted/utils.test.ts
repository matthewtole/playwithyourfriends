import {IPlayer} from '../../lib/room';
import {IGame, IRound} from './types';
import {hasPlayerSubmittedVotes, numWordsForPlayer, wordPositionForPlayer} from './utils';

describe('Sorted // Utility functions', () => {
  const p1: IPlayer = {id: 'player-1', name: 'Player 1', emoji: '😈'};
  const p2: IPlayer = {id: 'player-2', name: 'Player 2', emoji: '👹'};
  const p3: IPlayer = {id: 'player-3', name: 'Player 3', emoji: '🧠'};

  const round: IRound = {
    id: 'round1',
    judge: p3,
    votes: [
      {player_id: p1.id, word_id: 'word1', position: 1},
      {player_id: p1.id, word_id: 'word2', position: 5},
      {player_id: p1.id, word_id: 'word3', position: 2},
      {player_id: p1.id, word_id: 'word4', position: 3},
      {player_id: p1.id, word_id: 'word5', position: 4},
      {player_id: p2.id, word_id: 'word1', position: 1},
    ],
    words: [],
  };

  const game: Pick<IGame, 'words'> = {
    words: [
      {
        id: 'w1',
        player_id: p1.id,
        word: 'blah',
      },
      {
        id: 'w2',
        player_id: p1.id,
        word: 'yeet',
      },
      {
        id: 'w3',
        player_id: p1.id,
        word: 'wee',
      },
      {
        id: 'w4',
        player_id: p2.id,
        word: 'foo',
      },
    ],
  };

  describe('#hasPlayerSubmittedVotes', () => {
    it('should return true if a player has 5 votes for the round', () => {
      expect(hasPlayerSubmittedVotes(round, p1.id)).toBeTruthy();
    });

    it('should return false if a player has less than 5 votes for the round', () => {
      expect(hasPlayerSubmittedVotes(round, p2.id)).toBeFalsy();
    });

    it('should return false if a player has not submitted any votes for the round', () => {
      expect(hasPlayerSubmittedVotes(round, p3.id)).toBeFalsy();
    });
  });

  describe('#wordPositionForPlayer', () => {
    it('returns the position of a word for a given player', () => {
      expect(wordPositionForPlayer(round, 'word1', p1.id)).toBe(1);
      expect(wordPositionForPlayer(round, 'word2', p1.id)).toBe(5);
      expect(wordPositionForPlayer(round, 'word1', p1.id)).toBe(1);
    });

    it('returns undefined if the player does not have any votes', () => {
      expect(wordPositionForPlayer(round, 'word1', p3.id)).toBeUndefined();
    });

    it('returns undefined the player has not voted for that word', () => {
      expect(wordPositionForPlayer(round, 'word2', p2.id)).toBeUndefined();
    });

    it('returns undefined if the word was not part of the round', () => {
      expect(wordPositionForPlayer(round, 'wordX', p1.id)).toBeUndefined();
    });
  });

  describe('#numWordsForPlayer', () => {
    it('returns the number of words a player has submitted', () => {
      expect(numWordsForPlayer(game, p1.id)).toBe(3);
      expect(numWordsForPlayer(game, p2.id)).toBe(1);
      expect(numWordsForPlayer(game, p3.id)).toBe(0);
    });
  });
});
