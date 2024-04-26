import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Form, Input, Popconfirm, Select, Spin } from "antd";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import EditIcon from "../../Img/edit.svg";
import CancelIcon from "../../Img/cancel.svg";
import TranshIcon from "../../Img/trash.svg";
import {
  getIvfId,
  setIvfIdList,
  setSelectedPatient,
} from "redux/reducers/common.slice";
import {
  createLutealPhase,
  editLutealPhase,
  getLutealPhase,
  setLutealPhaseDetails,
  setLutealPhaseUpdate,
} from "redux/reducers/LutealPhase/lutealPhase.slice";

import { getAuthToken } from "Helper/AuthTokenHelper";
import {
  clearData,
  getGlobalSearch,
} from "redux/reducers/SearchPanel/globalSearch.slice";
export default function LutealPhase() {
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();
  const UserData = getAuthToken();
  const { selectedPatient, ivfIdList, isIvfListLoading } = useSelector(
    ({ common }) => common
  );
  const { lutealPhaseData, lutealPhaseListLoading, lutealPhaseUpdate } =
    useSelector(({ lutealPhase }) => lutealPhase);
  const { moduleList, userType, selectedLocation } = useSelector(
    ({ role }) => role
  );
  // const [patientDetails, setPatientDetails] = useState({
  //   patient_id: "",
  //   patient_full_name: "",
  //   partner_full_name: "",
  // });
  const [ivfIdOption, setIvfIdOption] = useState([]);
  const [lutealPhaseDetails, setLutealphaseDetails] = useState({
    ivf_flow_id: "",
    factors: null,
    ohss: null,
    notes: "",
  });
  const [medicineData, setMedicineData] = useState([]);
  const [ismedicineEditObj, setIsMedicineEditObj] = useState({});
  const [medicineDetails, setMedicineDetails] = useState({
    from_date: null,
    to_date: null,
    medicine: null,
    category: null,
    dose: "",
  });
  const [ivfidDetails, setIvfIdDetails] = useState({
    protocol: "",
    last_menstrual_period: null,
  });
  const selectedModule = useMemo(() => {
    return (
      moduleList?.find((item) => item?.module_name === location?.pathname) || {}
    );
  }, [moduleList, location?.pathname]);
  const clearLutealPhaseData = useCallback(() => {
    // setPatientDetails({
    //   patient_id: "",
    //   patient_full_name: "",
    //   partner_full_name: "",
    // });
    setMedicineDetails({
      ivf_flow_id: null,
      from_date: null,
      to_date: null,
      medicine: null,
      category: null,
      dose: "",
    });
    setLutealphaseDetails({
      ivf_flow_id: "",
      factors: null,
      ohss: null,
      notes: "",
    });
    setIvfIdDetails({
      protocol: "",
      last_menstrual_period: null,
    });
    form.resetFields();
    setIvfIdOption([]);
    setMedicineData([]);
  }, [form]);

  // useEffect(() => {
  //   if (selectedPatient && Object.keys(selectedPatient).length > 0) {
  //     setPatientDetails({
  //       patient_id: selectedPatient?.patient_id || "",
  //       patient_full_name: selectedPatient?.patient_full_name || "",
  //       partner_full_name: selectedPatient?.partner_full_name || "",
  //     });
  //     form.setFieldsValue({
  //       patient_id: selectedPatient?.patient_id || "",
  //       patient_full_name: selectedPatient?.patient_full_name || "",
  //       partner_full_name: selectedPatient?.partner_full_name || "",
  //     });
  //   }
  //   return () => {
  //     clearLutealPhaseData();
  //     dispatch(setLutealPhaseDetails({}));
  //     dispatch(setIvfIdList([]));
  //     setIvfIdOption([]);
  //   };
  // }, [form, selectedPatient, clearLutealPhaseData, dispatch]);

  useEffect(() => {
    if (
      Object.keys(selectedModule)?.length > 0 &&
      Object.keys(selectedPatient)?.length > 0 &&
      selectedLocation
    ) {
      dispatch(
        getIvfId({
          locationId: selectedLocation,
          patientRegId: selectedPatient?._id,
          moduleId: selectedModule?._id,
        })
      );
    }
    return () => {
      clearLutealPhaseData();
      dispatch(setLutealPhaseDetails({}));
      dispatch(setIvfIdList([]));
      setIvfIdOption([]);
    };
  }, [dispatch, selectedLocation, selectedModule, selectedPatient, clearLutealPhaseData]);
  useEffect(() => {
    if (ivfIdList?.length > 0) {
      const ivfListId = ivfIdList?.map((item) => ({
        value: item._id,
        label: item.ivf_id,
        protocol: item.protocol,
        finished: item.finished,
        last_menstrual_period: item.last_menstrual_period
          ? moment(item?.last_menstrual_period).format("DD/MM/YYYY")
          : null,
      }));
      setIvfIdOption(ivfListId);
      setIvfIdDetails({
        protocol: ivfListId[0]?.protocol,
        last_menstrual_period: ivfListId[0].last_menstrual_period
          ? ivfListId[0]?.last_menstrual_period
          : null,
      });
      setLutealphaseDetails((prevDetails) => ({
        ...prevDetails,
        ivf_flow_id: ivfListId[0]?.value,
      }));
      form.setFieldsValue({
        protocol: ivfListId[0]?.protocol,
        ivf_flow_id: ivfListId[0]?.value,
        last_menstrual_period: ivfListId[0]?.last_menstrual_period
          ? dayjs(ivfListId[0]?.last_menstrual_period, "DD/MM/YYYY")
          : null,
      });
    }
  }, [form, ivfIdList]);
  useEffect(() => {
    if (lutealPhaseDetails?.ivf_flow_id && selectedPatient?._id) {
      dispatch(
        getLutealPhase({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
          ivf_flow_id: lutealPhaseDetails?.ivf_flow_id,
        })
      );
    }
  }, [lutealPhaseDetails?.ivf_flow_id]);

  useEffect(() => {
    if (lutealPhaseUpdate) {
      dispatch(
        getLutealPhase({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
          ivf_flow_id: lutealPhaseDetails?.ivf_flow_id,
        })
      );
      dispatch(setLutealPhaseUpdate(false));
    }
  }, [lutealPhaseUpdate]);
  useEffect(() => {
    if (Object.keys(lutealPhaseData).length > 0) {
      const lutealPhaseDataTable =
        lutealPhaseData.medicine_detail?.map((item) => {
          return {
            ...item,
            id: Math.random().toString().substring(2, 9),
            isDelete: UserData?.other === false ? true : false,
          };
        }) || [];
      setMedicineData(lutealPhaseDataTable);
      setLutealphaseDetails({
        ivf_flow_id: lutealPhaseDetails?.ivf_flow_id,
        factors: lutealPhaseData?.factors || null,
        ohss: lutealPhaseData?.ohss || null,
        notes: lutealPhaseData?.notes || null,
      });
      form.setFieldsValue({
        factors: lutealPhaseData?.factors || null,
        ohss: lutealPhaseData?.ohss || null,
        notes: lutealPhaseData?.notes || null,
      });
    }
  }, [form, lutealPhaseData]);
  const handleIvfId = useCallback(
    (id) => {
      const findList = ivfIdOption?.find((item) => item.value === id);
      const lutealPhaseDataTable =
        lutealPhaseData.medicine_detail?.map((item) => {
          return {
            ...item,
            id: Math.random().toString().substring(2, 9),
            isDelete: UserData?.other === false ? true : false,
          };
        }) || [];
      if (findList) {
        setIvfIdDetails({
          protocol: findList?.protocol || null,
          last_menstrual_period: findList?.last_menstrual_period
            ? findList?.last_menstrual_period
            : null,
        });
        setLutealphaseDetails((prevDetails) => ({
          ...prevDetails,
          ivf_flow_id: findList?.value,
          factors: lutealPhaseData?.factors || null,
          ohss: lutealPhaseData?.ohss || null,
          notes: lutealPhaseData?.notes || null,
        }));
        setMedicineData(lutealPhaseDataTable);
        form.setFieldsValue({
          protocol: findList?.protocol,
          ivf_flow_id: findList?.value,
          last_menstrual_period: findList?.last_menstrual_period
            ? dayjs(findList?.last_menstrual_period, "DD/MM/YYYY")
            : null,
          factors: lutealPhaseData?.factors || null,
          ohss: lutealPhaseData?.ohss || null,
          notes: lutealPhaseData?.notes || null,
        });
      }
    },
    [form, ivfIdOption]
  );
  const onFinish = (values) => {
    if (lutealPhaseDetails?.ivf_flow_id) {
      let medicineDataset =
        medicineData?.map((item) => {
          delete item.id;
          return item;
        }) || [];
      const obj = {
        ...lutealPhaseDetails,
        medicine_detail: medicineDataset,
      };
      if (Object.keys(lutealPhaseData)?.length > 0) {
        dispatch(
          editLutealPhase({
            location_id: selectedLocation,
            _id: lutealPhaseData?._id,
            module_id: selectedModule?._id,
            payload: obj,
          })
        );
      } else {
        dispatch(
          createLutealPhase({
            location_id: selectedLocation,
            patient_reg_id: selectedPatient?._id,
            module_id: selectedModule?._id,
            payload: obj,
          })
        );
      }
    } else {
      toast.error("IVF id Is Not Generated");
    }
    clearMedicineData();
    setIsMedicineEditObj({});
  };

  const onFinishFailed = (errorInfo) => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearMedicineData = useCallback(() => {
    setMedicineDetails({
      from_date: null,
      to_date: null,
      medicine: null,
      category: null,
      dose: "",
    });
    form.setFieldsValue({
      from_date: null,
      to_date: null,
      medicine: null,
      category: null,
      dose: "",
    });
  }, [form]);

  const onDeleteMedicineDetails = useCallback(
    (record) => {
      let deleteData = [...medicineData] || [];
      deleteData = deleteData.filter((item) => item.id !== record.id);
      setMedicineData(deleteData);
      toast.success("Delete Succesfully.");
    },
    [medicineData, setMedicineData]
  );

  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "srNo",
      key: "srNo",
      render: (text, data, index) => index + 1,
    },
    {
      title: "From Date",
      dataIndex: "from_date",
      key: "from_date",
      render: (e) => {
        return e ? moment(e).format("DD/MM/YYYY") : null;
      },
    },
    {
      title: "To Date",
      dataIndex: "to_date",
      key: "to_date",
      render: (e) => {
        return e ? moment(e).format("DD/MM/YYYY") : null;
      },
    },
    {
      title: "Medicine",
      dataIndex: "medicine",
      key: "medicine",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Dose",
      dataIndex: "dose",
      key: "dose",
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
                  {(record?.id && record?.id === ismedicineEditObj?.id) ||
                    (record?._id && record?._id === ismedicineEditObj?._id) ? (
                    <img
                      src={CancelIcon}
                      alt="CancelIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        clearMedicineData();
                        setIsMedicineEditObj({});
                      }}
                    />
                  ) : (
                    <img
                      src={EditIcon}
                      alt="EditIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        setMedicineDetails({
                          from_date: moment(record.from_date).format(
                            "DD/MM/YYYY"
                          ),
                          to_date: moment(record.to_date).format("DD/MM/YYYY"),
                          medicine: record.medicine,
                          dose: record.dose,
                          category: record.category,
                        });
                        form.setFieldsValue({
                          from_date: dayjs(
                            moment(record.from_date).format("DD/MM/YYYY"),
                            "DD/MM/YYYY"
                          ),
                          to_date: dayjs(
                            moment(record.to_date).format("DD/MM/YYYY"),
                            "DD/MM/YYYY"
                          ),
                          medicine: record.medicine,
                          dose: record.dose,
                          category: record.category,
                        });
                        setIsMedicineEditObj(record);
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
                    onDeleteMedicineDetails(record)
                  }}
                  // onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    className="btn_transparent"
                  // onClick={() => onDeleteMedicineDetails(record)}
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

  const onChangeMedicineDetails = useCallback((name, values) => {
    const value =
      name === "from_date" || name === "to_date"
        ? values
          ? moment(new Date(values)).format("DD/MM/YYYY")
          : null
        : values;
    setMedicineDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleMedicineData = useCallback(() => {
    const { from_date, to_date, medicine, category, dose } = medicineDetails;
    if (
      Object.keys(selectedPatient)?.length > 0 &&
      from_date &&
      to_date &&
      medicine &&
      dose &&
      category
    ) {
      if (Object.keys(ismedicineEditObj)?.length > 0) {
        let editedData = [...medicineData] || [];
        editedData =
          editedData?.map((item) => {
            if (
              (item?.id && item?.id === ismedicineEditObj?.id) ||
              (item?._id && item?._id === ismedicineEditObj?._id)
            ) {
              return {
                ...item,
                from_date: moment(
                  medicineDetails?.from_date,
                  "DD/MM/YYYY"
                ).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
                to_date: moment(medicineDetails?.to_date, "DD/MM/YYYY").format(
                  "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                ),
                medicine: medicine,
                dose: dose,
                category: category,
              };
            }
            return item;
          }) || editedData;
        setMedicineData(editedData);
        setIsMedicineEditObj({});
        toast.success("Update Succesfully.");
      } else {
        setMedicineData((prev) => [
          ...prev,
          {
            ...medicineDetails,
            from_date: moment(medicineDetails.from_date, "DD/MM/YYYY").format(
              "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
            ),
            to_date: moment(medicineDetails.to_date, "DD/MM/YYYY").format(
              "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
            ),
            id: Math.random().toString().substring(2, 9),
            isDelete: true,
          },
        ]);
        toast.success("Add Succesfully.");
      }
      clearMedicineData();
    } else {
      toast.error("Please Fill Medicine Fields.");
    }
  }, [
    clearMedicineData,
    ismedicineEditObj,
    medicineData,
    medicineDetails,
    selectedPatient,
  ]);
  const getNewSelectedPatientData = useCallback(async () => {
    if (
      lutealPhaseUpdate &&
      Object.keys(selectedPatient)?.length > 0 &&
      Object.keys(lutealPhaseData)?.length === 0
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
    lutealPhaseUpdate,
    lutealPhaseData,
  ]);
  useEffect(() => {
    getNewSelectedPatientData();
  }, [lutealPhaseUpdate]);
  const handleClear = () => {
    clearLutealPhaseData();
    dispatch(setSelectedPatient({}));
    dispatch(setIvfIdList([]));
    dispatch(clearData());
  };
  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {(lutealPhaseListLoading || isIvfListLoading) && (
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
          scrollToFirstError
          autoComplete="off"
        >

          <div className="form_process_wrapper">
            <div className="form_info_wrapper filled">
              <div className="patient_detail_wrap">
                <ul>
                  <li>
                    <label>Patient ID :</label>
                    <span>{selectedPatient?.patient_id ? selectedPatient?.patient_id : ""}</span>
                  </li>
                  <li>
                    <label>Patient Name :</label>
                    <span>{selectedPatient?.patient_full_name ? selectedPatient?.patient_full_name : ""}</span>
                  </li>
                  <li>
                    <label>Partner Name :</label>
                    <span>{selectedPatient?.partner_full_name ? selectedPatient?.partner_full_name : ""}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Patient Details</h3>
              <ul className="grid_wrapper">
                {/* <li className="w_250 w_xs_50">
                  <Form.Item label="Patient ID" name="patient_id">
                    <Input
                      placeholder="Enter Patient ID"
                      name="patient_id"
                      value={patientDetails?.patient_id}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                <li className="w_250 w_xs_50">
                  <Form.Item
                    label="IVF ID"
                    name="ivf_flow_id"
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
                      name="ivf_flow_id"
                      options={ivfIdOption}
                      value={lutealPhaseDetails?.ivf_flow_id}
                      onChange={(e) => {
                        handleIvfId(e);
                      }}
                    />
                  </Form.Item>
                </li>
                {/* <li className="w_320 w_xs_100">
                  <Form.Item label="Patient Name" name="patient_full_name">
                    <Input
                      placeholder="Enter Patient Name"
                      name="patient_full_name"
                      value={patientDetails?.patient_full_name}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                {/* <li className="w_320 w_xs_100">
                  <Form.Item label="Partner Name" name="partner_full_name">
                    <Input
                      placeholder="Enter Partner Name"
                      name="partner_full_name"
                      value={patientDetails?.partner_full_name}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="Last Menstrual Period"
                    name="last_menstrual_period"
                  >
                    <DatePicker
                      placeholder="06/11/2022"
                      name="last_menstrual_period"
                      value={ivfidDetails.last_menstrual_period}
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_50 w_xs_100">
                  <Form.Item
                    label="Factors"
                    name="factors"
                    className="custom_select"
                    rules={
                      lutealPhaseDetails?.ivf_flow_id && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
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
                      placeholder="Enter Factors"
                      name="factors"
                      value={lutealPhaseDetails?.factors}
                      onChange={(e) => {
                        setLutealphaseDetails({
                          ...lutealPhaseDetails,
                          factors: e,
                        });
                      }}
                      options={[
                        { value: "Endometriosis", label: "Endometriosis" },
                        {
                          value: "Hyperandrogenemia/ PCO",
                          label: "Hyperandrogenemia/ PCO",
                        },
                        { value: "None", label: "None" },
                        { value: "Other", label: "Other" },
                        {
                          value: "PathCycle",
                          label:
                            "Path Cycle Other endoorinalagical disorders excluding hyperandrogenemia",
                        },
                        {
                          value: "Psychogenic Factors",
                          label: "Psychogenic Factors",
                        },
                        {
                          value: "Sexual Disorders",
                          label: "Sexual Disorders",
                        },
                        {
                          value: "Status after sterilization",
                          label: "Status after sterilization",
                        },
                        { value: "Tubal Pathology", label: "Tubal Pathology" },
                        {
                          value: "Uterine, Cervix factor",
                          label: "Uterine, Cervix factor",
                        },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50">
                  <Form.Item
                    label="OHSS"
                    name="ohss"
                    className="custom_select"
                    rules={
                      lutealPhaseDetails?.ivf_flow_id && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
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
                      placeholder="Hospitalisation"
                      name="ohss"
                      value={lutealPhaseDetails?.ohss}
                      onChange={(e) => {
                        setLutealphaseDetails({
                          ...lutealPhaseDetails,
                          ohss: e,
                        });
                      }}
                      options={[
                        { value: "Grade - I", label: "Grade - I" },
                        { value: "Grade - II", label: "Grade - II" },
                        { value: "Grade - III", label: "Grade - III" },
                        { value: "Hospitalisation", label: "Hospitalisation" },
                        { value: "None", label: "None" },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item label="Protocol" name="protocol">
                    <Input
                      placeholder="Alphabetic"
                      name="protocol"
                      value={ivfidDetails?.protocol}
                      disabled
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Medicine Details</h3>
              <ul className="grid_wrapper">
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="From Date"
                    name="from_date"
                    rules={
                      medicineDetails?.from_date && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
                  >
                    <DatePicker
                      placeholder="08/03/2017"
                      name="from_date"
                      value={
                        medicineDetails?.from_date
                          ? dayjs(medicineDetails?.from_date, "DD/MM/YYYY")
                          : null
                      }
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      onChange={(value) =>
                        onChangeMedicineDetails("from_date", value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="To Date"
                    name="to_date"
                    rules={
                      medicineDetails?.from_date && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
                  >
                    <DatePicker
                      placeholder="08/03/2017"
                      name="to_date"
                      value={
                        medicineDetails?.to_date
                          ? dayjs(medicineDetails?.to_date, "DD/MM/YYYY")
                          : null
                      }
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      onChange={(value) =>
                        onChangeMedicineDetails("to_date", value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_320 w_xs_100">
                  <Form.Item
                    label="Medicine"
                    name="medicine"
                    rules={
                      medicineDetails?.from_date && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
                  >
                    <Input
                      placeholder="Enter medicine"
                      name="medicine"
                      value={medicineDetails?.medicine}
                      onChange={(e) =>
                        onChangeMedicineDetails("medicine", e.target.value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_300 w_xs_100">
                  <Form.Item
                    label="Category"
                    name="category"
                    className="custom_select"
                    rules={
                      medicineDetails?.from_date && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
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
                      name="category"
                      value={medicineDetails?.category}
                      onChange={(a) => {
                        setMedicineDetails({
                          ...medicineDetails,
                          category: a,
                        });
                      }}
                      options={[
                        { value: "Oral", label: "Oral" },
                        { value: "IM", label: "IM" },
                        { value: "SC", label: "SC" },
                        { value: "Vaginal", label: "Vaginal" },
                        { value: "Intrauterine", label: "Intrauterine" },
                        { value: "L/A", label: "L/A" },
                        { value: "--", label: "--" },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_300 w_xs_100">
                  <Form.Item
                    label="Dose"
                    name="dose"
                    rules={
                      medicineDetails?.from_date && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
                  >
                    <Input
                      placeholder="Enter Dose"
                      name="dose"
                      value={medicineDetails?.dose}
                      onChange={(e) =>
                        onChangeMedicineDetails("dose", e.target.value)
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_300 w_xs_10 align-self-end">
                  {Object.keys(ismedicineEditObj)?.length > 0
                    ? (userType === 1 || selectedModule?.edit) && (
                      <Button
                        className="btn_primary mb24"
                        onClick={handleMedicineData}
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
                        onClick={handleMedicineData}
                      >
                        Add
                      </Button>
                    )}
                </li>
              </ul>
              <div className="cmn_table_wrap pb-4 max_height">
                <Table
                  columns={columns}
                  dataSource={medicineData}
                  pagination={false}
                />
              </div>
              <div>
                <Form.Item label="Notes" name="notes">
                  <TextArea
                    rows={4}
                    name="notes"
                    value={medicineDetails?.notes}
                    onChange={(e) => {
                      setLutealphaseDetails({
                        ...lutealPhaseDetails,
                        notes: e.target.value,
                      });
                    }}
                    placeholder="Notes"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-5">
            {Object.keys(lutealPhaseData)?.length > 0
              ? (userType === 1 || selectedModule?.edit) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary me-3"
                  htmlType="submit"
                >
                  Update
                </Button>
              )
              : (userType === 1 || selectedModule?.create) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary me-3"
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
