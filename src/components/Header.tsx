import * as React from 'react';

interface HeaderProps {
  game?: string;
  name?: string;
  code?: string;
}

export const Header: React.FC<HeaderProps> = ({game, name, code}) => {
  return (
    <header className="flex px-4 py-2 text-xl text-white bg-blue-700 border-b-4 border-blue-800 font-title">
      <h1>
        <span className="opacity-75">pwyf</span>
        {game ? ' // ' + game : ''}
      </h1>
      <div className="flex-1"></div>
      <h2>{name || code}</h2>
    </header>
  );
};
