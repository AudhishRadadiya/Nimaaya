import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import PrivateRouter from './PrivateRouter';
import { appRoute } from './appRoute';

export default function Index() {
  return (
    <Routes>
      {appRoute?.map((item, index) => {
        return item?.isPublic === false ? <Route key={index} path={item?.path} element={<PrivateRouter>{item.element}</PrivateRouter>} /> : <Route key={index} path={item?.path} element={item.element} />
      })}
    </Routes >
  );
}
