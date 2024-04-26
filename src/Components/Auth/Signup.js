import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import LogoIcon from "../../Img/logo-icon.svg";
import LogoText from "../../Img/logo-text.svg";
import LoginBg from "../../Img/login-main.png";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import PhoneWithCountry from "./PhoneWithCountry";
import { useDispatch, useSelector } from "react-redux";
import { setIsSignup, signupAction } from "redux/reducers/auths.slice";
import { getCurrentYear } from "utils/CommonFunctions";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { isUserSignup } = useSelector(({ auth }) => auth);

  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberWithoutCountryCode, setPhoneNumberWithoutCountryCode] =
    useState("");

  const onFinish = (values) => {
    const payload = {
      ...values,
      country_code: countryCode,
      user_mobile_no: phoneNumberWithoutCountryCode,
    };
    dispatch(signupAction(payload));
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

  const handlePhoneChange = (phone, country) => {
    const phoneNumberWithoutCountryCode = phone?.replace(country?.dialCode, "");
    setPhoneNumberWithoutCountryCode(phoneNumberWithoutCountryCode);
    setPhoneNumber(phone);
    setCountryCode(country?.dialCode);
  };

  useEffect(() => {
    if (isUserSignup) {
      navigate("/login");
      dispatch(setIsSignup(false));
    }
  }, [isUserSignup, navigate, dispatch]);

  return (
    <div className="login_wrapper">
      <Row className="g-0">
        <Col md={6}>
          <div className="login_form_wrap">
            <div className="login_form_Inner">
              <div className="login_top_wrapper">
                <div className="logo">
                  <img src={LogoIcon} className="logo_icon" alt="" />
                  <img src={LogoText} className="logo_text" alt="" />
                </div>
                <h1>👩🏻‍🍼️ Get Started with Nimaaya</h1>
              </div>
              <div className="login_form_box">
                <Form
                  name="basic"
                  form={form}
                  initialValues={{
                    remember: true,
                    accountType: "1",
                  }}
                  layout="vertical"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  scrollToFirstError
                  autoComplete="off"
                >
                  <Form.Item
                    label="Full Name"
                    name="user_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your full name",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your full name" />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="user_email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your email",
                      },
                      {
                        type: "email",
                        message: "Please enter a valid email!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your email" />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    className="phone_number_select Select_style_one"
                  >
                    <PhoneWithCountry
                      handlePhoneChange={handlePhoneChange}
                      phoneNumber={phoneNumber}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
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
                    <Input.Password placeholder="Enter a Confirm password" />
                  </Form.Item>

                  <Form.Item
                    label="Medial License No."
                    name="medical_license_no"
                    rules={[
                      {
                        required: false,
                        message: "Please enter your medical license no",
                      },
                    ]}
                  >
                    <Input placeholder="ABCD 0000 0000" />
                  </Form.Item>

                  <Form.Item>
                    <Button htmlType="signup" className="w-100 btn_primary">
                      Signup
                    </Button>
                  </Form.Item>

                  <p className="text-center text_dark">
                    Already have an account?
                    <Link to="/login" className="ps-1">
                      Login
                    </Link>
                  </p>
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
        <Col md={6}>
          <div className="login_img d-none d-lg-block">
            <img src={LoginBg} alt="" />
          </div>
        </Col>
      </Row>
    </div>
  );
}
