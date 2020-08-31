import * as React from 'react';

export const Card: React.FunctionComponent = ({children}) => (
  <div className="flex items-center justify-center max-w-lg p-4 text-xl bg-gray-200 border-4 border-black rounded-lg shadow-lg">
    {children}
  </div>
);
