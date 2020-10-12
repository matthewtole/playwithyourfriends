import * as React from 'react';

import {Meta} from '@storybook/react/types-6-0';

import {Button, ButtonProps} from './Button';

export default {
  title: 'Components/Button',
  component: Button,
} as Meta;

export const Basic = (args: ButtonProps): JSX.Element => (
  <Button {...args}>Test</Button>
);
