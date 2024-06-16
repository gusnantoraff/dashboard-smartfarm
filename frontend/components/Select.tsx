import React, { useState } from 'react';
import { HStack, Select as CSelect } from '@chakra-ui/react';

type Options = { value: any; label: string };

type Props = {
  onSelect: (value: any) => void;
  [x: string]: any;
  options: Options[];
  selected?: any;
};

export default function Select({
  onSelect,
  options,
  selected,
  ...rest
}: Props) {
  const [focus, setFocus] = useState(false);

  return (
    <HStack
      {...rest}
      transition={'0.2s ease-in'}
      borderRadius={'0.5rem'}
      pl='1rem'
      onClick={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      borderWidth={'1px'}
      cursor={'pointer'}
      borderColor={focus ? '#3182ce' : 'other.03'}
      boxShadow={focus ? '0 0 0 1px #3182ce' : 'none'}
      _hover={focus ? undefined : { borderColor: 'gray.300' }}
    >
      <CSelect
        onChange={(e) => {
          onSelect(e.target.value);
        }}
        cursor={'pointer'}
        transition={'0.2s ease'}
        // bg='other.02'
        h='30px'
        variant='unstyled'
        fontSize={'14px'}
        color={'black'}
        fontWeight={600}
        _placeholder={{ fontWeight: 600, pl: '0.5rem' }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      >
        {options.map((item) =>
          item.value === selected ? (
            <option
              selected
              disabled
              hidden
              key={item.value}
              value={item.value}
            >
              {item.label.split('/')?.[1] || item.label}
            </option>
          ) : (
            <option key={item.value} value={item.value}>
              {item.label.split('/')?.[1] || item.label}
            </option>
          ),
        )}
      </CSelect>
    </HStack>
  );
}
