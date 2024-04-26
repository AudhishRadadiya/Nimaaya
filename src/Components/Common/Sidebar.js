import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Switch } from "antd";
import UserRollManagement from "../../Img/user-role-management.svg";
import HomeIcon from "../../Img/HomeIcon.svg";
import PatientRegistration from "../../Img/patient-registration.svg";
import PatientBasicHistory from "../../Img/PatientBasicHistory.svg";
import PatientExtendedHistory from "../../Img/PatientExtendedHistory.svg";
import MaleInfertilityInvestigation from "../../Img/MaleInfertilityInvestigation.svg";
import FemaleInfertilityInvestigation from "../../Img/FemaleInfertilityInvestigation.svg";
import BasicSemenAnalysis from "../../Img/BasicSemenAnalysis.svg";
import IVFFlowSheet from "../../Img/IVFFlowSheet.svg";
import EmbryologyDataSheet from "../../Img/EmbryologyDataSheet.svg";
import DischargeCard from "../../Img/DischargeCard.svg";
import PGSDischargeCard from "../../Img/PGSDischargeCard.svg";
import VitrificationDataSheet from "../../Img/VitrificationDataSheet.svg";
import EmbryoWarmingDataSheet from "../../Img/EmbryoWarmingDataSheet.svg";
import CycleOutCome from "../../Img/CycleOutCome.svg";
import LogoIcon from "../../Img/logo-icon.svg";
import LogoText from "../../Img/logo-text.svg";
import { Link, useNavigate } from "react-router-dom";
import SelectArrow from "../../Img/select-arrow.svg";
import DarkIcon from "../../Img/dark-btn.svg";
import LightIcon from "../../Img/dark-mode.svg";
import { ThemeContext } from "../../contexts/theme-context";
import UsFlag from "../../Img/us.svg";
import IndiaFlag from "../../Img/india.svg";
import GermanFlag from "../../Img/german.svg";
import FrenchFlag from "../../Img/french.svg";
import Frame from "../../Img/Frame.svg";
import MenuDot from '../../Img/listdot.svg';
import IuiReport from "../../Img/IuiReport.svg";
import { useSelector } from "react-redux";

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

const images = [
  HomeIcon,
  PatientRegistration,
  PatientBasicHistory,
  PatientExtendedHistory,
  MaleInfertilityInvestigation,
  FemaleInfertilityInvestigation,
  BasicSemenAnalysis,
  IVFFlowSheet,
  EmbryologyDataSheet,
  Frame,
  // IuiReport,
  PatientExtendedHistory,
  DischargeCard,
  VitrificationDataSheet,
  EmbryoWarmingDataSheet,
  CycleOutCome,
  PatientExtendedHistory,
  DischargeCard,
  PGSDischargeCard,
];

// client 
// const images = [
//   HomeIcon,
//   PatientRegistration,
//   PatientBasicHistory,
//   PatientExtendedHistory,
//   MaleInfertilityInvestigation,
//   FemaleInfertilityInvestigation,
//   BasicSemenAnalysis,
//   IVFFlowSheet,
//   EmbryologyDataSheet,
//   PatientExtendedHistory,
//   DischargeCard,
//   VitrificationDataSheet,
//   EmbryoWarmingDataSheet,
//   CycleOutCome,
//   PatientExtendedHistory,
//   DischargeCard,
//   PGSDischargeCard,
// ];
// client 

const sideMenuPath = [
  { key: "0", path: "/" },
  { key: "1", path: "/user-role-management" },
  {
    key: "2",
    path: "/patient-registration",
    isFilledVal: "patient_registration",
  },
  {
    key: "3",
    path: "/patient-basic-history",
    isFilledVal: "patient_basic_history",
  },
  {
    key: "4",
    path: "/patient-extended-history",
    isFilledVal: "patient_extended_history",
  },
  {
    key: "5",
    path: "/male-infertility-investigation",
    isFilledVal: "male_infertility_investigation",
  },
  {
    key: "6",
    path: "/female-infertility-investigation",
    isFilledVal: "female_infertility_investigation",
  },
  {
    key: "7",
    path: "/ivf-flow-sheet",
    isFilledVal: "ivf_flow_sheet",
  },
  { key: "8", path: "/embryology-data-sheet", isFilledVal: "embryology" },
  {
    key: "9", path: "/semen-analysis", isFilledVal: "semen_analysis", sub: [
      {
        key: '9.0', path: "/s-freezing", isFilledVal: "semen_freezing",
      },
      {
        key: '9.1', path: "/dna", isFilledVal: "dna",
      },
      {
        key: '9.2', path: "/iui-h-d", isFilledVal: "iui_h_d",
      },
      {
        key: '9.3', path: "/sst", isFilledVal: "sst",
      }
    ]
  },
  // { key: "10", path: "/iui-report", isFilledVal: "iui_report" },
  { key: "10", path: "/luteal-phase", isFilledVal: "luteal_phase" },
  { key: "11", path: "/discharge-card", isFilledVal: "discharge_card" },
  {
    key: "12",
    path: "/tesa-pesa-discharge-card",
    isFilledVal: "tesa_pesa_discharge_card",
  },
  { key: "13", path: "/pgs-discharge-card", isFilledVal: "pgs_discharge_card" },
  { key: "14", path: "/cycle-out-come", isFilledVal: "cycle_outcome" },
  { key: "15", path: "/add-document", isFilledVal: "add_document" },
];


// client 
// const sideMenuPath = [
//   { key: "0", path: "/" },
//   { key: "1", path: "/user-role-management" },
//   {
//     key: "2",
//     path: "/patient-registration",
//     isFilledVal: "patient_registration",
//   },
//   {
//     key: "3",
//     path: "/patient-basic-history",
//     isFilledVal: "patient_basic_history",
//   },
//   {
//     key: "4",
//     path: "/patient-extended-history",
//     isFilledVal: "patient_extended_history",
//   },
//   {
//     key: "5",
//     path: "/male-infertility-investigation",
//     isFilledVal: "male_infertility_investigation",
//   },
//   {
//     key: "6",
//     path: "/female-infertility-investigation",
//     isFilledVal: "female_infertility_investigation",
//   },
//   {
//     key: "7",
//     path: "/ivf-flow-sheet",
//     isFilledVal: "ivf_flow_sheet",
//   },
//   { key: "8", path: "/embryology-data-sheet", isFilledVal: "embryology" },
//   { key: "9", path: "/luteal-phase", isFilledVal: "luteal_phase" },
//   { key: "10", path: "/discharge-card", isFilledVal: "discharge_card" },
//   {
//     key: "11",
//     path: "/tesa-pesa-discharge-card",
//     isFilledVal: "tesa_pesa_discharge_card",
//   },
//   { key: "12", path: "/pgs-discharge-card", isFilledVal: "pgs_discharge_card" },
//   { key: "13", path: "/cycle-out-come", isFilledVal: "cycle_outcome" },
//   { key: "14", path: "/add-document", isFilledVal: "add_document" },
// ];
// client 

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const {
    moduleList,
    userType
  } = useSelector(({ role }) => role);
  const { SubMenu } = Menu;
  const { selectedPatient } = useSelector(({ common }) => common);
  let UserPreferences = "";
  UserPreferences = localStorage.getItem("UserPreferences");
  if (UserPreferences) {
    UserPreferences = JSON.parse(window.atob(UserPreferences));
  }
  const [selectedTab, setSelectedTab] = useState("");
  const [defaultOpenKeys, setDefaultOpenKeys] = useState(["9"]);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const sideMenuItems = useMemo(() => {
    let moduleListData =
      moduleList?.length > 0
        ? [
          {
            _id: "",
            module_name: "/",
            module_actual_name: "Home",
            create: true,
            edit: true,
            delete: true,
            view_only: true,
          },
          ...moduleList,
        ]
        : [];
    const viewTabs =
      moduleListData?.map((items, index) => {
        if (
          userType !== 1 &&
          userType !== 2 &&
          items.module_actual_name === "User Role Management"
        ) {
          return null;
        }
        // else {
        //   return UserPreferences?.other === false || items?.view_only
        //     ? {
        //       label: (
        //         <Link to={sideMenuPath[index].path}>
        //           <span>{items?.module_actual_name}</span>
        //         </Link>
        //       ),
        //       key: sideMenuPath[index].key,
        //       icon: <img src={images[index]} alt={index} />,
        //       className:
        //         Object.keys(selectedPatient).length > 0 &&
        //           selectedPatient[sideMenuPath[index]?.isFilledVal]
        //           ? "is_filled"
        //           : null,
        //     }
        //     : {
        //       label: (
        //         <span
        //           className={
        //             UserPreferences?.user_type !== 1 &&
        //             !items?.view_only &&
        //             "disabled-menu"
        //           }
        //         >
        //           {items?.module_actual_name}
        //         </span>
        //       ),
        //       key: sideMenuPath[index].key,
        //       icon: <img src={images[index]} alt="" />,
        //     };
        // }
        else {
          const tempMenu =
            UserPreferences?.other === false || items?.view_only
              ? {
                label: (
                  <Link to={sideMenuPath[index]?.path}>
                    <span>{items?.module_actual_name}</span>
                  </Link>
                ),
                key: sideMenuPath[index].key,
                icon: <img src={images[index]} alt={index} />,
                className:
                  Object.keys(selectedPatient).length > 0 &&
                    selectedPatient[sideMenuPath[index]?.isFilledVal]
                    ? "is_filled"
                    : null,
              }
              : {
                label: (
                  <span
                    className={
                      UserPreferences?.user_type !== 1 &&
                      !items?.view_only &&
                      "disabled-menu"
                    }
                  >
                    {items?.module_actual_name}
                  </span>
                ),
                key: sideMenuPath[index].key,
                icon: <img src={images[index]} alt="" />,
                disabled: true,
              };
          if (items.submenu && items?.submenu?.length > 0) {
            tempMenu.subMenuItems = items.submenu.map((sub, i) => (
              UserPreferences?.other === false || items?.view_only ?
                {
                  label: (
                    <Link to={sideMenuPath[index]?.sub[i]?.path}>
                      <span>{sub?.module_actual_name}</span>
                    </Link>
                  ),
                  key: sideMenuPath[index]?.sub[i]?.key,
                  icon: <img src={MenuDot} alt="MenuImage" />,
                  className:
                    Object.keys(selectedPatient)?.length > 0 &&
                      selectedPatient[sideMenuPath[index]?.sub[i]?.isFilledVal]
                      ? "is_filled"
                      : null,
                } :
                {
                  label: (
                    <span
                      className={
                        UserPreferences?.user_type !== 1 &&
                        !items?.view_only &&
                        "disabled-menu"
                      }
                    >{sub?.module_actual_name}</span>
                  ),
                  key: sideMenuPath[index]?.sub[i]?.key,
                  icon: <img src={MenuDot} alt="MenuImage" />,
                  // disabled: true,
                }
            ));
          }
          return tempMenu
        }
      }) || [];
    return viewTabs;
  }, [moduleList, UserPreferences, userType, selectedPatient]);

  const findKeyByPath = useCallback(
    (path) => {
      // Loop through the sideMenuPath array
      for (let i = 0; i < sideMenuPath.length; i++) {
        // Check if the current object's path matches the given path
        if (sideMenuPath[i].path === path) {
          // If the path is found, return its key
          return sideMenuPath[i].key;
        } else if (sideMenuPath[i].sub) {
          // If the current object has a 'sub' array, loop through it
          for (let j = 0; j < sideMenuPath[i].sub.length; j++) {
            // Check if the path matches any sub-path
            if (sideMenuPath[i].sub[j].path === path) {
              // If the sub-path is found, return its key
              return sideMenuPath[i].sub[j].key;
            }
          }
        }
      }
      // If the path is not found, return null or handle as per your requirement
      return "0";
    },
    [],
  )

  useEffect(() => {
    if (Object?.keys(selectedPatient)?.length > 0) {
      const emptyModule = sideMenuItems.find(
        (item, i) => item.className === null && i !== 0 && i !== 1
      );
      if (emptyModule) {
        setSelectedTab(emptyModule.key);
        navigate(emptyModule?.label?.props?.to);
      } else {
        navigate("/patient-registration");
        setSelectedTab("2");
      }
    } else {
      // const selectedModule = sideMenuPath.find(
      //   (item) => item.path === window.location.pathname
      // );
      // if (selectedModule) setSelectedTab(selectedModule.key);
      // else setSelectedTab("0");
      const tempSelectedTab = findKeyByPath(window.location.pathname);
      setSelectedTab(tempSelectedTab);
    }
  }, [selectedPatient]);

  const onClick = useCallback((e) => {
    setSelectedTab(e.key);
  }, []);


  const onOpenChange = useCallback(
    (e) => {
      setSelectedTab("9");
    },
    [],
  )
  const userDropDown = [
    {
      key: "Logout",
      label: (
        <Link to="/login" className="language_items">
          Logout
        </Link>
      ),
    },
  ];

  const { theme, setTheme } = useContext(ThemeContext);
  const handleThemeChange = () => {
    const isCurrentDark = theme === "dark";
    setTheme(isCurrentDark ? "light" : "dark");
    localStorage.setItem("default-theme", isCurrentDark ? "light" : "dark");
  };

  const renderMenu = menuItems => {
    return menuItems.map(item => {
      if (item?.subMenuItems && item?.subMenuItems?.length > 0) {
        return (
          <SubMenu
            disabled={item?.disabled}
            key={item?.key}
            title={item?.label}
            icon={item?.icon}
            // className="ant-menu-submenu-selected"
            className={item?.className
              ? "is_filled"
              : null}
          >
            {renderMenu(item?.subMenuItems)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={item?.key}
          icon={item?.icon}
          className={item?.className
            ? "is_filled"
            : null}
        >
          {item?.label}
        </Menu.Item >
      );
    });
  };
  return (
    <div className="sidebar_inner">
      <div className="sidebar_logo d-none d-lg-flex">
        <div className="Logo_icon">
          <img src={LogoIcon} alt="" />
        </div>
        <div className="Logo_text ps-2">
          <img src={LogoText} alt="" />
        </div>
      </div>
      <div className="user_dropdown_mobile d-block d-lg-none">
        <Dropdown
          menu={{
            items: userDropDown,
          }}
          placement="bottomLeft"
          className="user_dropdown"
        >
          <Button>
            <span className="user_img me-2">
              <div className="user_inner_text">
                {UserPreferences?.user_name
                  ? `${UserPreferences?.user_name?.charAt(0)?.toUpperCase()}`
                  : "UN"}
              </div>
            </span>
            {UserPreferences?.user_name}
            <img src={SelectArrow} className="ms-2 down_arrow" alt="" />
          </Button>
        </Dropdown>
      </div>
      <Button
        className="toggle_btn btn_transparent mobile_toggle_btn"
        onClick={toggleCollapsed}
      >
        <CloseOutlined />
      </Button>
      {/* <Menu
        selectedKeys={[selectedTab]}
        onClick={onClick}
        mode="inline"
        inlineCollapsed={collapsed}
        items={sideMenuItems}
      /> */}
      <Menu
        mode="inline"
        onClick={onClick}
        onOpenChange={onOpenChange}
        // openKeys="9"
        // defaultOpenKeys={defaultOpenKeys}
        // defaultOpenKeys={selectedTab.includes(".") ? [selectedTab[0]] : [""]}
        // mode={'vertical'}
        // defaultOpenKeys={["9"]}
        defaultOpenKeys={defaultOpenKeys}
        selectedKeys={[selectedTab]}
      >
        {renderMenu(sideMenuItems)}
      </Menu>
      <div className="mobile_bottom_menu d-block d-lg-none">
        <ul>
          <li>
            <Button
              type="button"
              className="btn_transparent w-100 d-flex justify-content-between align-items-center"
            >
              <span>
                {theme === "light" ? (
                  <img src={DarkIcon} className="dark_icon me-2" alt="" />
                ) : (
                  <img src={LightIcon} className="light_icon me-2" alt="" />
                )}
                Dark Mode
              </span>
              <Switch
                onChange={handleThemeChange}
                defaultChecked={theme === "light" ? false : true}
              />
            </Button>
          </li>
          <li className="m-0">
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
          </li>
        </ul>
      </div>
    </div >
  );
}
