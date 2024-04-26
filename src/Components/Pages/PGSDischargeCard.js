import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DatePicker, Form, Select, Table, Button, Spin, Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Input from "antd/es/input/Input";
import TextArea from "antd/es/input/TextArea";
import { useLocation } from "react-router-dom";
import { ageCalculatorFunc } from "utils/CommonFunctions";
import moment from "moment";
import { toast } from "react-toastify";
import {
  getAttendingDrList,
  setIvfIdList,
  setSelectedPatient,
} from "redux/reducers/common.slice";
import dayjs from "dayjs";
import EditIcon from "../../Img/edit.svg";
import CancelIcon from "../../Img/cancel.svg";
import TranshIcon from "../../Img/trash.svg";
import {
  createPgsDischargeCard,
  editPgsDischargeCard,
  getPgsDischargeCard,
  setPgsDischargeCardDetails,
} from "redux/reducers/PgsDischargeCard/pgsDischargeCard.slice";
import { clearData, getGlobalSearch } from "redux/reducers/SearchPanel/globalSearch.slice";
// const patientDetailsInitialState = {
//   patient_id: "",
//   patient_full_name: "",
//   age: "",
// };
const pgsDischargeCardDataInitialState = {
  ivf_flow_id: "",
  valid_upto: "",
  pickup_date: "",
  pgs_date: "",
  vatrification_date: "",
  renewal_date: "",
  embryo_biopsy_by: null,
  vetrification_done_by: null,
  assisted_by: null,
  media_used: null,
  device_used: null,
  expiry_date_media: "",
  batch_no_media: "",
  pgs_lab_details: "",
  notes: "",
};
const otherDetailsTableObjInitialState = {
  embryos_days: "",
  embryos_id: "",
  embryos_score: "",
  goblet_color: "",
  device_color: "",
  tank_no: "",
  canister_no: "",
  pgs_report: "",
  transfer_recommendations: "",
};

export default function PgsDischargeCard() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [form] = Form.useForm();
  const { selectedPatient, ivfIdList, ivfIdListData, attendingDrList } =
    useSelector(({ common }) => common);
  const { moduleList, userType, selectedLocation } = useSelector(
    ({ role }) => role
  );
  const { pgsDischargeCardDetails, pgsDischargeCardLoading } = useSelector(
    ({ pgsDischargeCard }) => pgsDischargeCard
  );
  const selectedModule = useMemo(() => {
    return (
      moduleList?.find((item) => item?.module_name === location?.pathname) || {}
    );
  }, [moduleList, location?.pathname]);
  const [doctorList, setDoctorList] = useState([]);

  // const [patientDetails, setPatientDetails] = useState(
  //   patientDetailsInitialState
  // );
  const [ivfIdOption, setIvfIdOption] = useState([]);
  const [pgsDischargeCardData, setPgsDischargeCardData] = useState(
    pgsDischargeCardDataInitialState
  );
  const [otherDetailsTableObj, setOtherDetailsTableObj] = useState(
    otherDetailsTableObjInitialState
  );
  const [tableDataOtherDetails, setTableDataOtherDetails] = useState([]);

  useEffect(() => {
    if (Object.keys(selectedPatient).length > 0) {
      dispatch(getAttendingDrList());
    }
  }, [dispatch, selectedPatient]);

  useEffect(() => {
    if (Object.entries(attendingDrList)?.length > 0) {
      setDoctorList(attendingDrList);
      setIvfIdOption(ivfIdListData);
    }
  }, [dispatch, attendingDrList, ivfIdListData]);

  const clearPgsDischargeCard = useCallback(() => {
    setIvfIdOption([]);
    setTableDataOtherDetails([]);
    // setPatientDetails(patientDetailsInitialState);
    setPgsDischargeCardData(pgsDischargeCardDataInitialState);
    setOtherDetailsTableObj(otherDetailsTableObjInitialState);
    form.resetFields();
  }, [form]);

  // useEffect(() => {
  //   if (selectedPatient && Object.keys(selectedPatient)?.length > 0) {
  //     const PatientAge = ageCalculatorFunc(selectedPatient?.patient_dob) || "";
  //     setPatientDetails({
  //       patient_id: selectedPatient?.patient_id || "",
  //       patient_full_name: selectedPatient?.patient_full_name || "",
  //       age: PatientAge,
  //     });
  //     form.setFieldsValue({
  //       patient_id: selectedPatient?.patient_id || "",
  //       patient_full_name: selectedPatient?.patient_full_name || "",
  //       age: PatientAge,
  //     });
  //     return () => {
  //       setIvfIdOption([]);
  //       clearPgsDischargeCard();
  //       dispatch(setPgsDischargeCardDetails({}));
  //     };
  //   }
  // }, [form, selectedPatient]);

  useEffect(() => {
    if (ivfIdListData?.length > 0 && Object.keys(selectedPatient)?.length > 0) {
      setPgsDischargeCardData({
        ...pgsDischargeCardData,
        ivf_flow_id: ivfIdListData[0]?.value || "",
        lmp: ivfIdListData[0]?.last_menstrual_period
          ? dayjs(
            moment(ivfIdListData[0]?.last_menstrual_period).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : "",
      });
      form.setFieldsValue({
        ivf_flow_id: ivfIdListData[0]?.value || "",
        lmp: ivfIdListData[0]?.last_menstrual_period
          ? dayjs(
            moment(ivfIdListData[0]?.last_menstrual_period).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : "",
      });
    }
    return () => {
      setIvfIdOption([]);
      clearPgsDischargeCard();
      dispatch(setPgsDischargeCardDetails({}));
    };
  }, [form, ivfIdList, form, selectedPatient]);

  useEffect(() => {
    if (pgsDischargeCardData?.ivf_flow_id && selectedPatient?._id) {
      dispatch(
        getPgsDischargeCard({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
          ivf_flow_id: pgsDischargeCardData?.ivf_flow_id,
        })
      );
    }
  }, [pgsDischargeCardData?.ivf_flow_id, dispatch]);

  useEffect(() => {
    if (Object.keys(pgsDischargeCardDetails)?.length > 0) {
      const tableDataDischargeCardList =
        pgsDischargeCardDetails.pgs_discharge_card_table?.map((item) => {
          return {
            ...item,
            id: item._id,
            isDelete: true,
          };
        }) || [];
      setTableDataOtherDetails(tableDataDischargeCardList);
      setPgsDischargeCardData({
        ivf_flow_id: pgsDischargeCardDetails?.ivf_flow_id,
        valid_upto: pgsDischargeCardDetails?.valid_upto
          ? dayjs(
            moment(pgsDischargeCardDetails?.valid_upto).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        pickup_date: pgsDischargeCardDetails?.pickup_date
          ? dayjs(
            moment(pgsDischargeCardDetails?.pickup_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        pgs_date: pgsDischargeCardDetails?.pgs_date
          ? dayjs(
            moment(pgsDischargeCardDetails?.pgs_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        vatrification_date: pgsDischargeCardDetails?.vatrification_date
          ? dayjs(
            moment(pgsDischargeCardDetails?.vatrification_date).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : "",
        renewal_date: pgsDischargeCardDetails?.renewal_date
          ? dayjs(
            moment(pgsDischargeCardDetails?.renewal_date).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : "",
        embryo_biopsy_by: pgsDischargeCardDetails?.embryo_biopsy_by,
        vetrification_done_by: pgsDischargeCardDetails?.vetrification_done_by,
        assisted_by: pgsDischargeCardDetails?.assisted_by,
        media_used: pgsDischargeCardDetails?.media_used,
        device_used: pgsDischargeCardDetails?.device_used,
        expiry_date_media: pgsDischargeCardDetails?.expiry_date_media
          ? dayjs(
            moment(pgsDischargeCardDetails?.expiry_date_media).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : "",
        batch_no_media: pgsDischargeCardDetails?.batch_no_media,
        pgs_lab_details: pgsDischargeCardDetails?.pgs_lab_details,
        notes: pgsDischargeCardDetails?.notes,
      });
      form.setFieldsValue({
        ivf_flow_id: pgsDischargeCardDetails?.ivf_flow_id,
        valid_upto: pgsDischargeCardDetails?.valid_upto
          ? dayjs(
            moment(pgsDischargeCardDetails?.valid_upto).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        pickup_date: pgsDischargeCardDetails?.pickup_date
          ? dayjs(
            moment(pgsDischargeCardDetails?.pickup_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        pgs_date: pgsDischargeCardDetails?.pgs_date
          ? dayjs(
            moment(pgsDischargeCardDetails?.pgs_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        vatrification_date: pgsDischargeCardDetails?.vatrification_date
          ? dayjs(
            moment(pgsDischargeCardDetails?.vatrification_date).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : "",
        renewal_date: pgsDischargeCardDetails?.renewal_date
          ? dayjs(
            moment(pgsDischargeCardDetails?.renewal_date).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : "",
        embryo_biopsy_by: pgsDischargeCardDetails?.embryo_biopsy_by,
        vetrification_done_by: pgsDischargeCardDetails?.vetrification_done_by,
        assisted_by: pgsDischargeCardDetails?.assisted_by,
        media_used: pgsDischargeCardDetails?.media_used,
        device_used: pgsDischargeCardDetails?.device_used,
        expiry_date_media: pgsDischargeCardDetails?.expiry_date_media
          ? dayjs(
            moment(pgsDischargeCardDetails?.expiry_date_media).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : "",
        batch_no_media: pgsDischargeCardDetails?.batch_no_media,
        pgs_lab_details: pgsDischargeCardDetails?.pgs_lab_details,
        notes: pgsDischargeCardDetails?.notes,
      });
    }
  }, [form, pgsDischargeCardDetails]);

  const onDeleteTableData = useCallback(
    (record) => {
      let deleteData = [...tableDataOtherDetails] || [];
      deleteData = deleteData.filter((item) => item.id !== record.id);
      setTableDataOtherDetails(deleteData);
      toast.success("Delete Succesfully.");
    },
    [tableDataOtherDetails]
  );

  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "srNo",
      key: "srNo",
      render: (text, data, index) => index + 1,
    },
    {
      title: "Day of Embryos",
      dataIndex: "embryos_days",
      key: "embryos_days",
    },
    {
      title: "ID of Embryos",
      dataIndex: "embryos_id",
      key: "embryos_id",
    },
    {
      title: "Score of Embryos",
      dataIndex: "embryos_score",
      key: "embryos_score",
    },
    {
      title: "Color of Goblet",
      dataIndex: "goblet_color",
      key: "goblet_color",
    },
    {
      title: "Color of Device",
      dataIndex: "device_color",
      key: "device_color",
    },
    {
      title: "Tank No.",
      dataIndex: "tank_no",
      key: "tank_no",
    },
    {
      title: "Canister No.",
      dataIndex: "canister_no",
      key: "canister_no",
    },
    {
      title: "PGS Report",
      dataIndex: "pgs_report",
      key: "pgs_report",
    },
    {
      title: "Transfer Recomm.",
      dataIndex: "transfer_recommendations",
      key: "transfer_recommendations",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (record) => {
        return (
          <ul className="action_wrap d-flex align-items-center">
            {(userType === 1 || selectedModule?.edit || record?.isDelete) && (
              <li>
                <Button className="btn_transparent">
                  {record?.id && record?.id === otherDetailsTableObj?.id ? (
                    <img
                      src={CancelIcon}
                      alt="CancelIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        clearOtherDetailsTableObj();
                      }}
                    />
                  ) : (
                    <img
                      src={EditIcon}
                      alt="EditIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        setOtherDetailsTableObj(record);
                        form.setFieldsValue({
                          embryos_days: record?.embryos_days,
                          embryos_id: record?.embryos_id,
                          embryos_score: record?.embryos_score,
                          goblet_color: record?.goblet_color,

                          device_color: record?.device_color,
                          tank_no: record?.tank_no,
                          canister_no: record?.canister_no,
                          pgs_report: record?.pgs_report,
                          transfer_recommendations:
                            record?.transfer_recommendations,
                        });
                      }}
                    />
                  )}
                </Button>
              </li>
            )}
            {record?.isDelete && (
              <li>
                <Popconfirm
                  title="Delete this data"
                  description="Are you sure to delete this data?"
                  onConfirm={() => {
                    onDeleteTableData(record)
                  }}
                  // onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    className="btn_transparent"
                  >
                    <img src={TranshIcon} alt="TranshIcon" />
                  </Button>
                </Popconfirm>
              </li>
            )}
          </ul>
        );
      },
    },
  ];

  const handleInputChangeForOtherDetails = (e) => {
    const { name, value } = e.target;
    setOtherDetailsTableObj({
      ...otherDetailsTableObj,
      [name]: value,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPgsDischargeCardData({
      ...pgsDischargeCardData,
      [name]: value,
    });
  };
  const clearOtherDetailsTableObj = useCallback(() => {
    setOtherDetailsTableObj(otherDetailsTableObjInitialState);
    form.setFieldsValue(otherDetailsTableObjInitialState);
  }, [form]);

  const handleOtherDetailsTable = useCallback(() => {
    const {
      embryos_days,
      embryos_id,
      embryos_score,
      goblet_color,
      device_color,
      tank_no,
      canister_no,
      pgs_report,
      transfer_recommendations,
    } = otherDetailsTableObj;
    if (
      embryos_days &&
      embryos_id &&
      embryos_score &&
      goblet_color &&
      device_color &&
      tank_no &&
      canister_no &&
      pgs_report &&
      transfer_recommendations
    ) {
      if (otherDetailsTableObj?.id || otherDetailsTableObj?._id) {
        let editedData = [...tableDataOtherDetails] || [];
        editedData =
          editedData?.map((item) => {
            if (
              (item?.id && item?.id === otherDetailsTableObj?.id) ||
              (item?._id && item?._id === otherDetailsTableObj?._id)
            ) {
              return {
                ...otherDetailsTableObj,
              };
            }
            return item;
          }) || editedData;
        setTableDataOtherDetails(editedData);
        setOtherDetailsTableObj(otherDetailsTableObjInitialState);
        toast.success("Update Succesfully.");
      } else {
        setTableDataOtherDetails((prev) => [
          ...prev,
          {
            ...otherDetailsTableObj,
            id: new Date().getTime(),
            isDelete: true,
          },
        ]);
        toast.success("Add Succesfully.");
      }
      clearOtherDetailsTableObj();
    } else {
      toast.error("Please Fill Child Details.");
    }
  }, [clearOtherDetailsTableObj, otherDetailsTableObj, selectedPatient]);


  const getNewSelectedPatientData = useCallback(async () => {
    if (
      Object.keys(selectedPatient)?.length > 0
    ) {
      const { payload } = await dispatch(
        getGlobalSearch({
          patient_reg_id: selectedPatient._id,
          patient_name: selectedPatient.patient_full_name,
          location_id: selectedLocation,
        })
      );
      if (payload.length > 0) dispatch(setSelectedPatient(payload[0]));
    }
  }, [
    dispatch,
    selectedLocation,
    selectedPatient,
  ]);
  const createPgsDischargeCardFunc = useCallback(
    async (obj) => {
      const { payload } = await dispatch(
        createPgsDischargeCard({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
          payload: obj,
        })
      );
      if (payload.hasOwnProperty("_id")) {
        getNewSelectedPatientData();
      }
    },
    [dispatch, getNewSelectedPatientData, selectedLocation, selectedModule, selectedPatient],
  )


  const onFinish = (values) => {
    if (pgsDischargeCardData?.ivf_flow_id) {
      let tableDataDischargeCardSet =
        tableDataOtherDetails?.map((item) => {
          delete item.id;
          return item;
        }) || [];

      const obj = {
        ...pgsDischargeCardData,
        pgs_discharge_card_table: tableDataDischargeCardSet,
      };
      if (Object.keys(pgsDischargeCardDetails)?.length > 0) {
        dispatch(
          editPgsDischargeCard({
            location_id: selectedLocation,
            _id: pgsDischargeCardDetails?._id,
            module_id: selectedModule?._id,
            payload: obj,
          })
        );
      } else {
        createPgsDischargeCardFunc(obj);
      }
    } else {
      toast.error("IVF id Is Not Generated");
    }
    clearOtherDetailsTableObj();
    setOtherDetailsTableObj(otherDetailsTableObjInitialState);
  };

  const onFinishFailed = (errorInfo) => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClear = () => {
    clearPgsDischargeCard();
    dispatch(setSelectedPatient({}));
    dispatch(setIvfIdList([]));
    dispatch(clearData());
  };

  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {pgsDischargeCardLoading && (
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        )}
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          layout="vertical"
          onFinish={onFinish}
          form={form}
          onFinishFailed={onFinishFailed}
          scrollToFirstErrorssss
          autoComplete="off"
        >
          <div className="form_process_wrapper">
            <div className="form_info_wrapper filled">
              <div className="patient_detail_wrap">
                <ul>
                  <li>
                    <label>Patient ID :</label>
                    <span>{selectedPatient.patient_id ? selectedPatient.patient_id : ""}</span>
                  </li>
                  <li>
                    <label>Patient Name :</label>
                    <span>{selectedPatient.patient_full_name ? selectedPatient.patient_full_name : ""}</span>
                  </li>
                  <li>
                    <label>Age :</label>
                    <span>{selectedPatient?.patient_dob ? ageCalculatorFunc(selectedPatient?.patient_dob) : ""}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Patient Details</h3>
              <ul className="grid_wrapper">
                {/* <li className="w_250 w_xs_100">
                  <Form.Item label="Patient ID" name="patient_id">
                    <Input placeholder="Enter Patient ID" name="patient_id" />
                  </Form.Item>
                </li> */}
                {/* <li className="w_320 w_xs_100">
                  <Form.Item label="Patient Name" name="patient_full_name">
                    <Input
                      placeholder="Enter Patient Name"
                      name="patient_full_name"
                      value={patientDetails?.patient_full_name}
                    />
                  </Form.Item>
                </li> */}
                {/* <li className="w_150 w_xs_50">
                  <Form.Item label="Age" name="age">
                    <Input
                      placeholder="Enter Age"
                      value={patientDetails?.age}
                      name="age"
                    />
                  </Form.Item>
                </li> */}
                <li className="w_250 w_xs_50">
                  <Form.Item
                    label="IVF ID"
                    className="custom_select"
                    name="ivf_flow_id"
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
                      name="ivf_flow_id"
                      options={ivfIdOption}
                      value={pgsDischargeCardData?.ivf_flow_id}
                      onChange={(value) => {
                        const findList = ivfIdOption?.find(
                          (item) => item.value === value
                        );
                        form.setFieldsValue(pgsDischargeCardDataInitialState);
                        setOtherDetailsTableObj(
                          otherDetailsTableObjInitialState
                        );
                        setTableDataOtherDetails([]);
                        form.setFieldsValue({
                          ivf_flow_id: value,
                          lmp: findList?.last_menstrual_period
                            ? dayjs(
                              moment(findList?.last_menstrual_period).format(
                                "DD/MM/YYYY"
                              ),
                              "DD/MM/YYYY"
                            )
                            : "",
                        });
                        setPgsDischargeCardData({
                          ...pgsDischargeCardData,
                          ivf_flow_id: value,
                          lmp: findList?.last_menstrual_period
                            ? dayjs(
                              moment(findList?.last_menstrual_period).format(
                                "DD/MM/YYYY"
                              ),
                              "DD/MM/YYYY"
                            )
                            : "",
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="Valid up to" name="valid_upto">
                    <DatePicker
                      placeholder="Select Date"
                      name="valid_upto"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      value={pgsDischargeCardData?.valid_upto}
                      onChange={(e) => {
                        setPgsDischargeCardData({
                          ...pgsDischargeCardData,
                          valid_upto: moment(new Date(e)).format("YYYY/MM/DD"),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="Date of Pickup" name="pickup_date">
                    <DatePicker
                      placeholder="Select Date"
                      name="pickup_date"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      value={pgsDischargeCardData?.pickup_date}
                      onChange={(e) => {
                        setPgsDischargeCardData({
                          ...pgsDischargeCardData,
                          pickup_date: moment(new Date(e)).format("YYYY/MM/DD"),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="Date of PGS" name="pgs_date">
                    <DatePicker
                      placeholder="Select Date"
                      name="pgs_date"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      value={pgsDischargeCardData?.pgs_date}
                      onChange={(e) => {
                        setPgsDischargeCardData({
                          ...pgsDischargeCardData,
                          pgs_date: moment(new Date(e)).format("YYYY/MM/DD"),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Vitrification Date"
                    name="vatrification_date"
                  >
                    <DatePicker
                      placeholder="Select Date"
                      name="vatrification_date"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      value={pgsDischargeCardData?.vatrification_date}
                      onChange={(e) => {
                        setPgsDischargeCardData({
                          ...pgsDischargeCardData,
                          vatrification_date: moment(new Date(e)).format(
                            "YYYY/MM/DD"
                          ),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="Renewal Date" name="renewal_date">
                    <DatePicker
                      placeholder="Select Date"
                      name="renewal_date"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      value={pgsDischargeCardData?.renewal_date}
                      onChange={(e) => {
                        setPgsDischargeCardData({
                          ...pgsDischargeCardData,
                          renewal_date: moment(new Date(e)).format(
                            "YYYY/MM/DD"
                          ),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Other Details</h3>
              <ul className="grid_wrapper">
                <li className="w_220 w_xs_50">
                  <Form.Item label="Day of Embryos" name="embryos_days">
                    <Input
                      placeholder="Enter Day of Embryos"
                      name="embryos_days"
                      value={otherDetailsTableObj?.embryos_days}
                      onChange={handleInputChangeForOtherDetails}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="ID of Embryos" name="embryos_id">
                    <Input
                      placeholder="Enter ID of Embryos"
                      name="embryos_id"
                      value={otherDetailsTableObj?.embryos_days}
                      onChange={handleInputChangeForOtherDetails}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="Score of Embryos" name="embryos_score">
                    <Input
                      placeholder="Enter Score of Embryos"
                      name="embryos_score"
                      value={otherDetailsTableObj?.embryos_days}
                      onChange={handleInputChangeForOtherDetails}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="Color of Goblet" name="goblet_color">
                    <Input
                      placeholder="Enter Color of Goblet"
                      name="goblet_color"
                      value={otherDetailsTableObj?.embryos_days}
                      onChange={handleInputChangeForOtherDetails}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="Color of Device" name="device_color">
                    <Input
                      placeholder="Enter Color of Device"
                      name="device_color"
                      value={otherDetailsTableObj?.embryos_days}
                      onChange={handleInputChangeForOtherDetails}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="Tank No." name="tank_no">
                    <Input
                      placeholder="Enter Tank No."
                      name="tank_no"
                      value={otherDetailsTableObj?.embryos_days}
                      onChange={handleInputChangeForOtherDetails}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="Canister No." name="canister_no">
                    <Input
                      placeholder="Enter Canister No."
                      name="canister_no"
                      value={otherDetailsTableObj?.embryos_days}
                      onChange={handleInputChangeForOtherDetails}
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item label="PGS Report" name="pgs_report">
                    <Input
                      placeholder="Enter PGS Report"
                      name="pgs_report"
                      value={otherDetailsTableObj?.embryos_days}
                      onChange={handleInputChangeForOtherDetails}
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Transfer Recommendations"
                    name="transfer_recommendations"
                  >
                    <Input
                      placeholder="Enter Transfer Recommendations"
                      name="transfer_recommendations"
                      value={otherDetailsTableObj?.embryos_days}
                      onChange={handleInputChangeForOtherDetails}
                    />
                  </Form.Item>
                </li>
                <li className="w_300 w_xs_50 align-self-end">
                  {otherDetailsTableObj?.id || otherDetailsTableObj?._id
                    ? (userType === 1 || selectedModule?.edit) && (
                      <Button
                        className="btn_primary mb24"
                        onClick={handleOtherDetailsTable}
                      >
                        Edit
                      </Button>
                    )
                    : (userType === 1 || selectedModule?.create) && (
                      <Button
                        disabled={
                          Object.keys(selectedPatient)?.length > 0
                            ? false
                            : true
                        }
                        className="btn_primary mb24"
                        onClick={handleOtherDetailsTable}
                      >
                        Add
                      </Button>
                    )}
                </li>
              </ul>
              <div className="cmn_table_wrap pb-4">
                <Table
                  columns={columns}
                  dataSource={tableDataOtherDetails}
                  pagination={false}
                />
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Other Details</h3>
              <ul className="grid_wrapper">
                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="Embryo Biopsy By"
                    name="embryo_biopsy_by"
                    className="custom_select"
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
                      name="embryo_biopsy_by"
                      options={doctorList}
                      value={pgsDischargeCardData?.embryo_biopsy_by}
                      onChange={(value) => {
                        setPgsDischargeCardData({
                          ...pgsDischargeCardData,
                          embryo_biopsy_by: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="Vitrification Done By"
                    name="vetrification_done_by"
                    className="custom_select"
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
                      name="vetrification_done_by"
                      options={doctorList}
                      value={pgsDischargeCardData?.vetrification_done_by}
                      onChange={(value) => {
                        setPgsDischargeCardData({
                          ...pgsDischargeCardData,
                          vetrification_done_by: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="Assisted By"
                    name="assisted_by"
                    className="custom_select"
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
                      name="assisted_by"
                      options={doctorList}
                      value={pgsDischargeCardData?.assisted_by}
                      onChange={(value) => {
                        setPgsDischargeCardData({
                          ...pgsDischargeCardData,
                          assisted_by: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Media Used"
                    name="media_used"
                    className="custom_select"
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
                      name="media_used"
                      options={[
                        {
                          value: "Cryotec-VC",
                          label: "Cryotec-VC",
                        },
                        {
                          value: "Cryolock",
                          label: "Cryolock",
                        },
                        {
                          value: "Cryoleaf",
                          label: "Cryoleaf",
                        },
                        {
                          value: "Cryoloop",
                          label: "Cryoloop",
                        },
                      ]}
                      value={pgsDischargeCardData?.media_used}
                      onChange={(value) => {
                        setPgsDischargeCardData({
                          ...pgsDischargeCardData,
                          media_used: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Device Used"
                    name="device_used"
                    className="custom_select"
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
                      name="device_used"
                      options={[
                        {
                          value: "Cryotec-VC",
                          label: "Cryotec-VC",
                        },
                        {
                          value: "Cryolock",
                          label: "Cryolock",
                        },
                        {
                          value: "Cryoleaf",
                          label: "Cryoleaf",
                        },
                        {
                          value: "Cryoloop",
                          label: "Cryoloop",
                        },
                      ]}
                      value={pgsDischargeCardData?.device_used}
                      onChange={(value) => {
                        setPgsDischargeCardData({
                          ...pgsDischargeCardData,
                          device_used: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Expiry Date of Media"
                    name="expiry_date_media"
                  >
                    <DatePicker
                      placeholder="Select Date"
                      name="dateOne"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      value={pgsDischargeCardData?.expiry_date_media}
                      onChange={(e) => {
                        setPgsDischargeCardData({
                          ...pgsDischargeCardData,
                          expiry_date_media: moment(new Date(e)).format(
                            "YYYY/MM/DD"
                          ),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item label="Batch No. of Media" name="batch_no_media">
                    <Input
                      placeholder="Batch No. of Media"
                      name="batch_no_media"
                      value={pgsDischargeCardData?.batch_no_media}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item label="PGS Lab Details" name="pgs_lab_details">
                    <Input
                      placeholder="PGS Lab Details"
                      name="pgs_lab_details"
                      value={pgsDischargeCardData?.pgs_lab_details}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w-100">
                  <Form.Item name="notes" label="Notes">
                    <TextArea
                      rows={3}
                      name="notes"
                      placeholder="Notes"
                      value={pgsDischargeCardData?.notes}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {Object.keys(pgsDischargeCardDetails)?.length > 0
              ? (userType === 1 || selectedModule?.edit) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary mx-3"
                  htmlType="submit"
                >
                  Update
                </Button>
              )
              : (userType === 1 || selectedModule?.create) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary mx-3"
                  htmlType="submit"
                >
                  Save
                </Button>
              )}
            <Button className="btn_gray" onClick={handleClear}>
              Cancel
            </Button>
            <Button
              disabled
              className="btn_print mx-3"
            >
              Print
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
