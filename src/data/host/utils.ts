export function generateRoomCode(): string {
  return new Array(6)
    .fill(0)
    .map(() => Math.floor(10 * Math.random()).toString())
    .join('');
}
