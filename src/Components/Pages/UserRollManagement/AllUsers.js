import React, { useEffect, useState } from 'react';
import { Button, Pagination, Popconfirm, Select } from 'antd';
import { Col, Row } from 'react-bootstrap';
import TrashIcon from '../../../Img/trash.svg';
import EditIcon from '../../../Img/edit.svg';
import RestoreIcon from '../../../Img/restore.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserListData,
  setIsUserUpdated,
  setUserList,
  updateUser,
} from 'redux/reducers/Role/role.slice';
import { userTypeList } from 'utils/FieldValues';
import { useCallback } from 'react';

export default function AllUsers({ activeTab, isAuthority, userType, setUserId, setIsUserAdd, userList, isUserUpdated, locationData, isUserCreated, totolOfUser }) {
  const dispatch = useDispatch();
  let UserPreferences = localStorage.getItem('UserPreferences');
  const { selectedLocation } = useSelector(({ role }) => role);
  if (UserPreferences) {
    UserPreferences = JSON.parse(window.atob(UserPreferences));
  }
  const [startPage, setStartPage] = useState(1)
  const [locationList, setLocationList] = useState([]);
  const [selectLocation, setSelectLocation] = useState("");
  const handleUpdate = (e, item) => {
    setIsUserAdd(true)
    setUserId(item?._id);
  };
  const handleDeleteToggle = useCallback(
    async (item) => {
      if (item?._id && selectLocation !== "all") {
        dispatch(updateUser({ id: item?._id, user: { location_id: selectLocation, deleted: !item.deleted } }));
      } else {
        dispatch(updateUser({ id: item?._id, user: { deleted: !item.deleted } }));
      }
    },
    [dispatch, selectLocation],
  )
  useEffect(() => {
    if (isUserUpdated || isUserCreated) {
      dispatch(getUserListData({ start: startPage, limit: 10, locationId: selectLocation }));
      dispatch(setIsUserUpdated(false));
    }
  }, [isUserUpdated, isUserCreated, dispatch]);

  useEffect(() => {
    if (userType && userType !== 1) {
      if (selectedLocation) {
        dispatch(getUserListData({ start: startPage, limit: 10, locationId: selectedLocation }));
      }
    }
    return () => {
      dispatch(setUserList([]))
    }
  }, [dispatch, startPage, userType, selectedLocation]);

  useEffect(() => {
    if (userType === 1 && locationData?.length > 0 && activeTab === '1') {
      if (locationData.find((item) => item.location_id === selectedLocation)) {
        setSelectLocation(selectedLocation);
        dispatch(getUserListData({ start: startPage, limit: 10, locationId: selectedLocation }));
      }
      const locationDataList = locationData?.map(item => { return { "value": item.location_id, "label": item.location_name } }) || []
      setLocationList([{ "value": 'all', "label": 'All' }, ...locationDataList])
    }
  }, [dispatch, locationData, userType, startPage, selectedLocation, activeTab])
  const handlePageChange = useCallback(
    (value) => {
      setStartPage(value)
      dispatch(getUserListData({ start: value, limit: 10, locationId: selectLocation }));
    },
    [dispatch, selectLocation],
  )
  const enableToView = useCallback(
    (item) => {
      return ((UserPreferences?._id !== item?._id) && (item?.user_name !== 'Super admin'))
    },
    [UserPreferences],
  )
  const getUserRole = useCallback(
    (userType) => {
      if (userType === 1) {
        return 'Super Admin'
      } else if (userType === 2) {
        return 'Admin'
      } else if (userType === 3) {
        return "Senior Embryo"
      } else if (userType === 4) {
        return "Junior Embryo"
      } else if (userType === 5) {
        return "Senior Consultant"
      } else if (userType === 6) {
        return "Assistant Doctor"
      } else if (userType === 7) {
        return "CCE"
      } else if (userType === 8) {
        return "Stock Manager"
      }
    },
    [],
  )
  return (
    <>
      <div className="user_main_wrap">
        {userType === 1 &&
          <Row className='justify-content-end'>
            <Col md={3}>
              <div className="location_select d-flex align-items-center">
                <h5>Location : </h5>
                <div className='custom_select'>
                  <Select
                    showSearch
                    allowClear={true}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0)
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.label.toLowerCase().localeCompare(optionB.label.toLowerCase())
                    }
                    placeholder="Select Location"
                    options={locationList}
                    value={selectLocation}
                    name="selectLocation"
                    className='w-100'
                    onChange={(value) => {
                      dispatch(getUserListData({ start: startPage, limit: 10, locationId: value }));
                      setStartPage(1)
                      setSelectLocation(value);
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        }
        {userList?.map((item) => {
          return (
            <div className="user_box" key={item?._id}>
              <Row className="align-items-center">
                <Col xl={5} md={6} xs={11}>
                  <div className="d-flex align-items-center">
                    <div className="user_img">
                      {item?.profile_picture?.length > 0 ? (
                        <img src={item?.profile_picture} alt="" />
                      ) : (
                        <div className='user_name_letter'>
                          {item?.user_name
                            ? `${item.user_name?.charAt(0)?.toUpperCase()}`
                            : 'UN'}
                        </div>
                      )}
                    </div>
                    <div className="user_text">
                      <h3 className="fw_400 mb-1">
                        <span className="pe-2">
                          {item?.user_name}
                          {UserPreferences?._id === item?._id ? '   (You)' : ''}
                        </span>
                        <span className="bedge bedge_active">Active</span>
                      </h3>
                      <p className="m-0">{item?.user_email}</p>
                    </div>
                  </div>
                </Col>
                <Col md={2} className="badge_wrap d-none d-md-block">
                  {enableToView(item) && (
                    <span
                      className={item?.deleted ? 'bedge bedge_inactive' : 'bedge bedge_active'}
                    >
                      {item?.deleted ? 'In Active' : 'Active'}
                    </span>
                  )}
                </Col>
                <Col md={2} className="badge_wrap d-none d-md-block">
                  {enableToView(item) && item?.userLocationData?.map(locationDetail => {
                    return (
                      <p className='m-0'>
                        {locationDetail?.location_name} | {getUserRole(locationDetail.user_type)}
                      </p>
                    )
                  })}
                </Col>
                <Col xl={2} md={2}>
                  <ul className="d-flex align-items-center user_roll">
                    <li className="font_18 text_light d-none d-md-block">
                      {userTypeList[item?.user_type - 1]?.label}
                    </li>
                    {enableToView(item) && (item?.deleted ?
                      (userType === 1 || isAuthority?.delete) &&
                      <Popconfirm
                        title="Active User"
                        description="Are you sure to activ this user?"
                        onConfirm={(e) => {
                          // confirm(e, record);
                          handleDeleteToggle(item);
                        }}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button className='btn_transparent'
                        // onClick={() => handleDeleteToggle(item)}
                        >
                          <img src={RestoreIcon} alt='RestoreIcon' className='me-2' />
                        </Button>
                      </Popconfirm> :
                      <>
                        {(userType === 1 || isAuthority?.edit) && <li className="btn_delete btn_edit">
                          <Button
                            className="btn_transparent"
                            onClick={e => handleUpdate(e, item)}
                          >
                            <img src={EditIcon} alt="" />
                          </Button>
                        </li>}
                        {(userType === 1 || isAuthority?.delete) && <li className="btn_delete">
                          <Popconfirm
                            title="Deactivate User"
                            description="Are you sure to deactivate this user?"
                            onConfirm={(e) => {
                              // confirm(e, record);
                              handleDeleteToggle(item)
                            }}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              className="btn_transparent"
                            // onClick={e => handleDeleteToggle(item)}
                            >
                              <img src={TrashIcon} alt="" />
                            </Button>
                          </Popconfirm>
                        </li>}
                      </>
                    )}
                  </ul>
                </Col>
              </Row>
            </div>
          );
        })}
      </div>
      <Pagination current={startPage} total={totolOfUser} pageSize={10} onChange={handlePageChange} />
    </>
  );
}
