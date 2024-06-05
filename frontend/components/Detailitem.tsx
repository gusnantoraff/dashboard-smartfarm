import { Box, Skeleton, Text } from '@chakra-ui/react';
import React from 'react';

type Props = {
  label: string;
  value: string | number | React.ReactNode;
  gray?: boolean;
  noPadding?: boolean;
  loading?: boolean;
};

function DetailItem({
  noPadding,
  label,
  value,
  gray = false,
  loading = false,
}: Props) {
  return (
    <Box
      px={noPadding ? '0px' : '16px'}
      py='11px'
      display={'flex'}
      backgroundColor={gray ? '#FAFAFA' : '#FFFFFF'}
      justifyContent={'space-between'}
    >
      <Text fontSize={'14px'} color={'black'} fontWeight={500}>
        {label}
      </Text>
      <Skeleton
        isLoaded={!loading}
        width={loading ? '80px' : 'auto'}
        height={loading ? 5 : 'auto'}
      >
        <Text as={'div'} fontSize={'14px'} color={'black'} fontWeight={700}>
          {value}
        </Text>
      </Skeleton>
    </Box>
  );
}

function Border({ small = false }: { small?: boolean }) {
  return (
    <Box
      borderBottom={'1px'}
      borderBottomColor={'#C4C4C480'}
      my={small ? '8px' : '24px'}
    />
  );
}

function Title({
  title,
  subtitle,
  subtitle2,
  subtitle3,
  noMargin = false,
}: {
  title?: string;
  subtitle?: string | React.ReactNode;
  subtitle2?: string | React.ReactNode;
  subtitle3?: string | React.ReactNode;
  status?: boolean | null | undefined;
  noMargin?: boolean;
}) {
  return (
    <div className={`flex  items-start ${noMargin ? '' : 'mb-4'}`}>
      <Box
        className='flex flex-col'
        fontSize={'14px'}
        color={'text.02'}
        fontWeight={500}
      >
        {subtitle3 && subtitle3}
        {title && (
          <Text fontSize={'20px'} color={'primary'} fontWeight={600}>
            {title}
          </Text>
        )}

        {subtitle && subtitle}

        {subtitle2 && subtitle2}
      </Box>
    </div>
  );
}

DetailItem.Border = Border;
DetailItem.Title = Title;

export default DetailItem;
