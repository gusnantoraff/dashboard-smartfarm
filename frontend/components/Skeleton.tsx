import { Skeleton, Stack } from '@chakra-ui/react';
import React from 'react';

const SkeletonComponent = () => (
  <Stack>
    <Skeleton height='52px' />
    <Skeleton height='32px' mt={'8px'} />
    <Skeleton height='32px' />
    <Skeleton height='32px' />
    <Skeleton height='32px' />
  </Stack>
);

export default SkeletonComponent;
