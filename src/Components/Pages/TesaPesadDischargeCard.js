import { Button, DatePicker, Form, Input, Select, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ageCalculatorFunc } from "utils/CommonFunctions";
import moment from "moment";
import {
  createTesaPesaDischargeCard,
  editTesaPesaDischargeCard,
  getTesaPesaDischargeCard,
  printTesaPesadDischargeCardData,
  setTesaPesaDischargeCardDetails,
} from "redux/reducers/TesaPesaDischargeCard/tesaPesaDischargeCard.slice";
import { useLocation } from "react-router-dom";
import {
  setIvfIdListData,
  setSelectedPatient,
} from "redux/reducers/common.slice";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { clearData, getGlobalSearch } from "redux/reducers/SearchPanel/globalSearch.slice";
const patientDetailsInitialState = {
  // patient_id: "",
  // patient_full_name: "",
  // age: "",
  // partner_full_name: "",
};
const tesaPesadCardDataInitialState = {
  ivf_flow_id: "",
  ms: "",
  doa: "",
  dod: "",
  icd_code: "",
  icd_description: null,
  chief_complaints: "",
  clinical_data: "",
  relevant_investigations: "",
  procedures_performed: "",
  treatment_given: "",
  modication_adviced: "",
  condition_of_patient: "",
  follow_up_advice: "",
  other_instructions: "",
  urgent_care: "",
  result_of_procedure: "",
  biopsy_result: "",
  notes: ""

};
export default function TesaPesadDischargeCard() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [form] = Form.useForm();
  const { selectedPatient, ivfIdListData } = useSelector(
    ({ common }) => common
  );
  const { moduleList, userType, selectedLocation } = useSelector(
    ({ role }) => role
  );
  const { tesaPesaDischargeCardDetails, tesaPesaDischargeCardLoading } =
    useSelector(({ tesaPesaDischargeCard }) => tesaPesaDischargeCard);
  const selectedModule = useMemo(() => {
    return (
      moduleList?.find((item) => item?.module_name === location?.pathname) || {}
    );
  }, [moduleList, location?.pathname]);
  const [ivfIdOption, setIvfIdOption] = useState([]);
  const [patientDetails, setPatientDetails] = useState(
    patientDetailsInitialState
  );
  const [tesaPesadCardData, setTesaPesadCardData] = useState(
    tesaPesadCardDataInitialState
  );

  useEffect(() => {
    if (Object.keys(selectedPatient)?.length > 0) {
      setIvfIdOption(ivfIdListData);
      // const PatientAge = ageCalculatorFunc(selectedPatient?.patient_dob) || "";
      const PartnerAge = ageCalculatorFunc(selectedPatient?.partner_dob) || "";
      setPatientDetails({
        // patient_id: selectedPatient?.patient_id || "",
        // patient_full_name: selectedPatient?.patient_full_name || "",
        // age: PatientAge,
        // partner_full_name: selectedPatient?.patient_full_name || "",
        partner_age: PartnerAge,
      });
      form.setFieldsValue({
        // patient_id: selectedPatient?.patient_id || "",
        // patient_full_name: selectedPatient?.patient_full_name || "",
        // age: PatientAge,
        // partner_full_name: selectedPatient?.patient_full_name || "",
        partner_age: PartnerAge,
      });
      return () => {
        clearTesaPesaDischargeCard();
        setIvfIdOption([]);
        dispatch(setTesaPesaDischargeCardDetails({}));
      };
    }
  }, [form, selectedPatient]);

  useEffect(() => {
    if (ivfIdListData?.length > 0 && Object.keys(selectedPatient)?.length > 0) {
      setTesaPesadCardData({
        ...tesaPesadCardData,
        ivf_flow_id: ivfIdListData[0]?.value || "",
      });
      form.setFieldsValue({
        ivf_flow_id: ivfIdListData[0]?.value || "",
      });
    }
  }, [form, ivfIdListData]);

  useEffect(() => {
    if (
      selectedPatient?._id &&
      selectedModule?._id &&
      tesaPesadCardData?.ivf_flow_id
    ) {
      dispatch(
        getTesaPesaDischargeCard({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
          ivf_flow_id: tesaPesadCardData?.ivf_flow_id,
        })
      );
    }
  }, [tesaPesadCardData?.ivf_flow_id, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTesaPesadCardData({
      ...tesaPesadCardData,
      [name]: value,
    });
  };

  const clearTesaPesaDischargeCard = useCallback(() => {
    setPatientDetails(patientDetailsInitialState);
    setTesaPesadCardData(tesaPesadCardDataInitialState);
    setIvfIdOption([]);
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (Object.keys(tesaPesaDischargeCardDetails)?.length > 0) {
      setTesaPesadCardData({
        ivf_flow_id: tesaPesaDischargeCardDetails?.ivf_flow_id,
        doa: tesaPesaDischargeCardDetails?.doa
          ? dayjs(
            moment(tesaPesaDischargeCardDetails?.doa).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        dod: tesaPesaDischargeCardDetails?.dod
          ? dayjs(
            moment(tesaPesaDischargeCardDetails?.dod).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        icd_code: tesaPesaDischargeCardDetails?.icd_code,
        icd_description: tesaPesaDischargeCardDetails?.icd_description || null,
        chief_complaints: tesaPesaDischargeCardDetails?.chief_complaints,
        clinical_data: tesaPesaDischargeCardDetails?.clinical_data,
        relevant_investigations:
          tesaPesaDischargeCardDetails?.relevant_investigations,
        procedures_performed:
          tesaPesaDischargeCardDetails?.procedures_performed,
        treatment_given: tesaPesaDischargeCardDetails?.treatment_given,
        modication_adviced: tesaPesaDischargeCardDetails?.modication_adviced,
        condition_of_patient:
          tesaPesaDischargeCardDetails?.condition_of_patient,
        follow_up_advice: tesaPesaDischargeCardDetails?.follow_up_advice,
        other_instructions: tesaPesaDischargeCardDetails?.other_instructions,
        urgent_care: tesaPesaDischargeCardDetails?.urgent_care,
        result_of_procedure: tesaPesaDischargeCardDetails?.result_of_procedure,
        biopsy_result: tesaPesaDischargeCardDetails?.biopsy_result,
        notes: tesaPesaDischargeCardDetails?.notes,
      });
      form.setFieldsValue({
        ivf_flow_id: tesaPesaDischargeCardDetails?.ivf_flow_id,
        doa: tesaPesaDischargeCardDetails?.doa
          ? dayjs(
            moment(tesaPesaDischargeCardDetails?.doa).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        dod: tesaPesaDischargeCardDetails?.dod
          ? dayjs(
            moment(tesaPesaDischargeCardDetails?.dod).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : "",
        icd_code: tesaPesaDischargeCardDetails?.icd_code,
        icd_description: tesaPesaDischargeCardDetails?.icd_description || null,
        chief_complaints: tesaPesaDischargeCardDetails?.chief_complaints,
        clinical_data: tesaPesaDischargeCardDetails?.clinical_data,
        relevant_investigations:
          tesaPesaDischargeCardDetails?.relevant_investigations,
        procedures_performed:
          tesaPesaDischargeCardDetails?.procedures_performed,
        treatment_given: tesaPesaDischargeCardDetails?.treatment_given,
        modication_adviced: tesaPesaDischargeCardDetails?.modication_adviced,
        condition_of_patient:
          tesaPesaDischargeCardDetails?.condition_of_patient,
        follow_up_advice: tesaPesaDischargeCardDetails?.follow_up_advice,
        other_instructions: tesaPesaDischargeCardDetails?.other_instructions,
        urgent_care: tesaPesaDischargeCardDetails?.urgent_care,
        result_of_procedure: tesaPesaDischargeCardDetails?.result_of_procedure,
        biopsy_result: tesaPesaDischargeCardDetails?.biopsy_result,
        notes: tesaPesaDischargeCardDetails?.notes,
      });
    }
  }, [form, tesaPesaDischargeCardDetails]);

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

  const createTesaPesaDischargeCardfunc = useCallback(
    async (obj) => {
      const { payload } = await dispatch(
        createTesaPesaDischargeCard({
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
    if (tesaPesadCardData?.ivf_flow_id) {
      if (Object.keys(tesaPesaDischargeCardDetails)?.length > 0) {
        dispatch(
          editTesaPesaDischargeCard({
            location_id: selectedLocation,
            _id: tesaPesaDischargeCardDetails?._id,
            module_id: selectedModule?._id,
            payload: tesaPesadCardData,
          })
        );
      } else {
        createTesaPesaDischargeCardfunc(tesaPesadCardData)
        // dispatch(
        //   createTesaPesaDischargeCard({
        //     location_id: selectedLocation,
        //     patient_reg_id: selectedPatient?._id,
        //     module_id: selectedModule?._id,
        //     payload: tesaPesadCardData,
        //   })
        // );
      }
    } else {
      toast.error("IVF id Is Not Generated");
    }
  };

  const onFinishFailed = (errorInfo) => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearBtn = () => {
    clearTesaPesaDischargeCard();
    dispatch(setSelectedPatient({}));
    dispatch(setIvfIdListData([]));
    dispatch(clearData());
  };

  const printTesaPesadDischargeCard = useCallback(async () => {
    if (Object.entries(tesaPesaDischargeCardDetails).length > 0 &&
      Object.entries(selectedPatient).length > 0) {
      dispatch(
        printTesaPesadDischargeCardData({
          moduleId: selectedModule?._id,
          patientRegId: selectedPatient?._id,
          ivfFlowId: tesaPesaDischargeCardDetails?.ivf_flow_id,
        })
      );
    }
  }, [tesaPesaDischargeCardDetails, dispatch, selectedModule, selectedPatient]);

  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {tesaPesaDischargeCardLoading && (
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
                    <label>Partner Name :</label>
                    <span>{selectedPatient?.patient_full_name ? selectedPatient?.patient_full_name : ""}</span>
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
                      disabled
                      placeholder="Enter Patient ID"
                      value={patientDetails?.patient_id}
                      name="patient_id"
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
                      value={tesaPesadCardData?.ivf_flow_id}
                      onChange={(value) => {
                        form.setFieldsValue(tesaPesadCardDataInitialState);
                        form.setFieldsValue({ ivf_flow_id: value });
                        setTesaPesadCardData({
                          ivf_flow_id: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
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
                      value={patientDetails?.age}
                      name="age"
                      disabled
                    />
                  </Form.Item>
                </li> */}
                {/* <li className="w_330 w_xs_50">
                  <Form.Item label="Partner Name" name="partner_full_name">
                    <Input
                      name="partner_full_name"
                      placeholder="Enter Partner Name"
                      value={patientDetails?.partner_full_name}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                {/* <li className="w_150 w_xs_50">
                  <Form.Item label="Age" name="partner_age">
                    <Input
                      placeholder="Enter Age"
                      value={patientDetails?.partner_age}
                      name="partner_age"
                      disabled
                    />
                  </Form.Item>
                </li> */}
                <li className="w_150 w_xs_50">
                  <Form.Item label="M.S" name="ms">
                    <Input
                      name="ms"
                      placeholder="Enter M.S"
                      value={tesaPesadCardData?.ms}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="DOA" name="doa">
                    <DatePicker
                      placeholder="Select Date"
                      name="doa"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      onChange={(e) => {
                        setTesaPesadCardData({
                          ...tesaPesadCardData,
                          doa: moment(new Date(e)).format("YYYY/MM/DD"),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="DOD" name="dod">
                    <DatePicker
                      placeholder="Select Date"
                      name="dod"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      onChange={(e) => {
                        setTesaPesadCardData({
                          ...tesaPesadCardData,
                          dod: moment(new Date(e)).format("YYYY/MM/DD"),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Final Diagnosis Details</h3>
              <ul className="grid_wrapper">
                <li className="w_250 w_xs_50">
                  <Form.Item label="ICD Code" name="icd_code">
                    <Input
                      name="icd_code"
                      placeholder="Enter ICD Code"
                      value={tesaPesadCardData?.icd_code}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_50">
                  <Form.Item
                    label="ICD Description"
                    name="icd_description"
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
                      name="icd_description"
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
                      ]}
                      value={tesaPesadCardData?.diagnosis}
                      onChange={(value) => {
                        setTesaPesadCardData({
                          ...tesaPesadCardData,
                          icd_description: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
              <ul className="grid_wrapper">
                <li className="w_25 w_xs_100">
                  <Form.Item name="chief_complaints" label="Chief Complaints">
                    <TextArea
                      rows={4}
                      name="chief_complaints"
                      placeholder="Enter Chief Complaints"
                      className="with_arrow"
                      value={tesaPesadCardData?.chief_complaints}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="clinical_data"
                    label="Significant Findings Clinical Data"
                  >
                    <TextArea
                      rows={4}
                      name="clinical_data"
                      placeholder="Enter Significant Findings Clinical Data"
                      className="with_arrow"
                      value={tesaPesadCardData?.clinical_data}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="relevant_investigations"
                    label="Relevant Investigations"
                  >
                    <TextArea
                      rows={4}
                      name="relevant_investigations"
                      placeholder="Enter Relevant Investigations"
                      className="with_arrow"
                      value={tesaPesadCardData?.relevant_investigations}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="procedures_performed"
                    label="Procedures Performed"
                  >
                    <TextArea
                      rows={4}
                      name="procedures_performed"
                      placeholder="Enter Procedures Performed"
                      className="with_arrow"
                      value={tesaPesadCardData?.procedures_performed}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item name="treatment_given" label="Treatment Given">
                    <TextArea
                      rows={4}
                      name="treatment_given"
                      placeholder="Enter Treatment Given"
                      className="with_arrow"
                      value={tesaPesadCardData?.treatment_given}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="modication_adviced"
                    label="Modication Advised on Discharge"
                  >
                    <TextArea
                      rows={4}
                      name="modication_adviced"
                      placeholder="Enter Modication Advised on Discharge"
                      className="with_arrow"
                      value={tesaPesadCardData?.modication_adviced}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="condition_of_patient"
                    label="Condition of Patient at Discharge"
                  >
                    <TextArea
                      rows={4}
                      name="condition_of_patient"
                      placeholder="Enter Condition of Patient at Discharge"
                      className="with_arrow"
                      value={tesaPesadCardData?.condition_of_patient}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item name="follow_up_advice" label="Follow Up Advice">
                    <TextArea
                      rows={4}
                      name="follow_up_advice"
                      placeholder="Enter Follow Up Advice"
                      className="with_arrow"
                      value={tesaPesadCardData?.follow_up_advice}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="other_instructions"
                    label="Other Instructions"
                  >
                    <TextArea
                      rows={4}
                      name="other_instructions"
                      placeholder="Enter Other Instructions"
                      className="with_arrow"
                      value={tesaPesadCardData?.follow_up_advice}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="urgent_care"
                    label="When to Obtain Urgent Care"
                  >
                    <TextArea
                      rows={4}
                      name="urgent_care"
                      placeholder="Enter When to Obtain Urgent Care"
                      className="with_arrow"
                      value={tesaPesadCardData?.urgent_care}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="result_of_procedure"
                    label="Final Result of Procedure"
                  >
                    <TextArea
                      rows={4}
                      name="result_of_procedure"
                      placeholder="Enter Final Result of Procedure"
                      className="with_arrow"
                      value={tesaPesadCardData?.result_of_procedure}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item name="biopsy_result" label="Biopsy Result">
                    <TextArea
                      rows={4}
                      name="biopsy_result"
                      placeholder="Enter Biopsy Result"
                      className="with_arrow"
                      value={tesaPesadCardData?.biopsy_result}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Notes</h3>
              <div>
                <Form.Item name="notes">
                  <TextArea
                    rows={4}
                    name="notes"
                    placeholder="Notes"
                    value={tesaPesadCardData?.notes}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {Object.keys(tesaPesaDischargeCardDetails)?.length > 0
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
              disabled={
                Object.entries(tesaPesaDischargeCardDetails).length === 0
              }
              className="btn_print mx-3"
              onClick={() => {
                Object.entries(tesaPesaDischargeCardDetails).length > 0 &&
                  printTesaPesadDischargeCard();
              }}
            >
              Print
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
