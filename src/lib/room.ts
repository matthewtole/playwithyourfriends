import {firestore} from './firebase';

export const COLLECTION_ROOMS = 'rooms';
export const COLLECTION_ROOM_PLAYERS = 'players';

export interface PlayerData {
  name: string;
  lastPing?: number;
}

export interface RoomData {
  code: string;
  createdAt: number;
  lastPing?: number;
  games: any[];
}

export function getRoom(id: string): firebase.firestore.DocumentReference {
  return firestore.collection(COLLECTION_ROOMS).doc(id);
}

export async function getRoomByCode(
  code: string
): Promise<{id: string; data: RoomData}> {
  const result = await firestore
    .collection(COLLECTION_ROOMS)
    .where('code', '==', code)
    .get();
  if (result.empty) {
    throw new Error();
  }
  return {id: result.docs[0].id, data: result.docs[0].data() as RoomData};
}

export async function addPlayerToRoom(
  id: string,
  playerData: PlayerData
): Promise<string> {
  const nameConflict = !(
    await getRoom(id)
      .collection(COLLECTION_ROOM_PLAYERS)
      .where('name', '==', playerData.name.toLowerCase())
      .get()
  ).empty;
  if (nameConflict) {
    throw new Error(
      `BE MORE ORIGINAL! SOMEONE ELSE ALREADY TOOK THE NAME "${playerData.name}"`
    );
  }

  const doc = await firestore
    .collection(COLLECTION_ROOMS)
    .doc(id)
    .collection(COLLECTION_ROOM_PLAYERS)
    .add(playerData);

  // const game = (await getRoom(id).get()).data()!.game;
  // if (game) {
  //   await addPlayer(game.name, game.id, id, doc.id);
  // }

  return doc.id;
}

export async function removePlayerFromRoom(roomId: string, playerId: string) {
  await firestore
    .collection(COLLECTION_ROOMS)
    .doc(roomId)
    .collection(COLLECTION_ROOM_PLAYERS)
    .doc(playerId)
    .delete();
}

export async function updatePlayerPing(roomId: string, playerId: string) {
  await firestore
    .collection(COLLECTION_ROOMS)
    .doc(roomId)
    .collection(COLLECTION_ROOM_PLAYERS)
    .doc(playerId)
    .update({
      lastPing: Date.now(),
    });
}
