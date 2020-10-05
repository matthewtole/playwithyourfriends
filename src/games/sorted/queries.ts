import {gql} from '@apollo/client';

import {IPlayer} from '../../lib/room';
import {IRound} from './types';

export const GET_GAME = gql`
  query getGame($id: uuid!) {
    sorted_games_by_pk(id: $id) {
      words {
        id
        word
        player_id
      }
      room {
        players {
          name
          avatar_key
          id
        }
      }
      rounds(order_by: {number: desc}) {
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
    room: {players: Array<IPlayer>};
    rounds: Array<IRound>;
  };
}

export const GET_GAME_FOR_PLAYER = gql`
  query getGameForPlayer($id: uuid!, $player: uuid!) {
    sorted_games_by_pk(id: $id) {
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
  sorted_games_by_pk: {
    rounds: Array<IRound>;
  };
}
