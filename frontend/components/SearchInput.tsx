import useDebounce from '@/hooks/useDebounce';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

type Props = {
  setPagination?: (value: any) => void;
  placeholder?: string;
  searchRouter?: boolean;
  onSearch?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  width?: string;
};

export default function SearchInput({
  setPagination,
  placeholder,
  searchRouter,
  onSearch,
  size = 'lg',
  className,
  width = '60%',
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const debounceValue = useDebounce(search, 500);

  useEffect(() => {
    if (searchRouter) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, q: debounceValue },
      });
    } else if (onSearch) {
      onSearch(debounceValue);
    } else if (setPagination) {
      setPagination((prev: any) => ({
        ...prev,
        search: {
          keyword: debounceValue,
        },
      }));
    }
  }, [debounceValue]);

  return (
    <InputGroup
      className={className}
      size={size}
      bg='other.02'
      w={width}
      border='1px'
      borderWidth={'1px'}
      borderColor='other.03'
      borderRadius={'8px'}
    >
      <InputLeftElement pointerEvents='none'>
        <img
          width={size === 'md' ? '16px' : undefined}
          src='/icons/Search.svg'
          alt='search'
        />
      </InputLeftElement>
      <Input
        fontSize={'14px'}
        _placeholder={{ fontWeight: 500 }}
        type='search'
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder || 'Search'}
      />
    </InputGroup>
  );
}
