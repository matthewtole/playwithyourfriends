import {IPlayer} from '../../lib/room';

export interface IRound {
  id: string;
  words: Array<{word: {id: string; word: string}}>;
  votes: Array<{player_id: string}>;
  judge: IPlayer;
}
