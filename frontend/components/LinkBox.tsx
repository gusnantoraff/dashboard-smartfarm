import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {
  href: string;
  children: React.ReactNode;
  light?: boolean;
  color?: string;
  [x: string]: any;
};

export default function LinkBox({ href, children, ...rest }: Props) {
  const router = useRouter();

  const redirect = (e: any) => {
    e.preventDefault();
    router.push(
      {
        pathname: href,
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <Box as='a' href={href} target='_blank' onClick={redirect} {...rest}>
      {children}
    </Box>
  );
}
