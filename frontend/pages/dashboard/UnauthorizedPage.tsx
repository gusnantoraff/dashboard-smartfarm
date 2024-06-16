import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const UnauthorizedPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      Cookies.remove('token');
      Cookies.remove('role');
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Sesi Anda Telah Habis.</h1>
      <p className="text-lg text-gray-600">Anda akan dialihkan kembali ke halaman Login dalam beberapa detik.</p>
    </div>
  );
};

export default UnauthorizedPage;
