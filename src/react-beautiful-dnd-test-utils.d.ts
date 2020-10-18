declare module 'react-beautiful-dnd-test-utils' {
  import {screen} from '@testing-library/dom';

  export function mockGetComputedSpacing(): void;
  export function mockGetBoundingClientRect(el: HTMLElement): void;
  export function mockDndElSpacing(rtlUtils: {container: HTMLElement}): void;
  export function makeDnd(opts: {
    getByText: typeof screen.getByText;
    getDragEl: () => Element;
    direction: string;
    positions: number;
  }): Promise<void>;

  export const DND_DRAGGABLE_DATA_ATTR: string;
  export const DND_DIRECTION_LEFT: string;
  export const DND_DIRECTION_RIGHT: string;
  export const DND_DIRECTION_DOWN: string;
  export const DND_DIRECTION_UP: string;
}
