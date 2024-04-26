import { useContext, useEffect, useState, useCallback } from "react";
import { Col, Row } from "react-bootstrap";
import LogoIcon from "../../Img/logo-icon.svg";
import LogoText from "../../Img/logo-text.svg";
import LoginBg from "../../Img/login-main.png";
import DarkIcon from "../../Img/dark-btn.svg";
import LightIcon from "../../Img/light-btn.svg";
import { ThemeContext } from "../../contexts/theme-context";
import { Button, Checkbox, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "redux/reducers/auths.slice";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import {
  getLocationData,
  setLocationData,
  setSelectedLocation,
} from "redux/reducers/Role/role.slice";
import { sendDataToSocket } from "socket/SocketComponent.js";
import { getCurrentYear } from "utils/CommonFunctions";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { theme, setTheme } = useContext(ThemeContext);
  const handleThemeChange = () => {
    const isCurrentDark = theme === "dark";
    setTheme(isCurrentDark ? "light" : "dark");
    localStorage.setItem("default-theme", isCurrentDark ? "light" : "dark");
  };
  const { isUserLogin } = useSelector(({ auth }) => auth);
  const { selectedLocation } = useSelector(({ role }) => role);
  const [rememberMe, setRememberMe] = useState(
    JSON.parse(localStorage.getItem("RememberMe")) || false
  );

  const onFinish = (values) => {
    if (rememberMe) {
      localStorage.setItem("RememberMe", JSON.stringify(true));
      const encryptedUserEmail = CryptoJS.AES.encrypt(
        values.user_email,
        "secret_key"
      ).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(
        values.password,
        "secret_key"
      ).toString();

      Cookies.set("rememberedUserEmail", encryptedUserEmail);
      Cookies.set("rememberedPassword", encryptedPassword);
    } else {
      localStorage.setItem("RememberMe", JSON.stringify(false));
      Cookies.remove("rememberedUserEmail");
      Cookies.remove("rememberedPassword");
    }
    dispatch(loginAction(values));
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
  const isLoginValidate = useCallback(
    async (isUserLogin) => {
      let loggedUserData = "";
      loggedUserData = localStorage.getItem("UserPreferences");
      if (loggedUserData) {
        loggedUserData = JSON.parse(window.atob(loggedUserData));
      }
      if (isUserLogin && loggedUserData) {
        sendDataToSocket("JU", {
          user_id: loggedUserData?._id,
        });
        const { payload } = await dispatch(getLocationData());
        let userLocation = [];
        if (payload?.length > 0) {
          const locationListData =
            payload
              ?.filter((location) => {
                return loggedUserData?.other === false
                  ? location
                  : location?.deleted === false && location;
              })
              .map((location) => {
                return {
                  value: location.location_id,
                  label: location.location_name,
                };
              }) || [];
          userLocation = locationListData;
        }
        if (userLocation?.length === 1 || selectedLocation) {
          sendDataToSocket("JUR", {
            room_id: userLocation[0].value,
          });
          dispatch(setSelectedLocation(userLocation[0].value));
          localStorage.setItem(
            "userLocation",
            window.btoa(JSON.stringify(userLocation[0].value))
          );
          dispatch(setLocationData([]));
          navigate("/");
        } else {
          navigate("/user-select-location", { state: userLocation });
        }
      }
    },
    [selectedLocation, navigate, dispatch]
  );

  useEffect(() => {
    isLoginValidate(isUserLogin);
  }, [isUserLogin, isLoginValidate]);

  useEffect(() => {
    const rememberedUserEmail = Cookies.get("rememberedUserEmail");
    const rememberedPassword = Cookies.get("rememberedPassword");

    if (rememberedUserEmail && rememberedPassword) {
      const decryptedUserEmail = CryptoJS.AES.decrypt(
        rememberedUserEmail,
        "secret_key"
      ).toString(CryptoJS.enc.Utf8);
      const decryptedPassword = CryptoJS.AES.decrypt(
        rememberedPassword,
        "secret_key"
      ).toString(CryptoJS.enc.Utf8);

      form.setFieldsValue({
        user_email: decryptedUserEmail,
        password: decryptedPassword,
      });
    }
  }, []);

  return (
    <div className="login_wrapper">
      <Row className="g-0">
        <Col lg={6}>
          <div className="login_form_wrap">
            <div className="login_form_Inner">
              <div className="login_top_wrapper">
                <div className="logo">
                  <img src={LogoIcon} className="logo_icon" alt="" />
                  <img src={LogoText} className="logo_text" alt="" />
                </div>
                <h1>👋🏻 Hello! Welcome Back</h1>
              </div>
              <div className="login_form_box">
                <Form
                  form={form}
                  name="basic"
                  initialValues={{ remember: false }}
                  layout="vertical"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  scrollToFirstError
                  autoComplete="off"
                >
                  <Form.Item
                    label="Email"
                    name="user_email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your email!",
                      },
                      {
                        type: "email",
                        message: "Please enter a valid email!",
                        transform: (value) => value.trim(),
                      },
                    ]}
                  >
                    <Input placeholder="Enter your email"
                      autoComplete="username"
                    />
                  </Form.Item>

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
                    <Input.Password
                      autoComplete="current-password"
                      placeholder="Enter a password" />
                  </Form.Item>

                  <Row className="align-items-center mb-5">
                    <Col>
                      <Form.Item name="remember" className="m-0">
                        <Checkbox
                          name="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => {
                            setRememberMe(!rememberMe);
                          }}
                        >
                          Remember me
                        </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <div className="text-end">
                        <Link to="/forgot-password" className="text_light">
                          Forgot Password?
                        </Link>
                      </div>
                    </Col>
                  </Row>

                  <Form.Item>
                    <Button htmlType="login" className="w-100 btn_primary">
                      Login
                    </Button>
                  </Form.Item>

                  {/* <p className="text-center text_dark">
                    Don’t have an account?
                    <Link to="/signup" className="ps-1">
                      Create an Account
                    </Link>
                  </p> */}
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
        <Col lg={6}>
          <div className="login_img d-none d-lg-block">
            <img src={LoginBg} alt="" />
          </div>
        </Col>
      </Row>
      <div className="login_display_btn">
        <Button
          type="button"
          className="btn_transparent"
          onClick={handleThemeChange}
        >
          {theme === "light" ? (
            <img src={DarkIcon} className="dark_icon" alt="" />
          ) : (
            <img src={LightIcon} className="light_icon" alt="" />
          )}
        </Button>
      </div>
    </div>
  );
}
