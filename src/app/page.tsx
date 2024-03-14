import { useNavigate } from 'react-router-dom';

export default function Page() {
  const navigate = useNavigate();
  navigate('/dashboard');
  return null;
}
