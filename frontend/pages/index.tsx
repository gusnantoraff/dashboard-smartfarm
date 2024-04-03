import AuthLayout from '@/layouts/Auth.layout';
import Head from 'next/head';

import { Formik, Form } from 'formik';
import { Button, FormLabel, Switch, Text } from '@chakra-ui/react';
import FormItem from '@/components/FormItem';
import Link from '@/components/Link';
import { useState } from 'react';
import { useRouter } from 'next/router';



const Login: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
    setError('');

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else if (response.status === 401) {
        setError('Invalid email or password');
      } else {
        const data = await response.json();
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <>
      <Head>
        <title>Sign In - OS SMARTFARM</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AuthLayout
        title='Welcome back'
        subtitle='Enter your email and password to sign in'
      >
        <Formik
          initialValues={{ email: '', password: ''}}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className='flex flex-col gap-y-6'>
              <FormItem.Input name='email' type='email' placeholder='E-mail' />
              <FormItem.Password name='password' />
              <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                  <Switch
                    colorScheme='green'
                    w={'42px'}
                    id='remember-me'
                  />
                  <FormLabel
                    fontSize={'14px'}
                    color='#252F40'
                    fontWeight={400}
                    htmlFor='remember-me'
                    mb='0'
                  >
                    Remember me
                  </FormLabel>
                </div>

                <Link href='/forgot-password' light>
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              w={'100%'}
              mt={'2.5rem'}
              type='submit'
              size='lg'
            >
              SIGN IN
            </Button>

            {error && (
              <Text
                textAlign={'center'}
                letterSpacing={'-0.39 px'}
                lineHeight={'19.07px'}
                fontSize={'14px'}
                color='status.error'
                fontWeight={400}
                mt={2}
              >
                {error}
              </Text>
            )}

            <div className='flex justify-center items-center mt-6'>
              <Text
                letterSpacing={'-0.39 px'}
                lineHeight={'19.07px'}
                fontSize={'14px'}
                color='#8392AB'
                fontWeight={600}
                mr={1}
              >
                Don&rsquo;t have an account?
              </Text>

              <Link href='/signup'>Sign up</Link>
            </div>
          </Form>
        </Formik>
      </AuthLayout>
    </>
  );
};

export default Login;
