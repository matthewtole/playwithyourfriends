import {IGame, IRound} from './types';

export function hasPlayerSubmittedVotes(round: IRound, playerId: string) {
  return round.votes.filter(v => v.player_id === playerId).length === 5;
}

export function wordPositionForPlayer(
  round: IRound,
  wordId: string,
  playerId: String
) {
  return round.votes.find(v => v.player_id === playerId && v.word_id === wordId)
    ?.position;
}

export function numWordsForPlayer(game: Pick<IGame, 'words'>, id: string) {
  return game.words.filter(w => w.player_id === id).length;
}
