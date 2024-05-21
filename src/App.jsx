// import reactLogo from './assets/react.svg';
import './App.scss';
import AppStore from './AppStore';
import MRouter from './router'; // useRoutes

export default function App() {
  return (
    <AppStore>
      <MRouter />
    </AppStore>
  );
}
