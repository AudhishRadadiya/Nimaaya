import React, { useState, useEffect, useCallback } from "react";
import { Button, Input, Select } from "antd";
import Header from "Components/Common/Header";
import Sidebar from "Components/Common/Sidebar";
import { clearToken } from "Helper/AuthTokenHelper";
import { useDispatch } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { setIsLogin } from "redux/reducers/auths.slice";
import { useSelector } from "react-redux";
import {
  clearData,
  getGlobalSearch,
  setGlobalSearchFileValue,
} from "redux/reducers/SearchPanel/globalSearch.slice";
import { setSelectedPatient } from "redux/reducers/common.slice";
import _ from "lodash";
import { CloseOutlined } from "@ant-design/icons";
import { RoutAllowed } from "./appRoute";
export default function PrivateRouter({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { moduleList, userType } = useSelector(({ role }) => role);
  const [collapsed, setCollapsed] = useState(false);
  const [searchVal, setSearchVal] = useState(null);
  const [data, setData] = useState([]);

  let UserPreferences = localStorage.getItem("UserPreferences");
  if (UserPreferences) {
    UserPreferences = JSON.parse(window.atob(UserPreferences));
  }
  const token = UserPreferences?.token;
  const { globalSearchFileValue, globalSearchData } = useSelector(
    ({ globalSearch }) => globalSearch
  );
  const { selectedLocation } = useSelector(({ role }) => role);

  useEffect(() => {
    if (Object.keys(globalSearchFileValue)?.length > 0) {
      setSearchVal(globalSearchFileValue.patient_full_name);
    } else {
      setSearchVal(null);
    }
  }, [globalSearchFileValue]);
  useEffect(() => {
    if (globalSearchData?.length > 0) {
      setData(globalSearchData);
    } else {
      setData(globalSearchData);
    }
  }, [globalSearchData]);
  useEffect(() => {
    if (!token) {
      clearToken();
      dispatch(setIsLogin(false));
    }
  }, [dispatch, token]);
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
  const globalSearchTextChange = useCallback(_.debounce(handleSearch, 800), []);
  const handleChange = (newValue) => {
    const patientDetail = data?.find((patient) => patient?._id === newValue);
    patientDetail && dispatch(setSelectedPatient(patientDetail));
    dispatch(
      setGlobalSearchFileValue({
        _id: patientDetail._id,
        patient_full_name: patientDetail.patient_full_name,
      })
    );
  };
  const handleClearSearch = () => {
    dispatch(setSelectedPatient({}));
    dispatch(clearData());
  };
  const getModule = useCallback(
    (moduleName) => {
      let module = moduleList?.find(mod => mod.module_name === moduleName);

      if (!module) {
        moduleList.forEach(mod => {
          if (mod.submenu) {
            const subModule = mod.submenu.find(sub => sub.module_name === moduleName);
            if (subModule) {
              module = { ...subModule };
            }
          }
        });
      }
      return module ? { ...module } : null;
    },
    [moduleList],
  )
  const isAuthoriryToView = useCallback(
    (pathName) => {
      let isViewAuthority = true;
      if (userType === 1 || pathName === "/") {
        return true;
      } else {
        // const isView = moduleList?.find(
        //   (item) => item.module_name === pathName
        // );
        const isView = getModule(pathName);
        if (isView?.view_only || RoutAllowed?.includes(pathName)) {
          isViewAuthority = true;
        } else {
          isViewAuthority = false;
        }
      }
      return isViewAuthority;
    },
    [moduleList, userType]
  );
  if (!token) {
    return <Navigate to="/login" replace={true} />;
  }
  return token && location.pathname === "/user-select-location" ? (
    children
  ) : (
    <div
      className={collapsed ? "main_wrapper sidebar_collapse" : "main_wrapper"}
    >
      <div className="inner_wrapper">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="content_wrapper">
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <div className="search_bar_mobile d-block d-lg-none">
            <div className="search_top">
              <Select
                showSearch
                name="searchVal"
                value={searchVal}
                placeholder="Search anything here"
                defaultActiveFirstOption={false}
                suffixIcon={null}
                filterOption={false}
                onSearch={(e) => globalSearchTextChange(e, selectedLocation)}
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
          </div>
          {(userType === 1 || moduleList?.length > 0) &&
            (isAuthoriryToView(location.pathname) ? children : navigate("/"))}
        </div>
      </div>
    </div>
  );
}
