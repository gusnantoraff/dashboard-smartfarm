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
  ecDaps: number[];
  ecMode: string;
};

function EcConfigModal({
  label,
  value = 0,
  helperText,
  children,
  className,
  bodyClassName,
  method,
  ecDaps,
  ecMode,
  schema,
}: Props) {
  const formatNumber = (num: number) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
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
          <ConfigModal.EC
            title={`CONTROLLER ${method} CONFIG`}
            subtitle={helperText}
            method={method}
            helperText={helperText}
            daps={ecDaps ?? []}
            mode={ecMode}
            initialVal={schema}
          />
        </CardHeader>
      )}
      <CardBody className={bodyClassName} pt={0}>
        <Text mb={'5'} fontSize={'2rem'} fontWeight={600} color='secondary'>
          {typeof value === 'number' ? formatNumber(value) : value}
        </Text>
        {children}
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

EcConfigModal.SubItem = SubItem;

export default EcConfigModal;
