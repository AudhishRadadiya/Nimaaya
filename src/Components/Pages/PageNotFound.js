import React from 'react';
import NotFoundImg from '../../Img/404.png'

const PageNotFound = () => {
  return (
    <div className='not_found'>
      <img src={NotFoundImg} alt="NotFoundImg" />
      <h2>404 - Not Found</h2>
      <p>The page you're looking for does not exist.</p>
    </div >
  );
};
export default PageNotFound;
