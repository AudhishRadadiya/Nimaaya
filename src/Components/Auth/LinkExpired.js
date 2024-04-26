import React from 'react'
import LogoIcon from '../../Img/logo-icon.svg';
import LogoText from '../../Img/logo-text.svg';

export default function LinkExpired() {
  return (
    <div className='login_wrapper set_password_wrap'>
      <div className="reset_password_wrap reset_second_Wrapper">
        <div className='reset_password_inner_wrap'>
          <div className="login_form_Inner">
            <div className="login_form_wrap">
              <div class="logo d-none d-lg-flex">
                <img src={LogoIcon} className="logo_icon" alt="" />
                <img src={LogoText} className="logo_text" alt="" />
              </div>
              <h1 className="mb-3 text-center">Oops, that's an expired link</h1>
              <p className="text-center mb-4">
                For security reasons, password reset links expire after a little while. If you still need to reset your password, you can contact to the administration.
              </p>
            </div>
            <div className="reset_password_form">
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
