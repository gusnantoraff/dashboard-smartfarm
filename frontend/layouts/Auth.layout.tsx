import { Text } from '@chakra-ui/react';
import React from 'react';

type Props = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

export default function AuthLayout({ children, title, subtitle }: Props) {
  return (
    <div className='w-full h-screen relative'>
      <div className='max-w-7xl hidden lg:block absolute right-0 top-0 z-10 max-h-screen'>
        <img
          src='/images/bg_1.png'
          className='w-[50vw] h-screen object-cover object-center'
          alt='Illustration'
        />
      </div>

      <div className='bg-white hidden lg:block absolute h-[105vh] w-[754px] px-3 lg:px-0 z-40 left-0 bottom-0 origin-bottom-right rotate-12'></div>

      <div className='bg-white max-w-4xl absolute h-screen w-screen lg:w-[754px] px-3 lg:px-0 z-50 left-0 top-0 flex justify-center items-center'>
        <div className='w-full max-w-sm'>
          <div className='mb-12'>
            <Text
              fontSize='2.25rem'
              fontWeight={700}
              lineHeight='40px'
              color='primary'
              marginBottom='1.5rem'
            >
              {title}
            </Text>

            <Text
              fontSize='1.25rem'
              fontWeight={400}
              lineHeight='24px'
              color='text.02'
            >
              {subtitle}
            </Text>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
