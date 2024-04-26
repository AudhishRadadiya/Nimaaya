import * as React from 'react';
import ReactDOM from 'react-dom/client';
import 'sanitize.css/sanitize.css';
import { App } from 'app/index';
import { HelmetProvider } from 'react-helmet-async';
import './locales/i18n';
import '../src/scss/Style.scss';
import { Provider } from 'react-redux';
import { configureAppStore } from 'redux/configureStore';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
// import 'antd/dist/antd.css';

const store = configureAppStore();
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <HelmetProvider>
        {/* <React.StrictMode> */}
        <App />
        <ToastContainer />
        {/* </React.StrictMode> */}
      </HelmetProvider>
    </Provider>
  </BrowserRouter>,
);
