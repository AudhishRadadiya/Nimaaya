import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Form, Input, Select, Spin } from "antd";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  createMaleIntinfertility,
  editMaleInfterlity,
  getMaleIntinfertility,
  setIsCreateMalePatient,
  setMalePatientList,
  setMaleIntinfertilityUpdated,
} from "redux/reducers/MaleInfertilityInvestigation/maleInfertilityInvestigation.slice";
import dayjs from "dayjs";
import moment from "moment";
import { clearData, getGlobalSearch } from "redux/reducers/SearchPanel/globalSearch.slice";
import {
  getAttendingDrList,
  setSelectedPatient,
} from "redux/reducers/common.slice";
import {
  VDRLOptions,
  bloodGroupOptions,
  chromosomeAnalysisOptions,
  fertilityImpairmentFactorOptions,
  hBsAgOptions,
  habitsOptions,
  hivOptions,
  idiopathicOption,
  inflammationOptions,
  varicoceleOptions,
} from "utils/FieldValues";

export default function MaleInfertilityInvestigation() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const inputValidation = /^[0-9\-.]+$/;
  const { moduleList, userType } = useSelector(({ role }) => role);
  const { selectedPatient, attendingDrList } = useSelector(
    ({ common }) => common
  );
  const { selectedLocation } = useSelector(({ role }) => role);
  const { malePatientList, malePatientListLoding, maleInfertilityDataUpdate } =
    useSelector(
      ({ maleInfertilityInvestigation }) => maleInfertilityInvestigation
    );
  const [doctorList, setDoctorList] = useState([{}]);
  // const [patientDetails, setPatientDetails] = useState({
  //   patient_id: "",
  //   patient_name: "",
  // });
  const [maleInfertilityDetail, setMaleInfertilityDetail] = useState({});
  useEffect(() => {
    dispatch(getAttendingDrList());
    return () => {
      clearFormData();
    };
  }, [dispatch]);
  const clearFormData = useCallback(() => {
    setMaleInfertilityDetail({
      interpretation: "",
      attending_dr_id: null,
      blood_group: null,
      hiv: null,
      hbsag: null,
      vdrl: null,
      hcv: "",
      karyotyping: "",
      y_chromosome_microdeletion: "",
      rbs: "",
      prol: "",
      hb1ac: "",
      fsh: "",
      lh: "",
      e2: "",
      testosterone: "",
      chromosome_analysis: null,
      pregnancies_achieved: "",
      fertility_impairment_factor: null,
      chronics_illnesses: null,
      working_enviroment: null,
      habits: null,
      dfi: null,
      idiopathic: null,
      additional_illnesses: null,
      inflammation: null,
      varicocele: null,
      history_of_tesa: null,
      date_semen_analysis: null,
      count: "",
      motility: "",
      morphology: "",
      dfi_percent: "",
      frozen: null,
      notes: "",
    });
    // setPatientDetails({
    //   patient_id: "",
    //   patient_name: "",
    // });
    form.setFieldsValue({
      // patient_id: "",
      // patient_name: "",
      interpretation: "",
      attending_dr_id: null,
      blood_group: null,
      hiv: null,
      hbsag: null,
      vdrl: null,
      hcv: "",
      karyotyping: "",
      y_chromosome_microdeletion: "",
      rbs: "",
      prol: "",
      hb1ac: "",
      fsh: "",
      lh: "",
      e2: "",
      testosterone: "",
      chromosome_analysis: null,
      pregnancies_achieved: "",
      fertility_impairment_factor: null,
      chronics_illnesses: null,
      working_enviroment: null,
      habits: null,
      dfi: null,
      idiopathic: null,
      additional_illnesses: null,
      inflammation: null,
      varicocele: null,
      history_of_tesa: null,
      date_semen_analysis: null,
      count: "",
      motility: "",
      morphology: "",
      dfi_percent: "",
      frozen: null,
      notes: "",
    });
  }, [form]);

  // const clearPatientDetail = () => {
  //   setPatientDetails({
  //     patient_id: "",
  //     patient_name: "",
  //   });
  //   form.setFieldsValue({
  //     patient_id: "",
  //     patient_name: "",
  //   });
  // };
  const selectedModule = useMemo(() => {
    return (
      moduleList?.find(
        (item) => item?.module_name === "/male-infertility-investigation"
      ) || {}
    );
  }, [moduleList]);

  useEffect(() => {
    if (Object.entries(attendingDrList)?.length > 0) {
      setDoctorList(
        attendingDrList.map((item, index) => ({
          value: item._id,
          label: item.user_name,
        }))
      );
    }
  }, [dispatch, attendingDrList]);

  // useEffect(() => {
  //   if (Object.keys(selectedPatient)?.length > 0) {
  //     setPatientDetails({
  //       patient_id: selectedPatient.patient_id,
  //       patient_name: selectedPatient.patient_full_name,
  //     });
  //     form.setFieldsValue({
  //       patient_id: selectedPatient.patient_id,
  //       patient_name: selectedPatient.patient_full_name,
  //     });
  //   }
  //   return () => {
  //     clearFormData();
  //     dispatch(setMalePatientList({}));
  //   };
  // }, [selectedPatient, form]);

  useEffect(() => {
    if (Array.isArray(moduleList)) {
      if (selectedModule?._id && selectedPatient?._id && selectedLocation) {
        dispatch(
          getMaleIntinfertility({
            patientRegId: selectedPatient._id,
            moduleId: selectedModule?._id,
            location_id: selectedLocation,
          })
        );
      }
    }
    return () => {
      clearFormData();
      dispatch(setMalePatientList({}));
    };
  }, [selectedPatient, selectedLocation, selectedPatient]);


  const getNewSelectedPatientData = useCallback(
    async () => {
      if (maleInfertilityDataUpdate && Object.keys(selectedPatient)?.length > 0 && Object.keys(malePatientList)?.length === 0) {
        const { payload } = await dispatch(getGlobalSearch({ patient_reg_id: selectedPatient._id, patient_name: selectedPatient.patient_full_name, location_id: selectedLocation }));
        if (payload.length > 0) dispatch(setSelectedPatient(payload[0]));
      }
    },
    [dispatch, selectedLocation, maleInfertilityDataUpdate, malePatientList, selectedPatient],
  )

  useEffect(() => {
    if (maleInfertilityDataUpdate) {
      dispatch(
        getMaleIntinfertility({
          patientRegId: selectedPatient._id,
          moduleId: selectedModule?._id,
          location_id: selectedLocation,
        })
      );
      getNewSelectedPatientData();
      dispatch(setMaleIntinfertilityUpdated(false));
    }
  }, [
    dispatch,
    clearFormData,
    maleInfertilityDataUpdate,
    selectedLocation,
    selectedModule?._id,
    selectedPatient._id,
  ]);

  useEffect(() => {
    if (Object.entries(malePatientList)?.length > 0) {
      setMaleInfertilityDetail({
        attending_dr_id: malePatientList?.attending_dr_id || 0,
        blood_group: malePatientList?.blood_group || "",
        hiv: malePatientList?.hiv || "",
        hbsag: malePatientList?.hbsag || "",
        vdrl: malePatientList?.vdrl || "",
        hcv: malePatientList?.hcv || "",
        karyotyping: malePatientList?.karyotyping || "",
        y_chromosome_microdeletion:
          malePatientList?.y_chromosome_microdeletion || "",
        rbs: malePatientList?.rbs || "--",
        prol: malePatientList?.prol || 0,
        hb1ac: malePatientList?.hb1ac || "--",
        fsh: malePatientList?.fsh || 0.0,
        lh: malePatientList?.lh || "",
        e2: malePatientList?.e2 || 0.0,
        testosterone: malePatientList?.testosterone || 0,
        chromosome_analysis: malePatientList?.chromosome_analysis || "",
        pregnancies_achieved: malePatientList?.pregnancies_achieved || 0,
        fertility_impairment_factor:
          malePatientList?.fertility_impairment_factor || "None",
        chronics_illnesses: malePatientList?.chronics_illnesses || "None",
        working_enviroment: malePatientList?.working_enviroment || "",
        habits: malePatientList?.habits || "",
        dfi: malePatientList?.dfi || "",
        idiopathic: malePatientList?.idiopathic || "",
        additional_illnesses: malePatientList?.additional_illnesses || "--",
        inflammation: malePatientList?.inflammation || "--",
        varicocele: malePatientList?.varicocele || "--",
        history_of_tesa: malePatientList?.varicocele || "",
        date_semen_analysis: malePatientList.date_semen_analysis
          ? moment(malePatientList.date_semen_analysis).format("YYYY/MM/DD")
          : null,
        count: malePatientList?.count || 0,
        motility: malePatientList?.motility || 0,
        morphology: malePatientList?.morphology || 0,
        dfi_percent: malePatientList?.dfi_percent || 0,
        interpretation: malePatientList?.interpretation || "",
        frozen: malePatientList?.frozen || "",
        notes: malePatientList?.notes || "",
        deleted: malePatientList?.deleted || false,
      });
      form.setFieldsValue({
        attending_dr_id: malePatientList?.attending_dr_id || 0,
        blood_group: malePatientList?.blood_group || "",
        hiv: malePatientList?.hiv || "",
        hbsag: malePatientList?.hbsag || "",
        vdrl: malePatientList?.vdrl || "",
        hcv: malePatientList?.hcv || "",
        karyotyping: malePatientList?.karyotyping || "",
        y_chromosome_microdeletion:
          malePatientList?.y_chromosome_microdeletion || "",
        rbs: malePatientList?.rbs || "--",
        prol: malePatientList?.prol || 0,
        hb1ac: malePatientList?.hb1ac || "--",
        fsh: malePatientList?.fsh || 0.0,
        lh: malePatientList?.lh || "",
        e2: malePatientList?.e2 || 0.0,
        testosterone: malePatientList?.testosterone || 0,
        chromosome_analysis: malePatientList?.chromosome_analysis || "",
        pregnancies_achieved: malePatientList?.pregnancies_achieved || 0,
        fertility_impairment_factor:
          malePatientList?.fertility_impairment_factor || "None",
        chronics_illnesses: malePatientList?.chronics_illnesses || "None",
        working_enviroment: malePatientList?.working_enviroment || "",
        habits: malePatientList?.habits || "",
        dfi: malePatientList?.dfi || "",
        idiopathic: malePatientList?.idiopathic || "",
        additional_illnesses: malePatientList?.additional_illnesses || "--",
        inflammation: malePatientList?.inflammation || "--",
        varicocele: malePatientList?.varicocele || "--",
        history_of_tesa: malePatientList?.varicocele || "",
        date_semen_analysis: dayjs(
          moment(malePatientList?.date_semen_analysis).format("DD/MM/YYYY"),
          "DD/MM/YYYY"
        ),
        count: malePatientList?.count || 0,
        motility: malePatientList?.motility || 0,
        morphology: malePatientList?.morphology || 0,
        dfi_percent: malePatientList?.dfi_percent || 0,
        interpretation: malePatientList?.interpretation || "",
        frozen: malePatientList?.frozen || "",
        notes: malePatientList?.notes || "",
        deleted: malePatientList?.deleted || false,
      });
    }
  }, [dispatch, form, malePatientList]);

  const onFinish = (values) => {
    if (Object.entries(malePatientList)?.length > 0) {
      dispatch(
        editMaleInfterlity({
          location_id: selectedLocation,
          id: malePatientList._id,
          moduleId: selectedModule._id,
          payload: maleInfertilityDetail,
        })
      );
    } else {
      dispatch(
        createMaleIntinfertility({
          location_id: selectedLocation,
          id: selectedPatient._id,
          moduleId: selectedModule._id,
          payload: maleInfertilityDetail,
        })
      );
    }
  };

  const handleCancel = () => {
    clearFormData();
    dispatch(setMalePatientList({}));
    dispatch(setSelectedPatient({}));
    dispatch(clearData());
  };
  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {malePatientListLoding && (
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
                    <label>Patient Name :</label>
                    <span>{selectedPatient?.patient_full_name ? selectedPatient?.patient_full_name : ""}</span>
                  </li>
                </ul>
              </div>
            </div>
            {/* <div className="form_info_wrapper filled">
              <h3 className="mb-3">Patient Details </h3>
              <ul className="grid_wrapper">
                <li className="w_250 w_xs_50">
                  <Form.Item label="Patient ID" name="patient_id">
                    <Input
                      type="text"
                      placeholder="Enter Patient ID"
                      id="patient_id"
                      name="patient_id"
                      value={patientDetails?.patient_id}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_320 w_xs_100">
                  <Form.Item label="Patient Name" name="patient_name">
                    <Input
                      placeholder="Enter Patient Name"
                      name="patient_name"
                      value={patientDetails?.patient_name}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Attending Dr."
                    name="attending_dr_id"
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
                      name="attending_dr_id"
                      placeholder="select"
                      value={maleInfertilityDetail?.attending_dr_id}
                      onChange={(value) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          attending_dr_id: value,
                        });
                      }}
                      options={doctorList}
                    ></Select>
                  </Form.Item>
                </li>
              </ul>
            </div> */}
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Male Details</h3>
              <ul className="grid_wrapper">
                <li className="w_150 w_xs_50">
                  <Form.Item
                    label="Blood Group"
                    name="blood_group"
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
                      name="blood_group"
                      value={maleInfertilityDetail.blood_group}
                      onChange={(value) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          blood_group: value,
                        });
                      }}
                      options={bloodGroupOptions}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_50">
                  <Form.Item
                    label="HIV"
                    name="hiv"
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
                      name="hiv"
                      value={maleInfertilityDetail.hiv}
                      onChange={(value) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          hiv: value,
                        });
                      }}
                      options={hivOptions}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_50">
                  <Form.Item
                    label="HBsAg"
                    name="hbsag"
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
                      name="hbsag"
                      value={maleInfertilityDetail.hbsag}
                      onChange={(value) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          hbsag: value,
                        });
                      }}
                      options={hBsAgOptions}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_50">
                  <Form.Item
                    label="VDRL"
                    name="vdrl"
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
                      name="vdrl"
                      value={maleInfertilityDetail.vdrl}
                      onChange={(value) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          vdrl: value,
                        });
                      }}
                      options={VDRLOptions}
                    />
                  </Form.Item>
                </li>
                <li className="w_140 w_xs_50">
                  <Form.Item
                    label="HCV"
                    name="hcv"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter HCV"
                      name="hcv"
                      value={maleInfertilityDetail.hcv}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          hcv: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_120 w_xs_50">
                  <Form.Item
                    label="Karyotyping"
                    name="karyotyping"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="46xy"
                      name="karyotyping"
                      value={maleInfertilityDetail.karyotyping}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          karyotyping: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_240 w_xs_100">
                  <Form.Item
                    label="Y.Chromosome MicroDeletion"
                    name="y_chromosome_microdeletion"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Normal"
                      name="y_chromosome_microdeletion"
                      value={maleInfertilityDetail.y_chromosome_microdeletion}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          y_chromosome_microdeletion: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_140 w_xs_50">
                  <Form.Item
                    label="RBS (mg/dl)"
                    name="rbs"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="--"
                      value={maleInfertilityDetail.rbs}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          rbs: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item
                    label="PROL (mg/dl)"
                    name="prol"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="21.8"
                      name="prol"
                      value={maleInfertilityDetail.prol}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          prol: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item
                    label="HB1AC"
                    name="hb1ac"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="--"
                      name="hb1ac"
                      value={maleInfertilityDetail.hb1ac}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          hb1ac: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item
                    label="FSH (mui/ml)"
                    name="fsh"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="1.55"
                      name="fsh"
                      value={maleInfertilityDetail.fsh}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          fsh: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item
                    label="LH (miu/ml)"
                    name="lh"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="1.55"
                      name="lh"
                      value={maleInfertilityDetail.lh}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          lh: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item
                    label="E2 (pg/ml)"
                    name="e2"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="36.8"
                      name="e2"
                      value={maleInfertilityDetail.e2}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          e2: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_180 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="Testosterone (ng/ml)"
                    name="testosterone"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="175"
                      name="testosterone"
                      value={maleInfertilityDetail.testosterone}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          testosterone: e.target.value,
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
                      name="chromosome_analysis"
                      value={maleInfertilityDetail.chromosome_analysis}
                      onChange={(value) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          chromosome_analysis: value,
                        });
                      }}
                      options={chromosomeAnalysisOptions}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="No. of Pregnancies Achieved"
                    name="pregnancies_achieved"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="2"
                      name="pregnancies_achieved"
                      value={maleInfertilityDetail.pregnancies_achieved}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          pregnancies_achieved: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Fertility Impairment Factor</h3>
              <Row>
                <Col md={4}>
                  <Form.Item
                    label="Fertility Impairment Factor"
                    name="fertility_impairment_factor"
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
                      name="fertility_impairment_factor"
                      value={maleInfertilityDetail.fertility_impairment_factor}
                      onChange={(value) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          fertility_impairment_factor: value,
                        });
                      }}
                      options={fertilityImpairmentFactorOptions}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Illnesses / Harmful Influences</h3>
              <ul className="grid_wrapper">
                <li className="w_180 w_xs_50">
                  <Form.Item
                    label="Chronic illnesses"
                    name="chronics_illnesses"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="None"
                      name="chronics_illnesses"
                      value={maleInfertilityDetail.chronics_illnesses}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          chronics_illnesses: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="Working Environment"
                    name="working_enviroment"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="--"
                      name="working_enviroment"
                      value={maleInfertilityDetail.working_enviroment}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          working_enviroment: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_180 w_xs_50">
                  <Form.Item
                    label="Habits"
                    name="habits"
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
                      name="habits"
                      value={maleInfertilityDetail.habits}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          habits: e,
                        });
                      }}
                      options={habitsOptions}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="DFI"
                    name="dfi"
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
                      name="dfi"
                      value={maleInfertilityDetail.dfi}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          dfi: e,
                        });
                      }}
                      options={[
                        { value: "Yes", label: "Yes" },
                        { value: "No", label: "No" },
                      ]}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Additional Illnesses</h3>
              <ul className="grid_wrapper">
                <li className="w_350 w_xs_100">
                  <Form.Item
                    label="Idiopathic"
                    name="idiopathic"
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
                      name="idiopathic"
                      value={maleInfertilityDetail.idiopathic}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          idiopathic: e,
                        });
                      }}
                      options={idiopathicOption}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="Additional Illnesses"
                    name="additional_illnesses"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="--"
                      name="additional_illnesses"
                      value={maleInfertilityDetail.additional_illnesses}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          additional_illnesses: e.target.value,
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
                <li className="w_190 w_xs_50">
                  <Form.Item
                    label="Inflammation"
                    name="inflammation"
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
                      name="inflammation"
                      value={maleInfertilityDetail.inflammation}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          inflammation: e,
                        });
                      }}
                      options={inflammationOptions}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_50">
                  <Form.Item
                    label="Varicocele"
                    name="varicocele"
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
                      name="varicocele"
                      value={maleInfertilityDetail.varicocele}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          varicocele: e,
                        });
                      }}
                      options={varicoceleOptions}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">History of TESA</h3>
              <ul className="grid_wrapper align-items-end">
                <li className="w_190 w_xs_50">
                  <Form.Item
                    label="History of TESA"
                    name="history_of_tesa"
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
                      name="history_of_tesa"
                      value={maleInfertilityDetail.history_of_tesa}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          history_of_tesa: e,
                        });
                      }}
                      options={[
                        { value: "Yes", label: "Yes" },
                        { value: "No", label: "No" },
                      ]}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Semen Analysis</h3>
              <ul className="grid_wrapper align-items-end">
                <li className="w_200 w_xs_100">
                  <Form.Item
                    label="Date of semen analysis"
                    name="date_semen_analysis"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder="Enter Date"
                      name="date_semen_analysis"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      value={dayjs(
                        maleInfertilityDetail?.date_semen_analysis,
                        "DD/MM/YYYY"
                      )}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          date_semen_analysis: moment(new Date(e)).format(
                            "YYYY/MM/DD"
                          ),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="Count"
                    name="count"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Count"
                      name="count"
                      value={maleInfertilityDetail.count}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          count: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="Motility (%)"
                    name="motility"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Motility (%)"
                      name="motility"
                      value={maleInfertilityDetail.motility}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          motility: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="Normal morphology (%)"
                    name="morphology"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Normal morphology (%)"
                      name="morphology"
                      value={maleInfertilityDetail.morphology}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          morphology: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="DFI (%)"
                    name="dfi_percent"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter DFI (%)"
                      name="dfi_percent"
                      value={maleInfertilityDetail.dfi_percent}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          dfi_percent: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50 w_xxs_100">
                  <Form.Item
                    label="Interpretation"
                    name="interpretation"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Interpretation"
                      name="interpretation"
                      value={maleInfertilityDetail.interpretation}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          interpretation: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50">
                  <Form.Item
                    label="Frozen"
                    name="frozen"
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
                      name="frozen"
                      value={maleInfertilityDetail.frozen}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          frozen: e,
                        });
                      }}
                      options={[
                        { value: "Yes", label: "Yes" },
                        { value: "No", label: "No" },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_350 w_xs_50 w_xxs_100">
                  <Form.Item label="Notes" name="notes">
                    <Input
                      placeholder="Add Notes"
                      name="notes"
                      value={maleInfertilityDetail.notes}
                      onChange={(e) => {
                        setMaleInfertilityDetail({
                          ...maleInfertilityDetail,
                          notes: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {Object.entries(malePatientList)?.length > 0
              ? (userType === 1 || selectedModule._id?.edit) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary me-3"
                  htmlType="submit"
                >
                  Update
                </Button>
              )
              : (userType === 1 || selectedModule._id?.create) && (
                <Button
                  disabled={Object.keys(selectedPatient)?.length === 0}
                  className="btn_primary me-3"
                  htmlType="submit"
                >
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
