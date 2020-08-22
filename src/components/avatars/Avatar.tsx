import * as React from 'react';

import transparent01 from './faces/transparent_01.png';
import blank from './faces/blank.png';

export interface AvatarProps {
  variant?: number;
  name?: string;
}

const getImageForVariant = (variant: number) => {
  return transparent01;
};

export const Avatar: React.FC<AvatarProps> = ({variant, name}) => {
  return (
    <div className="w-48 p-1 bg-gray-300 border-4 border-black rounded">
      <div className="px-2 pt-2 bg-green-300 border-4 border-black rounded">
        {variant ? (
          <img src={getImageForVariant(variant)} className="w-full" />
        ) : (
          <img src={blank} className="w-full" />
        )}
      </div>
      {name ? (
        <p className="p-1 mt-1 font-bold text-center text-white bg-gray-600 border-4 border-black rounded">
          {name}
        </p>
      ) : null}
    </div>
  );
};
