import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import LogoIcon from "../../Img/logo-icon.svg";
import LogoText from "../../Img/logo-text.svg";
import SetPasswordBg from "../../Img/set-password-bg.jpg";
import SetPassImg from "../../Img/set-pass-img.png";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import BackArrow from "../../Img/back-arrow.svg";
import LeftArrow from "../../Img/left-arrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, setIsResetPassword } from "redux/reducers/auths.slice";
import { getCurrentYear } from "utils/CommonFunctions";

export default function SetPassword() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isResetPassword } = useSelector(({ auth }) => auth);
  const type = JSON.parse(localStorage.getItem("emailorpno"));

  const onFinish = (values) => {
    const payload = { ...values, ...type };
    dispatch(resetPassword(payload));
  };
  const onFinishFailed = (errorInfo) => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const validatePassword = (rule, value) => {
    if (!value) return Promise.reject("Please input your password!");
    if (value.length < 8)
      return Promise.reject("Password must be at least 8 characters long");
    if (!/\d/.test(value))
      return Promise.reject("Password must contain at least one digit");
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(value))
      return Promise.reject(
        "Password must contain at least one special character"
      );
    return Promise.resolve();
  };

  const validateConfirmPassword = (_, value) => {
    const { password } = form.getFieldValue();

    if (value && value !== password) {
      return Promise.reject(new Error("Passwords do not match"));
    } else {
      return Promise.resolve();
    }
  };

  useEffect(() => {
    if (isResetPassword) {
      navigate("/login");
      dispatch(setIsResetPassword(false));
    }
  }, [isResetPassword, dispatch, navigate]);

  return (
    <div className="login_wrapper set_password_wrap">
      <Row className="g-0">
        <Col lg={6}>
          <div className="login_form_wrap">
            <div className="login_form_Inner">
              <div className="login_top_wrapper">
                <div className="logo d-none d-lg-flex">
                  <img src={LogoIcon} className="logo_icon" alt="" />
                  <img src={LogoText} className="logo_text" alt="" />
                </div>
                <h1 className="mb-3">Set New Password</h1>
                <p className="text-center mb-5">
                  Must be at least 8 characters.
                </p>
                <img
                  src={SetPassImg}
                  className="top_img d-block d-lg-none"
                  alt=""
                />
                <Link
                  to="/password-reset"
                  className="back_arrow d-block d-lg-none"
                >
                  <img src={BackArrow} alt="" className="me-2" />
                </Link>
              </div>
              <div className="set_password_wrapper">
                <Form
                  form={form}
                  name="basic"
                  initialValues={{
                    remember: true,
                  }}
                  layout="vertical"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  scrollToFirstError
                  autoComplete="off"
                >
                  <Form.Item
                    label="Password"
                    name="password"
                    className="mb-2"
                    rules={[
                      {
                        validator: validatePassword,
                      },
                    ]}
                  >
                    <Input.Password placeholder="Enter a password" />
                  </Form.Item>
                  <Form.Item
                    label="Confirm Password"
                    name="confirm_password"
                    className="mb-5"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Please input your confirm password!",
                        key: "confirmPasswordRequired",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          return validateConfirmPassword(_, value);
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Confirm Password" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      htmlType="ResetPassword"
                      className="w-100 btn_primary"
                    >
                      Reset Password
                    </Button>
                  </Form.Item>

                  <div className="back_to_login text-center">
                    <Link to="/login" className="text_secondary d-inline-flex">
                      <img src={LeftArrow} alt="" className="me-2" /> Back to
                      login
                    </Link>
                  </div>
                </Form>
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
            <img src={SetPasswordBg} alt="" />
          </div>
        </Col>
      </Row>
    </div>
  );
}
