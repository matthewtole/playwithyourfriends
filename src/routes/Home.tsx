import * as React from 'react';

import logo from '../images/logo.svg';

export const Home: React.FC = () => (
  <main className="flex items-center justify-center h-screen p-8 bg-forward-slices font-title">
    <img src={logo} className="w-1/2 w-full lg:w-1/2"></img>
  </main>
);
