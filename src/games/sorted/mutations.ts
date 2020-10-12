import {gql} from '@apollo/client';

export const CREATE_GAME = gql`
  mutation createGame($room: uuid!) {
    insert_sorted_games_one(object: {room_id: $room}) {
      id
    }
  }
`;

// TODO: Find a better way to do the createRound mutation #2
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

export const SUBMIT_WORDS = gql`
  mutation submitWords($game: uuid!, $player: uuid!, $word: String!) {
    insert_sorted_words_one(
      object: {game_id: $game, player_id: $player, word: $word}
    ) {
      id
    }
  }
`;

export const SUBMIT_VOTE = gql`
  mutation submitVote(
    $round: uuid!
    $player: uuid!
    $word: uuid!
    $position: Int!
  ) {
    insert_sorted_votes_one(
      object: {
        round_id: $round
        player_id: $player
        word_id: $word
        position: $position
      }
    ) {
      position
    }
  }
`;
