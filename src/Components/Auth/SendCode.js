import { useState, useEffect, useCallback } from "react";
import { Col, Row } from "react-bootstrap";
import LogoIcon from "../../Img/logo-icon.svg";
import LogoText from "../../Img/logo-text.svg";
import LeftArrow from "../../Img/left-arrow.svg";
import ResetBg from "../../Img/reset-bg.jpg";
import PassResetImg from "../../Img/password-reset-img.png";
import BackArrow from "../../Img/back-arrow.svg";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import PhoneWithCountry from "./PhoneWithCountry";
import { useDispatch } from "react-redux";
import { resetViaEmail } from "redux/reducers/auths.slice";
import { getCurrentYear } from "utils/CommonFunctions";

export default function SendCode() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isType = localStorage.getItem("Forgot");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumberWithoutCountryCode, setPhoneNumberWithoutCountryCode] =
    useState("");

  const handlePhoneChange = (phone, country) => {
    const phoneNumberWithoutCountryCode = phone?.replace(country?.dialCode, "");
    setPhoneNumberWithoutCountryCode(phoneNumberWithoutCountryCode);
    setPhoneNumber(phone);
    setCountryCode(country?.dialCode);
  };
  const onFinish = useCallback(
    async (values) => {
      await dispatch(resetViaEmail(values)).then((data) => {
        if (data?.payload) {
          navigate("/password-reset", { state: values });
          localStorage.setItem("emailorpno", JSON.stringify(values));
        }
      });
    },
    [dispatch, navigate]
  );
  const onFinishFailed = (errorInfo) => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
                <h1 className="mb-3">
                  {isType === "isEmail" ? "Email Address" : "Phone Number"}
                </h1>
                <p className="text-center mb-4">
                  Enter your{" "}
                  {isType === "isEmail" ? " email address" : "phone number"} to
                  receive code
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

              <div className="forgot_password_wrapper">
                <Form
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  scrollToFirstError
                  style={{ height: "auto", padding: 0 }}
                >
                  {isType === "isEmail" ? (
                    <Form.Item
                      label=""
                      name="user_email"
                      rules={[
                        {
                          required: true,
                          message: "Please input your email!",
                        },
                        {
                          type: "email",
                          message: "Please enter a valid email!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your email" />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      label=""
                      name="phone"
                      className="phone_number_select Select_style_one"
                    >
                      <PhoneWithCountry
                        handlePhoneChange={handlePhoneChange}
                        phoneNumber={phoneNumber}
                      />
                    </Form.Item>
                  )}

                  <Button htmlType="login" className="w-100 btn_primary mb-4">
                    Continue
                  </Button>
                </Form>
                <div className="back_to_login text-center">
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
            <img src={ResetBg} alt="" />
          </div>
        </Col>
      </Row>
    </div>
  );
}
