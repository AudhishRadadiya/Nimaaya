import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import LogoIcon from "../../Img/logo-icon.svg";
import LogoText from "../../Img/logo-text.svg";
import SetPassImg from "../../Img/set-pass-img.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BackArrow from "../../Img/back-arrow.svg";
import { Button, Form, Select, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import SetLocationBg from "../../Img/set-location-bg.jpg";
import {
  getLocationData,
  setModuleList,
  setSelectedLocation,
} from "redux/reducers/Role/role.slice";
import { useState, useCallback } from "react";
import { logoutAction } from "redux/reducers/auths.slice";
import { sendDataToSocket } from "socket/SocketComponent";
import { getCurrentYear } from "utils/CommonFunctions";

export default function UserSelectLocation() {
  const { locationData, isLocationLoading } = useSelector(({ role }) => role);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form] = Form.useForm();
  const [locationList, setLocationList] = useState();
  const [selectLocation, setSelectLocation] = useState("");
  let UserData;
  let UserPreferences = localStorage.getItem("UserPreferences");
  if (UserPreferences) {
    UserData = UserPreferences = JSON.parse(window.atob(UserPreferences));
  }
  const dispatch = useDispatch();
  useEffect(() => {
    locationData.length === 0 && dispatch(getLocationData());
  }, [dispatch]);

  useEffect(() => {
    if (state) {
      setLocationList(state);
    } else if (locationData?.length > 0) {
      const locationListData =
        locationData
          ?.filter((location) => {
            return UserData?.other === false
              ? location
              : location?.deleted === false && location;
          })
          .map((location) => {
            return {
              value: location.location_id,
              label: location.location_name,
            };
          }) || [];
      setLocationList(locationListData);
    }
  }, [locationData]);
  const onFinish = useCallback(
    (values) => {
      if (values?.location) {
        sendDataToSocket("JUR", {
          room_id: values?.location,
        });
        dispatch(setSelectedLocation(values.location));
        localStorage.setItem(
          "userLocation",
          window.btoa(JSON.stringify(values.location))
        );
        navigate("/");
      }
    },
    [dispatch]
  );
  const onFinishFailed = useCallback((errorInfo) => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="login_wrapper set_password_wrap user_location_wrapper">
      {isLocationLoading && (
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      )}
      <Row className="g-0">
        <Col lg={6}>
          <div className="login_form_wrap">
            <div className="login_form_Inner">
              <div className="login_top_wrapper">
                <div className="logo d-none d-lg-flex">
                  <img src={LogoIcon} className="logo_icon" alt="" />
                  <img src={LogoText} className="logo_text" alt="" />
                </div>
                <h1 className="mb-3">Select Location</h1>
                <p className="text-center mb-5 pick_location_wrap">Please pick your location.</p>
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
                {locationList?.length > 0 ? (
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
                      label="Location"
                      className="custom_select"
                      name="location"
                      rules={[
                        {
                          required: true,
                          message: "",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select Location"
                        options={locationList}
                        value={selectLocation}
                        onChange={(value) => {
                          setSelectLocation(value);
                        }}
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        htmlType="ResetPassword"
                        className="w-100 btn_primary"
                      >
                        Select Location
                      </Button>
                    </Form.Item>
                  </Form>
                ) : (
                  <>
                    <h3 className="text-center">Location Not Found</h3>
                    <h3 className="text-center mb-5">Please Contact Admin</h3>
                    <Button
                      htmlType="login"
                      className="w-100 btn_primary mb-4"
                      onClick={() => {
                        localStorage.clear();
                        dispatch(setSelectedLocation(""));
                        dispatch(logoutAction());
                        dispatch(setModuleList([]))
                        navigate("/login");
                      }}
                    >
                      Back to login
                    </Button>
                  </>
                )}
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
            <img src={SetLocationBg} alt="" />
          </div>
        </Col>
      </Row>
    </div>
  );
}
