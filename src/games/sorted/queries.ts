import {gql} from '@apollo/client';

import {IPlayer} from '../../lib/room';
import {IGame, IRound} from './types';

export const GET_GAME = gql`
  query getGame($id: uuid!) {
    sorted_games_by_pk(id: $id) {
      words {
        id
        word
        player_id
      }
      room {
        code
        players {
          name
          avatar_key
          id
        }
      }
      rounds(order_by: {number: desc}) {
        votes {
          player_id
          word_id
          position
        }
        judge {
          id
        }
        words {
          word {
            id
            word
          }
        }
      }
    }
  }
`;
export interface IGetGameQuery {
  sorted_games_by_pk: {
    words: Array<{id: string; word: string; player_id: string}>;
    room: {players: Array<IPlayer>; code: string};
    rounds: Array<IRound>;
  };
}

export const GET_GAME_FOR_PLAYER = gql`
  query getGameForPlayer($id: uuid!, $player: uuid!) {
    sorted_games_by_pk(id: $id) {
      id
      words {
        id
        player_id
        word
      }
      rounds(order_by: {number: desc}, limit: 1) {
        id
        words {
          word {
            id
            word
          }
        }
        judge {
          name
          id
        }
        votes(where: {player_id: {_eq: $player}}) {
          player_id
          position
          word_id
        }
      }
    }
  }
`;
export interface IGetGameForPlayerQuery {
  sorted_games_by_pk: Pick<IGame, 'rounds' | 'words' | 'id'>;
}
