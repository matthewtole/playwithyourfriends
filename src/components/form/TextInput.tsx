import classnames from 'classnames';
import * as React from 'react';

export const TextInput: React.FC<React.HTMLProps<HTMLInputElement>> = props => (
  <input
    type="text"
    {...props}
    className={classnames('rounded leading-none', props.className)}
  />
);
