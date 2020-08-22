import * as React from 'react';
import classnames from 'classnames';

export const TextInput: React.FC<React.HTMLProps<HTMLInputElement>> = props => (
  <input
    type="text"
    {...props}
    className={classnames('rounded', props.className)}
  />
);
