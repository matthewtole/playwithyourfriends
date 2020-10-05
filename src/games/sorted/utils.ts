import {pl} from 'date-fns/locale';

import {IRound} from './types';

export function hasPlayerSubmittedVotes(round: IRound, playerId: string) {
  return round.votes.filter(v => v.player_id === playerId).length === 5;
}
