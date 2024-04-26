import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Form, Input, Popconfirm, Select, Spin, TimePicker } from "antd";
import { InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  IUI_with,
  bloodGroupOptions,
  collectionOptions,
  completeCollectionOptions,
  debriesOptions,
  frozen_sample,
  referringClinicOptions,
  visualAppearance,
} from "utils/FieldValues";
import {
  createIuiHDData,
  editIuiHDData,
  getIuiHDData,
  printIuiHDData,
  setIuiHDAddData,
  setIuiHDDetails,
} from "redux/reducers/IuiHD/iuiHDData.slice";
import { getAttendingDrList, setSelectedPatient } from "redux/reducers/common.slice";
import { clearData, getGlobalSearch } from "redux/reducers/SearchPanel/globalSearch.slice";
import { ageCalculate } from "utils/CommonFunctions";
import moment from "moment";
import dayjs from "dayjs";

const IuiHDInitialData = {
  collections: null,
  complete_collection: null,
  rec_no: "",
  date: null,
  refer_clinic: null,
  method_collection: "Masturbation",
  abstinance_period: "",
  collection_time: "",
  assay_time: "",
  iui_with: null,
  blood_group_husband_donor: null,
  frozen_sample: null,
  ejaculate_volume: "",
  liquification_time: "",
  visual_appeareance: "",
  viscosity: null,
  pus_cells_leucocytes: "",
  debries: null,
  normal_forms: "",
  prelim_concentration: "",
  prelim_total_motile: "",
  prelim_all_progressive: "",
  prelim_rapid_progressive: "",
  prelim_slow_progressive: "",
  prelim_non_progressive: "",
  prelim_immotile: "",
  preparation_method_media: "",
  batch_no: "",
  exp_date: null,
  insemination_volume: "",
  subsequent_concentration: "",
  subsequent_total_motile: "",
  subsequent_all_progressive: "",
  subsequent_rapid_progressive: "",
  subsequent_slow_progressive: "",
  subsequent_non_progressive: "",
  subsequent_immotile: "",
  prepared_by: "",
  approved_by: "",
  notes: "",
  inseminated_by: "",
};

const IuiHD = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const [iuiHDData, setIuiHDData] = useState(IuiHDInitialData);
  const { moduleList, userType, selectedLocation } = useSelector(({ role }) => role);
  const { selectedPatient, attendingDrList } = useSelector(({ common }) => common);
  const { iuiHDDetails, iuiHDDataLoading, iIuiHDDataUpdate } = useSelector(({ iuiHDDataStore }) => iuiHDDataStore);
  const [doctorList, setDoctorList] = useState([]);

  const selectedModule = useMemo(() => {
    let module = moduleList?.find((mod) => mod.module_name === location?.pathname);
    if (!module) {
      moduleList.forEach((mod) => {
        if (mod.submenu) {
          const subModule = mod.submenu.find((sub) => sub.module_name === location?.pathname);
          if (subModule) {
            // module = { ...subModule };
            module = mod;
          }
        }
      });
    }
    return module ? module : null;
  }, [moduleList, location?.pathname]);
  const clearIuiHD = useCallback(() => {
    setIuiHDData(IuiHDInitialData);
    dispatch(setIuiHDDetails({}));
    form.resetFields();
  }, [form, dispatch]);

  useEffect(() => {
    if (Object.keys(selectedPatient).length > 0) {
      dispatch(getAttendingDrList());
    }
  }, [dispatch, selectedPatient]);
  useEffect(() => {
    if (Object.entries(attendingDrList)?.length > 0) {
      setDoctorList(
        attendingDrList.map((item, index) => ({
          value: item._id,
          label: item.user_name,
        })),
      );
    }
  }, [dispatch, attendingDrList]);

  useEffect(() => {
    form.setFieldsValue({
      male_partner: selectedPatient?.partner_full_name || "",
      age_male: selectedPatient?.partner_dob ? ageCalculate(selectedPatient?.partner_dob) : "",
      female_partner: selectedPatient?.patient_full_name || "",
      age_female: selectedPatient?.patient_dob ? ageCalculate(selectedPatient?.patient_dob) : "",
      pt_id: selectedPatient?.patient_id || "",
    })
  }, [form, selectedPatient])


  useEffect(() => {
    if (selectedLocation &&
      Object.keys(selectedPatient)?.length > 0 &&
      Object.keys(selectedModule)?.length > 0 &&
      Object.keys(iuiHDDetails)?.length === 0
    ) {
      dispatch(
        getIuiHDData({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
        })
      );
    }
    return () => {
      clearIuiHD();
    };
  }, [selectedPatient, selectedLocation]);

  useEffect(() => {
    if (Object.keys(iuiHDDetails)?.length > 0) {
      setIuiHDData({
        collections: iuiHDDetails?.collections || null,
        complete_collection: iuiHDDetails?.complete_collection || null,
        rec_no: iuiHDDetails?.rec_no || "",
        date: iuiHDDetails?.date ? moment(iuiHDDetails?.date).format("YYYY-MM-DD") : null,
        refer_clinic: iuiHDDetails?.refer_clinic || null,
        method_collection: iuiHDDetails?.method_collection || "",
        abstinance_period: iuiHDDetails?.abstinance_period || "",
        collection_time: iuiHDDetails?.collection_time
          ? dayjs(iuiHDDetails?.collection_time, "HH:mm:ss").format("HH:mm:ss")
          : null,
        assay_time: iuiHDDetails?.assay_time ? dayjs(iuiHDDetails?.assay_time, "HH:mm:ss").format("HH:mm:ss") : null,
        iui_with: iuiHDDetails?.iui_with || null,
        blood_group_husband_donor: iuiHDDetails?.blood_group_husband_donor || null,
        frozen_sample: iuiHDDetails?.frozen_sample || null,
        ejaculate_volume: iuiHDDetails?.ejaculate_volume || "",
        liquification_time: iuiHDDetails?.liquification_time || "",
        visual_appeareance: iuiHDDetails?.visual_appeareance || "",
        viscosity: iuiHDDetails?.viscosity || null,
        pus_cells_leucocytes: iuiHDDetails?.pus_cells_leucocytes || "",
        debries: iuiHDDetails?.debries || null,
        normal_forms: iuiHDDetails?.normal_forms || "",
        prelim_concentration: iuiHDDetails?.prelim_concentration || "",
        prelim_total_motile: iuiHDDetails?.prelim_total_motile || "",
        prelim_all_progressive: iuiHDDetails?.prelim_all_progressive || "",
        prelim_rapid_progressive: iuiHDDetails?.prelim_rapid_progressive || "",
        prelim_slow_progressive: iuiHDDetails?.prelim_slow_progressive || "",
        prelim_non_progressive: iuiHDDetails?.prelim_non_progressive || "",
        prelim_immotile: iuiHDDetails?.prelim_immotile || "",
        preparation_method_media: iuiHDDetails?.preparation_method_media || "",
        batch_no: iuiHDDetails?.batch_no || "",
        exp_date: iuiHDDetails?.exp_date ? moment(iuiHDDetails?.exp_date).format("YYYY-MM-DD") : null,
        insemination_volume: iuiHDDetails?.insemination_volume || "",
        subsequent_concentration: iuiHDDetails?.subsequent_concentration || "",
        subsequent_total_motile: iuiHDDetails?.sub || "",
        subsequent_all_progressive: iuiHDDetails?.subsequent_all_progressive || "",
        subsequent_rapid_progressive: iuiHDDetails?.subsequent_rapid_progressive || "",
        subsequent_slow_progressive: iuiHDDetails?.subsequent_non_progressive || "",
        subsequent_non_progressive: iuiHDDetails?.subsequent_non_progressive || "",
        subsequent_immotile: iuiHDDetails?.subsequent_immotile || "",
        prepared_by: iuiHDDetails?.prepared_by || "",
        approved_by: iuiHDDetails?.approved_by || "",
        notes: iuiHDDetails?.notes || "",
        inseminated_by: iuiHDDetails?.inseminated_by || "",
      });
      form.setFieldsValue({
        collections: iuiHDDetails?.collections || null,
        complete_collection: iuiHDDetails?.complete_collection || null,
        rec_no: iuiHDDetails?.rec_no || "",
        date: iuiHDDetails?.date ? dayjs(moment(iuiHDDetails?.date).format("DD/MM/YYYY"), "DD/MM/YYYY") : null,
        refer_clinic: iuiHDDetails?.refer_clinic || null,
        method_collection: iuiHDDetails?.method_collection || "",
        abstinance_period: iuiHDDetails?.abstinance_period || "",
        collection_time: iuiHDDetails?.collection_time ? dayjs(iuiHDDetails?.collection_time, "HH:mm:ss") : null,
        assay_time: iuiHDDetails?.assay_time ? dayjs(iuiHDDetails?.assay_time, "HH:mm:ss") : null,
        iui_with: iuiHDDetails?.iui_with || null,
        blood_group_husband_donor: iuiHDDetails?.blood_group_husband_donor || null,
        frozen_sample: iuiHDDetails?.frozen_sample || null,
        ejaculate_volume: iuiHDDetails?.ejaculate_volume || "",
        liquification_time: iuiHDDetails?.liquification_time || "",
        visual_appeareance: iuiHDDetails?.visual_appeareance || "",
        viscosity: iuiHDDetails?.viscosity || null,
        pus_cells_leucocytes: iuiHDDetails?.pus_cells_leucocytes || "",
        debries: iuiHDDetails?.debries || null,
        normal_forms: iuiHDDetails?.normal_forms || "",
        prelim_concentration: iuiHDDetails?.prelim_concentration || "",
        prelim_total_motile: iuiHDDetails?.prelim_total_motile || "",
        prelim_all_progressive: iuiHDDetails?.prelim_all_progressive || "",
        prelim_rapid_progressive: iuiHDDetails?.prelim_rapid_progressive || "",
        prelim_slow_progressive: iuiHDDetails?.prelim_slow_progressive || "",
        prelim_non_progressive: iuiHDDetails?.prelim_non_progressive || "",
        prelim_immotile: iuiHDDetails?.prelim_immotile || "",
        preparation_method_media: iuiHDDetails?.preparation_method_media || "",
        batch_no: iuiHDDetails?.batch_no || "",
        exp_date: iuiHDDetails?.exp_date
          ? dayjs(moment(iuiHDDetails?.exp_date).format("DD/MM/YYYY"), "DD/MM/YYYY")
          : null,
        insemination_volume: iuiHDDetails?.insemination_volume || "",
        subsequent_concentration: iuiHDDetails?.subsequent_concentration || "",
        subsequent_total_motile: iuiHDDetails?.subsequent_total_motile || "",
        subsequent_all_progressive: iuiHDDetails?.subsequent_all_progressive || "",
        subsequent_rapid_progressive: iuiHDDetails?.subsequent_rapid_progressive || "",
        subsequent_slow_progressive: iuiHDDetails?.subsequent_non_progressive || "",
        subsequent_non_progressive: iuiHDDetails?.subsequent_non_progressive || "",
        subsequent_immotile: iuiHDDetails?.subsequent_immotile || "",
        prepared_by: iuiHDDetails?.prepared_by || "",
        approved_by: iuiHDDetails?.approved_by || "",
        notes: iuiHDDetails?.notes || "",
        inseminated_by: iuiHDDetails?.inseminated_by || "",
      });
    }
  }, [iuiHDDetails, form]);

  const getNewSelectedPatientData = useCallback(async () => {
    if (Object.keys(selectedPatient)?.length > 0) {
      const { payload } = await dispatch(
        getGlobalSearch({
          patient_reg_id: selectedPatient._id,
          patient_name: selectedPatient.patient_full_name,
          location_id: selectedLocation,
        })
      );
      if (payload.length > 0) dispatch(setSelectedPatient(payload[0]));
    }
  }, [dispatch, selectedLocation, selectedPatient]);

  const createIuiHDDataFunc = useCallback(
    async (obj) => {
      const { payload } = await dispatch(
        createIuiHDData({
          locationId: selectedLocation,
          id: selectedPatient?._id,
          moduleId: selectedModule._id,
          payload: obj,
        })
      );
      if (payload?.hasOwnProperty("_id")) {
        getNewSelectedPatientData();
      }
    },
    [dispatch, getNewSelectedPatientData, selectedLocation, selectedModule, selectedPatient]
  );
  const onFinishFailed = (errorInfo) => {
    const firstErrorField = document.querySelector(".ant-form-item-has-error");
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onFinish = useCallback(
    async (values) => {
      if (selectedLocation &&
        Object.keys(selectedPatient)?.length > 0 &&
        Object.keys(selectedModule)?.length > 0) {
        if (Object.keys(iuiHDDetails)?.length > 0) {
          dispatch(
            editIuiHDData({
              location_id: selectedLocation,
              _id: iuiHDDetails?._id,
              module_id: selectedModule._id,
              payload: iuiHDData
            })
          );
        } else {
          createIuiHDDataFunc(iuiHDData)
        }
      }
    },
    [dispatch, iuiHDData]
  );


  const handleClear = () => {
    clearIuiHD();
    dispatch(setSelectedPatient({}));
    dispatch(clearData());
  };

  const handleRepeatTest = useCallback(
    () => {
      dispatch(setIuiHDDetails({}));
      setIuiHDData(IuiHDInitialData);
      form.setFieldsValue(IuiHDInitialData);
    },
    [form, dispatch],
  )



  const printIuiHD = useCallback(async () => {
    Object.keys(selectedPatient)?.length > 0 &&
      dispatch(
        printIuiHDData({
          module_id: selectedModule?._id,
          patient_reg_id: selectedPatient?._id,
          location_id: selectedLocation,
        })
      );
  }, [dispatch, selectedModule, selectedPatient, selectedLocation]);

  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {iuiHDDataLoading && (
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        )}
        <div className='text-end repeat_test_btn'>
          <Button
            className="btn_primary"
            htmlType="submit"
            onClick={handleRepeatTest}
          >
            <PlusOutlined className="m-0 me-md-2" />
            <span className='ms-0'>
              Repeat Test
            </span>
          </Button>
        </div>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          scrollToFirstError
          autoComplete="off"
          form={form}
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
                    <label>Patient :</label>
                    <span>{selectedPatient?.patient_full_name ? selectedPatient?.patient_full_name : ""}</span>
                  </li>
                  <li>
                    <label>Patient Age :</label>
                    <span>{selectedPatient?.patient_dob ? ageCalculate(selectedPatient?.patient_dob) : ""}</span>
                  </li>
                  <li>
                    <label>Partner :</label>
                    <span>{selectedPatient?.partner_full_name ? selectedPatient?.partner_full_name : ""}</span>
                  </li>
                  <li>
                    <label>Partner Age :</label>
                    <span>{selectedPatient?.partner_dob ? ageCalculate(selectedPatient?.partner_dob) : ""}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Patient Registration & Basic info from patient</h3>
              <ul className="grid_wrapper">
                <li className="w_270 w_xs_100">
                  <Form.Item label="Male Partner" name="male_partner">
                    <Input placeholder="Enter Male Partner" disabled name="male_Partner" />
                  </Form.Item>
                </li>
                <li className="w_120 w_xs_100">
                  <Form.Item label="Age (Male)" name="age_male">
                    <Input placeholder="Enter Age" disabled name="age_male" />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_100">
                  <Form.Item label="Female Partner" name="female_partner">
                    <Input placeholder="Enter Female Partner" disabled name="female_Partner" />
                  </Form.Item>
                </li>
                <li className="w_120 w_xs_50">
                  <Form.Item label="Age (Female)" name="age_female">
                    <Input placeholder="Enter Age" disabled name="age_female" />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item label="Pt. ID" name="pt_id">
                    <Input placeholder="Enter ID" disabled name="pt_ID" />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="Collection" name="collections" className="custom_select">
                    <Select
                      allowClear={true}
                      placeholder="Select"
                      options={collectionOptions}
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                        0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.label
                          .toLowerCase()
                          .localeCompare(optionB.label.toLowerCase())
                      }
                      onChange={(val) => {
                        setIuiHDData((prevState) => ({ ...prevState, collections: val }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="Complete Collection" name="complete_collection" className="custom_select">
                    <Select
                      allowClear={true}
                      placeholder="Select"
                      options={completeCollectionOptions}
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                        0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.label
                          .toLowerCase()
                          .localeCompare(optionB.label.toLowerCase())
                      }
                      onChange={(val) => {
                        setIuiHDData((prevState) => ({ ...prevState, complete_collection: val }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_120 w_xs_50">
                  <Form.Item label="Rec.No." name="rec_no">
                    <Input
                      placeholder="Rec.No."
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({ ...prevState, rec_no: e.target.value }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Date"
                    name="date"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}>
                    <DatePicker
                      placeholder="DD-MM-YYYY"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({
                          ...prevState,
                          date: moment(new Date(e)).format("YYYY/MM/DD"),
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_100">
                  <Form.Item className="custom_select" label="Referring clinic/clinician" name="refer_clinic">
                    <Select
                      allowClear={true}
                      placeholder="Select"
                      // options={referringClinicOptions}
                      options={doctorList}
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                        0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.label
                          .toLowerCase()
                          .localeCompare(optionB.label.toLowerCase())
                      }
                      onChange={(val) => {
                        setIuiHDData((prevState) => ({ ...prevState, refer_clinic: val }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="Abstinance Period" name="abstinance_period">
                    <Input
                      placeholder="Enter Abstinance Period"
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({ ...prevState, abstinance_period: e.target.value }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="Method Of Collection">
                    <div className="default_value_wrap">
                      <span>Masturbation</span>
                    </div>
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item label="Collection time(CT)" name="collection_time">
                    <TimePicker
                      format="h:mm a"
                      onChange={(value) => {
                        setIuiHDData((prevState) => ({
                          ...prevState,
                          collection_time: value ? dayjs(value).format("HH:mm:ss") : null,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item label="Assay time (AT)" name="assay_time">
                    <TimePicker
                      format="h:mm a"
                      onChange={(value) => {
                        setIuiHDData((prevState) => ({
                          ...prevState,
                          assay_time: value ? dayjs(value).format("HH:mm:ss") : null,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item label="IUI with" name="iui_with" className="custom_select">
                    <Select
                      allowClear={true}
                      placeholder="Select"
                      options={IUI_with}
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                        0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.label
                          .toLowerCase()
                          .localeCompare(optionB.label.toLowerCase())
                      }
                      onChange={(val) => setIuiHDData((prevState) => ({ ...prevState, iui_with: val }))}
                    />
                  </Form.Item>
                </li>
                <li className="w_300 w_xs_100">
                  <Form.Item
                    label="Blood Group of Husband / Donor"
                    name="blood_group_husband_donor"
                    className="custom_select"
                  >
                    <Select
                      allowClear={true}
                      placeholder="Select"
                      options={bloodGroupOptions}
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                        0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.label
                          .toLowerCase()
                          .localeCompare(optionB.label.toLowerCase())
                      }
                      onChange={(val) =>
                        setIuiHDData((prevState) => ({ ...prevState, blood_group_husband_donor: val }))
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item label="Frozen sample" name="frozen_sample" className="custom_select">
                    <Select
                      allowClear={true}
                      placeholder="Select"
                      name="frozen_sample"
                      options={frozen_sample}
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                        0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.label
                          .toLowerCase()
                          .localeCompare(optionB.label.toLowerCase())
                      }
                      onChange={(val) => {
                        setIuiHDData((prevState) => ({ ...prevState, frozen_sample: val }));
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Preliminary Semen Analysis</h3>
              <ul className="grid_wrapper">
                <li className="w_220 w_xs_100">
                  <Form.Item
                    label="Ejaculate volume"
                    className="input_with_text"
                    name="ejaculate_volume"
                    tooltip={{
                      title: "normal > 1.4 ml",
                      placement: "bottom",
                      icon: <InfoCircleOutlined />,
                    }}
                  >
                    <Input
                      placeholder="Enter Ejaculate volume"
                      value={iuiHDData?.ejaculate_volume}
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({ ...prevState, ejaculate_volume: e.target.value }));
                      }}
                    />
                    <span className="ms-1">ml</span>
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_100">
                  <Form.Item
                    label="Liquification Time"
                    className="input_with_text"
                    name="liquification_time"
                    tooltip={{
                      title: "normal - within 60 mins",
                      placement: "bottom",
                      icon: <InfoCircleOutlined />,
                    }}
                  >
                    <Input
                      placeholder="Enter Liquification Time"
                      value={iuiHDData?.liquification_time}
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({ ...prevState, liquification_time: e.target.value }));
                      }}
                    />
                    <span className="ms-1">min</span>
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="Visual appearance" name="visual_appearance" className="custom_select">
                    <Select
                      allowClear={true}
                      placeholder="Select"
                      options={visualAppearance}
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                        0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.label
                          .toLowerCase()
                          .localeCompare(optionB.label.toLowerCase())
                      }
                      onChange={(val) => {
                        setIuiHDData((prevState) => ({ ...prevState, visual_appeareance: val }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="Viscosity" name="viscosity" className="custom_select">
                    <Select
                      allowClear={true}
                      placeholder="Select"
                      options={visualAppearance}
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                        0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.label
                          .toLowerCase()
                          .localeCompare(optionB.label.toLowerCase())
                      }
                      onChange={(val) => {
                        setIuiHDData((prevState) => ({ ...prevState, viscosity: val }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_300 w_xs_100">
                  <Form.Item
                    label="Pus cells/Leucocytes"
                    className="input_with_text"
                    name="pus_cells_leucocytes"
                    tooltip={{
                      title: "8-10/hpf",
                      placement: "bottom",
                      icon: <InfoCircleOutlined />,
                    }}
                  >
                    <Input
                      placeholder="Enter Pus cells/Leucocytes"
                      value={iuiHDData?.pus_cells_leucocytes}
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({ ...prevState, pus_cells_leucocytes: e.target.value }));
                      }}
                    />
                    <span className="ms-1">/hpf</span>
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="Debries" name="debries" className="custom_select">
                    <Select
                      allowClear={true}
                      placeholder="Select"
                      options={debriesOptions}
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                        0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.label
                          .toLowerCase()
                          .localeCompare(optionB.label.toLowerCase())
                      }
                      onChange={(val) => {
                        setIuiHDData((prevState) => ({ ...prevState, debries: val }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_300 w_xs_100">
                  <Form.Item
                    label="Concentration"
                    className="input_with_text"
                    name="prelim_concentration"
                    tooltip={{
                      title: "normal > 16 Million/ml",
                      placement: "bottom",
                      icon: <InfoCircleOutlined />,
                    }}
                  >
                    <Input
                      placeholder="Enter Concentration"
                      value={iuiHDData?.prelim_concentration}
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({ ...prevState, prelim_concentration: e.target.value }));
                      }}
                    />
                    <span className="ms-1">Million/ml</span>
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_100">
                  <Form.Item
                    label="Normal forms"
                    name="normal_forms"
                    tooltip={{
                      title: "normal > 4%",
                      placement: "bottom",
                      icon: <InfoCircleOutlined />,
                    }}
                  >
                    <Input
                      placeholder="Enter Normal forms"
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({ ...prevState, normal_forms: e.target.value }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_100">
                  <Form.Item label="Total motile (a+b+c)" name="prelim_total_motile">
                    <Input
                      placeholder="Enter Total motile"
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({ ...prevState, prelim_total_motile: e.target.value }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_100">
                  <Form.Item label="All progressive (a+b)" name="prelim_all_progressive">
                    <Input
                      placeholder="Enter All progressive"
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({ ...prevState, prelim_all_progressive: e.target.value }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="a) Rapid progressive" name="prelim_rapid_progressive">
                    <Input
                      placeholder="Enter Rapid progressive"
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({ ...prevState, prelim_rapid_progressive: e.target.value }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="b) Slow progressive" name="prelim_slow_progressive">
                    <Input
                      placeholder="Enter Slow progressive"
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({ ...prevState, prelim_slow_progressive: e.target.value }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="c) Non-progressive" name="prelim_non_progressive">
                    <Input
                      placeholder="Enter Non-progressive"
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({ ...prevState, prelim_non_progressive: e.target.value }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item label="d) Immotile" name="prelim_immotile">
                    <Input
                      placeholder="Enter Immotile"
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({ ...prevState, prelim_immotile: e.target.value }));
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Subsequent Semen Analysis</h3>
              <ul className="grid_wrapper">
                <li className="w_320 w_xs_100">
                  <Form.Item label="Preparation Method & Media" name="preparation_method_media">
                    <Input
                      placeholder="Enter Method & Media"
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({ ...prevState, preparation_method_media: e.target.value }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_50">
                  <Form.Item label="Batch No." name="batch_no">
                    <Input
                      placeholder="Enter Batch No."
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({
                          ...prevState,
                          batch_no: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_180 w_xs_50">
                  <Form.Item label="Expiry Date" name="exp_date">
                    <DatePicker
                      placeholder="DD-MM-YYYY"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({
                          ...prevState,
                          exp_date: moment(new Date(e)).format("YYYY/MM/DD"),
                        }));
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item
                    label="Insemination volume"
                    className="input_with_text"
                    name="insemination_volume"
                    tooltip={{
                      title: "normal > 1.4 ml",
                      placement: "bottom",
                      icon: <InfoCircleOutlined />,
                    }}
                  >
                    <Input
                      placeholder="Enter Insemination volume"
                      value={iuiHDData?.insemination_volume}
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({ ...prevState, insemination_volume: e.target.value }));
                      }}
                    />
                    <span className="ms-1">ml</span>
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_100">
                  <Form.Item
                    label="Concentration"
                    className="input_with_text"
                    name="subsequent_concentration"
                    tooltip={{
                      title: "normal > 16 Million/ml",
                      placement: "bottom",
                      icon: <InfoCircleOutlined />,
                    }}
                  >
                    <Input
                      placeholder="Enter Concentration"
                      value={iuiHDData?.subsequent_concentration}
                      onChange={(e) => {
                        setIuiHDData((prevState) => ({
                          ...prevState,
                          subsequent_concentration: e.target.value,
                        }));
                      }}
                    />
                    <span className="ms-1">Million/ml</span>
                  </Form.Item>
                </li>
                <li className="w-100">
                  <ul className="grid_wrapper">
                    <li className="w_220 w_xs_100">
                      <Form.Item label="Total motile (a+b+c)" name="subsequent_total_motile">
                        <Input
                          placeholder="Enter Total motile"
                          onChange={(e) => {
                            setIuiHDData((prevState) => ({
                              ...prevState,
                              subsequent_total_motile: e.target.value,
                            }));
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_200 w_xs_100">
                      <Form.Item label="All progressive (a+b)" name="subsequent_all_progressive">
                        <Input
                          placeholder="Enter All progressive"
                          onChange={(e) => {
                            setIuiHDData((prevState) => ({
                              ...prevState,
                              subsequent_all_progressive: e.target.value,
                            }));
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_170 w_xs_100">
                      <Form.Item label="a) Rapid progressive" name="subsequent_rapid_progressive">
                        <Input
                          placeholder="Enter Rapid progressive"
                          onChange={(e) => {
                            setIuiHDData((prevState) => ({
                              ...prevState,
                              subsequent_rapid_progressive: e.target.value,
                            }));
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_170 w_xs_100">
                      <Form.Item label="b) Slow progressive" name="subsequent_slow_progressive">
                        <Input
                          placeholder="Enter Slow progressive"
                          onChange={(e) => {
                            setIuiHDData((prevState) => ({
                              ...prevState,
                              subsequent_slow_progressive: e.target.value,
                            }));
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_170 w_xs_100">
                      <Form.Item label="c) Non-progressive" name="subsequent_non_progressive">
                        <Input
                          placeholder="Enter Non-progressive"
                          onChange={(e) => {
                            setIuiHDData((prevState) => ({
                              ...prevState,
                              subsequent_non_progressive: e.target.value,
                            }));
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_120 w_xs_100">
                      <Form.Item label="d) Immotile" name="subsequent_immotile">
                        <Input
                          placeholder="Enter Immotile"
                          onChange={(e) => {
                            setIuiHDData((prevState) => ({
                              ...prevState,
                              subsequent_immotile: e.target.value,
                            }));
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_270 w_xs_100">
                      <Form.Item label="Prepared by" name="prepared_by">
                        <Input
                          placeholder="Enter Prepared by"
                          onChange={(e) => {
                            setIuiHDData((prevState) => ({
                              ...prevState,
                              prepared_by: e.target.value,
                            }));
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_270 w_xs_100">
                      <Form.Item label="Approved by" name="approved_by">
                        <Input
                          placeholder="Enter Prepared by"
                          onChange={(e) => {
                            setIuiHDData((prevState) => ({
                              ...prevState,
                              approved_by: e.target.value,
                            }));
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_320 w_xs_100">
                      <Form.Item label="Notes" name="notes">
                        <Input
                          placeholder="Notes"
                          onChange={(e) => {
                            setIuiHDData((prevState) => ({
                              ...prevState,
                              notes: e.target.value,
                            }));
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_320 w_xs_100">
                      <Form.Item label="Inseminated by" name="inseminated_by">
                        <Input
                          placeholder="Enter Inseminated by"
                          onChange={(e) => {
                            setIuiHDData((prevState) => ({
                              ...prevState,
                              inseminated_by: e.target.value,
                            }));
                          }}
                        />
                      </Form.Item>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {Object.keys(iuiHDDetails)?.length > 0
              ? (userType === 1 || selectedModule?.edit) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary mx-sm-2 mx-1"
                  htmlType="submit"
                >
                  Update
                </Button>
              )
              : (userType === 1 || selectedModule?.create) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary mx-sm-2 mx-1"
                  htmlType="submit"
                >
                  Save
                </Button>
              )}
            <Button
              className="btn_print mx-sm-2 mx-1"
              disabled={Object.keys(selectedPatient)?.length === 0}
              onClick={printIuiHD}
            >
              Print
            </Button>
            {/* <Button className="btn_gray mx-ms-2 mx-1">IUI Result</Button> */}
            <Link
              disabled={Object.keys(selectedPatient)?.length === 0}
              to="/iui-report"
              state={{ parentComponentData: selectedModule }}
              className="btn_border"
            >
              IUI Result
              {/* <Button className="btn_gray mx-ms-2 mx-1">
                            IUI Result
                        </Button> */}
            </Link>
            <Button
              className="btn_gray mx-sm-2 mx-1"
              onClick={handleClear}>
              Cancel
            </Button>
          </div>
        </Form>
      </div >
    </div >
  );
};

export default IuiHD;
