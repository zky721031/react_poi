import { Navigate } from 'react-router-dom';
import { getCookies } from '../utils';

export default function Auth({ children }) {
  const isToken = getCookies('authToken');
  return isToken ? <>{children}</> : <Navigate to='/' replace />;
}
