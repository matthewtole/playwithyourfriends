import {App} from './App';
import * as React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

test('renders the development footer', () => {
  const {getByRole} = render(<App />);
  expect(getByRole('link', {name: 'Home'})).toBeInTheDocument();
  expect(getByRole('link', {name: 'Player'})).toBeInTheDocument();
});
