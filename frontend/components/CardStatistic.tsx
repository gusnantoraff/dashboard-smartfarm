import { Box, Card, CardBody, CardHeader, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import ConfigModal from './ConfigModal';
import { UpdateConfigControllerMethods } from '@/types';

type Props = {
  label?: string;
  value?: string | number;
  children?: React.ReactNode;
  helperText?: string;
  className?: string;
  bodyClassName?: string;
  method: UpdateConfigControllerMethods;
  schema?: any;
};

function CardStatistic({
  label,
  value = 0,
  helperText,
  children,
  className,
  bodyClassName,
  method,
  schema,
}: Props) {
  const formatNumber = (num: number) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const capitalize = (s: string) => {
    const split = s.split('_');

    if (split.length > 1) {
      return split
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .join(' ');
    }

    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <Card
      className={className}
      borderRadius={'0.5rem'}
      shadow={'0px rgba(0, 0, 0, 0)'}
      bg={'white'}
      pt={!label ? '1.25rem' : '0'}
    >
      {label && (
        <CardHeader
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          pb='0.75rem'
        >
          <Flex
            alignItems={'center'}
            gap={'0.5rem'}
            fontSize={'1rem'}
            fontWeight={600}
          >
            <span>{label}</span>
          </Flex>
          {helperText && (
            <ConfigModal
              title={`CONTROLLER ${method} CONFIG`}
              subtitle={helperText}
              initialVal={schema}
              method={method}
              helperText={helperText}
            >
              {Object.keys(schema).map((key, idx) =>
                key === 'controllerId' ? null : (
                  <ConfigModal.Data
                    key={`${key}${idx}`}
                    label={capitalize(key)}
                    name={key}
                    value={schema[key]}
                    editable
                  />
                ),
              )}
            </ConfigModal>
          )}
        </CardHeader>
      )}
      <CardBody className={bodyClassName} pt={0}>
        {children && value ? (
          <>
            <Text mb={'5'} fontSize={'2rem'} fontWeight={600} color='secondary'>
              {typeof value === 'number' ? formatNumber(value) : value}
            </Text>
            {children}
          </>
        ) : children ? (
          children
        ) : (
          <Text fontSize={'2rem'} fontWeight={600} color='secondary'>
            {typeof value === 'number' ? formatNumber(value) : value}
          </Text>
        )}
      </CardBody>
    </Card>
  );
}

function SubItem({
  label,
  value = 0,
  bold = false,
  sub,
  small = false,
}: {
  label: string;
  value: string | number | React.ReactNode;
  bold?: boolean;
  sub?: string;
  small?: boolean;
}) {
  return (
    <Box color={'black'}>
      <Text fontWeight={bold ? 600 : 400} fontSize={'1rem'}>
        {label}
      </Text>
      <Text
        fontWeight={700}
        color={'secondary'}
        fontSize={small ? '1.5rem' : '2rem'}
      >
        {value}
      </Text>
      {sub && <Text fontSize={'1rem'}>{sub}</Text>}
    </Box>
  );
}

CardStatistic.SubItem = SubItem;

export default CardStatistic;
