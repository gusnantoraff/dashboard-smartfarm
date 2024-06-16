import { Box } from '@chakra-ui/react';
import React from 'react';

type Props = {
  color: 'status.success' | 'status.error' | 'status.warning';
};

export default function Status({ color }: Props) {
  return (
    <div className='flex items-center gap-2'>
      <div className='relative flex h-3 w-3"'>
        <Box
          as='span'
          hidden={color !== 'status.success'}
          className='animate-ping absolute inline-flex h-full w-full rounded-full opacity-75'
          bg={color}
        ></Box>
        <Box
          as='span'
          className='relative inline-flex rounded-full h-3 w-3'
          bg={color}
        ></Box>
      </div>
    </div>
  );
}
