import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from '@chakra-ui/react';
import React from 'react';

type Props = {
  children: React.ReactNode;
  content: React.ReactNode | string;
  footer: React.ReactNode;
  headerText: string;
};

export default function Tooltip({
  children,
  content,
  headerText,
  footer,
}: Props) {
  return (
    <Popover placement='bottom-start' closeOnBlur={false}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{headerText}</PopoverHeader>
        <PopoverBody fontSize={'sm'}>{content}</PopoverBody>

        <PopoverFooter
          border='0'
          display='flex'
          alignItems='center'
          justifyContent='right'
          pb={4}
        >
          {footer}
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
