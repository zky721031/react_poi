import { useCookies } from 'react-cookie';
import Navigation from '../../components/Navigation';

export default function Layout() {
  const [cookies] = useCookies(['token']);
  console.log('getCookie => ', cookies.token);

  return (
    <div>
      <Navigation />
      <h1>Layout Page</h1>
      <p>cookie : {cookies.token}</p>
    </div>
  );
}
