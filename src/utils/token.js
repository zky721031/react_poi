const key = 'auth';

const setToken = (token) => window.localStorage.setItem(key, token);

const getToken = () => window.localStorage.getItem(key);

const removeToken = () => window.localStorage.removeItem(key);

export { setToken, getToken, removeToken };
