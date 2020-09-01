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
  orders: {[key: string]: number[]};
  revealedCards: number;
}

export interface Game {
  cards: Card[];
  rounds: Round[];
  players: PlayerId[];
}

export async function create(players: PlayerId[]): Promise<string> {
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

export async function startRound(game: Game, gameId: string) {
  const round: Round = {
    judge: game.players[0],
    cards: game.cards.sort(() => Math.random() * 2 - 1).slice(0, 5),
    orders: {},
    revealedCards: 0,
  };
  await firestore
    .collection('sorted')
    .doc(gameId)
    .update({
      rounds: firebase.firestore.FieldValue.arrayUnion(round),
    });
}

export async function submitOrder(
  game: Game,
  gameId: string,
  playerId: PlayerId,
  order: Card[]
) {
  game.rounds[0].orders[playerId] = order.map(o =>
    game.cards.findIndex(c => c.word === o.word)
  );
  await firestore.collection('sorted').doc(gameId).set(game);
  console.log(game);
  // awaut fire
  // .doc(`${gameId}/rounds/0/orders`)
  // .update({
  //   [playerId]: order,
  // });
}
