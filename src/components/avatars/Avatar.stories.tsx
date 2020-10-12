import * as React from 'react';

import {Meta} from '@storybook/react/types-6-0';

import {Avatar, AvatarProps} from './Avatar';

export default {
  title: 'Components/Avatar',
  component: Avatar,
} as Meta;

export const Basic = (args: AvatarProps): JSX.Element => <Avatar {...args} />;
