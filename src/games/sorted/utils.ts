import {IGame, IRound} from './types';

export function hasPlayerSubmittedVotes(
  round: IRound,
  playerId: string
): boolean {
  return round.votes.filter(v => v.player_id === playerId).length === 5;
}

export function wordPositionForPlayer(
  round: IRound,
  wordId: string,
  playerId: string
): number {
  return (
    round.votes.find(v => v.player_id === playerId && v.word_id === wordId)
      ?.position ?? -1
  );
}

export function numWordsForPlayer(
  game: Pick<IGame, 'words'>,
  id: string
): number {
  return game.words.filter(w => w.player_id === id).length;
}
