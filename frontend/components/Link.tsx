import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {
  href: string;
  children: React.ReactNode;
  light?: boolean;
  color?: string;
  [x: string]: any;
};

export default function Link({
  href,
  children,
  light,
  color = 'secondary',
  ...rest
}: Props) {
  const router = useRouter();

  const redirect = () => {
    router.push(
      {
        pathname: href,
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <Text
      onClick={redirect}
      letterSpacing={'-0.39 px'}
      lineHeight={'19.07px'}
      fontSize={'14px'}
      color={color}
      fontWeight={light ? 400 : 700}
      _hover={{ color: 'secondary_hover', cursor: 'pointer' }}
      {...rest}
    >
      {children}
    </Text>
  );
}
