import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { isLoggedIn } from '../auth';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/app/dashboard', { replace: true });
    } else {
      navigate('/auth/login', { replace: true });
    }
  }, [navigate]);

  return null;
}
