import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';

import { ChakraProvider } from '@chakra-ui/react';

import theme from '@/theme';

import NProgress from 'nprogress';
import { useRouter } from 'next/router';

import '@fontsource/work-sans';

import dotenv from 'dotenv';
dotenv.config();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeStart', () => NProgress.start());
    router.events.on('routeChangeComplete', () => NProgress.done());
    router.events.on('routeChangeError', () => NProgress.done());
  }, []);

  return (
    <ChakraProvider theme={theme}>
        <Component {...pageProps} />
    </ChakraProvider>
  );
}
