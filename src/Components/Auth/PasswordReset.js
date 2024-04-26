import React, { useEffect, useCallback, useState } from "react";
import { Col, Row } from "react-bootstrap";
import LogoIcon from "../../Img/logo-icon.svg";
import LogoText from "../../Img/logo-text.svg";
import LeftArrow from "../../Img/left-arrow.svg";
import ResetBg from "../../Img/reset-bg.jpg";
import PassResetImg from "../../Img/password-reset-img.png";
import BackArrow from "../../Img/back-arrow.svg";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  resetViaEmail,
  resetViaSMS,
  setIsVerifyOTP,
  verifyOTP,
} from "redux/reducers/auths.slice";
import OTPInput from "react-otp-input";
import { getCurrentYear } from "utils/CommonFunctions";

export default function PasswordReset() {
  // const formFields = [
  //   {
  //     name: "otp1",
  //     tabindex: 0,
  //     required: true,
  //     message: '',
  //     maxLength: 1
  //   },
  //   {
  //     name: "otp2",
  //     tabindex: 1,
  //     required: true,
  //     message: '',
  //     maxLength: 1
  //   }, {
  //     name: "otp3",
  //     tabindex: 2,
  //     required: true,
  //     message: '',
  //     maxLength: 1
  //   }, {
  //     name: "otp4",
  //     tabindex: 3,
  //     required: true,
  //     message: '',
  //     maxLength: 1
  //   }
  // ]
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isVerifyOTP } = useSelector(({ auth }) => auth);
  const type = JSON.parse(localStorage.getItem("emailorpno"));
  const isType = localStorage.getItem("Forgot");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const onFinish = (values) => {
    if (otp?.length != 4) {
      setOtpError(true);
    } else if (otp?.length === 4) {
      setOtpError(false);
      const payload = {
        user_email: type?.user_email,
        otp: otp,
      };
      dispatch(verifyOTP(payload));
    }
  };
  // const inputTagRef = useCallback((inputElement) => {

  //   if (inputElement) {
  //     inputElement.focus();
  //   }
  // }, []);

  const onFinishFailed = (errorInfo) => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResend = () => {
    isType === "isEmail"
      ? dispatch(resetViaEmail(type))
      : dispatch(resetViaSMS(type));
  };

  useEffect(() => {
    if (isVerifyOTP) {
      navigate("/reset-password");
      dispatch(setIsVerifyOTP(false));
    }
  }, [isVerifyOTP, navigate, dispatch]);

  return (
    <div className="login_wrapper">
      <Row className="g-0">
        <Col lg={6}>
          <div className="login_form_wrap">
            <div className="login_form_Inner">
              <div className="login_top_wrapper">
                <div className="logo  d-none d-lg-flex">
                  <img src={LogoIcon} className="logo_icon" alt="" />
                  <img src={LogoText} className="logo_text" alt="" />
                </div>
                <h1 className="mb-3">Password Reset</h1>
                <p className="text-center mb-4">
                  We sent a code to{" "}
                  <span className="text_dark">{type?.user_email}</span>
                </p>
                <img
                  src={PassResetImg}
                  className="top_img d-block d-lg-none"
                  alt=""
                />
                <Link
                  to="/forgot-password"
                  className="back_arrow d-block d-lg-none"
                >
                  <img src={BackArrow} alt="" className="me-2" />
                </Link>
              </div>
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{ height: "auto", padding: 0 }}
                scrollToFirstError
              >
                <div className="forgot_password_wrapper">
                  <div
                    className={
                      otpError ? "otp_wrapper red_active" : "otp_wrapper"
                    }
                  >
                    <OTPInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={4}
                      shouldAutoFocus
                      renderSeparator={<span>-</span>}
                      renderInput={(props) => <input {...props} />}
                    />
                    {/* <ul>
                      {formFields?.map((item, index) => {
                        return (
                          <li>
                            <Form.Item
                              name={item?.name}
                              rules={[
                                {
                                  required: item?.required,
                                  message: item?.message,
                                },
                              ]}
                            >
                              <Input onChange={(e) => setOtp([...otp, e.target.value])} ref={(otp.length === item?.tabindex || (otp.length !== 4 && item?.tabindex === 0)) && inputTagRef} maxLength={item.maxLength} />
                            </Form.Item>
                          </li>
                        )
                      })}
                    </ul> */}
                  </div>

                  <Button htmlType="login" className="w-100 btn_primary mb-4">
                    Continue
                  </Button>

                  <p className="text-center text_dark mb-5">
                    Don’t receive the email?
                    <Link
                      to="/password-reset"
                      className="ps-1"
                      onClick={handleResend}
                    >
                      Click to resend
                    </Link>
                  </p>
                  <div className="back_to_login text-center">
                    <Link to="/login" className="text_secondary d-inline-flex">
                      <img src={LeftArrow} alt="" className="me-2" /> Back to
                      login
                    </Link>
                  </div>
                </div>
              </Form>
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
            <img src={ResetBg} alt="" />
          </div>
        </Col>
      </Row>
    </div>
  );
}
