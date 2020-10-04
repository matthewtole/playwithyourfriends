import {gql} from '@apollo/client';

export const CREATE_ROUND = gql`
  mutation createRound(
    $game: uuid!
    $judge: uuid!
    $number: Int!
    $word1: uuid!
    $word2: uuid!
    $word3: uuid!
    $word4: uuid!
    $word5: uuid!
  ) {
    insert_sorted_rounds_one(
      object: {
        game_id: $game
        judge_id: $judge
        number: $number
        words: {
          data: [
            {word_id: $word1}
            {word_id: $word2}
            {word_id: $word3}
            {word_id: $word4}
            {word_id: $word5}
          ]
        }
      }
    ) {
      id
    }
  }
`;
