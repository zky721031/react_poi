import { useContext } from 'react';
import { AppContextWrapper } from '../../AppStore';

// i18n
import { useTranslation } from 'react-i18next';

export default function Test() {
  const { state, dispatch } = useContext(AppContextWrapper);

  const increment = () => {
    dispatch({ type: 'INCREMENT', payload: 1 });
  };
  const decrement = () => {
    dispatch({ type: 'DECREMENT', payload: 1 });
  };

  const { t, i18n } = useTranslation();

  const changeLng = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <h1>Test</h1>
      <p> state : {state.name}</p>
      <p> age : {state.age}</p>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
      <hr />
      <p>i18n:{t('hello', { name: 'omnieyes' })}</p>
      <p>i18n:{t('map')}</p>
      <button onClick={() => changeLng('zh')}>zh</button>
      <button onClick={() => changeLng('en')}>en</button>
    </div>
  );
}
