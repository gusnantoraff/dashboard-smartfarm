import { useState } from 'react';
import { useRouter } from 'next/router';
import AuthLayout from '@/layouts/Auth.layout';
import { Button, Text } from '@chakra-ui/react';
import FormItem from '@/components/FormItem';
import Link from '@/components/Link';
import { Formik, Form } from 'formik';
import Head from 'next/head';

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [userExists, setUserExists] = useState<boolean>(false);

  const checkUserExists = async (email: string) => {
    try {
      const response = await fetch(`http://localhost:4000/users?email=${email}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setUserExists(true);
        } else {
          setError('Email not found');
        }
      } else {
        setError('Something went wrong');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleSubmit = async ({ email }: { email: string }) => {
    setError('');
    setSuccess(false);

    await checkUserExists(email);
    
    if (userExists) {
      try {
        const response = await fetch('http://localhost:4000/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setSuccess(true);
        } else {
          const data = await response.json();
          setError(data.message || 'Something went wrong');
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error);
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password - OS SMARTFARM</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <AuthLayout
        title='Forgot Password'
        subtitle='Enter your email to reset your password'
      >
        <Formik
          initialValues={{ email: '' }}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className='flex flex-col gap-y-6'>
              <FormItem.Input name='email' placeholder='E-mail' type='email' />
            </div>

            <Button
              w={'100%'}
              mt={'2.5rem'}
              type='submit'
              size='lg'
            >
              RESET PASSWORD
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

            {success && (
              <Text
                textAlign={'center'}
                letterSpacing={'-0.39 px'}
                lineHeight={'19.07px'}
                fontSize={'14px'}
                color='green'
                fontWeight={400}
                mt={2}
              >
                Password reset instructions have been sent to your email.
              </Text>
            )}

            <div className='flex justify-center items-center mt-6'>
              <Link href='/'>Back to Sign In</Link>
            </div>
          </Form>
        </Formik>
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;
