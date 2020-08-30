import {useEffect, useState} from 'react';

import {Room} from '../routes/host/Index';
import {firestore} from './firebase';

// https://usehooks.com/useLocalStorage/
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // State to store our value

  // Pass initial state function to useState so logic is only executed once

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key

      const item = window.localStorage.getItem(key);

      // Parse stored json or if none return initialValue

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue

      console.log(error);

      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...

  // ... persists the new value to localStorage.

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState

      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state

      setStoredValue(valueToStore);

      // Save to local storage

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case

      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export function useRoom(roomId?: string): [Room | null, Error | undefined] {
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<Error | undefined>();
  useEffect(() => {
    if (!roomId) {
      return;
    }
    return firestore
      .collection('rooms')
      .doc(roomId)
      .onSnapshot(next => {
        setRoom(next.data() as Room);
        setError(next.exists ? undefined : new Error('Room does not exist'));
      });
  }, [roomId]);

  return [room, error];
}
