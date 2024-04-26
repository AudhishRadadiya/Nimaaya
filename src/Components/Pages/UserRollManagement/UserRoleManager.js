import { useCallback, useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Select } from "antd";
import { Col, Row } from "react-bootstrap";
import PhoneWithCountry from "Components/Auth/PhoneWithCountry";
import { useDispatch, useSelector } from "react-redux";
import {
  createUser,
  setIsUserCreated,
  setUserDetail,
  updateUser,
  viewUser
} from "redux/reducers/Role/role.slice";
import {
  seniorEmbryoAuthority,
  juniorEmbryoAuthority,
  seniorConsultantAuthority,
  assistantDoctorAuthority,
  cceAuthority,
  adminAuthority,
} from "routes/routesConfig";
import _ from "lodash";

export default function UserRoleManager({
  userType,
  isAuthority,
  userId,
  setUserId,
  isUserAdd,
  setIsUserAdd,
  userDetail,
  moduleList,
  isUserCreated,
  isUserUpdated,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { selectedLocation } = useSelector(({ role }) => role);
  const [id, setId] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedUserType, setSelectedUserType] = useState('')
  const [phoneNumberWithoutCountryCode, setPhoneNumberWithoutCountryCode] =
    useState("");
  const [roleManager, setRoleManager] = useState({
    user_name: "",
    user_email: "",
    user_mobile_no: "",
    country_code: "",
    user_type: ""
  });
  const [selectAll, setSelectAll] = useState("");
  const [permissionDetails, setPermissionDetails] = useState([])
  const rolePermissions = useCallback(
    () => {
      const list = _.map(moduleList, (x) =>
        _.extend({
          module_id: x?._id,
          module_actual_name: x?.module_actual_name,
          module_name: x?.module_name,
          create: false,
          edit: false,
          delete: false,
          view_only: false
        })
      ) || [];
      setPermissionDetails(list);
    },
    [moduleList],
  )

  const handlePhoneChange = useCallback(
    (phone, country) => {
      const phoneNumberWithoutCountryCode = phone?.replace(country?.dialCode, "");
      setPhoneNumberWithoutCountryCode(phoneNumberWithoutCountryCode);
      setPhoneNumber(phone);
      setCountryCode(country?.dialCode);
    }, [])

  const handleSave = useCallback(
    () => {
      const memberDetails = {
        ...roleManager,
        user_mobile_no: phoneNumberWithoutCountryCode,
        location_id: selectedLocation,
        country_code: countryCode
      };
      const filteredPermissionDetails =
        permissionDetails?.map((obj) => {
          const newObj = { ...obj };
          delete newObj["module_actual_name"];
          return newObj;
        }) || [];
      const payload = { ...memberDetails, permission: filteredPermissionDetails };
      dispatch(createUser(payload));
    }, [dispatch, countryCode, permissionDetails, phoneNumberWithoutCountryCode, roleManager])

  const handleChecked = useCallback(
    (e, index) => {
      const { name, checked } = e.target;
      const isChecked = permissionDetails?.map((item) => {
        if (item?.module_id === permissionDetails[index]?.module_id) {
          return { ...item, [name]: checked };
        }
        return item;
      });
      setPermissionDetails(isChecked);
    }, [permissionDetails])

  const handleSelectAll = useCallback(
    (e) => {
      const { checked } = e.target;
      let moduleListArray = [];
      permissionDetails.map((i) => {
        moduleListArray.push({
          module_id: i?.module_id,
          module_name: i?.module_name,
          module_actual_name: i?.module_actual_name,
          create: checked,
          edit: checked,
          delete: checked,
          view_only: checked
        });
        setPermissionDetails(moduleListArray);
        return moduleListArray;
      });
      setSelectAll(checked);
    }, [permissionDetails])

  const handleUpdate = useCallback(
    () => {
      const memberDetails = {
        ...roleManager,
        user_mobile_no: phoneNumberWithoutCountryCode,
        country_code: countryCode
      };
      const filteredPermissionDetails =
        permissionDetails?.map((obj) => {
          const newObj = { ...obj };
          delete newObj["module_actual_name"];
          return newObj;
        }) || [];

      const payload = {
        ...memberDetails,
        location_id: selectedLocation,
        permission: filteredPermissionDetails,
        verified: true
      };
      dispatch(updateUser({ id: id, user: payload }));
    }, [dispatch, countryCode, permissionDetails, phoneNumberWithoutCountryCode, selectedLocation, roleManager, id])

  const handleClear = useCallback(
    () => {
      setRoleManager({
        user_name: "",
        user_email: "",
        user_mobile_no: "",
        country_code: "",
        user_type: ""
      });
      setCountryCode("91");
      setPhoneNumber("91");
      setUserId(null);
      setPhoneNumberWithoutCountryCode("");
      form?.resetFields();
      rolePermissions();
    }, [form, rolePermissions, setUserId])

  const handleCancel = useCallback(
    () => {
      setIsUserAdd(false)
      handleClear();
    }, [handleClear, setIsUserAdd])

  useEffect(() => {
    if (isUserCreated || isUserUpdated) {
      setIsUserAdd(false)
      handleClear();
      dispatch(setIsUserCreated(false));
    }
  }, [dispatch, isUserCreated, isUserUpdated]);

  useEffect(() => {
    if (userId) {
      dispatch(viewUser({ id: userId, userLocation: selectedLocation }));
    } else {
      handleClear();
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (Object.entries(userDetail)?.length > 0 && userId) {
      const setPhoneNumberWithCode = `+${userDetail?.country_code} ${userDetail?.user_mobile_no}`;
      form.setFieldsValue({
        user_name: userDetail?.user_name,
        user_email: userDetail?.user_email,
        user_mobile_no: userDetail?.user_mobile_no,
        country_code: userDetail?.country_code,
        user_type: userDetail?.user_type
      });
      setRoleManager({
        user_name: userDetail?.user_name,
        user_email: userDetail?.user_email,
        user_mobile_no: userDetail?.user_mobile_no,
        country_code: userDetail?.country_code,
        user_type: userDetail?.user_type
      });
      setSelectedUserType(userDetail?.user_type)
      setId(userDetail?._id);
      setPhoneNumber(setPhoneNumberWithCode);
      setCountryCode(userDetail?.country_code);
      setPhoneNumberWithoutCountryCode(userDetail?.user_mobile_no);
      const permissionResult = permissionDetails.map((item) => {
        const newPermission = userDetail?.permission.find(
          (detail) => detail._id === item.module_id
        );
        return {
          ...item,
          ...newPermission
        };
      });
      setPermissionDetails(
        userDetail?.permission?.length === 0
          ? permissionDetails
          : permissionResult
      );
    }
  }, [userDetail]);

  const changeUserAuthority = useCallback(
    (userType, authorityArry) => {
      let permissionData = [...permissionDetails] || []
      let result = _.map(permissionData, (permission) => {
        let permissionDetail = _.find(authorityArry, function (o) { return o.module_name === permission.module_name }) || {}
        if (Object.keys(permissionDetail)?.length > 0 || (userType === 1)) {
          return {
            ...permission,
            create: (userType === 1) ? true : permissionDetail.create,
            delete: (userType === 1) ? true : permissionDetail.delete,
            edit: (userType === 1) ? true : permissionDetail.edit,
            view_only: (userType === 1) ? true : permissionDetail.view_only,
          }
        }
        return permission
      }
      );
      setPermissionDetails(result)
    }, [permissionDetails])

  useEffect(() => {
    if (roleManager?.user_type) {
      let userType = roleManager?.user_type
      if (userDetail?.user_type === roleManager?.user_type) {
        const permissionResult = permissionDetails.map((item) => {
          const newPermission = userDetail?.permission.find(
            (detail) => detail._id === item.module_id
          );
          return {
            ...item,
            ...newPermission
          };
        }) || [];
        changeUserAuthority(userType, permissionResult)
      }
      else {
        let authorityPermission = userType === 2 ? [...adminAuthority] : userType === 3 ? [...seniorEmbryoAuthority] : userType === 4 ? [...juniorEmbryoAuthority] :
          userType === 5 ? [...seniorConsultantAuthority] : userType === 6 ? [...assistantDoctorAuthority] :
            userType === 7 ? [...cceAuthority] : []
        changeUserAuthority(userType, authorityPermission)
      }
    }
  }, [selectedUserType, roleManager])

  useEffect(() => {
    if (moduleList?.length > 0) {
      rolePermissions();
    }
    return () => {
      dispatch(setUserDetail({}))
      setPermissionDetails([])
      handleClear()
    }
  }, [moduleList, rolePermissions]);

  useEffect(() => {
    if (!isUserAdd) {
      handleClear();
    }
  }, [isUserAdd, handleClear]);

  const onFinish = useCallback(
    () => {
      userId ? handleUpdate() : handleSave();
    }, [userId, handleUpdate, handleSave])

  const onFinishFailed = useCallback(
    (errorInfo) => {
      const firstErrorField = document.querySelector('.ant-form-item-has-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth' });
      }
    }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoleManager({ ...roleManager, [name]: value });
  };

  return (
    <div className="user_roll_manager_wrap">
      <Form
        form={form}
        name="user_roll_manager"
        initialValues={{
          remember: true
        }}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        scrollToFirstError
        autoComplete="off"
      >
        <Row>
          <Col md={3}>
            <Form.Item
              label="Member Name"
              name="user_name"
              rules={[
                {
                  required: true,
                  message: ""
                }
              ]}
            >
              <Input
                placeholder="Enter member name"
                name="user_name"
                value={roleManager?.user_name}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col md={3}>
            <Form.Item
              label="Member’s Email"
              name="user_email"
              rules={[
                {
                  required: true,
                  message: ""
                },
                {
                  type: "email",
                  message: "Please enter a valid email!"
                }
              ]}
            >
              <Input
                placeholder="Enter Member’s Email"
                name="user_email"
                value={roleManager?.user_email}
                onChange={handleChange}
                disabled={userId}
              />
            </Form.Item>
          </Col>
          <Col md={3}>
            <Form.Item
              label="Member’s Mobile No."
              rules={[
                {
                  required: false
                }
              ]}
            >
              <PhoneWithCountry
                handlePhoneChange={handlePhoneChange}
                phoneNumber={phoneNumber}
                isDisabled={userId}
                countryCode={countryCode}
              />
            </Form.Item>
          </Col>
          <Col md={3}>
            <Form.Item
              label="Member Type"
              name="user_type"
              className="custom_select"
              rules={[
                {
                  required: true,
                  message: ""
                }
              ]}
            >
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
                placeholder="Select"
                options={[
                  { value: 1, label: "Super Admin" },
                  { value: 2, label: "Admin" },
                  { value: 3, label: "Senior Embryo" },
                  { value: 4, label: "Junior Embryo" },
                  { value: 5, label: "Senior Consultant" },
                  { value: 6, label: "Assistant Doctor" },
                  { value: 7, label: "CCE" },
                  { value: 8, label: "Stock Manager" }
                ]}
                name="user_type"
                value={roleManager?.user_type}
                onChange={(value) => {
                  rolePermissions();
                  setRoleManager({
                    ...roleManager,
                    user_type: value
                  });
                  setSelectedUserType(value)
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className="roll_permision_wrapper">
          <h2 className="mb-4">Role Permissions</h2>
          <div className="border_bottom pb-3 mb-3">
            <Row>
              <Col xs={6}>
                <p className="m-0 font_16 text_dark">All Access</p>
              </Col>
              <Col xs={6}>
                <div className="text-end">
                  <Form.Item className="m-0">
                    <Checkbox
                      name="selectAll"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    >
                      Select All
                    </Checkbox>
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </div>
          {permissionDetails?.length > 0 &&
            permissionDetails?.map((item, index) => {
              return (
                <div
                  className="roll_permission_inner border_bottom pb-3 mb-3"
                  key={item?.module_id}
                >
                  <Row className="align-items-center">
                    <Col xxl={3}>
                      <p className="mb-2 mb-xxl-0 text_dark font_16">
                        {item?.module_actual_name}
                      </p>
                    </Col>
                    <Col xxl={9}>
                      <ul className="roll_checkbox_wrap">
                        <li>
                          <Form.Item className="m-0">
                            <Checkbox
                              name="create"
                              checked={item.create}
                              onChange={(e) => {
                                handleChecked(e, index);
                              }}
                            >
                              Create
                            </Checkbox>
                          </Form.Item>
                        </li>
                        <li>
                          <Form.Item className="m-0">
                            <Checkbox
                              name="edit"
                              checked={item.edit}
                              onChange={(e) => {
                                handleChecked(e, index);
                              }}
                            >
                              Edit
                            </Checkbox>
                          </Form.Item>
                        </li>
                        <li>
                          <Form.Item className="m-0">
                            <Checkbox
                              name="delete"
                              checked={item.delete}
                              onChange={(e) => {
                                handleChecked(e, index);
                              }}
                            >
                              Delete
                            </Checkbox>
                          </Form.Item>
                        </li>
                        <li>
                          <Form.Item className="m-0">
                            <Checkbox
                              name="view_only"
                              checked={item.view_only}
                              onChange={(e) => {
                                handleChecked(e, index);
                              }}
                            >
                              View Only
                            </Checkbox>
                          </Form.Item>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </div>
              );
            })}
        </div>
        <div className="button_group d-flex align-items-center justify-content-center">
          {userId ? (userType === 1 || isAuthority?.edit) && <Button className="btn_primary mx-2" htmlType="submit">Update</Button>
            : (userType === 1 || isAuthority?.create) && <Button className="btn_primary mx-2" htmlType="submit">Save</Button>}
          <Button className="btn_gray mx-2" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form >
    </div >
  );
}
