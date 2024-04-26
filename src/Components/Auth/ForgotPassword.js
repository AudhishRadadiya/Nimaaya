import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import LogoIcon from "../../Img/logo-icon.svg";
import LogoText from "../../Img/logo-text.svg";
import EmailIcon from "../../Img/email.svg";
import PhoneIcon from "../../Img/phone.svg";
import LeftArrow from "../../Img/left-arrow.svg";
import ForgotBg from "../../Img/forgot-pass-bg.jpg";
import ForgotImg from "../../Img/forgot-img.png";
import BackArrow from "../../Img/back-arrow.svg";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentYear } from "utils/CommonFunctions";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState("resend_email");

  const handleSendResetLink = () => {
    const isCheckType =
      selectedValue === "resend_email" ? "isEmail" : "isPhone";
    localStorage.setItem("Forgot", isCheckType);
    navigate("/send-code");
  };

  return (
    <div className="login_wrapper">
      <Row className="g-0">
        <Col lg={6}>
          <div className="login_form_wrap">
            <div className="login_form_Inner">
              <div className="login_top_wrapper">
                <div className="logo d-none d-lg-flex">
                  <img src={LogoIcon} className="logo_icon" alt="" />
                  <img src={LogoText} className="logo_text" alt="" />
                </div>
                <h1 className="mb-3">Forgot Password?</h1>
                <p className="text-center mb-4">
                  Please select option to sent link password
                </p>
                <img
                  src={ForgotImg}
                  className="top_img d-block d-lg-none"
                  alt=""
                />
                <Link to="/login" className="back_arrow d-block d-lg-none">
                  <img src={BackArrow} alt="" className="me-2" />
                </Link>
              </div>

              <div className="forgot_password_wrapper">
                <div className="forgot_pass_radio_wrapper">
                  <div className="form_group">
                    <input
                      type="radio"
                      name="otp_radio"
                      id="resend_email"
                      value="resend_email"
                      checked={selectedValue === "resend_email"}
                      onChange={(e) => setSelectedValue(e.target.value)}
                    />

                    <label htmlFor="resend_email">
                      <div className="icon">
                        <img src={EmailIcon} alt="" />
                      </div>
                      <div className="label_text">
                        <h2>Reset via Email</h2>
                        <p>
                          link reset will be send to your email address
                          registered
                        </p>
                      </div>
                    </label>
                  </div>
                  {/* <div className="form_group">
                    <input
                      type="radio"
                      name="otp_radio"
                      id="resend_sms"
                      value="resend_sms"
                      checked={selectedValue === 'resend_sms'}
                      onChange={e => setSelectedValue(e.target.value)}
                    />

                    <label htmlFor="resend_sms">
                      <div className="icon">
                        <img src={PhoneIcon} alt="" />
                      </div>
                      <div className="label_text">
                        <h2>Reset via SMS</h2>
                        <p>
                          link reset will be send to your email address
                          registered
                        </p>
                      </div>
                    </label>
                  </div> */}
                </div>

                <Button
                  htmlType="login"
                  className="w-100 btn_primary mb-4"
                  onClick={handleSendResetLink}
                  //onClick={() => navigate('/password-reset')}
                >
                  Send Reset Link
                </Button>

                {/* <p className="text-center text_dark">
                  Don’t receive the link?
                  <Link to="/password-reset" className="ps-1">
                    Resend
                  </Link>
                </p> */}
                <div className="back_to_login text-center d-none d-lg-block">
                  <Link to="/login" className="text_secondary d-inline-flex">
                    <img src={LeftArrow} alt="" className="me-2" /> Back to
                    login
                  </Link>
                </div>
              </div>
            </div>
            <div className="copyright_wrap d-none d-lg-block">
              <p className="m-0 text-center">
                @{getCurrentYear()} Nimaaya IVF Hospital. All rights reserved.
              </p>
            </div>
          </div>
        </Col>
        <Col lg={6} className="d-none d-lg-block">
          <div className="forgot_bg">
            <img src={ForgotBg} alt="" />
          </div>
        </Col>
      </Row>
    </div>
  );
}
