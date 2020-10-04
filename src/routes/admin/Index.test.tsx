import '@testing-library/jest-dom';

import * as React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import {MockedProvider, MockedResponse} from '@apollo/react-testing';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';

import {DELETE_ROOM, GET_ROOMS, IRoom} from '../../lib/room';
import {RoomList} from './Index';

describe('Admin', () => {
  describe('RoomList', () => {
    describe('empty state', () => {
      const mocks = [
        {
          request: {
            query: GET_ROOMS,
          },
          result: {
            data: {
              rooms: [],
            },
          },
        },
      ];

      it('should render loading UI', async () => {
        render(
          <>
            <MockedProvider mocks={mocks}>
              <RoomList />
            </MockedProvider>
          </>
        );
        expect(screen.getByText('LOADING')).toBeInTheDocument();
      });

      it('should render an empty table', async () => {
        render(
          <>
            <MockedProvider mocks={mocks}>
              <RoomList />
            </MockedProvider>
          </>
        );
        await screen.findByText("It's quiet, too quiet...");
        expect(
          screen.getByText("It's quiet, too quiet...")
        ).toBeInTheDocument();
      });
    });

    describe('handles errors from the API', () => {
      const mocks = [
        {
          request: {
            query: GET_ROOMS,
          },
          error: new Error('Oops'),
        },
      ];

      it('should render the error message', async () => {
        render(
          <>
            <MockedProvider mocks={mocks}>
              <RoomList />
            </MockedProvider>
          </>
        );
        await screen.findByText('Oops');
        expect(screen.getByText('Oops')).toBeInTheDocument();
      });
    });

    describe('list of rooms', () => {
      const room: IRoom = {
        id: 'abcdef',
        created_at: new Date(2020, 1, 1).toUTCString(),
        updated_at: new Date(2020, 2, 2).toUTCString(),
        code: '000000',
      };
      const mocks: Array<MockedResponse> = [
        {
          request: {
            query: GET_ROOMS,
          },
          result: {
            data: {
              rooms: [room],
            },
          },
        },
        {
          request: {
            query: DELETE_ROOM,
            variables: {id: room.id},
          },
          result: {data: room},
        },
      ];

      it('should render the list of rooms', async () => {
        render(
          <Router>
            <MockedProvider mocks={mocks}>
              <RoomList />
            </MockedProvider>
          </Router>
        );
        await screen.findByText('000000');
        expect(screen.getByText('000000')).toBeInTheDocument();
        expect(screen.getByText('02/01/2020')).toBeInTheDocument();
        expect(screen.getByText('03/02/2020')).toBeInTheDocument();
      });

      describe('deleting rooms', () => {
        it('should remove the room from the table', async () => {
          render(
            <Router>
              <MockedProvider mocks={mocks}>
                <RoomList />
              </MockedProvider>
            </Router>
          );
          const deleteButton = await screen.findByText(/delete/i);
          fireEvent.click(deleteButton);
          await waitFor(() =>
            expect(screen.queryByText('000000')).not.toBeInTheDocument()
          );
        });
      });
    });
  });
});
