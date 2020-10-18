import * as React from 'react';

import {useMutation} from '@apollo/client';
import {writeStorage} from '@rehooks/local-storage';

import {Button} from '../../components/Button';
import {HOST_ROOM_ID} from '../../config/local-storage';
import logo from '../../images/logo.svg';
import {CREATE_ROOM, generateRoomCode} from '../../lib/room';

export const RoomCreation: React.FC = () => {
  const [error, setError] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(false);

  const [createRoomMutation] = useMutation(CREATE_ROOM);

  async function createRoom() {
    setLoading(true);
    setError(undefined);
    try {
      const {data, errors} = await createRoomMutation({
        variables: {code: generateRoomCode()},
        optimisticResponse: false,
      });
      setLoading(false);
      if (data) {
        writeStorage(HOST_ROOM_ID, data.insert_rooms_one.id);
      } else if (errors) {
        setError(errors.map(e => e.message).join('\n'));
      }
    } catch (ex) {
      setLoading(false);
      setError(ex.message);
    }
  }

  return (
    <>
      {error && (
        <div className="bg-red-700 text-white text-lg p-4 fixed top-0 left-0 right-0 text-center ">
          <p className="font-title pb-2">Something went wrong!</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex items-center flex-col space-y-16 h-screen justify-center p-16 bg-forward-slices w-full">
        <img src={logo} className="w-1/2" />
        <Button
          className="px-16 py-4 text-3xl"
          onClick={createRoom}
          disabled={loading}
        >
          Create Room
        </Button>
      </div>
    </>
  );
};
