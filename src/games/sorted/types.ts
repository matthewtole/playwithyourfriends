import {IPlayer, IRoom} from '../../lib/room';

export interface IRound {
  id: string;
  words: Array<{word: {id: string; word: string}}>;
  votes: Array<{player_id: string; word_id: string; position: number}>;
  judge: IPlayer;
}

export interface IWord {
  id: string;
  word: string;
  player_id: string;
}

export interface IGame {
  id: string;
  rounds: Array<IRound>;
  room: IRoom;
  words: Array<IWord>;
}
