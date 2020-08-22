import {App} from './App';
import * as React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

test('renders the basic app', () => {
  const {getByText} = render(<App />);
  expect(getByText('Play With Your Friends')).toBeInTheDocument();
});
