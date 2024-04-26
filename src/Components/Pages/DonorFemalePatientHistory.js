import React, { useCallback, useState } from 'react'
import { Button, Form, Input, Select } from 'antd';
import { createPatientBasicHistoryDetails, setPatientBasicHistoryDetail, updatePatientBasicHistory } from 'redux/reducers/PatientBasicHistory/patientBasicHistory.slice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import moment from 'moment';
import { clearData } from 'redux/reducers/SearchPanel/globalSearch.slice';
import { setSelectedPatient } from 'redux/reducers/common.slice';
import { intensityOptions, regularityOptions } from 'utils/FieldValues';
import TextArea from 'antd/es/input/TextArea';

const DonorFemalePatientHistory = ({ userType, locationId, selectedPatient, moduleDetail, patientBasicHistoryDetail, isPatientBasicCreated }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [basicInformationDonorFemaleData, setBasicInformationDonorFemaleData] = useState({
    colour_of_hair: "",
    colour_of_eyes: null,
    colour_of_skin: null,
    marital_status: null,
    religion: null,
    sub_cast: null,
    height: '',
    weight: '',
    donor_education: "",
    spouse_education: "",
    donor_occupation: "",
    spouse_occupation: "",
    monthly_income: "",
    no_of_deliveries: 0,
    no_of_abortion: 0,
    points_of_note: "",
    use_of_contraceptives: null,
    medical_history: null,
    abnoramility_in_child: null,
    blood_transfusion: "",
    substance_abuse: "",
    regularity: null,
    duration: 0,
    distance: 0,
    intensity: null,
    pulse: 0,
    blood_pressure: "",
    temperature: 0,
    respiratory_aebe_clear: null,
    murmur: null,
    s1s2: null,
    abdominal_examination: null,
    organomegaly: null,
    notes: ""
  })
  // useEffect(() => {
  //   if (Object.entries(selectedPatient)?.length > 0) {
  //     setBasicInformationDonorFemaleData({
  //       patient_dob: basicInformationDonorFemaleData.patient_dob
  //     })
  //     form.setFieldsValue({
  //       patient_dob: dayjs(moment(selectedPatient?.patient_dob).format('DD/MM/YYYY'), "DD/MM/YYYY"),
  //     })
  //   }
  //   return () => {
  //     clearDonorFemaleForm()
  //   }
  // }, [selectedPatient])

  useEffect(() => {
    if (Object.entries(patientBasicHistoryDetail)?.length > 0) {
      setBasicInformationDonorFemaleData({
        colour_of_hair: patientBasicHistoryDetail.colour_of_hair,
        colour_of_eyes: patientBasicHistoryDetail.colour_of_eyes,
        colour_of_skin: patientBasicHistoryDetail.colour_of_skin,
        marital_status: patientBasicHistoryDetail.marital_status,
        religion: patientBasicHistoryDetail.religion,
        sub_cast: patientBasicHistoryDetail.sub_cast,
        donor_education: patientBasicHistoryDetail.donor_education,
        spouse_education: patientBasicHistoryDetail.spouse_education,
        donor_occupation: patientBasicHistoryDetail.donor_occupation,
        spouse_occupation: patientBasicHistoryDetail.spouse_occupation,
        monthly_income: patientBasicHistoryDetail.monthly_income,
        no_of_deliveries: patientBasicHistoryDetail.no_of_deliveries,
        no_of_abortion: patientBasicHistoryDetail.no_of_abortion,
        points_of_note: patientBasicHistoryDetail.points_of_note,
        height: patientBasicHistoryDetail.height,
        weight: patientBasicHistoryDetail.weight,
        use_of_contraceptives: patientBasicHistoryDetail.use_of_contraceptives,
        medical_history: patientBasicHistoryDetail.medical_history,
        abnoramility_in_child: patientBasicHistoryDetail.abnoramility_in_child,
        blood_transfusion: patientBasicHistoryDetail.blood_transfusion,
        substance_abuse: patientBasicHistoryDetail.substance_abuse,
        regularity: patientBasicHistoryDetail.regularity,
        duration: patientBasicHistoryDetail.duration,
        distance: patientBasicHistoryDetail.distance,
        intensity: patientBasicHistoryDetail.intensity,
        pulse: patientBasicHistoryDetail.pulse,
        blood_pressure: patientBasicHistoryDetail.blood_pressure,
        temperature: patientBasicHistoryDetail.temperature,
        respiratory_aebe_clear: patientBasicHistoryDetail.respiratory_aebe_clear,
        murmur: patientBasicHistoryDetail.murmur,
        s1s2: patientBasicHistoryDetail.s1s2,
        abdominal_examination: patientBasicHistoryDetail.abdominal_examination,
        organomegaly: patientBasicHistoryDetail.organomegaly,
        notes: patientBasicHistoryDetail.notes,
      });
      form.setFieldsValue({
        colour_of_hair: patientBasicHistoryDetail.colour_of_hair,
        colour_of_eyes: patientBasicHistoryDetail.colour_of_eyes,
        colour_of_skin: patientBasicHistoryDetail.colour_of_skin,
        marital_status: patientBasicHistoryDetail.marital_status,
        religion: patientBasicHistoryDetail.religion,
        sub_cast: patientBasicHistoryDetail.sub_cast,
        donor_education: patientBasicHistoryDetail.donor_education,
        spouse_education: patientBasicHistoryDetail.spouse_education,
        donor_occupation: patientBasicHistoryDetail.donor_occupation,
        spouse_occupation: patientBasicHistoryDetail.spouse_occupation,
        monthly_income: patientBasicHistoryDetail.monthly_income,
        no_of_deliveries: patientBasicHistoryDetail.no_of_deliveries,
        no_of_abortion: patientBasicHistoryDetail.no_of_abortion,
        points_of_note: patientBasicHistoryDetail.points_of_note,
        use_of_contraceptives: patientBasicHistoryDetail.use_of_contraceptives,
        medical_history: patientBasicHistoryDetail.medical_history,
        abnoramility_in_child: patientBasicHistoryDetail.abnoramility_in_child,
        blood_transfusion: patientBasicHistoryDetail.blood_transfusion,
        substance_abuse: patientBasicHistoryDetail.substance_abuse,
        regularity: patientBasicHistoryDetail.regularity,
        duration: patientBasicHistoryDetail.duration,
        distance: patientBasicHistoryDetail.distance,
        intensity: patientBasicHistoryDetail.intensity,
        pulse: patientBasicHistoryDetail.pulse,
        blood_pressure: patientBasicHistoryDetail.blood_pressure,
        height: patientBasicHistoryDetail.height,
        weight: patientBasicHistoryDetail.weight,
        temperature: patientBasicHistoryDetail.temperature,
        respiratory_aebe_clear: patientBasicHistoryDetail.respiratory_aebe_clear,
        murmur: patientBasicHistoryDetail.murmur,
        s1s2: patientBasicHistoryDetail.s1s2,
        abdominal_examination: patientBasicHistoryDetail.abdominal_examination,
        organomegaly: patientBasicHistoryDetail.organomegaly,
        notes: patientBasicHistoryDetail.notes,
      });
    }
    return () => {
      clearDonorFemaleForm()
    }
  }, [patientBasicHistoryDetail, form, selectedPatient]);
  const onFinish = values => {
    Object.keys(patientBasicHistoryDetail)?.length > 0 ?
      dispatch(updatePatientBasicHistory({
        locationId: locationId,
        id: patientBasicHistoryDetail._id,
        moduleId: moduleDetail?._id,
        payload: basicInformationDonorFemaleData
      })) :
      dispatch(
        createPatientBasicHistoryDetails({
          locationId: locationId,
          patientRegId: selectedPatient?._id,
          moduleId: moduleDetail?._id,
          payload: basicInformationDonorFemaleData
        }),
      );
  };

  const onFinishFailed = errorInfo => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearDonorFemaleForm = useCallback(
    () => {
      setBasicInformationDonorFemaleData({
        colour_of_hair: "",
        colour_of_eyes: null,
        colour_of_skin: null,
        marital_status: null,
        religion: null,
        sub_cast: null,
        height: '',
        weight: '',
        donor_education: "",
        spouse_education: "",
        donor_occupation: "",
        spouse_occupation: "",
        monthly_income: "",
        no_of_deliveries: 0,
        no_of_abortion: 0,
        points_of_note: "",
        use_of_contraceptives: null,
        medical_history: null,
        abnoramility_in_child: null,
        blood_transfusion: "",
        substance_abuse: "",
        regularity: null,
        duration: 0,
        distance: 0,
        intensity: null,
        pulse: 0,
        blood_pressure: "",
        temperature: 0,
        respiratory_aebe_clear: null,
        murmur: null,
        s1s2: null,
        abdominal_examination: null,
        organomegaly: null,
        notes: ""
      });

      form.setFieldsValue({
        colour_of_hair: "",
        colour_of_eyes: null,
        colour_of_skin: null,
        marital_status: null,
        religion: null,
        sub_cast: null,
        height: '',
        weight: '',
        donor_education: "",
        spouse_education: "",
        donor_occupation: "",
        spouse_occupation: "",
        monthly_income: "",
        no_of_deliveries: 0,
        no_of_abortion: 0,
        points_of_note: "",
        use_of_contraceptives: null,
        medical_history: null,
        abnoramility_in_child: null,
        blood_transfusion: "",
        substance_abuse: "",
        regularity: null,
        duration: 0,
        distance: 0,
        intensity: null,
        pulse: 0,
        blood_pressure: "",
        temperature: 0,
        respiratory_aebe_clear: null,
        murmur: null,
        s1s2: null,
        abdominal_examination: null,
        organomegaly: null,
        notes: ""
      })
    },
    [form],
  )
  const handleCancel = () => {
    clearDonorFemaleForm();
    dispatch(setSelectedPatient({}));
    dispatch(setPatientBasicHistoryDetail({}))
    dispatch(clearData())
  };

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
                    <label>Date Of Birth :</label>
                    <span>{selectedPatient?.patient_dob ? moment(selectedPatient?.patient_dob).format('DD-MM-YYYY') : ""}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Basic Information (Donor - Female)</h3>
              <ul className="grid_wrapper">
                {/* <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Date Of Birth"
                    name="patient_dob"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      name="date_of_birth"
                      disabled
                    />
                  </Form.Item>
                </li> */}
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Marital status"
                    name="marital_status"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      name="marital_status"
                      value={basicInformationDonorFemaleData?.marital_status}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          marital_status: value,
                        });
                      }}
                      options={[
                        { value: 'Married', label: 'Married' },
                        { value: 'Unmarried', label: 'Unmarried' },
                        { value: 'Widow', label: 'Widow' },
                        { value: 'Single', label: 'Single' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Religion"
                    name="religion"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      name="religion"
                      value={basicInformationDonorFemaleData?.religion}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          religion: value,
                        });
                      }}
                      options={[
                        { value: 'Hindu', label: 'Hindu' },
                        { value: 'Muslim', label: 'Muslim' },
                        { value: 'Sikh', label: 'Sikh' },
                        { value: 'Parsi', label: 'Parsi' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Subcast"
                    name="sub_cast"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      name="sub_cast"
                      value={basicInformationDonorFemaleData?.sub_cast}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          sub_cast: value,
                        });
                      }}
                      options={[
                        { value: 'Patel', label: 'Patel' },
                        { value: 'Ahir', label: 'Ahir' },
                        { value: 'Marwadi', label: 'Marwadi' },
                        { value: 'Sindhi', label: 'Sindhi' },
                      ]}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Education</h3>
              <ul className="grid_wrapper">
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Donor Education"
                    name="donor_education"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Donor Education"
                      name="donor_education"
                      value={basicInformationDonorFemaleData?.donor_education}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          donor_education: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Spouse Education"
                    name="spouse_education"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Spouse Education"
                      name="spouse_education"
                      value={basicInformationDonorFemaleData?.spouse_education}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          spouse_education: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Occupation</h3>
              <ul className="grid_wrapper">
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Donor Occupation"
                    name="donor_occupation"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Donor Occupation"
                      name="donor_occupation"
                      value={basicInformationDonorFemaleData?.donor_occupation}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          donor_occupation: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Spouse Occupation"
                    name="spouse_occupation"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Spouse Occupation"
                      name="spouse_occupation"
                      value={basicInformationDonorFemaleData?.spouse_occupation}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          spouse_occupation: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Monthly Income (INR)"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name="monthly_income"
                      type="number"
                      placeholder="0"
                      value={basicInformationDonorFemaleData?.monthly_income}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          monthly_income: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">History</h3>
              <ul className="grid_wrapper">
                <li className="w_190 w_xs_100">
                  <Form.Item
                    label="Number of deliveries"
                    name="no_of_deliveries"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name="no_of_deliveries"
                      type="number"
                      placeholder="0"
                      value={basicInformationDonorFemaleData?.no_of_deliveries}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          no_of_deliveries: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_100">
                  <Form.Item
                    label="Number of abortions"
                    name="no_of_abortion"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name="no_of_abortion"
                      type="number"
                      placeholder="0"
                      value={basicInformationDonorFemaleData?.no_of_abortion}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          no_of_abortion: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_390 w_xs_100">
                  <Form.Item
                    label="Other points of note"
                    name="points_of_note"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Note"
                      name="points_of_note"
                      value={basicInformationDonorFemaleData?.points_of_note}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          points_of_note: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="History of use of contraceptives"
                    name="use_of_contraceptives"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      name="use_of_contraceptives"
                      value={basicInformationDonorFemaleData?.use_of_contraceptives}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          use_of_contraceptives: value,
                        });
                      }}
                      options={[
                        { value: 'Cut', label: 'Cut' },
                        { value: 'Condom', label: 'Condom' },
                        { value: 'UC pills', label: 'UC pills' },
                        { value: 'Withdrawal method', label: 'Withdrawal method' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Medical history"
                    name="medical_history"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      name="medical_history"
                      value={basicInformationDonorFemaleData?.medical_history}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          medical_history: value,
                        });
                      }}

                      options={[
                        { value: 'Diabetes mellitus', label: 'Diabetes mellitus' },
                        { value: 'Hypotharolousm', label: 'Hypotharolousm' },
                        { value: 'Hyperthyrousm', label: 'Hyperthyrousm' },
                        { value: 'Hypertension', label: 'Hypertension' },
                        { value: 'Chalesemia minor', label: 'Chalesemia minor' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="History of any abnormality in a child of donor"
                    name="abnoramility_in_child"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      name="abnoramility_in_child"
                      value={basicInformationDonorFemaleData?.abnoramility_in_child}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          abnoramility_in_child: value,
                        });
                      }}
                      options={[
                        { value: true, label: 'Yes' },
                        { value: false, label: 'No' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="History of blood transfusion"
                    name="blood_transfusion"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Note"
                      name="blood_transfusion"
                      value={basicInformationDonorFemaleData?.blood_transfusion}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          blood_transfusion: e.target.value,
                        });
                      }}

                    />
                  </Form.Item>
                </li>
                <li className="w_390 w_xs_100">
                  <Form.Item
                    label="History of substance abuse"
                    name="substance_abuse"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Note"
                      name="substance_abuse"
                      value={basicInformationDonorFemaleData?.substance_abuse}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          substance_abuse: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Menstrual History</h3>
              <ul className="grid_wrapper">
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Regularity"
                    name="regularity"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      name="regularity"
                      value={basicInformationDonorFemaleData?.regularity}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          regularity: value,
                        });
                      }}
                      options={regularityOptions}
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Duration (Days)"
                    name="duration"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name="duration"
                      type="number"
                      placeholder="0"
                      value={basicInformationDonorFemaleData?.duration}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          duration: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Distance (Days)"
                    name="distance"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name="distance"
                      type="number"
                      placeholder="0"
                      value={basicInformationDonorFemaleData?.distance}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          distance: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_370 w_xs_100">
                  <Form.Item
                    label="Intensity"
                    name="intensity"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      name="intensity"
                      value={basicInformationDonorFemaleData?.intensity}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          intensity: value,
                        });
                      }}
                      options={intensityOptions}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Features</h3>
              <ul className="grid_wrapper">
                <li className="w_190 w_xs_100">
                  <Form.Item
                    label="Height"
                    name="height"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name="height"
                      type="number"
                      placeholder="0"
                      value={basicInformationDonorFemaleData?.height}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          height: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_100">
                  <Form.Item
                    label="Weight (KG)"
                    name="weight"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name="weight"
                      type="number"
                      placeholder="0"
                      value={basicInformationDonorFemaleData?.weight}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          weight: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_350 w_xs_100">
                  <Form.Item
                    label="Colour of skin"
                    name="colour_of_skin"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      name="colour_of_skin"
                      value={basicInformationDonorFemaleData?.colour_of_skin}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          colour_of_skin: value,
                        });
                      }}
                      options={[
                        { value: 'Fair', label: 'Fair' },
                        { value: 'Wheatish', label: 'Wheatish' },
                        { value: 'Black', label: 'Black' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_350 w_xs_100">
                  <Form.Item
                    label="Colour of hair"
                    name="colour_of_hair"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      name="colour_of_hair"
                      value={basicInformationDonorFemaleData?.colour_of_hair}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          colour_of_hair: value,
                        });
                      }}
                      options={[
                        { value: 'Brown', label: 'Brown' },
                        { value: 'Black', label: 'Black' },
                        { value: 'Blond', label: 'Blond' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_350 w_xs_100">
                  <Form.Item
                    label="Colour of eyes"
                    name="colour_of_eyes"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      name="colour_of_eyes"
                      value={basicInformationDonorFemaleData?.colour_of_eyes}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          colour_of_eyes: value,
                        });
                      }}
                      options={[
                        { value: 'Black', label: 'Black' },
                        { value: 'Grey', label: 'Grey' },
                        { value: 'Brown', label: 'Brown' },
                        { value: 'Excessive', label: 'Excessive' },
                        { value: 'Blue', label: 'Blue' },
                        { value: 'Green', label: 'Green' },
                      ]}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Detailed physical examination</h3>
              <ul className="grid_wrapper">
                <li className="w_190 w_xs_100">
                  <Form.Item
                    label="Pulse (Per Min)"
                    name="pulse"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name="pulse"
                      placeholder="0"
                      value={basicInformationDonorFemaleData?.pulse}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          pulse: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_100">
                  <Form.Item
                    label="Blood pressure (mmHg)"
                    name="blood_pressure"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Blood pressure"
                      name="blood_pressure"
                      value={basicInformationDonorFemaleData?.blood_pressure}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          blood_pressure: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_350 w_xs_100">
                  <Form.Item
                    label="Temperature (F)"
                    name="temperature"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name="temperature"
                      type="number"
                      placeholder="0"
                      value={basicInformationDonorFemaleData?.temperature}
                      onChange={e => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          temperature: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_350 w_xs_100">
                  <Form.Item
                    label="Respiratory system AEBE Clear"
                    name="respiratory_aebe_clear"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      name="respiratory_aebe_clear"
                      value={basicInformationDonorFemaleData?.respiratory_aebe_clear}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          respiratory_aebe_clear: value,
                        });
                      }}
                      options={[
                        { value: true, label: 'Yes' },
                        { value: false, label: 'No' },
                      ]}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Cardiovascular system</h3>
              <ul className="grid_wrapper">
                <li className="w_300 w_xs_100">
                  <Form.Item
                    label="Murmur"
                    name="murmur"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      placeholder="Select Murmur"
                      name="murmur"
                      value={basicInformationDonorFemaleData?.murmur}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          murmur: value,
                        });
                      }}
                      options={[
                        { value: true, label: 'Yes' },
                        { value: false, label: 'No' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_300 w_xs_100">
                  <Form.Item
                    label="S1 S2"
                    name="s1s2"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      name="s1s2"
                      value={basicInformationDonorFemaleData?.s1s2}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          s1s2: value,
                        });
                      }}
                      options={[
                        { value: true, label: 'Yes' },
                        { value: false, label: 'No' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_400 w_xs_100">
                  <Form.Item
                    label="Per abdominal examination"
                    name="abdominal_examination"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      name="abdominal_examination"
                      value={basicInformationDonorFemaleData?.abdominal_examination}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          abdominal_examination: value,
                        });
                      }}
                      options={[
                        { value: 'Soft', label: 'Soft' },
                        { value: 'Tender', label: 'Tender' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className="w_400 w_xs_100">
                  <Form.Item
                    label="No Organomegaly"
                    name="organomegaly"
                    className="custom_select"
                    rules={[
                      {
                        required: true,
                        message: '',
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
                      name="organomegaly"
                      value={basicInformationDonorFemaleData?.organomegaly}
                      onChange={value => {
                        setBasicInformationDonorFemaleData({
                          ...basicInformationDonorFemaleData,
                          organomegaly: value,
                        });
                      }}
                      options={[
                        { value: true, label: 'Yes' },
                        { value: false, label: 'No' },
                      ]}
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
                    value={basicInformationDonorFemaleData?.notes}
                    onChange={(e) => {
                      setBasicInformationDonorFemaleData({
                        ...basicInformationDonorFemaleData,
                        notes: e.target.value,
                      });
                    }}
                    placeholder="Notes"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {Object.keys(patientBasicHistoryDetail)?.length > 0 ?
              (userType === 1 || moduleDetail?.edit) && <Button className="btn_primary me-3" htmlType="submit">Update</Button> :
              (userType === 1 || moduleDetail?.create) && <Button className="btn_primary me-3" htmlType="submit">Save</Button>
            }
            <Button className="btn_gray" onClick={handleCancel}>Cancel</Button>
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
  )
}

export default DonorFemalePatientHistory
