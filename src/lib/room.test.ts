import {generateRoomCode} from './room';

describe('Room', () => {
  describe('#generateRoomCode', () => {
    it('should generate a valid room code', () => {
      for (let i = 0; i < 1000; i += 1) {
        expect(generateRoomCode()).toMatch(/^[0-9]{6}$/);
      }
    });
  });
});
