import React, { useState } from 'react'
import { Button, Form, Input, Radio, Select } from 'antd';
import { useDispatch } from 'react-redux';
import {
  createPatientBasicHistoryDetails,
  setPatientBasicHistoryDetail,
  updatePatientBasicHistory
} from 'redux/reducers/PatientBasicHistory/patientBasicHistory.slice';
import { useEffect, useCallback } from 'react';
import { setSelectedPatient } from 'redux/reducers/common.slice';
import { clearData } from 'redux/reducers/SearchPanel/globalSearch.slice';
import TextArea from 'antd/es/input/TextArea';

const DonorMalePatientHistory = ({ userType, locationId, selectedPatient, moduleDetail, patientBasicHistoryDetail }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [basicInformationDonorMaleData, setBasicInformationDonorMaleData] = useState({
    // patient_id: "",
    // patient_full_name: "",
    // attending_dr: "",
    // partner_age: "",
    colour_of_hair: null,
    colour_of_eyes: null,
    colour_of_skin: null,
    donor_info: "",
    quantity: '',
    health_looks: null,
    height: '',
    weight: '',
    count_per_ml: '',
    motility_percent: '',
    agglutation: '',
    wbc: "",
    rbc: '',
    // blood_group: null,
    facial_feature: null,
    congenital_deformities: false,
    genetically_acquired_disease: false,
    chronic_illness: false,
    disease_to_blood_relative: false,
    disease_to_family_member: false,
    habits: "",
    education_qualification: "",
    notes: "",
  })
  // useEffect(() => {
  //   if (Object.entries(selectedPatient)?.length > 0) {
  //     const currentDate = moment();
  //     const dob = moment(new Date(selectedPatient.patient_dob));
  //     const patientAge = diffYMD(currentDate, dob) || null;
  //     setBasicInformationDonorMaleData({
  //       patient_id: selectedPatient.patient_id,
  //       patient_full_name: selectedPatient.patient_full_name,
  //       attending_dr: selectedPatient.attending_dr,
  //       partner_age: patientAge,
  //       blood_group: selectedPatient.patient_blood_group
  //     })
  //     form.setFieldsValue({
  //       patient_id: selectedPatient.patient_id,
  //       patient_full_name: selectedPatient.patient_full_name,
  //       attending_dr: selectedPatient.attending_dr,
  //       partner_age: patientAge,
  //       blood_group: selectedPatient.patient_blood_group
  //     })
  //   }
  //   return () => {
  //     clearDonorMaleForm();
  //   }
  // }, [selectedPatient])

  const clearDonorMaleForm = useCallback(
    () => {
      setBasicInformationDonorMaleData({
        // patient_id: "",
        // patient_full_name: "",
        // attending_dr: "",
        // partner_age: "",
        colour_of_hair: null,
        colour_of_eyes: null,
        colour_of_skin: null,
        donor_info: "",
        quantity: '',
        health_looks: null,
        height: '',
        weight: '',
        count_per_ml: '',
        motility_percent: '',
        agglutation: '',
        wbc: "",
        rbc: '',
        // blood_group: null,
        facial_feature: null,
        congenital_deformities: false,
        genetically_acquired_disease: false,
        chronic_illness: false,
        disease_to_blood_relative: false,
        disease_to_family_member: false,
        habits: "",
        education_qualification: "",
        notes: ""
      });

      form.setFieldsValue({
        // patient_id: "",
        // patient_full_name: "",
        // attending_dr: "",
        // partner_age: "",
        colour_of_hair: null,
        colour_of_eyes: null,
        colour_of_skin: null,
        donor_info: "",
        quantity: '',
        health_looks: null,
        height: '',
        weight: '',
        count_per_ml: '',
        motility_percent: '',
        agglutation: '',
        wbc: "",
        rbc: '',
        facial_feature: null,
        congenital_deformities: false,
        genetically_acquired_disease: false,
        chronic_illness: false,
        disease_to_blood_relative: false,
        disease_to_family_member: false,
        habits: "",
        education_qualification: "",
        notes: ""
      })
    },
    [form],
  )
  useEffect(() => {
    if (Object.entries(patientBasicHistoryDetail)?.length > 0) {
      // const currentDate = moment();
      // const dob = moment(new Date(selectedPatient.patient_dob));
      // const patientAge = diffYMD(currentDate, dob) || null;
      setBasicInformationDonorMaleData({
        // patient_id: patientBasicHistoryDetail.patient_id,
        // attending_dr: patientBasicHistoryDetail.attending_dr,
        bmi: patientBasicHistoryDetail.bmi,
        // partner_age: patientAge,
        colour_of_hair: patientBasicHistoryDetail.colour_of_hair,
        colour_of_eyes: patientBasicHistoryDetail.colour_of_eyes,
        colour_of_skin: patientBasicHistoryDetail.colour_of_skin,
        donor_info: patientBasicHistoryDetail.donor_info,
        quantity: patientBasicHistoryDetail.quantity,
        count_per_ml: patientBasicHistoryDetail.count_per_ml,
        motility_percent: patientBasicHistoryDetail.motility_percent,
        agglutation: patientBasicHistoryDetail.agglutation,
        health_looks: patientBasicHistoryDetail.health_looks,
        height: patientBasicHistoryDetail.height,
        weight: patientBasicHistoryDetail.weight,
        wbc: patientBasicHistoryDetail.wbc,
        rbc: patientBasicHistoryDetail.rbc,
        facial_feature: patientBasicHistoryDetail.facial_feature,
        congenital_deformities: patientBasicHistoryDetail.congenital_deformities,
        genetically_acquired_disease: patientBasicHistoryDetail.genetically_acquired_disease,
        chronic_illness: patientBasicHistoryDetail.chronic_illness,
        disease_to_blood_relative: patientBasicHistoryDetail.disease_to_blood_relative,
        disease_to_family_member: patientBasicHistoryDetail.disease_to_family_member,
        habits: patientBasicHistoryDetail.habits,
        education_qualification: patientBasicHistoryDetail.education_qualification,
        notes: patientBasicHistoryDetail.notes
      });
      form.setFieldsValue({
        // patient_id: patientBasicHistoryDetail.patient_id,
        // attending_dr: patientBasicHistoryDetail.attending_dr,
        // partner_age: patientAge,
        colour_of_hair: patientBasicHistoryDetail.colour_of_hair,
        colour_of_eyes: patientBasicHistoryDetail.colour_of_eyes,
        colour_of_skin: patientBasicHistoryDetail.colour_of_skin,
        health_looks: patientBasicHistoryDetail.health_looks,
        donor_info: patientBasicHistoryDetail.donor_info,
        quantity: patientBasicHistoryDetail.quantity,
        bmi: patientBasicHistoryDetail.bmi,
        count_per_ml: patientBasicHistoryDetail.count_per_ml,
        motility_percent: patientBasicHistoryDetail.motility_percent,
        agglutation: patientBasicHistoryDetail.agglutation,
        height: patientBasicHistoryDetail.height,
        weight: patientBasicHistoryDetail.weight,
        wbc: patientBasicHistoryDetail.wbc,
        rbc: patientBasicHistoryDetail.rbc,
        facial_feature: patientBasicHistoryDetail.facial_feature,
        congenital_deformities: patientBasicHistoryDetail.congenital_deformities,
        genetically_acquired_disease: patientBasicHistoryDetail.genetically_acquired_disease,
        chronic_illness: patientBasicHistoryDetail.chronic_illness,
        disease_to_blood_relative: patientBasicHistoryDetail.disease_to_blood_relative,
        disease_to_family_member: patientBasicHistoryDetail.disease_to_family_member,
        habits: patientBasicHistoryDetail.habits,
        education_qualification: patientBasicHistoryDetail.education_qualification,
        notes: patientBasicHistoryDetail.notes
      });
    }
    return () => {
      clearDonorMaleForm();
    }
  }, [patientBasicHistoryDetail, form, selectedPatient, clearDonorMaleForm]);
  const onFinish = values => {
    Object.keys(patientBasicHistoryDetail)?.length > 0 ?
      dispatch(updatePatientBasicHistory({
        id: patientBasicHistoryDetail._id,
        locationId: locationId,
        moduleId: moduleDetail?._id,
        payload: basicInformationDonorMaleData
      }))
      : dispatch(
        createPatientBasicHistoryDetails({
          locationId: locationId,
          patientRegId: selectedPatient?._id,
          moduleId: moduleDetail?._id,
          payload: basicInformationDonorMaleData
        }),
      );
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const calculateBmi = useCallback(
    (height, weight) => {
      if (height && weight) {
        const heightInMeters = height / 100;
        const bmi = (
          weight /
          (heightInMeters * heightInMeters)
        ).toFixed(2);
        return bmi || '0.00'
      }
      return ''
    },
    [],
  )

  const handleChangeHeightWidth = useCallback(
    (name, value) => {
      const bmiValue = name === 'height' ? calculateBmi(value, basicInformationDonorMaleData.width) : calculateBmi(basicInformationDonorMaleData.height, value)
      setBasicInformationDonorMaleData({
        ...basicInformationDonorMaleData,
        [name]: value,
        bmi: bmiValue
      });
      bmiValue && form.setFieldsValue({ bmi: bmiValue })
    },
    [setBasicInformationDonorMaleData, form, basicInformationDonorMaleData, calculateBmi],
  )


  const handleCancel = () => {
    clearDonorMaleForm();
    dispatch(setSelectedPatient({}));
    dispatch(setPatientBasicHistoryDetail({}))
    dispatch(clearData())
  };
  return (
    <div className="page_main_content" >

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
                    <label>Attending Dr. :</label>
                    <span>{selectedPatient?.attending_dr ? selectedPatient?.attending_dr : ""}</span>
                  </li>
                  <li>
                    <label>Blood Group :</label>
                    <span>{selectedPatient?.patient_blood_group ? selectedPatient?.patient_blood_group : ""}</span>
                  </li>
                  <li>
                    <label>Partner Age :</label>
                    <span>{basicInformationDonorMaleData?.partner_age ? basicInformationDonorMaleData?.partner_age : ""}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Basic Information (Donor - Male)</h3>
              <ul className="grid_wrapper">
                {/* <li className="w_250 w_xs_100">
                  <Form.Item
                    label="Patient ID"
                    name="patient_id"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Patient ID"
                      name="patient_id"
                      value={basicInformationDonorMaleData?.patient_id}
                      onChange={e => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          patient_id: e.target.value,
                        });
                      }}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                {/* <li className="w_350 w_xs_100">
                  <Form.Item label="Patient Name" name="patient_full_name" className='disabledInput' rules={[
                    {
                      required: true,
                      message: '',
                    },
                  ]} >
                    <Input
                      placeholder="Enter Patient Name"
                      name="patient_full_name"
                      value={basicInformationDonorMaleData?.patient_full_name}
                      onChange={e => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          patient_full_name: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li> */}
                {/* <li className="w_350 w_xs_100">
                  <Form.Item
                    label="Attending Dr."
                    className='disabledInput'
                    name="attending_dr"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Attending Dr."
                      name="attending_dr"
                      value={basicInformationDonorMaleData?.attending_dr}
                      onChange={e => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          attending_dr: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li> */}
                <li className="w_240 w_xs_50">
                  <Form.Item label="Height (cm)" rules={[
                    {
                      required: true,
                      message: '',
                    },
                  ]} name="height">
                    <Input
                      type="number"
                      placeholder="Enter Height (cm)"
                      name="height"
                      value={basicInformationDonorMaleData?.height}
                      onChange={e => {
                        handleChangeHeightWidth('height', e.target.value)
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_240 w_xs_50">
                  <Form.Item label="Weight (kg)" type="number"
                    placeholder="0"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]} name="weight">
                    <Input
                      type="number"
                      placeholder="Enter Weight (kg)"
                      name="weight"
                      value={basicInformationDonorMaleData?.weight}
                      onChange={e => {
                        handleChangeHeightWidth('weight', e.target.value)
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_240 w_xs_50">
                  <Form.Item label="Donor Information" name="donor_info"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name='donor_info'
                      placeholder="Enter Donor Info"
                      value={basicInformationDonorMaleData?.donor_info}
                      onChange={e => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          donor_info: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_240 w_xs_50">
                  <Form.Item label="BMI" className='disabledInput' name="bmi"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter BMI"
                      name="bmi"
                      value={basicInformationDonorMaleData?.bmi}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="Count (ml)" name="count_per_ml"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name='count_per_ml'
                      type="number"
                      placeholder="0"
                      value={basicInformationDonorMaleData?.count_per_ml}
                      onChange={e => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          count_per_ml: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_240 w_xs_50">
                  <Form.Item label="Agglutation" name="agglutation"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name='agglutation'
                      placeholder="Enter Agglutation"
                      value={basicInformationDonorMaleData?.agglutation}
                      onChange={e => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          agglutation: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_240 w_xs_50">
                  <Form.Item label="Motility %" name="motility_percent"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name='motility_percent'
                      type="number"
                      placeholder="Enter Motility"
                      value={basicInformationDonorMaleData?.motility_percent}
                      onChange={e => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          motility_percent: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_240 w_xs_50">
                  <Form.Item label="WBCs" name="wbc"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name='wbc'
                      placeholder="Enter WBCs"
                      value={basicInformationDonorMaleData?.wbc}
                      onChange={e => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          wbc: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50">
                  <Form.Item label="RBCs" name="rbc"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name="rbc"
                      placeholder="Enter RBCs"
                      value={basicInformationDonorMaleData?.rbc}
                      onChange={e => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          rbc: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_50">
                  <Form.Item label="Quantity" name="quantity"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name='quantity'
                      type="number"
                      placeholder="0"
                      value={basicInformationDonorMaleData?.quantity}
                      onChange={e => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          quantity: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                {/* <li className="w_200 w_xs_100">
                  <Form.Item
                    label="Blood Group"
                    name="blood_group"
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
                      options={bloodGroupOptions}
                      disabled
                      name="blood_group"
                      value={basicInformationDonorMaleData?.blood_group}
                      onChange={value => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          blood_group: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li> */}
                {/* <li className="w_200 w_xs_50">
                  <Form.Item label="Age" name="partner_age"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Age"
                      name="partner_age"
                      value={basicInformationDonorMaleData?.partner_age}
                      onChange={e => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          partner_age: e.target.value,
                        });
                      }}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                <li className="w_200 w_xs_100">
                  <Form.Item
                    label="Facial Feature"
                    name="facial_feature"
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
                      name='facial_feature'
                      options={[
                        { value: 'Sharp', label: 'Sharp' },
                        { value: 'Normal', label: 'Normal' },

                      ]}
                      value={basicInformationDonorMaleData?.facial_feature}
                      onChange={value => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          facial_feature: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_100">
                  <Form.Item
                    label="Health Looks"
                    name="health_looks"
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
                      name='health_looks'
                      placeholder="Select"
                      options={[
                        { value: 'Sharp', label: 'Sharp' },
                        { value: 'Normal', label: 'Normal' },
                      ]}
                      value={basicInformationDonorMaleData?.custom_select}
                      onChange={value => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          health_looks: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_200 w_xs_100">
                  <Form.Item
                    label="Color of Hair"
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
                      options={[
                        { value: 'Brown', label: 'Brown' },
                        { value: 'Black', label: 'Black' },
                        { value: 'Blond', label: 'Blond' }
                      ]}
                      value={basicInformationDonorMaleData?.colour_of_hair}
                      onChange={value => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          colour_of_hair: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_350 w_xs_100">
                  <Form.Item
                    label="Color Of Eye"
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
                      options={[
                        { value: 'Black', label: 'Black' },
                        { value: 'Grey', label: 'Grey' },
                        { value: 'Brown', label: 'Brown' },
                        { value: 'Excessive', label: 'Excessive' },
                        { value: 'Blue', label: 'Blue' },
                        { value: 'Green', label: 'Green' },
                      ]}
                      value={basicInformationDonorMaleData?.colour_of_eyes}
                      onChange={value => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          colour_of_eyes: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_320 w_xs_100">
                  <Form.Item
                    label="Skin Tone"
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
                      options={[
                        { value: 'Fair', label: 'Fair' },
                        { value: 'Wheatish', label: 'Wheatish' },
                        { value: 'Black', label: 'Black' },
                      ]}
                      value={basicInformationDonorMaleData?.colour_of_skin}
                      onChange={value => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          colour_of_skin: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_350 w_xs_100">
                  <Form.Item
                    label="Habits"
                    name="habits"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name="habits"
                      placeholder="Enter Habits"
                      value={basicInformationDonorMaleData?.habits}
                      onChange={e => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          habits: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_350 w_xs_100">
                  <Form.Item
                    label="Education Qualification"
                    name="education_qualification"
                    rules={[
                      {
                        required: true,
                        message: '',
                      },
                    ]}
                  >
                    <Input
                      name='education_qualification'
                      placeholder="Enter Education Qualification"
                      value={basicInformationDonorMaleData?.education_qualification}
                      onChange={e => {
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          education_qualification: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_240 w_xs_100">
                  <div className='radio_wrapper'>
                    <label htmlFor="">Any Genetically Acquired Disease</label>
                    <Radio.Group name='genetically_acquired_disease'
                      onChange={(e) =>
                        setBasicInformationDonorMaleData({
                          ...basicInformationDonorMaleData,
                          genetically_acquired_disease: e.target.value,
                        })
                      } value={basicInformationDonorMaleData?.genetically_acquired_disease}>
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  </div>
                </li>
                <li className="w_240 w_xs_100">
                  <div className='radio_wrapper'>
                    <label htmlFor="">History of any Chronic Illness</label>
                    <Radio.Group name='chronic_illness' onChange={(e) => setBasicInformationDonorMaleData({
                      ...basicInformationDonorMaleData,
                      chronic_illness: e.target.value,
                    })} value={basicInformationDonorMaleData?.chronic_illness}>
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  </div>
                </li>
                <li className="w_240 w_xs_100">
                  <div className='radio_wrapper'>
                    <label htmlFor="">Serious Disease to any close blood relative</label>
                    <Radio.Group name='disease_to_blood_relative' onChange={(e) => setBasicInformationDonorMaleData({
                      ...basicInformationDonorMaleData,
                      disease_to_blood_relative: e.target.value,
                    })} value={basicInformationDonorMaleData?.disease_to_blood_relative}>
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  </div>
                </li>
                <li className="w_240 w_xs_100">
                  <div className='radio_wrapper'>
                    <label htmlFor="">Any Congenital Deformities</label>
                    <Radio.Group name='congenital_deformities' onChange={(e) => setBasicInformationDonorMaleData({
                      ...basicInformationDonorMaleData,
                      congenital_deformities: e.target.value,
                    })} value={basicInformationDonorMaleData?.congenital_deformities}>
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  </div>
                </li>
                <li className="w_240 w_xs_100">
                  <div className='radio_wrapper'>
                    <label htmlFor="">Serious Disease to any family member</label>
                    <Radio.Group name='disease_to_family_member' onChange={(e) => setBasicInformationDonorMaleData({
                      ...basicInformationDonorMaleData,
                      disease_to_family_member: e.target.value,
                    })} value={basicInformationDonorMaleData?.disease_to_family_member}>
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  </div>
                </li>
              </ul>
            </div>
            <div className="note_wrap">
              <span className='fw-bold'>Note : </span>
              A Six-Month Quarantine Period Ensures That the Donor No.{basicInformationDonorMaleData.donor_info ? basicInformationDonorMaleData.donor_info : "_____"} is found Negative FOr HIV-I & II, HbsAg, VDRL, HCV & Thalassemia
            </div>
            <div>
              <Form.Item name="notes">
                <TextArea
                  rows={4}
                  name="notes"
                  placeholder="Notes"
                  value={basicInformationDonorMaleData.donor_info?.notes}
                  onChange={(e) => {
                    setBasicInformationDonorMaleData({
                      ...basicInformationDonorMaleData,
                      notes: e.target.value,
                    });
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {Object.keys(patientBasicHistoryDetail)?.length > 0 ?
              (userType === 1 || moduleDetail?.edit) && <Button className="btn_primary me-3" htmlType="submit">Update</Button> :
              (userType === 1 || moduleDetail?.create) && <Button className="btn_primary me-3" htmlType="submit">Save</Button>
            }
            <Button className="btn_gray" onClick={handleCancel}>Cancel</Button>
          </div>
        </Form>
      </div >
    </div >
  )
}

export default DonorMalePatientHistory
