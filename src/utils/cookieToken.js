import Cookies from 'universal-cookie';
const cookies = new Cookies();

const setCookies = (name, token) => cookies.set(name, token);
const getCookies = (name) => cookies.get(name);
const removeCookies = (name) => cookies.remove(name);

export { setCookies, getCookies, removeCookies };
