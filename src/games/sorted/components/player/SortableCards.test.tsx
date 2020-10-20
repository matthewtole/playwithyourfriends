import '@testing-library/jest-dom';

import * as React from 'react';
import {
  DND_DIRECTION_DOWN, DND_DRAGGABLE_DATA_ATTR, makeDnd, mockDndElSpacing, mockGetComputedSpacing
} from 'react-beautiful-dnd-test-utils';

import {render, screen, waitFor} from '@testing-library/react';

import {SortedCards} from './SortableCards';

describe('SortableCards', () => {
  beforeEach(() => {
    mockGetComputedSpacing();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('initial render', () => {
    const words = ['alpha', 'bravo', 'charlie', 'delta', 'echo'];
    const updateOrderSpy = jest.fn();

    render(
      <SortedCards
        words={words.map((w, idx) => ({word: w, id: `word${idx + 1}`}))}
        onUpdateOrder={updateOrderSpy}
      />
    );

    const cardWords = screen.getAllByRole('button').map(el => el.textContent);
    expect(cardWords).toEqual(words);
  });

  test('sorting calls the callback', async () => {
    const words = ['alpha', 'bravo', 'charlie', 'delta', 'echo'];
    const updateOrderSpy = jest.fn();

    const el = render(
      <SortedCards
        words={words.map(w => ({word: w, id: w}))}
        onUpdateOrder={updateOrderSpy}
      />
    );
    mockDndElSpacing(el);

    const cardToDrag = screen
      .getByText('alpha')
      .closest(DND_DRAGGABLE_DATA_ATTR);
    expect(cardToDrag).not.toBeNull();

    //TOOO: Hack to make Typescript happt
    if (!cardToDrag) {
      return;
    }

    await makeDnd({
      getByText: screen.getByText,
      getDragEl: () => cardToDrag,
      direction: DND_DIRECTION_DOWN,
      positions: 2,
    });

    await waitFor(() =>
      expect(updateOrderSpy).toHaveBeenCalledWith(
        ['bravo', 'alpha', 'charlie', 'delta', 'echo'].map(w => ({
          word: w,
          id: w,
        }))
      )
    );
  });
});
