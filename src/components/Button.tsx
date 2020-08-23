import * as React from 'react';
import classnames from 'classnames';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  fullWidth,
  className,
  children,
  ...rest
}) => (
  <button
    className={classnames(
      'block p-2 text-lg text-white bg-cta rounded font-title hover:bg-cta-dark hover:text-white',
      {
        'w-full': fullWidth,
      },
      className
    )}
    {...rest}
  >
    {children}
  </button>
);
