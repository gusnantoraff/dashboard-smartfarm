import { useRouter } from 'next/router';

export default async function handler(req, res) {
  const { email, password } = req.body;

  const response = await fetch('http://localhost:4000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (data.success) {
    const router = useRouter();
    router.push('/dashboard');
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}
