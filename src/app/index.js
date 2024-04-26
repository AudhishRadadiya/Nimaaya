import { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Routes from 'routes/index';
import { ThemeContext } from '../contexts/theme-context';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { clearToken, setAuthToken } from 'Helper/AuthTokenHelper';
import { setIsLogin } from 'redux/reducers/auths.slice';
import { setSelectedLocation } from 'redux/reducers/Role/role.slice';
import { Spin } from 'antd';
import SocketComponent, { socketDataSend } from 'socket/SocketComponent';
import io from 'socket.io-client';
export const socket = io.connect(process.env.REACT_APP_SOCKET_URL);

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const { status, msg } = error?.response?.data || {};
    // console.log('interceptors - status', status);
    // console.log('interceptors - msg', msg);
    if (status === 401) {
      clearToken();
      window.location.href = '/';
      toast.error('Access Token is not valid or has expired');
    } else if (status === 406 || status === 404) {
      clearToken();
      window.location.href = '/';
      toast.error(
        'Your account is deactivated by admin. Please contact your admin.',
      );
    }
    return Promise.reject(error);
  },
);

export function App() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const isBrowserDefaultDark = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const getDefaultTheme = () => {
    const localStorageTheme = localStorage.getItem('default-theme');
    const browserDefault = isBrowserDefaultDark() ? 'dark' : 'light';
    return localStorageTheme ? localStorageTheme : browserDefault;
  };
  const [theme, setTheme] = useState(getDefaultTheme());
  let UserPreferences = localStorage.getItem('UserPreferences');
  if (UserPreferences) {
    UserPreferences = JSON.parse(window.atob(UserPreferences));
    dispatch(setIsLogin(true));
    setAuthToken(UserPreferences?.token);
  }
  useEffect(() => {
    socket.on('connect', (res) => {
      // console.log('socket connect.');
    });
    socketDataSend();
  }, [])
  useEffect(() => {
    let userLocation = localStorage.getItem('userLocation')
    if (userLocation) {
      userLocation = JSON.parse(window.atob(userLocation));
      dispatch(setSelectedLocation(userLocation))
    }
  }, [dispatch])
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`theme-${theme}`}>
        <Suspense fallback={
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        }>
          <Helmet
            titleTemplate="%s - Nimaaya IVF Hospital"
            defaultTitle="Nimaaya IVF Hospital"
            htmlAttributes={{ lang: i18n.language }}
          >
            <meta name="description" content="A Nimaaya application" />
          </Helmet>
          <SocketComponent />
          <Routes />
        </Suspense>
      </div>
    </ThemeContext.Provider >
  );
}
