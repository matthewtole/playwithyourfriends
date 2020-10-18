import cx from 'classnames';
import * as React from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';

import {Card} from '../../../../components/Card';

export const reorder = (
  list: Array<{word: string; id: string}>,
  startIndex: number,
  endIndex: number
): Array<{word: string; id: string}> => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const SortedCards: React.FC<{
  words: Array<{word: string; id: string}>;
  onUpdateOrder: (words: Array<{word: string; id: string}>) => void;
}> = ({words, onUpdateOrder}) => {
  const getItemStyle = (
    isDragging: boolean,
    draggableStyle?: React.CSSProperties
  ): React.CSSProperties => ({
    userSelect: 'none',
    ...draggableStyle,
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(words, result.source.index, result.destination.index);

    onUpdateOrder(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {provided => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="px-2 space-y-2"
            data-testid="drop"
          >
            {words.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <Card
                      className={cx('mx-auto', {
                        'opacity-75': snapshot.isDragging,
                      })}
                    >
                      {item.word}
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
