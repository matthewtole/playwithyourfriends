import * as React from 'react';

import {Meta} from '@storybook/react/types-6-0';
import {Card} from './Card';

export default {
  title: 'Components/Card',
  component: Card,
} as Meta;

export const Basic: React.SFC<{}> = () => <Card>Test</Card>;
