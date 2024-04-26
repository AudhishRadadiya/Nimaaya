import React, { useMemo } from 'react'
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Button, Spin, Tabs } from "antd";
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
const UserRoleManager = React.lazy(() => import("./UserRoleManager"));
const UserLocation = React.lazy(() => import("./UserLocation"));
const AllUsers = React.lazy(() => import("./AllUsers"));

export default function Index() {
  const { userList, isUserUpdated, isUserCreated, userLoading, totolOfUser, userDetail, moduleList, userType, locationData, isLocationUpdated } = useSelector(
    ({ role }) => role,
  );
  const location = useLocation()
  const isAuthority = useMemo(() => {
    return moduleList?.find((item) => item.module_name === location?.pathname)
  }, [moduleList, location])
  const [activeTab, setActiveTab] = useState("1");
  const [userId, setUserId] = useState(null);
  const [isUserAdd, setIsUserAdd] = useState(false);
  let items = [
    {
      key: "1",
      label: userList?.length > 0 ? `All users (${userList?.length})` :
        isUserAdd ?
          "All users"
          : 'All users'
      ,
      children: isUserAdd ?
        <UserRoleManager
          userType={userType}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userId={userId}
          setUserId={setUserId}
          setIsUserAdd={setIsUserAdd}
          isUserAdd={isUserAdd}
          userDetail={userDetail}
          isUserCreated={isUserCreated}
          moduleList={moduleList}
          isUserUpdated={isUserUpdated}
          isAuthority={isAuthority}
        />
        :
        <AllUsers
          isAuthority={isAuthority}
          activeTab={activeTab}
          userType={userType}
          locationData={locationData}
          setActiveTab={setActiveTab}
          setUserId={setUserId}
          setIsUserAdd={setIsUserAdd}
          userList={userList}
          isUserUpdated={isUserUpdated}
          isUserCreated={isUserCreated}
          totolOfUser={totolOfUser}
        />
    }
  ];
  if (userType === 1) {
    items.push({
      key: "2",
      label: 'Location',
      children: (
        <UserLocation userType={userType} isLocationUpdated={isLocationUpdated} locationData={locationData} />
      )
    })
  }
  const onChange = useCallback(
    (key) => {
      setUserId(null);
      setIsUserAdd(false)
      setActiveTab(key);
    },
    [],
  )
  return (
    <div className="page_main_content">
      {(userLoading) &&
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      }
      <div className="page_inner_content">
        <div className="page_header">
          <Row className="align-items-center">
            <Col xs={9}>
              <h3>Team members</h3>
              <p className="m-0">
                Invite or manage your organisation’s members.
              </p>
            </Col>
            <Col xs={3}>
              <div className="text-end plus_mobile_wrap">
                {(((activeTab === "1" && userId) || (activeTab === "1" && !isUserAdd)) && (userType === 1 || isAuthority?.create)) && (
                  <Button
                    className="btn_primary"
                    onClick={() => {
                      setUserId(null);
                      setIsUserAdd(true)
                    }}
                  >
                    <PlusOutlined className="m-0 me-md-2" />
                    <span className="d-none d-md-inline-block">Add Member</span>
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
        <div className="user_roll_content">
          <Tabs defaultActiveKey="1" activeKey={activeTab} onTabClick={onChange}>
            {items.map((item) => (
              <Tabs.TabPane tab={item.label} key={item.key}>
                {item.children}
              </Tabs.TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
