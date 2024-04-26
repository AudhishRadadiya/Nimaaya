import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Button, Spin } from "antd";
import { Col, Row } from "react-bootstrap";
import ToggleMenu from "../../Img/burger_menu.svg";
import DarkIcon from "../../Img/dark-btn.svg";
import LightIcon from "../../Img/light-btn.svg";
import NotificationIcon from "../../Img/notification.svg";
import UsFlag from "../../Img/us.svg";
import IndiaFlag from "../../Img/india.svg";
import GermanFlag from "../../Img/german.svg";
import FrenchFlag from "../../Img/french.svg";
import SelectArrow from "../../Img/select-arrow.svg";
import { Dropdown } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../contexts/theme-context";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "redux/reducers/auths.slice";
import jsonp from "fetch-jsonp";
import qs from "qs";
import { Select } from "antd";
import {
  clearData,
  getGlobalSearch,
  setGlobalSearchFileValue,
} from "redux/reducers/SearchPanel/globalSearch.slice";
import {
  setIvfIdListData,
  setSelectedPatient,
} from "redux/reducers/common.slice";
import _ from "lodash";
import {
  getLocationData,
  getPermissionLocationWise,
  setModuleList,
  setSelectedLocation,
} from "redux/reducers/Role/role.slice";
import { CloseOutlined } from "@ant-design/icons";
import { sendDataToSocket } from "socket/SocketComponent";

const countryWiseLanguage = [
  {
    key: "1",
    label: (
      <span className="language_items">
        <img src={UsFlag} alt="" /> English
      </span>
    ),
  },
  {
    key: "2",
    label: (
      <span className="language_items">
        <img src={IndiaFlag} alt="" /> Hindi
      </span>
    ),
  },
  {
    key: "3",
    label: (
      <span className="language_items">
        <img src={GermanFlag} alt="" /> German
      </span>
    ),
  },
  {
    key: "4",
    label: (
      <span className="language_items">
        <img src={FrenchFlag} alt="" /> French
      </span>
    ),
  },
];

let timeout;
let currentValue;
const fetch = (value, callback) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;
  const fake = () => {
    const str = qs.stringify({
      code: "utf-8",
      q: value,
    });
    jsonp(`https://suggest.taobao.com/sug?${str}`)
      .then((response) => response.json())
      .then((d) => {
        if (currentValue === value) {
          const { result } = d;
          const data = result.map((item) => ({
            value: item[0],
            text: item[0],
          }));
          callback(data);
        }
      });
  };
  if (value) {
    timeout = setTimeout(fake, 300);
  } else {
    callback([]);
  }
};

export default function Header({ collapsed, setCollapsed, props }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    locationData,
    isLocationLoading,
    selectedLocation,
    permissionLocationWiseLoading,
    moduleList,
  } = useSelector(({ role }) => role);
  let UserData;
  let UserPreferences = localStorage.getItem("UserPreferences");
  if (UserPreferences) {
    UserData = UserPreferences = JSON.parse(window.atob(UserPreferences));
  }
  const { globalSearchData, globalSearchLoading, globalSearchFileValue } =
    useSelector(({ globalSearch }) => globalSearch);
  const { patientLoading } = useSelector(
    ({ patientRegistration }) => patientRegistration
  );
  const { patientBasicLoading } = useSelector(
    ({ patientBasicHistory }) => patientBasicHistory
  );
  const [locationList, setLocationList] = useState([]);
  const [data, setData] = useState([]);
  const [selectLocation, setSelectLocation] = useState("");
  const [searchVal, setSearchVal] = useState(null);

  useEffect(() => {
    locationData.length === 0 && dispatch(getLocationData());
  }, [dispatch]);

  useEffect(() => {
    if (locationData?.length > 0) {
      const locationListData =
        locationData
          ?.filter((location) => {
            return UserPreferences?.other === false
              ? location
              : location?.deleted === false && location;
          })
          .map((location) => {
            return {
              value: location.location_id,
              label: location.location_name,
            };
          }) || [];
      if (selectedLocation) {
        if (locationListData.find((item) => item.value === selectedLocation)) {
          setSelectLocation(selectedLocation);
          moduleList.length === 0 &&
            dispatch(getPermissionLocationWise(selectedLocation));
        } else {
          navigate("/user-select-location");
        }
      } else if (selectedLocation == null) {
        navigate("/user-select-location");
      }
      setLocationList(locationListData);
    }
  }, [dispatch, navigate, locationData]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const { theme, setTheme } = useContext(ThemeContext);

  const handleThemeChange = () => {
    const isCurrentDark = theme === "dark";
    setTheme(isCurrentDark ? "light" : "dark");
    localStorage.setItem("default-theme", isCurrentDark ? "light" : "dark");
  };

  const userDropDown = [
    {
      key: "Logout",
      label: (
        <Link
          to="/login"
          className="language_items"
          onClick={() => {
            localStorage.removeItem("UserPreferences");
            dispatch(setSelectedLocation(""));
            localStorage.removeItem("userLocation");
            dispatch(logoutAction());
            dispatch(setModuleList([]));
          }}
        >
          Logout
        </Link>
      ),
    },
  ];
  const handleSearch = useCallback(
    (newValue, selectedLocation) => {
      if (newValue && selectedLocation) {
        dispatch(
          getGlobalSearch({
            patient_name: newValue,
            location_id: selectedLocation,
          })
        );
      }
    },
    [dispatch]
  );
  const globalSearchTextChange = React.useCallback(
    _.debounce(handleSearch, 800),
    []
  );
  const handleChange = (newValue) => {
    const patientDetail = data?.find((patient) => patient?._id === newValue);
    if (patientDetail) {
      dispatch(setSelectedPatient(patientDetail));
      if (patientDetail?.ivf_flow_data.length > 0) {
        const ivfListId = patientDetail?.ivf_flow_data?.map((item) => ({
          ...item,
          value: item._id,
          label: item.ivf_id,
        }));
        dispatch(setIvfIdListData(ivfListId));
      }
    }
    dispatch(
      setGlobalSearchFileValue({
        _id: patientDetail._id,
        patient_full_name: patientDetail.patient_full_name,
      })
    );
  };

  useEffect(() => {
    setData(globalSearchData);
  }, [globalSearchData]);
  useEffect(() => {
    if (Object.keys(globalSearchFileValue)?.length > 0) {
      setSearchVal(globalSearchFileValue.patient_full_name);
    } else {
      setSearchVal(null);
    }
  }, [globalSearchFileValue]);
  const handleClearSearch = () => {
    navigate("/patient-registration");
    dispatch(setSelectedPatient({}));
    dispatch(setIvfIdListData([]));
    dispatch(clearData());
  };
  const getModuleName = useMemo(() => {
    const matchModule = moduleList.find(
      (item) => item.module_name === location.pathname
    );
    let currentModule = matchModule?.module_actual_name || "";
    if (location.pathname === "/") {
      currentModule = "Dashboard";
    }
    return currentModule || "";
  }, [location.pathname, moduleList]);
  const handleLocationChange = (value) => {
    if (UserPreferences?.other) {
      dispatch(clearData());
      dispatch(setSelectedPatient({}));
    }

    localStorage.setItem("userLocation", window.btoa(JSON.stringify(value)));
    sendDataToSocket("JUR", {
      room_id: value,
    });
    dispatch(setSelectedLocation(value));
    dispatch(getPermissionLocationWise(value));
    setSelectLocation(value);
  };

  return (
    <header>
      {(globalSearchLoading ||
        isLocationLoading ||
        patientBasicLoading ||
        permissionLocationWiseLoading ||
        patientLoading) && (
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        )}
      <Row className="align-items-center">
        <Col xs={2} xl={5} lg={4}>
          <div className="hedaer_left">
            <ul>
              <li>
                <Button className="toggle_btn" onClick={toggleCollapsed}>
                  <img src={ToggleMenu} alt="" />
                </Button>
              </li>
              <li className="d-none d-lg-block">
                <div className="search_top">
                  <Select
                    showSearch
                    name="searchVal"
                    value={searchVal}
                    placeholder="Search anything here"
                    defaultActiveFirstOption={false}
                    suffixIcon={null}
                    filterOption={false}
                    onSearch={(e) =>
                      globalSearchTextChange(e, selectedLocation)
                    }
                    onChange={handleChange}
                    notFoundContent={null}
                    options={(data || []).map((d) => ({
                      value: d?._id,
                      label: d?.patient_full_name,
                    }))}
                  />
                  {searchVal && (
                    <Button
                      className="clearIcon btn_transparent"
                      onClick={handleClearSearch}
                    >
                      <CloseOutlined />
                    </Button>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </Col>
        <Col className="d-block d-lg-none" xs={8}>
          <div className="page_heading">
            <h1>{getModuleName}</h1>
          </div>
        </Col>
        <Col xs={2} xl={7} lg={8}>
          <div className="right_header">
            <ul>
              <li className="d-none d-lg-block">
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
              </li>
              {/* Notification Icon */}
              {/* <li>
                <Button className="btn_transparent btn_notification">
                  <img src={NotificationIcon} alt="" />
                  <span>8</span>
                </Button>
              </li> */}
              {/* Notification Icon */}
              <li className="d-none d-lg-block custom_select location_header">
                <Select
                  placeholder="Select Location"
                  options={locationList}
                  value={selectLocation}
                  onChange={handleLocationChange}
                />
              </li>
              {/* Language Change Dropdown */}
              {/* <li className="d-none d-lg-block">
                <Dropdown
                  menu={{
                    items: countryWiseLanguage,
                  }}
                  placement="bottomLeft"
                >
                  <Button className="language_dropdown">
                    <img src={UsFlag} className="me-2" alt="" /> English{" "}
                    <img src={SelectArrow} className="ms-2 down_arrow" alt="" />
                  </Button>
                </Dropdown>
              </li> */}
              {/* Language Change Dropdown */}
              <li className="d-none d-lg-block">
                <Dropdown
                  menu={{
                    items: userDropDown,
                  }}
                  placement="bottomLeft"
                  className="user_dropdown"
                  trigger={['click']}
                >
                  <Button>
                    <span className="user_img me-2">
                      <div className="user_inner_text">
                        {UserPreferences?.user_name
                          ? `${UserPreferences?.user_name
                            ?.charAt(0)
                            ?.toUpperCase()}`
                          : "UN"}
                      </div>
                    </span>
                    {UserPreferences?.user_name}
                    <img src={SelectArrow} className="ms-2 down_arrow" alt="" />
                  </Button>
                </Dropdown>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
    </header>
  );
}
