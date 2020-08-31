import * as firebase from 'firebase/app';

import {Player} from '../../data/host/reducer';
import {firestore} from '../../lib/firebase';

type PlayerId = string;

export interface Card {
  word: string;
  createdBy: PlayerId;
}

export interface Round {
  judge: PlayerId;
  cards: Card[];
  orders: {player: PlayerId; order: number[]};
  revealedCards: number;
}

export interface Game {
  cards: Card[];
  rounds: Round[];
  players: Player[];
}

export async function create(players: Player[]): Promise<string> {
  const game: Game = {
    cards: [],
    rounds: [],
    players,
  };

  const ref = await firestore.collection('sorted').add(game);
  return ref.id;
}

export async function addCard(
  word: string,
  gameId: string,
  playerId: PlayerId
) {
  await firestore
    .collection('sorted')
    .doc(gameId)
    .update({
      cards: firebase.firestore.FieldValue.arrayUnion({
        word: word,
        createdBy: playerId,
      }),
    });
}
