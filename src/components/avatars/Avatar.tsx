import * as React from 'react';

export interface AvatarProps {
  emoji: string;
  name: string;
}

export const Avatar: React.FC<AvatarProps> = ({emoji, name}) => {
  return (
    <div className="w-48 max-w-full p-1 bg-gray-300 border-4 border-black rounded">
      <div className="flex items-center justify-center p-8 bg-green-300 border-4 border-black rounded">
        <span className="text-6xl leading-none">{emoji}</span>
      </div>
      <p className="p-1 mt-1 text-center text-white bg-gray-600 border-4 border-black rounded font-title">
        {name}
      </p>
    </div>
  );
};
