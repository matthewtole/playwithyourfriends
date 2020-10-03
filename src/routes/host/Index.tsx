import * as React from 'react';

export interface Room {
  id: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export const Host: React.FC = () => {
  return (
    <main className="flex w-screen h-screen bg-forward-slices overflow-none"></main>
  );
};
