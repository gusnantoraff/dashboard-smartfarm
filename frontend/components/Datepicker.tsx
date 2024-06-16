import React, { useState } from 'react';
import { HStack } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { DateRangePicker, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

type Props = {
  [x: string]: any;
};

export default function Datepicker({ ...rest }: Props) {
  const [focus, setFocus] = useState(false);

  const [date1, setDate1] = useState<string | null>(
    dayjs().format('YYYY-MM-DD'),
  );
  const [date2, setDate2] = useState<string | null>(
    dayjs().format('YYYY-MM-DD'),
  );

  const selectionRange = {
    startDate: dayjs(date1).toDate(),
    endDate: dayjs(date2).toDate(),
    key: 'selection',
  };

  const handleSelect = (ranges: RangeKeyDict) => {
    if (ranges.selection.startDate) {
      setDate1(dayjs(ranges.selection.startDate).format('YYYY-MM-DD'));
    }

    if (ranges.selection.endDate) {
      setDate2(dayjs(ranges.selection.endDate).format('YYYY-MM-DD'));
      setFocus(false);
    }
  };

  return (
    <HStack
      {...rest}
      transition={'0.2s ease-in'}
      borderRadius={'0.5rem'}
      px='1rem'
      onBlur={() => setFocus(false)}
      borderWidth={'1px'}
      cursor={'pointer'}
      borderColor={focus ? '#3182ce' : 'other.03'}
      boxShadow={focus ? '0 0 0 1px #3182ce' : 'none'}
      _hover={focus ? undefined : { borderColor: 'gray.300' }}
      position={'relative'}
      display='flex'
      justifyContent='space-between'
    >
      <div
        className='w-full flex justify-between items-center'
        onClick={() => {
          setFocus(!focus);
        }}
      >
        {date1 && date2 ? (
          <p className='font-bold text-sm'>
            {dayjs(date1).format('DD/MM/YYYY')}&nbsp;-&nbsp;
            {dayjs(date2).format('DD/MM/YYYY')}
          </p>
        ) : (
          'Select date'
        )}
        <img src='/icons/calendar.svg' />
      </div>
      <DateRangePicker
        className={`absolute shadow-lg border-gray-400 rounded-lg transition-all duration-100 top-10 -left-10 bg-white z-10 ${
          focus ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        ranges={[selectionRange]}
        onChange={handleSelect}
      />
    </HStack>
  );
}
