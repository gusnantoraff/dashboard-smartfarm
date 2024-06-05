import React, { useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import ReactPaginate from 'react-paginate';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';

type Columns = {
  name: string;
  selector: (row: any, idx?: any) => any | React.ReactElement | React.ReactNode;
  width?: string;
  className?: string;
};

type Props = {
  columns: Columns[];
  data: any[];
  pagination: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  onPageChange: (page: number) => void;
};

const Table: React.FC<Props> = ({ columns, data, pagination, onPageChange }) => {
  const handlePageClick = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <div className='max-w-screen'>
      <table className='table-auto w-full max-w-screen overflow-x-scroll'>
        <thead>
          <tr>
            {columns.map((column, idx) => (
              <th
                key={idx}
                className={`${column.width} ${
                  column.className
                } font-semibold text-sm text-left bg-[#F8F8F8] px-4 py-3 ${
                  idx === 0
                    ? 'rounded-l-lg'
                    : idx === columns.length - 1
                    ? 'rounded-r-lg'
                    : ''
                }`}
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idxData) => (
            <tr
              key={idxData}
              className={`${
                idxData % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
              } border-b border-[#F5F5F5]`}
            >
              {columns.map((column, idx) => (
                <td
                  key={idx}
                  className={`${column.width} ${column.className} font-normal text-sm text-left px-4 py-2`}
                >
                  {column.selector(row, idxData)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Flex
       mt='2'
       bg='other.02'
       borderRadius={'12px'}
       justifyContent={'space-between'}
       alignItems={'center'}
       py='10px'
       px='1rem'
      >
        <ReactPaginate
          forcePage={pagination.page - 1}
          className='flex gap-x-[9px] transition-all duration-300 ease-in-out'
          breakLabel='...'
          nextLabel={<ArrowForwardIcon />}
          previousLabel={<ArrowBackIcon />}
          pageClassName='w-[35px] h-[35px] rounded-[8px] flex items-center justify-center pagination-page'
          activeClassName='w-[35px] h-[35px] rounded-[8px] flex items-center justify-center pagination-page-active'
          nextClassName='w-[35px] h-[35px] rounded-[8px] flex border-[#F2F2F2] items-center justify-center pagination-arrow'
          previousClassName='w-[35px] h-[35px] rounded-[8px] flex items-center border-[#F2F2F2] justify-center pagination-arrow'
          disabledClassName='pagination-arrow-disabled border border-[#F2F2F2]'
          nextLinkClassName='flex w-full h-full items-center justify-center'
          pageLinkClassName='flex w-full h-full items-center justify-center'
          activeLinkClassName='flex w-full h-full items-center justify-center'
          previousLinkClassName='flex w-full h-full items-center justify-center'
          disabledLinkClassName='text-gray-400 cursor-not-allowed'
          onPageChange={handlePageClick}
          pageCount={pagination.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
        />
        <Text fontSize='14px' fontWeight={600} color='black'>
          Showing {pagination.page === 1 ? 1 : (pagination.page - 1) * pagination.take + 1} to{' '}
          {pagination.page * pagination.take} of {pagination.itemCount} entries
        </Text>
      </Flex>
    </div>
  );
};

export default Table;
