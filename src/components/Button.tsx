import * as React from 'react';
import classnames from 'classnames';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  size?: 'small' | 'standard' | 'large';
}

const SIZE_CLASSES: {[size: string]: string} = {
  small: 'text-sm py-1 px-2',
  standard: 'text-base p-2',
  large: 'text-lg p-3',
};

export const Button: React.FC<ButtonProps> = ({
  fullWidth,
  size,
  className,
  children,
  ...rest
}) => (
  <button
    className={classnames(
      'block text-white bg-black rounded font-title hover:bg-cta-dark hover:text-white disabled:bg-gray-400',
      {
        'w-full': fullWidth,
      },
      [SIZE_CLASSES[size || 'standard']],
      className
    )}
    {...rest}
  >
    {children}
  </button>
);
