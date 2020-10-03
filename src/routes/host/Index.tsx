import * as React from 'react';

export interface Room {
  code: string;
  createdAt: number;
  lastPing?: number;
  game?: {
    name: string;
    id: string;
  };
}

export const Host: React.FC = () => {
  return (
    <main className="flex w-screen h-screen bg-forward-slices overflow-none"></main>
  );
};
