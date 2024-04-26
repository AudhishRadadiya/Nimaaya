import { useState, useEffect, useCallback } from "react";
import { Button, DatePicker, Form, Input, Popconfirm, Select, Table, Tooltip } from "antd";
import { Col, Row } from "react-bootstrap";
import dayjs from "dayjs";
import EditIcon from "../../Img/edit.svg";
import CancelIcon from "../../Img/cancel.svg";
import TranshIcon from "../../Img/trash.svg";
import moment from "moment";
import {
  createPatientBasicHistoryDetails,
  updatePatientBasicHistory,
} from "redux/reducers/PatientBasicHistory/patientBasicHistory.slice";
import { useDispatch } from "react-redux";
import { setSelectedPatient } from "redux/reducers/common.slice";
import { clearData } from "redux/reducers/SearchPanel/globalSearch.slice";
import {
  chromosomeAnalysisOptions,
  deliveryMethodOptions,
  patencyOfTheFallopianTubeOptions,
  pregnancyOutcomeOptions,
  previousIllnessesOptions,
  sterilityFactorsOptions,
  withPartnerOptions,
} from "utils/FieldValues";
import TextArea from "antd/es/input/TextArea";

export default function PatientBasicInformation({
  userType,
  locationId,
  selectedPatient,
  moduleDetail,
  patientBasicHistoryDetail,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  let UserData;
  let UserPreferences = localStorage.getItem("UserPreferences");
  if (UserPreferences) {
    UserData = UserPreferences = JSON.parse(window.atob(UserPreferences));
  }
  const [isEditObj, setIsEditObj] = useState({});
  const dateFormat = "DD/MM/YYYY";
  const [basicInfo, setBasicInfo] = useState({
    // patient_id: "",
    // patient_full_name: "",
    // attending_dr: "",
    height: "",
    weight: "",
    bmi: "",
    date_of_medical_history: null,
    patency_of_the_fallopian_tube_right: null,
    patency_of_the_fallopian_tube_left: null,
    chromosome_analysis: null,
    fallopian_tube_reviewed: "",
    type_of_infertility: null,
  });
  const [previousPregnanciesInfo, setPreviousPregnanciesInfo] = useState({
    sr_no: "",
    in_year: "",
    pregnancy_outcome: null,
    with_partner: null,
    child_died_perinatally: "",
    // previous_treatment: "",
    delivery_method: null,
    type_of_conception: null,
    pg_week: "",
    note: "",
  });
  const clearPreviousPregnanciesInfo = useCallback(() => {
    setPreviousPregnanciesInfo({
      sr_no: "",
      in_year: "",
      pregnancy_outcome: null,
      with_partner: null,
      child_died_perinatally: "",
      // previous_treatment: "",
      delivery_method: null,
      type_of_conception: null,
      pg_week: "",
      note: "",
    });
    form.setFieldsValue({
      sr_no: "",
      in_year: "",
      pregnancy_outcome: null,
      with_partner: null,
      child_died_perinatally: "",
      // previous_treatment: "",
      delivery_method: null,
      type_of_conception: null,
      pg_week: "",
      note: "",
    });
  }, [form]);
  const [prevTable, setPrevTable] = useState([]);
  const isAddBtnStatus = () => {
    const {
      sr_no,
      in_year,
      pregnancy_outcome,
      with_partner,
      child_died_perinatally,
      // previous_treatment,
      delivery_method,
      type_of_conception,
      pg_week,
    } = previousPregnanciesInfo;
    if (
      sr_no &&
      in_year &&
      pregnancy_outcome &&
      with_partner &&
      child_died_perinatally &&
      // previous_treatment &&
      delivery_method &&
      type_of_conception &&
      pg_week
    ) {
      return false;
    } else return true;
  };
  const [previousTreatmentInfo, setPreviousTreatmentInfo] = useState({
    no_of_previous_ot: "",
    no_of_iui: "",
    fet: "",
    ivf_icsi: "",
    iuid: "",
    freeze_all: "",
    od: "",
    ed: "",
    pgt: "",
    surrogacy: "",
  });
  const [otherDetailsInfo, setOtherDetailsInfo] = useState({
    previous_illnesses: null,
    sterility_factors: null,
    notes: ""
  });
  const onFinish = (values) => {
    const payload = {
      ...basicInfo,
      previous_pregnancy: prevTable,
      ...previousTreatmentInfo,
      ...otherDetailsInfo,
    };

    Object.keys(patientBasicHistoryDetail)?.length > 0
      ? dispatch(
        updatePatientBasicHistory({
          locationId: locationId,
          id: patientBasicHistoryDetail._id,
          moduleId: moduleDetail?._id,
          payload:
            basicInfo?.type_of_infertility !== "Primary"
              ? payload
              : basicInfo,
        })
      )
      : dispatch(
        createPatientBasicHistoryDetails({
          locationId: locationId,
          patientRegId: selectedPatient?._id,
          moduleId: moduleDetail?._id,
          payload:
            basicInfo?.type_of_infertility !== "Primary"
              ? payload
              : basicInfo,
        })
      );
  };

  const onFinishFailed = (errorInfo) => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const onDeleteHandler = useCallback(
    (record) => {
      let PregnanciesData = [...prevTable] || [];
      PregnanciesData = PregnanciesData.filter((item) => item.id !== record.id);
      setPrevTable(PregnanciesData);
    },
    [prevTable, setPrevTable]
  );
  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "sr_no",
      key: "sr_no",
    },
    {
      title: "In Year",
      dataIndex: "in_year",
      key: "in_year",
    },
    {
      title: "Pregnancy Outcome",
      dataIndex: "pregnancy_outcome",
      key: "pregnancy_outcome",
    },
    {
      title: "With Partner",
      dataIndex: "with_partner",
      key: "with_partner",
    },
    {
      title: "Delivery Method",
      dataIndex: "delivery_method",
      key: "delivery_method",
    },
    {
      title: "PG Week",
      dataIndex: "pg_week",
      key: "pg_week",
    },
    {
      title: "Child Died Perinatally",
      dataIndex: "child_died_perinatally",
      key: "child_died_perinatally",
    },
    {
      title: "Type of Conception",
      dataIndex: "type_of_conception",
      key: "type_of_conception",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (record) => {
        return (
          <ul className="action_wrap d-flex align-items-center">
            {(userType === 1 || moduleDetail?.edit || record?.isDelete) && (
              <li>
                <Button className="btn_transparent">
                  {record.id === isEditObj.id ? (
                    <img
                      src={CancelIcon}
                      alt="CancelIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        clearPreviousPregnanciesInfo();
                        setIsEditObj({});
                      }}
                    />
                  ) : (
                    <img
                      src={EditIcon}
                      alt="EditIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        setPreviousPregnanciesInfo({
                          sr_no: record.sr_no,
                          in_year: record.in_year,
                          pregnancy_outcome: record.pregnancy_outcome,
                          with_partner: record.with_partner,
                          child_died_perinatally: record.child_died_perinatally,
                          // previous_treatment: record.previous_treatment,
                          delivery_method: record.delivery_method,
                          type_of_conception: record.type_of_conception,
                          pg_week: record.pg_week,
                          note: record.note,
                        });
                        form.setFieldsValue({
                          sr_no: record.sr_no,
                          in_year: record.in_year,
                          pregnancy_outcome: record.pregnancy_outcome,
                          with_partner: record.with_partner,
                          child_died_perinatally: record.child_died_perinatally,
                          // previous_treatment: record.previous_treatment,
                          delivery_method: record.delivery_method,
                          type_of_conception: record.type_of_conception,
                          pg_week: record.pg_week,
                          note: record.note,
                        });
                        setIsEditObj(record);
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
                    onDeleteHandler(record)
                  }}
                  // onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    className="btn_transparent"
                  // onClick={() => onDeleteHandler(record)}
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
  // useEffect(() => {
  //   if (Object.entries(selectedPatient)?.length > 0) {
  //     setBasicInfo({
  //       patient_id: selectedPatient.patient_id,
  //       patient_full_name: selectedPatient.patient_full_name,
  //       attending_dr: selectedPatient.attending_dr,
  //     });
  //     form.setFieldsValue({
  //       patient_id: selectedPatient.patient_id,
  //       patient_full_name: selectedPatient.patient_full_name,
  //       attending_dr: selectedPatient.attending_dr,
  //     });
  //   }
  //   return () => {
  //     clearPatientBasicInformationForm();
  //   };
  // }, [selectedPatient]);

  useEffect(() => {
    if (Object.entries(patientBasicHistoryDetail)?.length > 0) {
      const withIdPreganancyData =
        patientBasicHistoryDetail.preganancyData?.map((item, i) => {
          return {
            ...item,
            id: Math.random().toString().substring(2, 9),
            isDelete: UserData?.other === false ? true : false,
            sr_no: i + 1,
          };
        }) || [];
      setPrevTable(withIdPreganancyData);
      setBasicInfo({
        patient_id: patientBasicHistoryDetail?.patient_id,
        patient_full_name: patientBasicHistoryDetail?.patient_full_name,
        attending_dr: patientBasicHistoryDetail?.attending_dr,
        height: patientBasicHistoryDetail?.height,
        weight: patientBasicHistoryDetail?.weight,
        bmi: patientBasicHistoryDetail?.bmi,
        date_of_medical_history: moment(
          new Date(patientBasicHistoryDetail?.date_of_medical_history)
        ).format("DD/MM/YYYY"),
        patency_of_the_fallopian_tube_right:
          patientBasicHistoryDetail?.patency_of_the_fallopian_tube_right,
        patency_of_the_fallopian_tube_left:
          patientBasicHistoryDetail?.patency_of_the_fallopian_tube_left,
        chromosome_analysis: patientBasicHistoryDetail?.chromosome_analysis,
        fallopian_tube_reviewed:
          patientBasicHistoryDetail?.fallopian_tube_reviewed,
        type_of_infertility: patientBasicHistoryDetail?.type_of_infertility,
      });
      setPreviousTreatmentInfo({
        no_of_previous_ot: patientBasicHistoryDetail?.no_of_previous_ot,
        no_of_iui: patientBasicHistoryDetail?.no_of_iui,
        fet: patientBasicHistoryDetail?.fet,
        ivf_icsi: patientBasicHistoryDetail?.ivf_icsi,
        iuid: patientBasicHistoryDetail?.iuid,
        freeze_all: patientBasicHistoryDetail?.freeze_all,
        od: patientBasicHistoryDetail?.od,
        ed: patientBasicHistoryDetail?.ed,
        pgt: patientBasicHistoryDetail?.pgt,
        surrogacy: patientBasicHistoryDetail?.surrogacy,
      });
      setOtherDetailsInfo({
        previous_illnesses: patientBasicHistoryDetail?.previous_illnesses,
        sterility_factors: patientBasicHistoryDetail?.sterility_factors,
        notes: patientBasicHistoryDetail?.notes,
      });
      form.setFieldsValue({
        patient_id: patientBasicHistoryDetail?.patient_id,
        patient_full_name: patientBasicHistoryDetail?.patient_full_name,
        attending_dr: patientBasicHistoryDetail?.attending_dr,
        height: patientBasicHistoryDetail?.height,
        weight: patientBasicHistoryDetail?.weight,
        bmi: patientBasicHistoryDetail?.bmi,
        date_of_medical_history: dayjs(
          moment(patientBasicHistoryDetail?.date_of_medical_history).format(
            "DD/MM/YYYY"
          ),
          "DD/MM/YYYY"
        ),
        patency_of_the_fallopian_tube_right:
          patientBasicHistoryDetail?.patency_of_the_fallopian_tube_right,
        patency_of_the_fallopian_tube_left:
          patientBasicHistoryDetail?.patency_of_the_fallopian_tube_left,
        chromosome_analysis: patientBasicHistoryDetail?.chromosome_analysis,
        fallopian_tube_reviewed:
          patientBasicHistoryDetail?.fallopian_tube_reviewed,
        type_of_infertility: patientBasicHistoryDetail?.type_of_infertility,
        no_of_previous_ot: patientBasicHistoryDetail?.no_of_previous_ot,
        no_of_iui: patientBasicHistoryDetail?.no_of_iui,
        fet: patientBasicHistoryDetail?.fet,
        ivf_icsi: patientBasicHistoryDetail?.ivf_icsi,
        iuid: patientBasicHistoryDetail?.iuid,
        freeze_all: patientBasicHistoryDetail?.freeze_all,
        od: patientBasicHistoryDetail?.od,
        ed: patientBasicHistoryDetail?.ed,
        pgt: patientBasicHistoryDetail?.pgt,
        surrogacy: patientBasicHistoryDetail?.surrogacy,
        previous_illnesses: patientBasicHistoryDetail?.previous_illnesses,
        sterility_factors: patientBasicHistoryDetail?.sterility_factors,
        notes: patientBasicHistoryDetail?.notes,
      });
    }
    return () => {
      clearPatientBasicInformationForm();
    };
  }, [patientBasicHistoryDetail, selectedPatient]);
  const handleSubmit = useCallback(() => {
    if (Object.keys(isEditObj)?.length > 0) {
      let editedData = [...prevTable] || [];
      editedData =
        editedData?.map((item) => {
          if (item.id === isEditObj.id) {
            return {
              ...item,
              ...previousPregnanciesInfo,
            };
          }
          return item;
        }) || editedData;
      setPrevTable(editedData);
      setIsEditObj({});
      clearPreviousPregnanciesInfo();
    } else {
      setPrevTable([
        ...prevTable,
        {
          id: Math.random().toString().substring(2, 9),
          isDelete: true,
          ...previousPregnanciesInfo,
        },
      ]);
      clearPreviousPregnanciesInfo();
    }
  }, [
    clearPreviousPregnanciesInfo,
    isEditObj,
    prevTable,
    previousPregnanciesInfo,
  ]);
  const calculateBmi = useCallback((height, weight) => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      return bmi || "0.00";
    }
    return "";
  }, []);
  const handleChangeHeightWidth = useCallback(
    (name, value) => {
      const bmiValue =
        name === "height"
          ? calculateBmi(value, basicInfo.width)
          : calculateBmi(basicInfo.height, value);
      setBasicInfo({
        ...basicInfo,
        [name]: value,
        bmi: bmiValue,
      });
      bmiValue && form.setFieldsValue({ bmi: bmiValue });
    },
    [setBasicInfo, form, basicInfo, calculateBmi]
  );
  const clearPatientBasicInformationForm = useCallback(() => {
    setBasicInfo({
      patient_id: "",
      patient_full_name: "",
      attending_dr: "",
      height: "",
      weight: "",
      bmi: "",
      date_of_medical_history: null,
      patency_of_the_fallopian_tube_right: null,
      patency_of_the_fallopian_tube_left: null,
      chromosome_analysis: null,
      fallopian_tube_reviewed: "",
      type_of_infertility: null,
    });
    setPreviousPregnanciesInfo({
      sr_no: "",
      in_year: "",
      pregnancy_outcome: null,
      with_partner: null,
      child_died_perinatally: "",
      // previous_treatment: "",
      delivery_method: null,
      type_of_conception: null,
      pg_week: "",
      note: "",
    });
    setPrevTable([]);
    setPreviousTreatmentInfo({
      no_of_previous_ot: "",
      no_of_iui: "",
      fet: "",
      ivf_icsi: "",
      iuid: "",
      freeze_all: "",
      od: "",
      ed: "",
      pgt: "",
      surrogacy: "",
    });
    setOtherDetailsInfo({
      previous_illnesses: null,
      sterility_factors: null,
      notes: ""
    });
    form.setFieldsValue({
      patient_id: "",
      patient_full_name: "",
      attending_dr: "",
      height: "",
      weight: "",
      bmi: "",
      date_of_medical_history: null,
      patency_of_the_fallopian_tube_right: null,
      patency_of_the_fallopian_tube_left: null,
      chromosome_analysis: null,
      fallopian_tube_reviewed: "",
      type_of_infertility: null,
      sr_no: "",
      in_year: "",
      pregnancy_outcome: null,
      with_partner: null,
      child_died_perinatally: "",
      // previous_treatment: "",
      delivery_method: null,
      type_of_conception: null,
      pg_week: "",
      note: "",
      no_of_previous_ot: "",
      no_of_iui: "",
      fet: "",
      ivf_icsi: "",
      iuid: "",
      freeze_all: "",
      od: "",
      ed: "",
      pgt: "",
      surrogacy: "",
      previous_illnesses: null,
      sterility_factors: null,
    });
  }, [form]);
  const handleCancel = () => {
    clearPatientBasicInformationForm();
    dispatch(setSelectedPatient({}));
    dispatch(clearData());
  };

  // const selectProps = {
  //   sterilityFactorsOptions,
  //   onChange: setOtherDetailsInfo,
  // };

  // const sharedProps = {
  //   mode: "multiple",
  //   style: {
  //     width: "100%",
  //   },
  //   sterilityFactorsOptions,
  //   placeholder: "Select",
  //   maxTagCount: "responsive",
  // };
  return (
    <div className="page_main_content">
      <div className="page_inner_content">
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
                    <label>Attending Dr :</label>
                    <span>{selectedPatient?.attending_dr ? selectedPatient?.attending_dr : ""}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Basic Information</h3>
              <ul className="grid_wrapper">
                {/* <li className="w_250 w_xs_100">
                  <Form.Item
                    label="Patient ID"
                    name="patient_id"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Patient ID"
                      name="patient_id"
                      value={basicInfo?.patient_id}
                      onChange={(e) => {
                        setBasicInfo({
                          ...basicInfo,
                          patient_id: e.target.value,
                        });
                      }}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                {/* <li className="w_320 w_xs_100">
                  <Form.Item
                    label="Patient Name"
                    name="patient_full_name"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Patient Name"
                      name="patient_full_name"
                      value={basicInfo?.patient_full_name}
                      onChange={(e) => {
                        setBasicInfo({
                          ...basicInfo,
                          patient_full_name: e.target.value,
                        });
                      }}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                {/* <li className="w_320 w_xs_100">
                  <Form.Item
                    label="Attending Dr."
                    name="attending_dr"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Attending Dr."
                      name="attending_dr"
                      value={basicInfo?.attending_dr}
                      onChange={(e) => {
                        setBasicInfo({
                          ...basicInfo,
                          attending_dr: e.target.value,
                        });
                      }}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                <li className="w_180 w_xs_50">
                  <Form.Item
                    label="Height (cm)"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                    name="height"
                  >
                    <Input
                      placeholder="Enter Height (cm)"
                      name="height"
                      value={basicInfo?.height}
                      onChange={(e) => {
                        handleChangeHeightWidth("height", e.target.value);
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_180 w_xs_50">
                  <Form.Item
                    label="Weight (kg)"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                    name="weight"
                  >
                    <Input
                      placeholder="Enter Weight (kg)"
                      name="weight"
                      value={basicInfo?.weight}
                      onChange={(e) => {
                        handleChangeHeightWidth("weight", e.target.value);
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_180 w_xs_50">
                  <Form.Item
                    label="BMI"
                    // className="disabledInput"
                    name="bmi"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                    disabled
                  >
                    <Input
                      placeholder="Enter BMI"
                      disabled
                      value={basicInfo?.bmi}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_100">
                  <Form.Item
                    label="Date of Medical History"
                    name="date_of_medical_history"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <DatePicker
                      name="date_of_medical_history"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      value={dayjs(
                        basicInfo?.date_of_medical_history,
                        dateFormat
                      )}
                      onChange={(value) => {
                        setBasicInfo({
                          ...basicInfo,
                          date_of_medical_history: moment(
                            new Date(value)
                          ).format("YYYY-MM-DD"),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_320 w_xs_100">
                  <Form.Item
                    label="Patency of the Fallopian Tube (Right)"
                    name="patency_of_the_fallopian_tube_right"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
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
                      options={patencyOfTheFallopianTubeOptions}
                      name="patency_of_the_fallopian_tube_right"
                      value={basicInfo?.patency_of_the_fallopian_tube_right}
                      onChange={(value) => {
                        setBasicInfo({
                          ...basicInfo,
                          patency_of_the_fallopian_tube_right: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_320 w_xs_100">
                  <Form.Item
                    label="Patency of the Fallopian Tube (Left)"
                    name="patency_of_the_fallopian_tube_left"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
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
                      options={patencyOfTheFallopianTubeOptions}
                      name="patency_of_the_fallopian_tube_left"
                      value={basicInfo?.patency_of_the_fallopian_tube_left}
                      onChange={(value) => {
                        setBasicInfo({
                          ...basicInfo,
                          patency_of_the_fallopian_tube_left: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_320 w_xs_100">
                  <Form.Item
                    label="Chromosome Analysis"
                    name="chromosome_analysis"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
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
                      options={chromosomeAnalysisOptions}
                      name="chromosome_analysis"
                      value={basicInfo?.chromosome_analysis}
                      onChange={(value) => {
                        setBasicInfo({
                          ...basicInfo,
                          chromosome_analysis: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item
                    label="Fallopian Tube Reviewed (Yr)"
                    name="fallopian_tube_reviewed"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="--"
                      name="fallopian_tube_reviewed"
                      value={basicInfo?.fallopian_tube_reviewed}
                      onChange={(e) => {
                        setBasicInfo({
                          ...basicInfo,
                          fallopian_tube_reviewed: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_320 w_xs_100">
                  <Form.Item
                    label="Type of Infertility"
                    name="type_of_infertility"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
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
                        { value: "Primary", label: "Primary" },
                        { value: "Secondary", label: "Secondary" },
                      ]}
                      name="type_of_infertility"
                      value={basicInfo?.type_of_infertility}
                      onChange={(value) => {
                        setBasicInfo({
                          ...basicInfo,
                          type_of_infertility: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            {basicInfo?.type_of_infertility !== "Primary" && (
              <>
                <div className="form_info_wrapper filled">
                  <h3 className="mb-3">Previous Pregnancies</h3>
                  <ul className="grid_wrapper">
                    <li className="w_90 w_xs_50">
                      <Form.Item label="Sr. No." name="sr_no">
                        <Input
                          type="number"
                          placeholder="0"
                          name="sr_no"
                          value={previousPregnanciesInfo?.sr_no}
                          onChange={(e) => {
                            setPreviousPregnanciesInfo({
                              ...previousPregnanciesInfo,
                              sr_no: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_90 w_xs_50">
                      <Form.Item
                        label="In Year"
                        name="in_year"
                        rules={[
                          {
                            required: previousPregnanciesInfo?.sr_no
                              ? true
                              : false,
                            message: "",
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          placeholder="0"
                          name="in_year"
                          value={previousPregnanciesInfo?.in_year}
                          onChange={(e) => {
                            setPreviousPregnanciesInfo({
                              ...previousPregnanciesInfo,
                              in_year: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_270 w_xs_100">
                      <Form.Item
                        label="Pregnancy Outcome"
                        name="pregnancy_outcome"
                        className="custom_select"
                        rules={[
                          {
                            required: previousPregnanciesInfo?.sr_no
                              ? true
                              : false,
                            message: "",
                          },
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
                          options={pregnancyOutcomeOptions}
                          dropdownMatchSelectWidth={false}
                          name="pregnancy_outcome"
                          value={previousPregnanciesInfo?.pregnancy_outcome}
                          onChange={(value) => {
                            setPreviousPregnanciesInfo({
                              ...previousPregnanciesInfo,
                              pregnancy_outcome: value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_220 w_xs_100">
                      <Form.Item
                        label="With Partner"
                        name="with_partner"
                        className="custom_select"
                        rules={[
                          {
                            required: previousPregnanciesInfo?.sr_no
                              ? true
                              : false,
                            message: "",
                          },
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
                          options={withPartnerOptions}
                          name="with_partner"
                          value={previousPregnanciesInfo?.with_partner}
                          onChange={(value) => {
                            setPreviousPregnanciesInfo({
                              ...previousPregnanciesInfo,
                              with_partner: value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_300 w_xs_100">
                      <Form.Item
                        label="Delivery Method"
                        name="delivery_method"
                        className="custom_select"
                        rules={[
                          {
                            required: previousPregnanciesInfo?.sr_no
                              ? true
                              : false,
                            message: "",
                          },
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
                          options={deliveryMethodOptions}
                          name="delivery_method"
                          value={previousPregnanciesInfo?.delivery_method}
                          onChange={(value) => {
                            setPreviousPregnanciesInfo({
                              ...previousPregnanciesInfo,
                              delivery_method: value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_120 w_xs_100">
                      <Form.Item
                        label="PG Week"
                        name="pg_week"
                        rules={[
                          {
                            required: previousPregnanciesInfo?.sr_no
                              ? true
                              : false,
                            message: "",
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          placeholder="0"
                          name="pg_week"
                          value={previousPregnanciesInfo?.pg_week}
                          onChange={(e) => {
                            setPreviousPregnanciesInfo({
                              ...previousPregnanciesInfo,
                              pg_week: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_190 w_xs_100">
                      <Form.Item
                        label="Child Died Perinatally"
                        name="child_died_perinatally"
                        rules={[
                          {
                            required: previousPregnanciesInfo?.sr_no
                              ? true
                              : false,
                            message: "",
                          },
                        ]}
                      >
                        <Input
                          placeholder="--"
                          name="child_died_perinatally"
                          value={
                            previousPregnanciesInfo?.child_died_perinatally
                          }
                          onChange={(e) => {
                            setPreviousPregnanciesInfo({
                              ...previousPregnanciesInfo,
                              child_died_perinatally: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_180 w_xs_100">
                      <Form.Item
                        label="Type of Conception"
                        name="type_of_conception"
                        className="custom_select"
                        rules={[
                          {
                            required: previousPregnanciesInfo?.sr_no
                              ? true
                              : false,
                            message: "",
                          },
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
                            { value: "Natural", label: "Natural" },
                            { value: "IUI", label: "IUI" },
                            { value: "IVF", label: "IVF" },
                          ]}
                          name="type_of_conception"
                          value={previousPregnanciesInfo?.type_of_conception}
                          onChange={(value) => {
                            setPreviousPregnanciesInfo({
                              ...previousPregnanciesInfo,
                              type_of_conception: value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    {/* <li className="w_190 w_xs_100">
                      <Form.Item
                        label="Previous Treatment"
                        name="previous_treatment"
                        rules={[
                          {
                            required: previousPregnanciesInfo?.sr_no
                              ? true
                              : false,
                            message: "",
                          },
                        ]}
                      >
                        <Input
                          placeholder="--"
                          name="previous_treatment"
                          value={previousPregnanciesInfo?.previous_treatment}
                          onChange={(e) => {
                            setPreviousPregnanciesInfo({
                              ...previousPregnanciesInfo,
                              previous_treatment: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li> */}
                    <li className="w_370 w_xs_100">
                      <Form.Item label="Note" name="note">
                        <Input
                          placeholder="Type here"
                          name="note"
                          value={previousPregnanciesInfo?.note}
                          onChange={(e) => {
                            setPreviousPregnanciesInfo({
                              ...previousPregnanciesInfo,
                              note: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_120 w_xs_50 align-self-end">
                      {Object.keys(isEditObj)?.length > 0
                        ? (userType === 1 || moduleDetail?.edit) && (
                          <Button
                            className="btn_primary mb24"
                            disabled={isAddBtnStatus()}
                            onClick={handleSubmit}
                          >
                            Edit
                          </Button>
                        )
                        : (userType === 1 || moduleDetail?.create) && (
                          <Button
                            className="btn_primary mb24"
                            disabled={isAddBtnStatus()}
                            onClick={handleSubmit}
                          >
                            Add
                          </Button>
                        )}
                    </li>
                  </ul>
                  <div className="cmn_table_wrap pb-4">
                    <Table
                      columns={columns}
                      dataSource={prevTable}
                      pagination={false}
                    />
                  </div>
                </div>
                <div className="form_info_wrapper filled">
                  <h3 className="mb-3">Previous Treatment</h3>
                  <ul className="grid_wrapper">
                    <li className="w_180 w_xs_100">
                      <Form.Item
                        label="No. of Previous OT"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                        name="no_of_previous_ot"
                      >
                        <Input
                          type="number"
                          placeholder="0"
                          name="no_of_previous_ot"
                          value={previousTreatmentInfo?.no_of_previous_ot}
                          onChange={(e) => {
                            setPreviousTreatmentInfo({
                              ...previousTreatmentInfo,
                              no_of_previous_ot: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_180 w_xs_50">
                      <Form.Item
                        label="No. of IUI"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                        name="no_of_iui"
                      >
                        <Input
                          type="number"
                          placeholder="0"
                          name="no_of_iui"
                          value={previousTreatmentInfo?.no_of_iui}
                          onChange={(e) => {
                            setPreviousTreatmentInfo({
                              ...previousTreatmentInfo,
                              no_of_iui: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_180 w_xs_50">
                      <Form.Item
                        label="FET"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                        name="fet"
                      >
                        <Input
                          type="number"
                          placeholder="0"
                          name="fet"
                          value={previousTreatmentInfo?.fet}
                          onChange={(e) => {
                            setPreviousTreatmentInfo({
                              ...previousTreatmentInfo,
                              fet: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_180 w_xs_50">
                      <Form.Item
                        label="IVF / ICSI"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                        name="ivf_icsi"
                      >
                        <Input
                          type="number"
                          placeholder="0"
                          name="ivf_icsi"
                          value={previousTreatmentInfo?.ivf_icsi}
                          onChange={(e) => {
                            setPreviousTreatmentInfo({
                              ...previousTreatmentInfo,
                              ivf_icsi: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_180 w_xs_50">
                      <Form.Item
                        label="IUID"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                        name="iuid"
                      >
                        <Input
                          type="number"
                          placeholder="0"
                          name="iuid"
                          value={previousTreatmentInfo?.iuid}
                          onChange={(e) => {
                            setPreviousTreatmentInfo({
                              ...previousTreatmentInfo,
                              iuid: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_180 w_xs_50">
                      <Form.Item
                        label="Freeze All"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                        name="freeze_all"
                      >
                        <Input
                          type="number"
                          placeholder="0"
                          name="freeze_all"
                          value={previousTreatmentInfo?.freeze_all}
                          onChange={(e) => {
                            setPreviousTreatmentInfo({
                              ...previousTreatmentInfo,
                              freeze_all: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_180 w_xs_50">
                      <Form.Item
                        label="OD"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                        name="od"
                      >
                        <Input
                          type="number"
                          placeholder="0"
                          name="od"
                          value={previousTreatmentInfo?.od}
                          onChange={(e) => {
                            setPreviousTreatmentInfo({
                              ...previousTreatmentInfo,
                              od: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_180 w_xs_50">
                      <Form.Item
                        label="ED"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                        name="ed"
                      >
                        <Input
                          type="number"
                          placeholder="0"
                          name="ed"
                          value={previousTreatmentInfo?.ed}
                          onChange={(e) => {
                            setPreviousTreatmentInfo({
                              ...previousTreatmentInfo,
                              ed: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_180 w_xs_50">
                      <Form.Item
                        label="PGT"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                        name="pgt"
                      >
                        <Input
                          type="number"
                          placeholder="0"
                          name="pgt"
                          value={previousTreatmentInfo?.pgt}
                          onChange={(e) => {
                            setPreviousTreatmentInfo({
                              ...previousTreatmentInfo,
                              pgt: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_180 w_xs_50">
                      <Form.Item
                        label="Surrogacy"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                        name="surrogacy"
                      >
                        <Input
                          type="number"
                          placeholder="0"
                          name="surrogacy"
                          value={previousTreatmentInfo?.surrogacy}
                          onChange={(e) => {
                            setPreviousTreatmentInfo({
                              ...previousTreatmentInfo,
                              surrogacy: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                  </ul>
                </div>
                <div className="form_info_wrapper filled">
                  <h3 className="mb-3">Other Details</h3>
                  <Row>
                    <Col md={3}>
                      <Form.Item
                        label="Previous Illnesses"
                        name="previous_illnesses"
                        className="custom_select"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
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
                          name="previous_illnesses"
                          mode="multiple"
                          maxTagCount="responsive"
                          options={previousIllnessesOptions}
                          value={otherDetailsInfo?.previous_illnesses}
                          onChange={(value) => {
                            setOtherDetailsInfo({
                              ...otherDetailsInfo,
                              previous_illnesses: value,
                            });
                          }}
                          maxTagPlaceholder={(omittedValues) => (
                            <Tooltip
                              title={omittedValues
                                .map(({ label }) => label)
                                .join(", ")}
                            >
                              <span>Hover Me</span>
                            </Tooltip>
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col md={5}>
                      {/* <Form.Item
                        label="Sterility Factors"
                        name="sterility_factors"
                        className="custom_select"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select"
                          options={sterilityFactorsOptions}
                          name="sterility_factors"
                          value={otherDetailsInfo?.sterility_factors}
                          onChange={(value) => {
                            setOtherDetailsInfo({
                              ...otherDetailsInfo,
                              sterility_factors: value,
                            });
                          }}
                        />
                      </Form.Item> */}
                      <Form.Item
                        label="Sterility Factors"
                        name="sterility_factors"
                        className="custom_select"
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
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
                          name="sterility_factors"
                          mode="multiple"
                          maxTagCount="responsive"
                          options={sterilityFactorsOptions}
                          value={otherDetailsInfo?.sterility_factors}
                          onChange={(value) => {
                            setOtherDetailsInfo({
                              ...otherDetailsInfo,
                              sterility_factors: value,
                            });
                          }}
                          maxTagPlaceholder={(omittedValues) => (
                            <Tooltip
                              title={omittedValues
                                .map(({ label }) => label)
                                .join(", ")}
                            >
                              <span>Hover Me</span>
                            </Tooltip>
                          )}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <div className="form_info_wrapper filled">
                  <h3 className="mb-3">Notes</h3>
                  <div>
                    <Form.Item name="notes">
                      <TextArea
                        rows={4}
                        name="notes"
                        value={otherDetailsInfo?.notes}
                        onChange={(e) => {
                          setOtherDetailsInfo({
                            ...otherDetailsInfo,
                            notes: e.target.value,
                          });
                        }}
                        placeholder="Notes"
                      />
                    </Form.Item>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {Object.keys(patientBasicHistoryDetail)?.length > 0
              ? (userType === 1 || moduleDetail?.edit) && (
                <Button className="btn_primary me-3" htmlType="submit">
                  Update
                </Button>
              )
              : (userType === 1 || moduleDetail?.create) && (
                <Button className="btn_primary me-3" htmlType="submit">
                  Save
                </Button>
              )}
            <Button className="btn_gray" onClick={handleCancel}>
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
