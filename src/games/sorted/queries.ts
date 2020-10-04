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
