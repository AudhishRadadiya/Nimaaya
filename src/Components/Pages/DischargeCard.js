import { Button, DatePicker, Form, Popconfirm, Select, Spin, Table } from "antd";
import Input from "antd/es/input/Input";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "antd/es/input/TextArea";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ageCalculatorFunc } from "utils/CommonFunctions";
import moment from "moment";
import EditIcon from "../../Img/edit.svg";
import CancelIcon from "../../Img/cancel.svg";
import TranshIcon from "../../Img/trash.svg";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import {
  getAttendingDrList,
  setIvfIdListData,
  setSelectedPatient,
} from "redux/reducers/common.slice";
import {
  createDischargeCard,
  editDischargeCard,
  getDischargeCard,
  printEmbryoTransfer,
  printOvumPickup,
  setDischargeCardData,
} from "redux/reducers/DischargeCard/dischargeCard.slice";
import dayjs from "dayjs";
import { clearData, getGlobalSearch } from "redux/reducers/SearchPanel/globalSearch.slice";
import {
  embryosTransferredOptions,
  icsiDoneWithOptions,
  procedureOptions,
  transferDoneInSingleTrialStayUneventfulDoneUnderUSGGuidenceOptions,
} from "utils/FieldValues";
const isEmbryosTransferredSelect = ["Frozen embryo transfer", "Frozen embryo transfer + surrogacy"];
const patientDetailsInitialState = {
  // patient_id: "",
  // patient_full_name: "",
  // age: "",
};
const dischargeCardInitialState = {
  ivf_flow_id: "",
  ms: "",
  bdod: "",
  pdoa: "",
  pdod: "",
  etdoa: "",
  etdod: "",
  bdoa: "",
  diagnosis: "",
  procedure: null,
  endometrium: "",
  hormones_given: "",
  rupture_given_with: "",
  oocytes_retrieved: "",
  pesa_tesa_done: null,
  icsi_done_with: null,
  with_consent_on: "",
  count: "",
  motility: "",
  morphology: "",
  cleaved: "",
  fertilized: "",
  embryos_transferred: "",
  embryos_frozen: "",
  no_of_embryos: "",
  remaining_frozen_catheter: null,
  media: null,
  hcg_date: "",
  notes: "",
};
const otherDetailsObjInitialState = {
  days: null,
  no_of_oocytes_fertilized: "",
  grade_embryos: null,
};

const embryoFrozendataObj = {
  straw_no: "",
  embryo_days: "",
  no_of_embryo: "",
  grade: "",
  score: "",
  vitrification_id: "",
};

export default function DischargeCard() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [form] = Form.useForm();

  const { selectedPatient, ivfIdList, ivfIdListData, attendingDrList } =
    useSelector(({ common }) => common);
  const { moduleList, userType, selectedLocation } = useSelector(
    ({ role }) => role
  );
  const { dischargeCardData, dischargeCardLoading, dischargeCardUpdate } = useSelector(
    ({ dischargeCard }) => dischargeCard
  );
  const selectedModule = useMemo(() => {
    return (
      moduleList?.find((item) => item?.module_name === location?.pathname) || {}
    );
  }, [moduleList, location?.pathname]);
  const [patientDetails, setPatientDetails] = useState(
    patientDetailsInitialState
  );
  const [dischargeCardVal, setDischargeCardDataVal] = useState(
    dischargeCardInitialState
  );
  const [ivfIdOption, setIvfIdOption] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [otherDetails, setOtherDetails] = useState(otherDetailsObjInitialState);
  const [embryoFrozenDetails, setEmbryoFrozenDetails] =
    useState(embryoFrozendataObj);

  const [tableDataDischargeCard, setTableDataDischargeCard] = useState([]);
  const [tableEmbryoFrozenDetails, setTableEmbryoFrozenDetails] = useState([]);

  useEffect(() => {
    if (Object.keys(selectedPatient).length > 0) {
      dispatch(getAttendingDrList());
    }
  }, [dispatch, selectedPatient]);

  useEffect(() => {
    if (
      Object.entries(attendingDrList)?.length > 0 &&
      Object.entries(selectedPatient)?.length > 0
    ) {
      setDoctorList(attendingDrList);
      setIvfIdOption(ivfIdListData);
    }
  }, [dispatch, attendingDrList, ivfIdListData, selectedPatient]);

  const clearDischargeCard = useCallback(() => {
    setPatientDetails(patientDetailsInitialState);
    setDischargeCardDataVal(dischargeCardInitialState);
    setOtherDetails(otherDetailsObjInitialState);
    form.resetFields();
    setIvfIdOption([]);
    setTableDataDischargeCard([]);
    setTableEmbryoFrozenDetails([]);
  }, [form]);

  useEffect(() => {
    if (Object.keys(selectedPatient)?.length > 0) {
      // const PatientAge = ageCalculatorFunc(selectedPatient?.patient_dob);
      setPatientDetails({
        // patient_id: selectedPatient?.patient_id || "",
        // patient_full_name: selectedPatient?.patient_full_name || "",
        // age: PatientAge,
        diagnosis: selectedPatient?.diagnosis || ""
      });
      form.setFieldsValue({
        // patient_id: selectedPatient?.patient_id || "",
        // patient_full_name: selectedPatient?.patient_full_name || "",
        // age: PatientAge,
        diagnosis: selectedPatient?.diagnosis || ""
      });
      return () => {
        setIvfIdOption([]);
        clearDischargeCard();
        dispatch(setDischargeCardData({}));
      };
    }
  }, [form, selectedPatient]);

  useEffect(() => {
    if (ivfIdListData?.length > 0 && Object.keys(selectedPatient)?.length > 0) {
      setDischargeCardDataVal({
        ...dischargeCardVal,
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
  }, [form, ivfIdList, selectedPatient]);

  useEffect(() => {
    if (
      selectedModule?._id &&
      dischargeCardVal?.ivf_flow_id &&
      selectedPatient?._id
    ) {
      dispatch(
        getDischargeCard({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
          ivf_flow_id: dischargeCardVal?.ivf_flow_id,
        })
      );
    }
  }, [dischargeCardVal?.ivf_flow_id, dispatch]);


  useEffect(() => {
    if (Object.keys(dischargeCardData)?.length > 0) {
      const tableDataDischargeCardList =
        dischargeCardData.discharge_card_table?.map((item) => {
          return {
            ...item,
            id: item._id,
            isDelete: true,
          };
        }) || [];
      setTableDataDischargeCard(tableDataDischargeCardList);
      const embryoFrozenTable =
        dischargeCardData.embryo_frozen_table?.map((item) => {
          return {
            ...item,
            id: item._id,
            isDelete: true,
          };
        }) || [];
      setTableEmbryoFrozenDetails(embryoFrozenTable);
      setDischargeCardDataVal({
        ivf_flow_id: dischargeCardData?.ivf_flow_id || "",
        ms: dischargeCardData?.ms || "",
        bdod: dischargeCardData?.bdod
          ? dayjs(
            moment(dischargeCardData?.bdod).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        pdoa: dischargeCardData?.pdoa
          ? dayjs(
            moment(dischargeCardData?.pdoa).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        pdod: dischargeCardData?.pdod
          ? dayjs(
            moment(dischargeCardData?.pdod).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        etdoa: dischargeCardData?.etdoa
          ? dayjs(
            moment(dischargeCardData?.etdoa).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        etdod: dischargeCardData?.etdod
          ? dayjs(
            moment(dischargeCardData?.etdod).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        bdoa: dischargeCardData?.bdoa
          ? dayjs(
            moment(dischargeCardData?.bdoa).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        diagnosis: dischargeCardData?.diagnosis || "",
        procedure: dischargeCardData?.procedure || null,
        endometrium: dischargeCardData?.endometrium || "",
        hormones_given: dischargeCardData?.hormones_given || "",
        rupture_given_with: dischargeCardData?.rupture_given_with || "",
        oocytes_retrieved: dischargeCardData?.oocytes_retrieved || "",
        pesa_tesa_done: dischargeCardData?.pesa_tesa_done || null,
        icsi_done_with: dischargeCardData?.icsi_done_with || null,
        with_consent_on: dischargeCardData?.with_consent_on
          ? dayjs(
            moment(dischargeCardData?.with_consent_on).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        count: dischargeCardData?.count || "",
        motility: dischargeCardData?.motility || "",
        morphology: dischargeCardData?.morphology || "",
        cleaved: dischargeCardData?.cleaved || "",
        fertilized: dischargeCardData?.fertilized || "",
        embryos_transferred: dischargeCardData?.embryos_transferred || "",
        embryos_frozen: dischargeCardData?.embryos_frozen || "",
        no_of_embryos: dischargeCardData?.no_of_embryos || "",
        remaining_frozen_catheter:
          dischargeCardData?.remaining_frozen_catheter || null,
        media: dischargeCardData?.media || null,
        hcg_date: dischargeCardData?.hcg_date
          ? dayjs(
            moment(dischargeCardData?.hcg_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        notes: dischargeCardData?.notes || "",
      });
      form.setFieldsValue({
        ivf_flow_id: dischargeCardData?.ivf_flow_id || "",
        ms: dischargeCardData?.ms || "",
        bdod: dischargeCardData?.bdod
          ? dayjs(
            moment(dischargeCardData?.bdod).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        pdoa: dischargeCardData?.pdoa
          ? dayjs(
            moment(dischargeCardData?.pdoa).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        pdod: dischargeCardData?.pdod
          ? dayjs(
            moment(dischargeCardData?.pdod).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        etdoa: dischargeCardData?.etdoa
          ? dayjs(
            moment(dischargeCardData?.etdoa).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        etdod: dischargeCardData?.etdod
          ? dayjs(
            moment(dischargeCardData?.etdod).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        bdoa: dischargeCardData?.bdoa
          ? dayjs(
            moment(dischargeCardData?.bdoa).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        diagnosis: dischargeCardData?.diagnosis || "",
        procedure: dischargeCardData?.procedure || null,
        endometrium: dischargeCardData?.endometrium || "",
        hormones_given: dischargeCardData?.hormones_given || "",
        rupture_given_with: dischargeCardData?.rupture_given_with || "",
        oocytes_retrieved: dischargeCardData?.oocytes_retrieved || "",
        pesa_tesa_done: dischargeCardData?.pesa_tesa_done || null,
        icsi_done_with: dischargeCardData?.icsi_done_with || null,
        with_consent_on: dischargeCardData?.with_consent_on
          ? dayjs(
            moment(dischargeCardData?.with_consent_on).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        count: dischargeCardData?.count || "",
        motility: dischargeCardData?.motility || "",
        morphology: dischargeCardData?.morphology || "",
        cleaved: dischargeCardData?.cleaved || "",
        fertilized: dischargeCardData?.fertilized || "",
        embryos_transferred: dischargeCardData?.embryos_transferred || "",
        embryos_frozen: dischargeCardData?.embryos_frozen || "",
        no_of_embryos: dischargeCardData?.no_of_embryos || "",
        remaining_frozen_catheter:
          dischargeCardData?.remaining_frozen_catheter || null,
        media: dischargeCardData?.media || null,
        hcg_date: dischargeCardData?.hcg_date
          ? dayjs(
            moment(dischargeCardData?.hcg_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        notes: dischargeCardData?.notes || "",
      });
    }
  }, [form, dischargeCardData]);

  const onDeleteTableData = useCallback(
    (record) => {
      let deleteData = [...tableDataDischargeCard] || [];
      deleteData = deleteData.filter((item) => item.id !== record.id);
      setTableDataDischargeCard(deleteData);
      toast.success("Delete Succesfully.");
    },
    [tableDataDischargeCard]
  );

  const onDeleteEmbryoFrozenTableData = useCallback(
    (record) => {
      let deleteData = [...tableEmbryoFrozenDetails] || [];
      deleteData = deleteData.filter((item) => item.id !== record.id);
      setTableEmbryoFrozenDetails(deleteData);
      toast.success("Delete Succesfully.");
    },
    [tableEmbryoFrozenDetails]
  );

  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "srNo",
      key: "srNo",
      render: (text, data, index) => index + 1,
    },
    {
      title: "Days",
      dataIndex: "days",
      key: "days",
    },
    {
      title: "No. of Oocytes Fertilizes",
      dataIndex: "no_of_oocytes_fertilized",
      key: "no_of_oocytes_fertilized",
    },
    {
      title: "Grade of Embryos",
      dataIndex: "grade_embryos",
      key: "grade_embryos",
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
                  {(record?.id && record?.id === otherDetails?.id) ||
                    (record?._id && record?._id === otherDetails?._id) ? (
                    <img
                      src={CancelIcon}
                      alt="CancelIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        clearOtherDetailsTable();
                      }}
                    />
                  ) : (
                    <img
                      src={EditIcon}
                      alt="EditIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        setOtherDetails(record);
                        form.setFieldsValue({
                          days: record?.days,
                          no_of_oocytes_fertilized:
                            record?.no_of_oocytes_fertilized,
                          grade_embryos: record?.grade_embryos,
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
                  onConfirm={(e) => {
                    onDeleteTableData(record)
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    className="btn_transparent"
                  // onClick={() => onDeleteTableData(record)}
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

  const columnsForEmbryoFrozenDetails = [
    {
      title: "Sr. No.",
      dataIndex: "srNo",
      key: "srNo",
      render: (text, data, index) => index + 1,
    },
    {
      title: "Straw No",
      dataIndex: "straw_no",
      key: "straw_no",
    },
    {
      title: "Embryo Days",
      dataIndex: "embryo_days",
      key: "embryo_days",
    },
    {
      title: "No Of Embryo",
      dataIndex: "no_of_embryo",
      key: "no_of_embryo",
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "No Of Embryo",
      dataIndex: "no_of_embryo",
      key: "no_of_embryo",
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
                  {(record?.id && record?.id === embryoFrozenDetails?.id) ||
                    (record?._id && record?._id === embryoFrozenDetails?._id) ? (
                    <img
                      src={CancelIcon}
                      alt="CancelIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        clearOtherDetailsTable();
                      }}
                    />
                  ) : (
                    <img
                      src={EditIcon}
                      alt="EditIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        setEmbryoFrozenDetails(record);
                        form.setFieldsValue({
                          straw_no: record?.straw_no,
                          embryo_days: record?.embryo_days,
                          no_of_embryo: record?.no_of_embryo,
                          grade: record?.grade,
                          score: record?.score,
                          vitrification_id: record?.vitrification_id,
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
                  onConfirm={(e) => {
                    onDeleteEmbryoFrozenTableData(record)
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    className="btn_transparent"
                  // onClick={() => onDeleteEmbryoFrozenTableData(record)}
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDischargeCardDataVal({
      ...dischargeCardVal,
      [name]: value,
    });
  };

  const clearOtherDetailsTable = useCallback(() => {
    setOtherDetails(otherDetailsObjInitialState);
    form.setFieldsValue(otherDetailsObjInitialState);
  }, [form]);

  const clearEmbryoFrozenTable = useCallback(() => {
    setEmbryoFrozenDetails(embryoFrozendataObj);
    form.setFieldsValue(embryoFrozendataObj);
  }, [form]);

  const handleOtherDetailsTable = useCallback(() => {
    const { days, grade_embryos, no_of_oocytes_fertilized } = otherDetails;
    if (days && grade_embryos && no_of_oocytes_fertilized) {
      if (otherDetails?.id || otherDetails?._id) {
        let editedData = [...tableDataDischargeCard] || [];
        editedData =
          editedData?.map((item) => {
            if (
              (item?.id && item?.id === otherDetails?.id) ||
              (item?._id && item?._id === otherDetails?._id)
            ) {
              return {
                ...otherDetails,
              };
            }
            return item;
          }) || editedData;
        setTableDataDischargeCard(editedData);
        setOtherDetails(otherDetailsObjInitialState);
        toast.success("Update Succesfully.");
      } else {
        setTableDataDischargeCard((prev) => [
          ...prev,
          {
            ...otherDetails,
            id: new Date().getTime(),
            isDelete: true,
          },
        ]);
        toast.success("Add Succesfully.");
      }
      clearOtherDetailsTable();
    } else {
      toast.error("Please Fill Child Details.");
    }
  }, [clearOtherDetailsTable, otherDetails, selectedPatient]);

  const handleEmbryoFrozenDetailsTable = useCallback(() => {
    const {
      straw_no,
      embryo_days,
      no_of_embryo,
      grade,
      score,
      vitrification_id,
    } = embryoFrozenDetails;
    if (
      straw_no &&
      embryo_days &&
      no_of_embryo &&
      grade &&
      score &&
      vitrification_id
    ) {
      if (embryoFrozenDetails?.id || embryoFrozenDetails?._id) {
        let editedData = [...tableEmbryoFrozenDetails] || [];
        editedData =
          editedData?.map((item) => {
            if (
              (item?.id && item?.id === embryoFrozenDetails?.id) ||
              (item?._id && item?._id === embryoFrozenDetails?._id)
            ) {
              return {
                ...embryoFrozenDetails,
              };
            }
            return item;
          }) || editedData;
        setTableEmbryoFrozenDetails(editedData);
        setEmbryoFrozenDetails(embryoFrozendataObj);
        toast.success("Update Succesfully.");
      } else {
        setTableEmbryoFrozenDetails((prev) => [
          ...prev,
          {
            ...embryoFrozenDetails,
            id: new Date().getTime(),
            isDelete: true,
          },
        ]);
        toast.success("Add Succesfully.");
      }
      clearEmbryoFrozenTable();
    } else {
      toast.error("Please Fill Child Details.");
    }
  }, [clearEmbryoFrozenTable, embryoFrozenDetails, selectedPatient]);
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
  const createDischargeCardFunc = useCallback(async (obj) => {

    const { payload } = await dispatch(
      createDischargeCard({
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
    [dispatch, selectedLocation, selectedPatient, selectedModule, getNewSelectedPatientData],
  );

  const onFinish = (values) => {
    if (dischargeCardVal?.ivf_flow_id) {
      let tableDataDischargeCardSet =
        tableDataDischargeCard?.map((item) => {
          delete item.id;
          return item;
        }) || [];

      let tableEmbryoFrozenDetailsSet =
        tableEmbryoFrozenDetails?.map((item) => {
          delete item.id;
          return item;
        }) || [];

      const obj = {
        ...dischargeCardVal,
        discharge_card_table: tableDataDischargeCardSet,
        embryo_frozen_table: tableEmbryoFrozenDetailsSet,
      };
      if (Object.keys(dischargeCardData)?.length > 0) {
        dispatch(
          editDischargeCard({
            location_id: selectedLocation,
            _id: dischargeCardData?._id,
            module_id: selectedModule?._id,
            payload: obj,
          })
        );
      } else {
        createDischargeCardFunc(obj)
        // dispatch(
        //   createDischargeCard({
        //     location_id: selectedLocation,
        //     patient_reg_id: selectedPatient?._id,
        //     module_id: selectedModule?._id,
        //     payload: obj,
        //   })
        // );
      }
    } else {
      toast.error("IVF id Is Not Generated");
    }
    clearOtherDetailsTable();
  };

  const onFinishFailed = (errorInfo) => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearBtn = () => {
    clearDischargeCard();
    dispatch(setSelectedPatient({}));
    dispatch(setIvfIdListData([]));
    dispatch(clearData());
  };

  const printEmbryoTransferData = useCallback(async () => {
    dispatch(
      printEmbryoTransfer({
        moduleId: selectedModule?._id,
        location_id: selectedLocation,
        patientRegId: selectedPatient?._id,
        ivfFlowId: dischargeCardData?.ivf_flow_id,
      })
    );
  }, [dischargeCardData, dispatch, selectedModule, selectedPatient]);

  const printOvumPickupData = useCallback(async () => {
    dispatch(
      printOvumPickup({
        moduleId: selectedModule?._id,
        patientRegId: selectedPatient?._id,
        ivfFlowId: dischargeCardData?.ivf_flow_id,
      })
    );
  }, [dischargeCardData, dispatch, selectedModule, selectedPatient]);


  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {dischargeCardLoading && (
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
                {/* <li className="w_330 w_xs_50">
                  <Form.Item label="Patient Name" name="patient_full_name">
                    <Input
                      placeholder="Enter Patient Name"
                      name="patient_full_name"
                      value={patientDetails?.patient_full_name}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                {/* <li className="w_150 w_xs_50">
                  <Form.Item label="Age" name="age">
                    <Input
                      placeholder="Enter Age"
                      name="age"
                      value={patientDetails?.age}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                <li className="w_220 w_xs_50">
                  <Form.Item label="LMP" name="lmp">
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      placeholder="Select Date"
                      name="lmp"
                      value={dischargeCardVal?.lmp}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item label="M.S" name="ms">
                    <Input
                      type="number"
                      placeholder="Enter M.S"
                      name="ms"
                      value={dischargeCardVal?.ms}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="BDOD" name="bdod">
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      name="bdod"
                      value={dischargeCardVal?.bdod}
                      onChange={(e) => {
                        setDischargeCardDataVal({
                          ...dischargeCardVal,
                          bdod: moment(new Date(e)).format("YYYY/MM/DD"),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="OPU" name="pdoa">
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      name="pdoa"
                      value={dischargeCardVal?.pdoa}
                      onChange={(e) => {
                        setDischargeCardDataVal({
                          ...dischargeCardVal,
                          pdoa: moment(new Date(e)).format("YYYY/MM/DD"),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="DOD" name="pdod">
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      name="pdod"
                      value={dischargeCardVal?.pdod}
                      onChange={(e) => {
                        setDischargeCardDataVal({
                          ...dischargeCardVal,
                          pdod: moment(new Date(e)).format("YYYY/MM/DD"),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="ETDOA" name="etdoa">
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      name="etdoa"
                      value={dischargeCardVal?.etdoa}
                      onChange={(e) => {
                        setDischargeCardDataVal({
                          ...dischargeCardVal,
                          etdoa: moment(new Date(e)).format("YYYY/MM/DD"),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="ETDOD" name="etdod">
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      name="etdod"
                      value={dischargeCardVal?.etdod}
                      onChange={(e) => {
                        setDischargeCardDataVal({
                          ...dischargeCardVal,
                          etdod: moment(new Date(e)).format("YYYY/MM/DD"),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="BDOA" name="bdoa">
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      name="bdoa"
                      value={dischargeCardVal?.bdoa}
                      onChange={(e) => {
                        setDischargeCardDataVal({
                          ...dischargeCardVal,
                          bdoa: moment(new Date(e)).format("YYYY/MM/DD"),
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
                <li className="w_33 w_xs_50">
                  <Form.Item
                    label="Diagnosis"
                    name="diagnosis"
                    className="custom_select"
                  >
                    {/* <Select
                      placeholder="Select"
                      name="diagnosis"
                      options={[
                        {
                          value: "Primary Infertility + Low Ovarian reserve",
                          label: "Primary Infertility + Low Ovarian reserve",
                        },
                        {
                          value: "Primary Infertility + Low Ovarian reserve",
                          label: "Primary Infertility + Low Ovarian reserve",
                        },
                        {
                          value: "Primary Infertility + Low Ovarian reserve",
                          label: "Primary Infertility + Low Ovarian reserve",
                        },
                      ]}
                      value={otherDetails?.diagnosis}
                      onChange={(value) => {
                        setDischargeCardDataVal({
                          ...dischargeCardVal,
                          diagnosis: value,
                        });
                      }}
                    /> */}
                    <Input
                      placeholder="Enter Diagnosis"
                      name="diagnosis"
                      value={selectedPatient?.diagnosis}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_33 w_xs_50">
                  <Form.Item
                    label="Procedure"
                    name="procedure"
                    className="custom_select"
                  >
                    {/* <Input
                      placeholder="Enter Procedure"
                      name="procedure"
                      value={dischargeCardVal?.procedure}
                      onChange={handleInputChange}
                    /> */}

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
                      name="procedure"
                      options={procedureOptions}
                      value={dischargeCardVal?.procedure}
                      onChange={(value) => {
                        if (isEmbryosTransferredSelect.includes(value)) {
                          setDischargeCardDataVal({
                            ...dischargeCardVal,
                            procedure: value,
                            embryos_transferred: null
                          });
                          form.setFieldsValue({
                            procedure: value,
                            embryos_transferred: null
                          });
                        } else {
                          setDischargeCardDataVal({
                            ...dischargeCardVal,
                            procedure: value,
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_33 w_xs_50">
                  <Form.Item label="Endometrium" name="endometrium">
                    <Input
                      placeholder="Enter Endometrium"
                      name="endometrium"
                      value={dischargeCardVal?.endometrium}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_33 w_xs_50">
                  <Form.Item label="Hormones Given" name="hormones_given">
                    <Input
                      placeholder="Enter Hormones Given"
                      name="hormones_given"
                      value={dischargeCardVal?.hormones_given}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_33 w_xs_50">
                  <Form.Item
                    label="Rupture Given With"
                    name="rupture_given_with"
                  >
                    <Input
                      placeholder="Enter Rupture Given With"
                      name="rupture_given_with"
                      value={dischargeCardVal?.rupture_given_with}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_33 w_xs_50">
                  <Form.Item label="Oocytes Retrieved" name="oocytes_retrieved">
                    <Input
                      placeholder="Enter Oocytes Retrieved"
                      name="oocytes_retrieved"
                      value={dischargeCardVal?.oocytes_retrieved}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_33 w_xs_50">
                  <Form.Item
                    label="PESA / TESA Done"
                    className="custom_select"
                    name="pesa_tesa_done"
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
                      name="pesa_tesa_done"
                      options={doctorList}
                      value={dischargeCardVal?.pesa_tesa_done}
                      onChange={(value) => {
                        setDischargeCardDataVal({
                          ...dischargeCardVal,
                          pesa_tesa_done: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_33 w_xs_50">
                  <Form.Item
                    label="ICSI Done With"
                    name="icsi_done_with"
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
                      name="icsi_done_with"
                      // options={doctorList}
                      options={icsiDoneWithOptions}
                      value={dischargeCardVal?.icsi_done_with}
                      onChange={(value) => {
                        setDischargeCardDataVal({
                          ...dischargeCardVal,
                          icsi_done_with: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="With Consent On" name="with_consent_on">
                    <DatePicker
                      placeholder="Select Date"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      value={dischargeCardVal?.with_consent_on}
                      onChange={(e) => {
                        setDischargeCardDataVal({
                          ...dischargeCardVal,
                          with_consent_on: moment(new Date(e)).format(
                            "YYYY/MM/DD"
                          ),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item label="Count" name="count"
                    rules={[
                      {
                        pattern: /^[0-9]*$/,
                        message: 'Please enter only numbers.',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Count"
                      name="count"
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item label="Motility" name="motility">
                    <Input
                      placeholder="Enter Motility"
                      name="motility"
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item label="Morphology" name="morphology">
                    <Input
                      placeholder="Enter Morphology"
                      name="morphology"
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item label="Cleaved" name="cleaved">
                    <Input
                      placeholder="Enter Cleaved"
                      name="cleaved"
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item label="Fertilised" name="fertilized">
                    <Input
                      placeholder="Enter Fertilised"
                      name="fertilized"
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
              </ul>
              <ul className="grid_wrapper">
                <li className="w_33 w_xs_100">
                  <Form.Item
                    label="Embryos Transferred"
                    name="embryos_transferred"
                    className={
                      isEmbryosTransferredSelect.includes(dischargeCardVal?.procedure) ? "custom_select"
                        : ""
                    }
                  >
                    {isEmbryosTransferredSelect.includes(dischargeCardVal?.procedure) ?
                      (
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
                          name="embryos_transferred"
                          options={embryosTransferredOptions}
                          value={dischargeCardVal?.embryos_transferred}
                          onChange={(value) => {
                            setDischargeCardDataVal({
                              ...dischargeCardVal,
                              embryos_transferred: value,
                            });
                          }}
                        />
                      ) : (
                        <TextArea
                          rows={4}
                          name="embryos_transferred"
                          placeholder="Enter Embryos Transferred"
                          className="with_arrow"
                          onChange={handleInputChange}
                        />
                      )}
                  </Form.Item>
                </li>
                <li className="w_33 w_xs_100">
                  <Form.Item name="embryos_frozen" label="Embryos Frozen">
                    <TextArea
                      rows={4}
                      name="embryos_frozen"
                      placeholder="Enter Embryos Frozen"
                      className="with_arrow"
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_33 w_xs_100">
                  <Form.Item name="no_of_embryos" label="No. of Embryos">
                    <TextArea
                      rows={4}
                      name="no_of_embryos"
                      placeholder="Enter No. of Embryos"
                      className="with_arrow"
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_320 w_xs_50">
                  <Form.Item
                    label="Remaining Frozen Catheter"
                    name="remaining_frozen_catheter"
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
                      name="remaining_frozen_catheter"
                      options={[
                        {
                          value: "Sydney, IVF - Australia",
                          label: "Sydney, IVF - Australia",
                        },
                        {
                          value: "Sydney, IVF - Australia",
                          label: "Sydney, IVF - Australia",
                        },
                        {
                          value: "Sydney, IVF - Australia",
                          label: "Sydney, IVF - Australia",
                        },
                      ]}
                      value={otherDetails?.remaining_frozen_catheter}
                      onChange={(value) => {
                        setDischargeCardDataVal({
                          ...dischargeCardVal,
                          remaining_frozen_catheter: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_320 w_xs_50">
                  <Form.Item
                    label="Media"
                    name="media"
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
                      name="media"
                      options={[
                        {
                          value: "Vitromed, Germany",
                          label: "Vitromed, Germany",
                        },
                        {
                          value: "Vitromed, Germany",
                          label: "Vitromed, Germany",
                        },
                        {
                          value: "Vitromed, Germany",
                          label: "Vitromed, Germany",
                        },
                      ]}
                      value={otherDetails?.media}
                      onChange={(value) => {
                        setDischargeCardDataVal({
                          ...dischargeCardVal,
                          media: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
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
                      value={dischargeCardVal?.ivf_flow_id}
                      onChange={(value) => {
                        form.setFieldsValue(dischargeCardInitialState);
                        setOtherDetails(otherDetailsObjInitialState);
                        setTableDataDischargeCard([]);
                        setTableEmbryoFrozenDetails([]);
                        form.setFieldsValue({ ivf_flow_id: value });
                        setDischargeCardDataVal({
                          ivf_flow_id: value,
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
                <li className="w_170 w_xs_50">
                  <Form.Item label="Days" name="days" className="custom_select">
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
                      name="days"
                      options={[
                        {
                          value: "1",
                          label: "1",
                        },
                        {
                          value: "2",
                          label: "2",
                        },
                        {
                          value: "3",
                          label: "3",
                        },
                        {
                          value: "4",
                          label: "4",
                        },
                      ]}
                      value={otherDetails?.days}
                      onChange={(value) => {
                        setOtherDetails({
                          ...otherDetails,
                          days: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="No. of Oocytes Fertilised"
                    name="no_of_oocytes_fertilized"
                  >
                    <Input
                      placeholder="--"
                      name="no_of_oocytes_fertilized"
                      onChange={(e) => {
                        setOtherDetails({
                          ...otherDetails,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_300 w_xs_50">
                  <Form.Item
                    label="Grade of Embryos"
                    name="grade_embryos"
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
                      options={[
                        {
                          value: "Chromosomal Abnormality",
                          label: "Chromosomal Abnormality",
                        },
                        {
                          value: "Desired Reduction",
                          label: "Desired Reduction",
                        },
                        {
                          value: "Malformation",
                          label: "Malformation",
                        },
                        {
                          value: "Social Indiaction",
                          label: "Social Indiaction",
                        },
                        {
                          value: "None",
                          label: "None",
                        },
                        {
                          value: "Bleeding",
                          label: "Bleeding",
                        },
                        {
                          value: "Passing",
                          label: "Passing",
                        },
                      ]}
                      name="grade_embryos"
                      value={otherDetails?.grade_embryos}
                      onChange={(value) => {
                        setOtherDetails({
                          ...otherDetails,
                          grade_embryos: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_300 w_xs_50 align-self-end">
                  {otherDetails?.id || otherDetails?._id
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
                  dataSource={tableDataDischargeCard}
                  pagination={false}
                />
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Embryo Frozen Details</h3>
              <ul className="grid_wrapper">
                <li className="w_220 w_xs_50">
                  <Form.Item label="Straw No" name="straw_no">
                    <Input
                      placeholder="--"
                      name="straw_no"
                      onChange={(e) => {
                        setEmbryoFrozenDetails({
                          ...embryoFrozenDetails,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="Embryo Days" name="embryo_days">
                    <Input
                      placeholder="--"
                      name="embryo_days"
                      onChange={(e) => {
                        setEmbryoFrozenDetails({
                          ...embryoFrozenDetails,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="No Of Embryo" name="no_of_embryo">
                    <Input
                      placeholder="--"
                      name="no_of_embryo"
                      onChange={(e) => {
                        setEmbryoFrozenDetails({
                          ...embryoFrozenDetails,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="Grade" name="grade">
                    <Input
                      placeholder="--"
                      name="grade"
                      onChange={(e) => {
                        setEmbryoFrozenDetails({
                          ...embryoFrozenDetails,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="Score" name="score">
                    <Input
                      placeholder="--"
                      name="score"
                      onChange={(e) => {
                        setEmbryoFrozenDetails({
                          ...embryoFrozenDetails,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="Vitrification Id" name="vitrification_id">
                    <Input
                      placeholder="--"
                      name="vitrification_id"
                      onChange={(e) => {
                        setEmbryoFrozenDetails({
                          ...embryoFrozenDetails,
                          [e.target.name]: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_xs_50 align-self-end">
                  {embryoFrozenDetails?.id || embryoFrozenDetails?._id
                    ? (userType === 1 || selectedModule?.edit) && (
                      <Button
                        className="btn_primary mb24"
                        onClick={handleEmbryoFrozenDetailsTable}
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
                        onClick={handleEmbryoFrozenDetailsTable}
                      >
                        Add
                      </Button>
                    )}
                </li>
              </ul>
              <div className="cmn_table_wrap pb-4">
                <Table
                  columns={columnsForEmbryoFrozenDetails}
                  dataSource={tableEmbryoFrozenDetails}
                  pagination={false}
                />
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Other Details</h3>
              <ul className="grid_wrapper pb-3">
                <li className="w_400 w_xs_50">
                  <Form.Item
                    label="To Get 3cc of Blood in Plain bulb for Sr-Beta HCG on"
                    name="hcg_date"
                  >
                    <DatePicker
                      placeholder="Select Date"
                      name="hcg_date"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      value={dischargeCardVal?.hcg_date}
                      onChange={(e) => {
                        setDischargeCardDataVal({
                          ...dischargeCardVal,
                          hcg_date: moment(new Date(e)).format("YYYY/MM/DD"),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled center">
              <p className="d-flex align-items-center m-0 pb-4 Guidance_wrap">
                Transfer{" "}
                <Form.Item
                  className="custom_select mb-0 mx-2"
                  label=""
                  name="hcg_transfer"
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
                    className="min_100"
                    options={
                      transferDoneInSingleTrialStayUneventfulDoneUnderUSGGuidenceOptions
                    }
                    name="hcg_transfer"
                    value={otherDetails?.hcg_transfer}
                    onChange={(value) => {
                      setOtherDetails({
                        ...otherDetails,
                        hcg_transfer: value,
                      });
                    }}
                  />
                </Form.Item>
                done in single trail. Stay uneventful. Done under USG Guidance.
              </p>
            </div>
            <div className="form_info_wrapper filled">
              <ul className="grid_wrapper">
                <li className="w-100">
                  <Form.Item name="notes" label="Notes">
                    <TextArea
                      rows={3}
                      name="notes"
                      onChange={handleInputChange}
                      placeholder="Notes"
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {Object.keys(dischargeCardData)?.length > 0
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
            <Button className="btn_gray" onClick={handleClearBtn}>
              Cancel
            </Button>
            <Button
              className="btn_primary mx-3"
              disabled={Object.entries(dischargeCardData).length === 0}
              onClick={() => {
                Object.entries(dischargeCardData).length > 0 &&
                  Object.entries(selectedPatient).length > 0 &&
                  printEmbryoTransferData();
              }}
            >
              Print
            </Button>
            {/* <Button className="btn_primary mx-3" onClick={printOvumPickupData}>
              Print2
            </Button> */}
          </div>
        </Form>
      </div >
    </div >
  );
}
