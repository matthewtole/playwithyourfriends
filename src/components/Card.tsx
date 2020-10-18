import cx from 'classnames';
import * as React from 'react';

export const Card: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => (
  <div
    className={cx(
      'flex items-center justify-center max-w-lg p-4 text-xl bg-gray-200 border-4 border-black rounded-lg shadow-lg',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);
