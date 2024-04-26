import { useMemo, useState, useEffect, useCallback } from "react";
import { Button, DatePicker, Form, Input, Select, Space, Upload } from "antd";
import { Col, Row } from "react-bootstrap";
import UserImg from "../../Img/placeholder.png";
import UploadIcon from "../../Img/upload.svg";
import RemoveIcon from "../../Img/Close.svg";
import PhoneWithCountry from "Components/Auth/PhoneWithCountry";
import countryList from "react-select-country-list";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  setUploadImageDetail,
  uploadImage,
} from "redux/reducers/UploadImage/uploadImage.slice";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  createPatientDetails,
  getPatientData,
  printPatientDetails,
  setIsPatientUpdated,
  setPatientCreated,
  setPatientDetail,
  updatePatientDetails,
} from "redux/reducers/PatientRegistration/patientRegistration.slice";
import { getTypeWiseUserListData } from "redux/reducers/Role/role.slice";
import { setSelectedPatient } from "redux/reducers/common.slice";
import {
  clearData,
  getGlobalSearch,
  setGlobalSearchFileValue,
} from "redux/reducers/SearchPanel/globalSearch.slice";
import { diffYMD } from "utils/CommonFunctions";
import {
  allergyOptions,
  bloodGroupOptions,
  iDCardOptions,
  referenceTypeOption,
} from "utils/FieldValues";
import { useLocation } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
const basicInfoInitialData = {
  hospital_id: "",
  patient_id: "",
  type_of_patient: null,
  type_of_treatment: null,
  today_date: moment(new Date()).format('DD-MM-YYYY'),
};

export default function HomePage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [form] = Form.useForm();
  const dateFormat = "DD-MM-YYYY";
  const partnerDetailsValidation = [2, 4, 5];
  const patientDetailsValidation = [3];
  const marriedCouplelsValidation = [1];
  const adharCardPattern = /^[0-9]{12}$/;
  const panCardPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const passportPattern = /^[A-Z0-9]{8}$/;
  const voterIdPattern = /^[A-Z]{3}[0-9]{7}$/;
  const drivingLicPattern = /^[A-Z]{2}[0-9]{13}$/;
  const { moduleList, seniorConsultantUserList, selectedLocation, userType } =
    useSelector(({ role }) => role);
  const { selectedPatient } = useSelector(({ common }) => common);
  const { getUploadImage, isUploadImageUpdated } = useSelector(
    ({ uploadImage }) => uploadImage
  );
  const { patientDetail, isPatientCreated, isPatientUpdated } = useSelector(
    ({ patientRegistration }) => patientRegistration
  );
  const selectedModule = useMemo(() => {
    return (
      moduleList?.find((item) => item?.module_name === location.pathname) || {}
    );
  }, [moduleList]);

  const [seniorConsultant, setSeniorConsultant] = useState([]);
  const [patientPhotoList, setPatientPhotoList] = useState([]);
  const [patientIdProofPhotoList, setPatientIdProofPhotoList] = useState([]);
  const [partnerPhotoList, setPartnerPhotoList] = useState([]);
  const [partnerIdProofPhotoList, setPartnerIdProofPhotoList] = useState([]);
  const [fileName, setFileName] = useState("");
  const [patientMobileNumber, setPatientMobileNumber] = useState("");
  const [partnerMobileNo, setPartnerMobileNo] = useState("");
  const [updatedUser, setUpdatedUser] = useState({});
  const [basicInfo, setBasicInfo] = useState(basicInfoInitialData);
  const [isSubmitError, setIsSubmitError] = useState({
    patientMobileNumber: false, partnerMobileNo: false
  });
  const [patientInfo, setPatientInfo] = useState({
    patient_firstname: "",
    patient_middlename: "",
    patient_lastname: "",
    patient_dob: "",
    patient_age: "",
    patient_blood_group: null,
    patient_id_card: null,
    patient_id_card_no: "",
    patient_photo: "",
    patient_id_proof_photo: "",
  });
  const [partnerInfo, setPartnerInfo] = useState({
    partner_firstname: "",
    partner_middlename: "",
    partner_lastname: "",
    partner_dob: "",
    partner_age: "",
    partner_blood_group: null,
    partner_id_card: null,
    partner_id_card_no: "",
    partner_photo: "",
    partner_id_proof_photo: "",
  });
  const [contactInfo, setContactInfo] = useState({
    patient_email: "",
    patient_country_code: "",
    patient_mobile_no: "",
    partner_email: "",
    partner_country_code: "",
    partner_mobile_no: "",
  });
  const [addressInfo, setAddressInfo] = useState({
    street_address: "",
    city: "",
    state: "",
    nationality: null,
  });
  const [otherInfo, setOtherInfo] = useState({
    anniversary: "",
    allergy: false,
    reference: "",
    reference_by: null,
    senior_consultant: "",
    notes: ""
  });
  const options = useMemo(
    () =>
      countryList()
        .getData()
        .map((country) => ({
          label: country.label,
          value: country.label,
        })),
    []
  );
  const handlePatientMobileNoChange = (phone, country) => {
    phone &&
      setIsSubmitError((prevState) => (
        {
          ...prevState,
          patientMobileNumber: false
        }
      ))

    setPatientMobileNumber(phone);
    form.setFieldsValue({ patientMobileNumber: phone });
    setContactInfo({ ...contactInfo, patient_country_code: country?.dialCode });
  };
  const handlePartnerMobileNoChange = (phone, country) => {
    phone &&
      setIsSubmitError((prevState) => (
        {
          ...prevState,
          partnerMobileNo: false
        }
      ))

    setPartnerMobileNo(phone);
    form.setFieldsValue({ partnerMobileNo: phone });
    setContactInfo({ ...contactInfo, partner_country_code: country?.dialCode });
  };
  useEffect(() => {
    if (selectedLocation && seniorConsultantUserList.length === 0) {
      dispatch(
        getTypeWiseUserListData({ location_id: selectedLocation, user_type: 5 })
      );
    }
  }, [dispatch]);
  useEffect(() => {
    form.setFieldsValue({
      today_date: dayjs(
        moment(new Date()).format("DD-MM-YYYY"),
        "DD-MM-YYYY"
      )
    });
    const seniorConsultantUser =
      seniorConsultantUserList?.map((user) => {
        return { value: user._id, label: user.user_name };
      }) || [];
    setSeniorConsultant(seniorConsultantUser);
  }, [seniorConsultantUserList]);

  useEffect(() => {
    if (Object.entries(patientDetail).length > 0) {
      calculatePatientAge(
        moment(new Date(patientDetail?.patient_dob)).format("DD/MM/YYYY")
      );
      calculatePartnerAge(
        moment(new Date(patientDetail?.partner_dob)).format("DD/MM/YYYY")
      );
      setBasicInfo({
        hospital_id: patientDetail?.hospital_id,
        patient_id: patientDetail?.patient_id,
        type_of_patient: patientDetail?.type_of_patient,
        type_of_treatment: patientDetail?.type_of_treatment,
        today_date: moment(new Date(patientDetail?.today_date)).format(
          "DD/MM/YYYY"
        ),
      });
      setPatientMobileNumber(
        patientDetail?.patient_country_code + patientDetail?.patient_mobile_no
      );
      setPartnerMobileNo(
        patientDetail?.partner_country_code + patientDetail?.partner_mobile_no
      );
      setPatientInfo({
        patient_firstname: patientDetail?.patient_firstname,
        patient_middlename: patientDetail?.patient_middlename,
        patient_lastname: patientDetail?.patient_lastname,
        patient_dob: moment(new Date(patientDetail?.patient_dob)).format(
          "DD/MM/YYYY"
        ),
        patient_blood_group: patientDetail?.patient_blood_group,
        patient_id_card: patientDetail?.patient_id_card,
        patient_id_card_no: patientDetail?.patient_id_card_no,
        patient_photo: patientDetail?.patient_photo,
        patient_id_proof_photo: patientDetail?.patient_id_proof_photo,
      });
      setPartnerInfo({
        partner_firstname: patientDetail?.partner_firstname,
        partner_middlename: patientDetail?.partner_middlename,
        partner_lastname: patientDetail?.partner_lastname,
        partner_dob: moment(new Date(patientDetail?.partner_dob)).format(
          "DD/MM/YYYY"
        ),
        partner_blood_group: patientDetail?.partner_blood_group,
        partner_id_card: patientDetail?.partner_id_card,
        partner_id_card_no: patientDetail?.partner_id_card_no,
        partner_photo: patientDetail?.partner_photo,
        partner_id_proof_photo: patientDetail?.partner_id_proof_photo,
      });
      setContactInfo({
        patient_email: patientDetail?.patient_email,
        patient_country_code: patientDetail?.patient_country_code,
        patient_mobile_no: patientDetail?.patient_mobile_no,
        partner_email: patientDetail?.partner_email,
        partner_country_code: patientDetail?.partner_country_code,
        partner_mobile_no: patientDetail?.partner_mobile_no,
      });
      setAddressInfo({
        street_address: patientDetail?.street_address,
        city: patientDetail?.city,
        state: patientDetail?.state,
        nationality: patientDetail?.nationality,
      });
      setOtherInfo({
        anniversary: patientDetail?.anniversary,
        allergy: patientDetail?.allergy,
        reference: patientDetail?.reference,
        reference_by: patientDetail?.reference_by,
        senior_consultant: patientDetail?.senior_consultant,
        notes: patientDetail?.notes,
      });
      form.setFieldsValue({
        partnerMobileNo: patientDetail?.partner_country_code + patientDetail?.partner_mobile_no,
        patientMobileNumber: patientDetail?.patient_country_code + patientDetail?.patient_mobile_no,
        type_of_patient: patientDetail?.type_of_patient,
        type_of_treatment: patientDetail?.type_of_treatment,
        patient_firstname: patientDetail?.patient_firstname,
        patient_middlename: patientDetail?.patient_middlename,
        patient_lastname: patientDetail?.patient_lastname,
        partner_firstname: patientDetail?.partner_firstname,
        partner_lastname: patientDetail?.partner_lastname,
        patient_email: patientDetail?.patient_email,
        partner_email: patientDetail?.partner_email,
        nationality: patientDetail?.nationality,
        street_address: patientDetail?.street_address,
        city: patientDetail?.city,
        state: patientDetail?.state,
        partner_blood_group: patientDetail?.partner_blood_group,
        patient_blood_group: patientDetail?.patient_blood_group,
        patient_id_card: patientDetail?.patient_id_card,
        patient_id_card_no: patientDetail?.patient_id_card_no,
        partner_id_card: patientDetail?.partner_id_card,
        partner_id_card_no: patientDetail?.partner_id_card_no,
        senior_consultant: patientDetail?.senior_consultant,
        reference_by: patientDetail?.reference_by,
        today_date: dayjs(
          moment(patientDetail?.today_date).format("DD-MM-YYYY"),
          "DD-MM-YYYY"
        ),
        patient_dob: dayjs(
          moment(patientDetail?.patient_dob).format("DD-MM-YYYY"),
          "DD-MM-YYYY"
        ),
        partner_dob: dayjs(
          moment(patientDetail?.partner_dob).format("DD-MM-YYYY"),
          "DD-MM-YYYY"
        ),
        anniversary: dayjs(
          moment(patientDetail?.anniversary).format("DD-MM-YYYY"),
          "DD-MM-YYYY"
        ),
        remark_note: patientDetail?.remark_note,
        notes: patientDetail?.notes,
      });
    }
  }, [patientDetail]);

  const changeHandler = (value) => {
    setAddressInfo({ ...addressInfo, nationality: value ? value : null });
  };

  const customUpload =
    (name) =>
      async ({ file, onSuccess, onError }) => {
        try {
          const formData = new FormData();
          formData.append("file", file);
          setFileName(name);
          dispatch(uploadImage(formData));

          if (name === "patient_photo") {
            setPatientPhotoList([file]);
          } else if (name === "patient_id_proof_photo") {
            setPatientIdProofPhotoList([file]);
          } else if (name === "partner_photo") {
            setPartnerPhotoList([file]);
          } else if (name === "partner_id_proof_photo") {
            setPartnerIdProofPhotoList([file]);
          }
          setTimeout(() => {
            onSuccess("Successfully uploaded");
          }, 1000);
        } catch (error) {
          onError("Upload failed");
        }
      };

  const handleRemove = (file, fileName) => {
    if (fileName === "patient_photo") {
      const newFileList = patientPhotoList.filter(
        (item) => item.uid !== file.uid
      );
      setPatientPhotoList(newFileList);
    } else if (fileName === "patient_id_proof_photo") {
      const newFileList = patientIdProofPhotoList.filter(
        (item) => item.uid !== file.uid
      );
      setPatientIdProofPhotoList(newFileList);
    } else if (fileName === "partner_photo") {
      const newFileList = partnerPhotoList.filter(
        (item) => item.uid !== file.uid
      );
      setPartnerPhotoList(newFileList);
    } else if (fileName === "partner_id_proof_photo") {
      const newFileList = partnerIdProofPhotoList.filter(
        (item) => item.uid !== file.uid
      );
      setPartnerIdProofPhotoList(newFileList);
    }
    dispatch(setUploadImageDetail(false));
  };

  const showErrorMessage = (error, response, fileListName) => {
    if (fileListName === "patient_photo") {
      toast.error("Error uploading patient photo.");
    } else if (fileName === "patient_id_proof_photo") {
      toast.error("Error uploading patient id proof photo.");
    } else if (fileName === "partner_photo") {
      toast.error("Error uploading partner photo.");
    } else if (fileName === "partner_id_proof_photo") {
      toast.error("Error uploading partner id proof photo.");
    }
  };
  useEffect(() => {
    if (isUploadImageUpdated) {
      if (fileName === "patient_photo") {
        setPatientInfo({
          ...patientInfo,
          patient_photo: getUploadImage?.file,
        });
      } else if (fileName === "patient_id_proof_photo") {
        setPatientInfo({
          ...patientInfo,
          patient_id_proof_photo: getUploadImage?.file,
        });
      } else if (fileName === "partner_photo") {
        setPartnerInfo({ ...partnerInfo, partner_photo: getUploadImage?.file });
      } else if (fileName === "partner_id_proof_photo") {
        setPartnerInfo({
          ...partnerInfo,
          partner_id_proof_photo: getUploadImage?.file,
        });
      }
    }
  }, [fileName, isUploadImageUpdated]);

  const calculatePatientAge = useCallback(
    (PatientDob) => {
      if (PatientDob) {
        const currentDate = moment();
        const dob = moment(PatientDob, "DD/MM/YYYY");
        const patientAge = diffYMD(currentDate, dob) || null;
        setPatientInfo({
          ...patientInfo,
          patient_age: patientAge,
        });
        form.setFieldsValue({
          patient_age: patientAge,
        });
      }
      else {
        setPatientInfo({
          ...patientInfo,
          patient_age: "",
          patient_dob: ""
        });
        form.setFieldsValue({
          patient_age: "",
          patient_dob: ""
        });
      }
    },
    [patientInfo, form]
  );

  const calculatePartnerAge = useCallback(
    (PartnerDob) => {
      if (PartnerDob === "DD-MM-YYYY") {
        setPatientInfo({
          ...patientInfo,
          partner_age: "",
          partner_dob: ""
        });
        form.setFieldsValue({
          partner_age: "",
          partner_dob: ""
        });
      }
      else {
        const currentDate = moment();
        const dob = moment(PartnerDob, "DD-MM-YYYY");
        const partnerAge = diffYMD(currentDate, dob) || null;
        setPartnerInfo({
          ...partnerInfo,
          partner_age: partnerAge,
        });
        form.setFieldsValue({
          partner_age: partnerAge,
        });
      }
    },
    [patientInfo, form]
  );

  const onFinishFailed = (errorInfo) => {
    if (!patientDetailsValidation.includes(
      basicInfo?.type_of_patient
    ) && !patientMobileNumber) {
      setIsSubmitError((prevState) => (
        {
          ...prevState,
          patientMobileNumber: true
        }
      ))
    }
    if (!partnerDetailsValidation.includes(
      basicInfo?.type_of_patient
    ) &&
      !partnerMobileNo) {
      setIsSubmitError((prevState) => (
        {
          ...prevState,
          partnerMobileNo: true
        }
      ))
    }
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onFinish = (values) => {
    const basicDetails = {
      ...basicInfo,
      today_date: basicInfo?.today_date
        ? moment(basicInfo?.today_date, "DD-MM-YYYY").format("YYYY-MM-DD")
        : null,
    };

    const patientDetails = {
      ...patientInfo,
      patient_dob: patientInfo?.patient_dob
        ? moment(patientInfo?.patient_dob, "DD-MM-YYYY").format("YYYY-MM-DD")
        : null,
    };

    const partnerDetails = {
      ...partnerInfo,
      partner_dob: partnerInfo?.partner_dob
        ? moment(partnerInfo?.partner_dob, "DD-MM-YYYY").format("YYYY-MM-DD")
        : null,
    };
    const contactDetail = {
      ...contactInfo,
      patient_mobile_no: patientMobileNumber.replace(
        contactInfo?.patient_country_code,
        ""
      ),
      partner_mobile_no: partnerMobileNo.replace(
        contactInfo?.partner_country_code,
        ""
      ),
    };
    const otherDetails = {
      ...otherInfo,
      anniversary: otherInfo?.anniversary
        ? moment(otherInfo?.anniversary, "DD-MM-YYYY").format("YYYY-MM-DD")
        : null,
    };
    const payload = {
      location_id: selectedLocation ? selectedLocation : "",
      ...basicDetails,
      ...patientDetails,
      ...partnerDetails,
      ...contactDetail,
      ...addressInfo,
      ...otherDetails,
    };
    setUpdatedUser(payload);
    if (selectedPatient?.patient_id) {
      dispatch(
        updatePatientDetails({
          patientRegistrationId: selectedPatient?._id,
          moduleId: selectedModule?._id,
          payload: payload,
        })
      );
    } else {
      patientRegister(payload);
    }
  };

  const patientRegister = useCallback(
    async (load) => {
      const { payload } = await dispatch(
        createPatientDetails({
          moduleId: selectedModule?._id,
          payload: load,
        })
      );
      if (payload && Object?.keys(payload)?.length > 0) {
        const res = await dispatch(
          getGlobalSearch({
            patient_reg_id: payload._id,
            patient_name: payload.patient_full_name,
            location_id: selectedLocation,
          })
        );
        if (res?.payload?.length > 0) {
          await dispatch(setSelectedPatient(res?.payload[0]));
          await dispatch(
            setGlobalSearchFileValue({
              _id: payload._id,
              patient_full_name: payload.patient_full_name,
            })
          );
        }
      }
      dispatch(setPatientCreated(false));
    },
    [dispatch, selectedModule?._id]
  );

  const clearPatientRegistrationForm = useCallback(() => {
    setBasicInfo(basicInfoInitialData);
    setPatientMobileNumber("");
    setPartnerMobileNo("");
    setIsSubmitError({ patientMobileNumber: false, partnerMobileNo: false })
    setPatientInfo({
      patient_firstname: "",
      patient_middlename: "",
      patient_lastname: "",
      patient_dob: "",
      patient_age: "",
      patient_blood_group: null,
      patient_id_card: null,
      patient_id_card_no: "",
      patient_photo: "",
      patient_id_proof_photo: "",
    });
    setPartnerInfo({
      partner_firstname: "",
      partner_middlename: "",
      partner_lastname: "",
      partner_dob: "",
      partner_age: "",
      partner_blood_group: null,
      partner_id_card: null,
      partner_id_card_no: "",
      partner_photo: "",
      partner_id_proof_photo: "",
    });
    setContactInfo({
      patient_email: "",
      patient_country_code: "",
      patient_mobile_no: "",
      partner_email: "",
      partner_country_code: "",
      partner_mobile_no: "",
    });
    setAddressInfo({
      street_address: "",
      city: "",
      state: "",
      nationality: null,
    });
    setOtherInfo({
      anniversary: "",
      allergy: false,
      reference: "",
      reference_by: null,
      senior_consultant: null,
      notes: "",
    });
    form.resetFields();
    form.setFieldsValue({
      today_date: dayjs(
        moment(new Date()).format("DD-MM-YYYY"),
        "DD-MM-YYYY"
      )
    });
  }, [form]);

  useEffect(() => {
    if (
      selectedModule?._id &&
      selectedPatient?._id &&
      Object.entries(patientDetail).length === 0
    ) {
      dispatch(
        getPatientData({
          patientRegId: selectedPatient._id,
          moduleId: selectedModule._id,
        })
      );
    }
    if (Object.entries(selectedPatient).length === 0) {
      clearPatientRegistrationForm();
      dispatch(setPatientDetail({}));
    }
  }, [dispatch, selectedPatient, selectedLocation]);
  const patientUpdatedData = useCallback(async () => {
    if (isPatientUpdated && selectedModule?._id && selectedPatient?._id) {
      if (
        patientDetail?.patient_firstname !== patientInfo?.patient_firstname ||
        patientDetail?.patient_middlename !== patientInfo?.patient_middlename ||
        patientDetail?.patient_lastname !== patientInfo?.patient_lastname ||
        patientDetail?.partner_firstname !== partnerInfo?.partner_firstname ||
        patientDetail?.partner_middlename !== partnerInfo?.partner_middlename ||
        patientDetail?.partner_lastname !== partnerInfo?.partner_lastname
      ) {
        const { payload } = await dispatch(
          getPatientData({
            patientRegId: selectedPatient?._id,
            moduleId: selectedModule._id,
          })
        );
        await dispatch(
          getGlobalSearch({
            patient_reg_id: selectedPatient._id,
            patient_name: payload.patient_full_name,
            location_id: selectedLocation,
          })
        );
        dispatch(
          setGlobalSearchFileValue({
            _id: patientDetail._id,
            patient_full_name: payload.patient_full_name,
          })
        );
      } else {
        if (
          selectedPatient.patient_id &&
          Object.keys(updatedUser)?.length > 0
        ) {
          dispatch(setSelectedPatient({ ...selectedPatient, ...updatedUser }));
          dispatch(setPatientDetail(updatedUser))
        }
      }
      dispatch(setIsPatientUpdated(false));
    }
  }, [
    dispatch,
    isPatientUpdated,
    patientDetail,
    partnerInfo,
    patientInfo,
    selectedLocation,
    selectedModule,
    selectedPatient,
    updatedUser,
  ]);

  useEffect(() => {
    isPatientUpdated && patientUpdatedData();
  }, [isPatientUpdated]);
  const handleCancel = () => {
    clearPatientRegistrationForm();
    dispatch(setSelectedPatient({}));
    dispatch(setPatientDetail({}));
    dispatch(clearData());
  };

  const printPatientRegistrationData = useCallback(async () => {
    if (Object.entries(patientDetail).length > 0) {
      const payload = {
        today_date: patientDetail?.today_date,
        patient_id: patientDetail?.patient_id,
        patient_full_name: patientDetail?.patient_full_name,
        patient_dob: patientDetail?.patient_dob,
        patient_id_card_no: patientDetail?.patient_id_card_no,
        patient_email: patientDetail?.patient_email,
        patient_country_code: patientDetail?.patient_country_code,
        patient_mobile_no: patientDetail?.patient_mobile_no,
        partner_full_name: "",
        partner_dob: patientDetail?.partner_dob,
        partner_id_card_no: patientDetail?.partner_id_card_no,
        partner_email: patientDetail?.partner_email,
        partner_country_code: patientDetail?.partner_country_code,
        partner_mobile_no: patientDetail?.partner_mobile_no,
        street_address: patientDetail?.street_address,
        city: patientDetail?.city,
        state: patientDetail?.state,
        nationality: patientDetail?.nationality,
        anniversary: patientDetail?.anniversary,
      };
      dispatch(
        printPatientDetails({
          moduleId: selectedModule?._id,
          payload: payload,
        })
      );
    }
  }, [patientDetail, dispatch, selectedModule]);

  const printPatientStickerData = useCallback(async () => {
    if (Object.entries(patientDetail).length > 0) {
      const payload = {
        patient_full_name: patientDetail?.patient_full_name,
        age: patientDetail?.age,
        sex: patientDetail?.sex,
        street_address: patientDetail?.street_address,
        city: patientDetail?.city,
        state: patientDetail?.state,
        doctor_name: patientDetail?.doctor_name,
        patient_id: patientDetail?.patient_id,
        patient_country_code: patientDetail?.patient_country_code,
        patient_mobile_no: patientDetail?.patient_mobile_no,
        partner_country_code: patientDetail?.partner_country_code,
        partner_mobile_no: patientDetail?.partner_mobile_no,
        patient_id_card_no: patientDetail?.patient_id_card_no,
        ref_name: patientDetail?.ref_name,
      };
      dispatch(
        printPatientDetails({
          moduleId: selectedModule?._id,
          payload: payload,
        })
      );
    }
  }, [dispatch, selectedModule, patientDetail]);

  const validatorAnniversary = useCallback(
    (rules, value) => {
      const patientDob = patientInfo?.patient_dob && moment(patientInfo?.patient_dob, 'DD-MM-YYYY');
      const partnerDob = partnerInfo?.partner_dob && moment(partnerInfo?.partner_dob, 'DD-MM-YYYY');
      const patientAnniversary = otherInfo?.anniversary && moment(otherInfo?.anniversary, 'DD-MM-YYYY');

      if ((((patientDob && patientAnniversary) && patientDob.isAfter(patientAnniversary))) || ((partnerDob && patientAnniversary) && partnerDob.isAfter(patientAnniversary))) {
        toast.error("Patient's date of birth is greater than anniversary date.");
        return Promise.reject("");
      } else if ((patientDob && patientAnniversary) && patientDob.isSame(patientAnniversary)) {
        toast.error("The patient's birthdate and anniversary are the same.");
        return Promise.reject("");
      }
      return Promise.resolve();
    },
    [partnerInfo?.partner_dob, patientInfo?.patient_dob, otherInfo?.anniversary],
  )


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
              <h3 className="mb-3">Basic Information</h3>
              <ul className="grid_wrapper">
                <li className="w_320 w_xs_50">
                  <Form.Item label="Hospital ID"
                    name="hospital_id"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input

                      placeholder="Enter Hospital ID"
                      name="hospital_id"
                      value={basicInfo?.hospital_id}
                      onChange={(e) => {
                        setBasicInfo({
                          ...basicInfo,
                          hospital_id: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_320 w_xs_50">
                  <Form.Item label="Patient ID">
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
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Type of Treatment"
                    name="type_of_treatment"
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
                        { value: 1, label: "IVF" },
                        { value: 2, label: "IUI" },
                        { value: 3, label: "NP" },
                      ]}
                      name="type_of_treatment"
                      value={basicInfo?.type_of_treatment}
                      onChange={(value) => {
                        setBasicInfo({
                          ...basicInfo,
                          type_of_treatment: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Type of Patient"
                    name="type_of_patient"
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
                        { value: 1, label: "Married Couple" },
                        { value: 2, label: "Single Woman" },
                        { value: 3, label: "Donor (Male)" },
                        { value: 4, label: "Donor (Female)" },
                        { value: 5, label: "Surrogate Mother" },
                      ]}
                      name="type_of_patient"
                      value={basicInfo?.type_of_patient}
                      onChange={(value) => {
                        setBasicInfo({
                          ...basicInfo,
                          type_of_patient: value,
                        });
                        if (patientDetailsValidation.includes(value)) {
                          form.setFields([
                            {
                              name: 'patient_firstname',
                              errors: [],
                            },
                            {
                              name: 'patient_lastname',
                              errors: [],
                            },
                            {
                              name: 'patient_dob',
                              errors: [],
                            },
                            {
                              name: 'patient_age',
                              errors: [],
                            },
                            {
                              name: 'patient_blood_group',
                              errors: [],
                            },
                            {
                              name: 'patient_id_card',
                              errors: [],
                            },
                            {
                              name: 'patient_id_card_no',
                              errors: [],
                            },
                            {
                              name: 'patient_email',
                              errors: [],
                            },
                            {
                              name: 'patientMobileNumber',
                              errors: [],
                            },
                          ]);
                          setIsSubmitError((prevState) => (
                            {
                              ...prevState,
                              patientMobileNumber: false
                            }
                          ))
                        }
                        else if (partnerDetailsValidation.includes(value)) {
                          form.setFields([
                            {
                              name: 'partner_firstname',
                              errors: [],
                            },
                            {
                              name: 'partner_lastname',
                              errors: [],
                            },
                            {
                              name: 'partner_dob',
                              errors: [],
                            },
                            {
                              name: 'partner_age',
                              errors: [],
                            },
                            {
                              name: 'partner_blood_group',
                              errors: [],
                            },
                            {
                              name: 'partner_id_card',
                              errors: [],
                            },
                            {
                              name: 'partner_id_card_no',
                              errors: [],
                            },
                            {
                              name: 'partner_email',
                              errors: [],
                            },
                            {
                              name: "partnerMobileNo",
                              errors: [],
                            },
                          ]);
                          setIsSubmitError((prevState) => (
                            {
                              ...prevState,
                              partnerMobileNo: false
                            }
                          ))
                        }
                        if (!marriedCouplelsValidation.includes(value)) {
                          form.setFields([
                            {
                              name: 'anniversary',
                              errors: [],
                            },
                          ]);
                        }
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Today’s Date"
                    name="today_date"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <DatePicker
                      value={dayjs(basicInfo?.today_date, dateFormat)}
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      placeholder="DD-MM-YYYY"
                      onChange={(value) => {
                        setBasicInfo({
                          ...basicInfo,
                          today_date: value
                            ? moment(new Date(value)).format("DD-MM-YYYY")
                            : null,
                        });
                      }}
                      disabledDate={(current) => current && current > moment().endOf("day")
                      }
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Patient Information</h3>
              <Row className="patient_info_custom_row">
                <Col xxl={7} md={12} className="patient_info_left">
                  <ul className="grid_wrapper">
                    <li className="w_33 w_xs_50">
                      <Form.Item
                        label="First Name"
                        name="patient_firstname"
                        rules={
                          !patientDetailsValidation.includes(
                            basicInfo?.type_of_patient
                          ) && [
                            {
                              required: true,
                              message: "",
                            },
                          ]
                        }
                      >
                        <Input
                          name="patient_firstname"
                          // tabIndex={3}
                          placeholder="Enter First Name"
                          value={patientInfo?.patient_firstname}
                          onChange={(e) => {
                            setPatientInfo({
                              ...patientInfo,
                              patient_firstname: e.target.value,
                            });
                          }}

                        />
                      </Form.Item>
                    </li>
                    <li className="w_33 w_xs_50">
                      <Form.Item label="Middle Name" name="patient_middlename">
                        <Input
                          placeholder="Enter Middle Name"
                          // tabIndex={2}
                          name="patient_middlename"
                          value={patientInfo?.patient_middlename}
                          onChange={(e) => {
                            setPatientInfo({
                              ...patientInfo,
                              patient_middlename: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_33 w_xs_50">
                      <Form.Item
                        label="Last Name"
                        name="patient_lastname"
                        rules={
                          !patientDetailsValidation.includes(
                            basicInfo?.type_of_patient
                          ) && [
                            {
                              required: true,
                              message: "",
                            },
                          ]
                        }
                      >
                        <Input
                          placeholder="Enter Last Name"
                          name="patient_lastname"
                          // tabIndex={1}
                          value={patientInfo?.patient_lastname}
                          onChange={(e) => {
                            setPatientInfo({
                              ...patientInfo,
                              patient_lastname: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_180 w_xs_50">
                      <Form.Item
                        label="Date of Birth"
                        name="patient_dob"
                        rules={
                          !patientDetailsValidation.includes(
                            basicInfo?.type_of_patient
                          ) && [
                            {
                              required: true,
                              message: "",
                            },
                            // {
                            //   validator: validatorAnniversary,
                            // },
                          ]
                        }
                      >
                        <DatePicker
                          placeholder="DD-MM-YYYY"
                          value={dayjs(patientInfo?.patient_dob, dateFormat)}
                          format={{
                            format: "DD-MM-YYYY",
                            type: "mask",
                          }}
                          // onBlur={(event) => {
                          //   calculatePatientAge(event.target.value === "DD-MM-YYYY" ? "DD-MM-YYYY" :
                          //     event.target.value
                          //   );
                          // }}
                          onChange={(value, event) => {
                            calculatePatientAge(event);
                            setPatientInfo({
                              ...patientInfo,
                              patient_dob: value
                                ? moment(new Date(value)).format("DD-MM-YYYY")
                                : null,
                            });
                            setOtherInfo(prevState => ({
                              ...prevState,
                              anniversary: ""
                            }));
                            form.setFieldsValue({ patient_dob: value, anniversary: "" });
                          }}
                          disabledDate={(current) => current && current > moment().endOf("day")
                          }
                        />
                      </Form.Item>
                    </li>
                    <li className="w_180 w_xs_100">
                      <Form.Item
                        name="patient_age"
                        rules={
                          !patientDetailsValidation.includes(
                            basicInfo?.type_of_patient
                          ) && [
                            {
                              required: true,
                              message: "",
                            },
                          ]
                        }
                        label="Age"
                      >
                        <Input
                          placeholder="Enter Age"
                          name="patient_age"
                          value={patientInfo?.patient_age}
                          disabled
                        />
                      </Form.Item>
                    </li>
                    <li className="w_140 w_xs_50">
                      <Form.Item
                        label="Blood Group"
                        rules={
                          !patientDetailsValidation.includes(
                            basicInfo?.type_of_patient
                          ) && [
                            {
                              required: true,
                              message: "",
                            },
                          ]
                        }
                        className="custom_select"
                        name="patient_blood_group"
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
                          name="patient_blood_group"
                          onChange={(value) => {
                            setPatientInfo({
                              ...patientInfo,
                              patient_blood_group: value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_170 w_xs_50">
                      <Form.Item
                        label="ID Card"
                        className="custom_select"
                        rules={
                          !patientDetailsValidation.includes(
                            basicInfo?.type_of_patient
                          ) && [
                            {
                              required: true,
                              message: "",
                            },
                          ]
                        }
                        name="patient_id_card"
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
                          options={iDCardOptions}
                          name="patient_id_card"
                          value={patientInfo?.patient_id_card}
                          onChange={(value) => {
                            setPatientInfo({
                              ...patientInfo,
                              patient_id_card: value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_200 w_xs_50">
                      <Form.Item
                        label="ID Card No."
                        name="patient_id_card_no"
                        rules={
                          !patientDetailsValidation.includes(
                            basicInfo?.type_of_patient
                          ) && [
                            {
                              required: true,
                              message: "",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                const selectedIDCardType =
                                  getFieldValue("patient_id_card");

                                if (
                                  selectedIDCardType === "Aadhaar Card" &&
                                  !adharCardPattern.test(value)
                                ) {
                                  return Promise.reject(
                                    "Please enter a valid Aadhaar Card number (12 digits)."
                                  );
                                } else if (
                                  selectedIDCardType === "Pan Card" &&
                                  !panCardPattern.test(value)
                                ) {
                                  return Promise.reject(
                                    "Please enter a valid PAN Card number."
                                  );
                                } else if (
                                  selectedIDCardType === "Passport" &&
                                  !passportPattern.test(value)
                                ) {
                                  return Promise.reject(
                                    "Please enter a valid Passport number."
                                  );
                                } else if (
                                  selectedIDCardType === "Voter ID" &&
                                  !voterIdPattern.test(value)
                                ) {
                                  return Promise.reject(
                                    "Please enter a valid Voter ID number."
                                  );
                                } else if (
                                  selectedIDCardType === "Driving Lic." &&
                                  !drivingLicPattern.test(value)
                                ) {
                                  return Promise.reject(
                                    "Please enter a valid Driving License number."
                                  );
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]
                        }
                      >
                        <Input
                          placeholder="Enter ID Card No."
                          name="patient_id_card_no"
                          value={patientInfo?.patient_id_card_no}
                          onChange={(e) => {
                            setPatientInfo({
                              ...patientInfo,
                              patient_id_card_no: e.target.value,
                            });
                          }}
                          disabled={!patientInfo?.patient_id_card}
                        />
                      </Form.Item>
                    </li>
                  </ul>
                </Col>
                <Col xxl={5} lg={8} md={9} className="patient_info_right">
                  <Row>
                    <Col sm={6}>
                      <Form.Item
                        label="Patient Photo / Attachment"
                        className="upload_Wrapper"
                      >
                        <div className="photo_upload_inner">
                          <Row className="g-2">
                            <Col xs={6}>
                              <div className="uploaded_img">
                                <img
                                  src={
                                    patientInfo?.patient_photo
                                      ? `${process.env.REACT_APP_SOCKET_URL}/${patientInfo?.patient_photo}` : UserImg
                                  }
                                  alt=""
                                />
                                <Button
                                  className="btn_transparent"
                                  onClick={() => {
                                    dispatch(setUploadImageDetail(false));
                                    setPatientInfo({
                                      ...patientInfo,
                                      patient_photo: "",
                                    });
                                    setPatientPhotoList([]);
                                  }}
                                >
                                  <img src={RemoveIcon} alt="" />
                                </Button>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <Upload
                                customRequest={customUpload("patient_photo")}
                                fileList={patientPhotoList}
                                onRemove={(file) => {
                                  setPatientInfo({
                                    ...patientInfo,
                                    patient_photo: "",
                                  });
                                  handleRemove(file, "patient_photo");
                                }}
                                onError={(error, response) => {
                                  showErrorMessage(
                                    error,
                                    response,
                                    "patient_photo"
                                  );
                                }}
                                listType="text"
                              >
                                <div className="upload_wrap">
                                  <img src={UploadIcon} alt="" />
                                  <p>Click to upload or drag & drop</p>
                                  <span>Browse</span>
                                </div>
                              </Upload>
                            </Col>
                          </Row>
                        </div>
                      </Form.Item>
                    </Col>
                    <Col sm={6}>
                      <Form.Item label="ID Proof" className="upload_Wrapper">
                        <div className="photo_upload_inner">
                          <Row className="g-2">
                            <Col xs={6}>
                              <div className="uploaded_img">
                                <img
                                  src={
                                    patientInfo?.patient_id_proof_photo
                                      ? `${process.env.REACT_APP_SOCKET_URL}/${patientInfo?.patient_id_proof_photo}`
                                      : UserImg
                                  }
                                  alt=""
                                />
                                <Button
                                  className="btn_transparent"
                                  onClick={() => {
                                    dispatch(setUploadImageDetail(false));
                                    setPatientInfo({
                                      ...patientInfo,
                                      patient_id_proof_photo: "",
                                    });
                                    setPatientIdProofPhotoList([]);
                                  }}
                                >
                                  <img src={RemoveIcon} alt="" />
                                </Button>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <Upload
                                customRequest={customUpload(
                                  "patient_id_proof_photo"
                                )}
                                fileList={patientIdProofPhotoList}
                                onRemove={(file) => {
                                  setPatientInfo({
                                    ...patientInfo,
                                    patient_id_proof_photo: "",
                                  });
                                  handleRemove(file, "patient_id_proof_photo");
                                }}
                                onError={(error, response) => {
                                  showErrorMessage(
                                    error,
                                    response,
                                    "patient_id_proof_photo"
                                  );
                                }}
                                listType="text"
                              >
                                <div className="upload_wrap">
                                  <img src={UploadIcon} alt="" />
                                  <p>Click to upload or drag & drop</p>
                                  <span>Browse</span>
                                </div>
                              </Upload>
                            </Col>
                          </Row>
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Partner Information</h3>
              <Row className="patient_info_custom_row">
                <Col xxl={7} md={12} className="patient_info_left">
                  <ul className="grid_wrapper">
                    <li className="w_33 w_xs_50">
                      <Form.Item
                        label="First Name"
                        name="partner_firstname"
                        rules={
                          !partnerDetailsValidation.includes(
                            basicInfo?.type_of_patient
                          ) && [
                            {
                              required: true,
                              message: "",
                            },
                          ]
                        }
                      >
                        <Input
                          placeholder="Enter First Name"
                          name="partner_firstname"
                          value={partnerInfo?.partner_firstname}
                          onChange={(e) => {
                            setPartnerInfo({
                              ...partnerInfo,
                              partner_firstname: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_33 w_xs_50">
                      <Form.Item label="Middle Name">
                        <Input
                          placeholder="Enter Middle Name"
                          name="partner_middlename"
                          value={partnerInfo?.partner_middlename}
                          onChange={(e) => {
                            setPartnerInfo({
                              ...partnerInfo,
                              partner_middlename: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_33 w_xs_50">
                      <Form.Item
                        label="Last Name"
                        name="partner_lastname"
                        rules={
                          !partnerDetailsValidation.includes(
                            basicInfo?.type_of_patient
                          ) && [
                            {
                              required: true,
                              message: "",
                            },
                          ]
                        }
                      >
                        <Input
                          placeholder="Enter Last Name"
                          name="partner_lastname"
                          value={partnerInfo?.partner_lastname}
                          onChange={(e) => {
                            setPartnerInfo({
                              ...partnerInfo,
                              partner_lastname: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_180 w_xs_50">
                      <Form.Item
                        label="Date of Birth"
                        rules={
                          !partnerDetailsValidation.includes(
                            basicInfo?.type_of_patient
                          ) && [
                            {
                              required: true,
                              message: "",
                            },
                            {
                              validator: validatorAnniversary,
                            },
                          ]
                        }
                        name="partner_dob"
                      >
                        <DatePicker
                          placeholder="DD-MM-YYYY"
                          value={dayjs(partnerInfo?.partner_dob, dateFormat)}
                          format={{
                            format: "DD-MM-YYYY",
                            type: "mask",
                          }}
                          allowClear={true}
                          // onBlur={(event) => {
                          //   calculatePartnerAge(event.target.value === "DD-MM-YYYY" ? "DD-MM-YYYY" :
                          //     event.target.value
                          //   );
                          // }}
                          onChange={(value, event) => {
                            calculatePartnerAge(event);
                            setPartnerInfo({
                              ...partnerInfo,
                              partner_dob: value
                                ? moment(new Date(value)).format("DD-MM-YYYY")
                                : null,
                            });
                            setOtherInfo(prevState => ({
                              ...prevState,
                              anniversary: ""
                            }));
                            form.setFieldsValue({ partner_dob: value, anniversary: "" })
                          }}
                          disabledDate={(current) => current && current > moment().endOf("day")
                          }
                        />
                      </Form.Item>
                    </li>
                    <li className="w_180 w_xs_100">
                      <Form.Item
                        label="Age"
                        name="partner_age"
                        rules={
                          !partnerDetailsValidation.includes(
                            basicInfo?.type_of_patient
                          ) && [
                            {
                              required: true,
                              message: "",
                            },
                          ]
                        }
                      >
                        <Input
                          placeholder="Enter Age"
                          name="partner_age"
                          value={partnerInfo?.partner_age}
                          // onChange={e => {
                          //   setPartnerInfo({
                          //     ...partnerInfo,
                          //     partner_age: e.target.value,
                          //   });
                          // }}
                          disabled
                        />
                      </Form.Item>
                    </li>
                    <li className="w_140 w_xs_50">
                      <Form.Item
                        label="Blood Group"
                        rules={
                          !partnerDetailsValidation.includes(
                            basicInfo?.type_of_patient
                          ) && [
                            {
                              required: true,
                              message: "",
                            },
                          ]
                        }
                        className="custom_select"
                        name="partner_blood_group"
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
                          name="partner_blood_group"
                          value={partnerInfo?.partner_blood_group}
                          onChange={(value) => {
                            setPartnerInfo({
                              ...partnerInfo,
                              partner_blood_group: value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_170 w_xs_50">
                      <Form.Item
                        label="ID Card"
                        className="custom_select"
                        name="partner_id_card"
                        rules={
                          !partnerDetailsValidation.includes(
                            basicInfo?.type_of_patient
                          ) && [
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
                          options={iDCardOptions}
                          name="partner_id_card"
                          value={partnerInfo?.partner_id_card}
                          onChange={(value) => {
                            setPartnerInfo({
                              ...partnerInfo,
                              partner_id_card: value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_200 w_xs_50">
                      <Form.Item
                        label="ID Card No."
                        name="partner_id_card_no"
                        rules={
                          !partnerDetailsValidation.includes(
                            basicInfo?.type_of_patient
                          ) && [
                            {
                              required: true,
                              message: "",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                const selectedIDCardType =
                                  getFieldValue("partner_id_card");

                                if (
                                  selectedIDCardType === "Aadhaar Card" &&
                                  !adharCardPattern.test(value)
                                ) {
                                  return Promise.reject(
                                    "Please enter a valid Aadhaar Card number (12 digits)."
                                  );
                                } else if (
                                  selectedIDCardType === "Pan Card" &&
                                  !panCardPattern.test(value)
                                ) {
                                  return Promise.reject(
                                    "Please enter a valid PAN Card number."
                                  );
                                } else if (
                                  selectedIDCardType === "Passport" &&
                                  !passportPattern.test(value)
                                ) {
                                  return Promise.reject(
                                    "Please enter a valid Passport number."
                                  );
                                } else if (
                                  selectedIDCardType === "Voter ID" &&
                                  !voterIdPattern.test(value)
                                ) {
                                  return Promise.reject(
                                    "Please enter a valid Voter ID number."
                                  );
                                } else if (
                                  selectedIDCardType === "Driving Lic." &&
                                  !drivingLicPattern.test(value)
                                ) {
                                  return Promise.reject(
                                    "Please enter a valid Driving License number."
                                  );
                                }

                                return Promise.resolve();
                              },
                            }),
                          ]
                        }
                      >
                        <Input
                          placeholder="Enter ID Card No."
                          name="partner_id_card_no"
                          value={partnerInfo?.partner_id_card_no}
                          onChange={(e) => {
                            setPartnerInfo({
                              ...partnerInfo,
                              partner_id_card_no: e.target.value,
                            });
                          }}
                          disabled={!partnerInfo?.partner_id_card}
                        />
                      </Form.Item>
                    </li>
                  </ul>
                </Col>
                <Col xxl={5} lg={8} md={9} className="patient_info_right">
                  <Row>
                    <Col sm={6}>
                      <Form.Item
                        label="Partner Photo / Attachment"
                        className="upload_Wrapper"
                      >
                        <div className="photo_upload_inner">
                          <Row className="g-2">
                            <Col xs={6}>
                              <div className="uploaded_img">
                                <img
                                  src={
                                    partnerInfo?.partner_photo
                                      ? `${process.env.REACT_APP_SOCKET_URL}/${partnerInfo?.partner_photo}`
                                      : UserImg
                                  }
                                  alt=""
                                />
                                <Button
                                  className="btn_transparent"
                                  onClick={() => {
                                    dispatch(setUploadImageDetail(false));
                                    setPartnerInfo({
                                      ...partnerInfo,
                                      partner_photo: "",
                                    });
                                    setPartnerPhotoList([]);
                                  }}
                                >
                                  <img src={RemoveIcon} alt="" />
                                </Button>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <Upload
                                customRequest={customUpload("partner_photo")}
                                fileList={partnerPhotoList}
                                onRemove={(file) => {
                                  setPartnerInfo({
                                    ...partnerInfo,
                                    partner_photo: "",
                                  });
                                  handleRemove(file, "partner_photo");
                                }}
                                onError={(error, response) => {
                                  showErrorMessage(
                                    error,
                                    response,
                                    "partner_photo"
                                  );
                                }}
                                listType="text"
                              >
                                <div className="upload_wrap">
                                  <img src={UploadIcon} alt="" />
                                  <p>Click to upload or drag & drop</p>
                                  <span>Browse</span>
                                </div>
                              </Upload>
                            </Col>
                          </Row>
                        </div>
                      </Form.Item>
                    </Col>
                    <Col sm={6}>
                      <Form.Item label="ID Proof" className="upload_Wrapper">
                        <div className="photo_upload_inner">
                          <Row className="g-2">
                            <Col xs={6}>
                              <div className="uploaded_img">
                                <img
                                  src={
                                    partnerInfo?.partner_id_proof_photo
                                      ? `${process.env.REACT_APP_SOCKET_URL}/${partnerInfo?.partner_id_proof_photo}`
                                      : UserImg
                                  }
                                  alt=""
                                />
                                <Button
                                  className="btn_transparent"
                                  onClick={() => {
                                    dispatch(setUploadImageDetail(false));
                                    setPartnerInfo({
                                      ...partnerInfo,
                                      partner_id_proof_photo: "",
                                    });
                                    setPartnerIdProofPhotoList([]);
                                  }}
                                >
                                  <img src={RemoveIcon} alt="" />
                                </Button>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <Upload
                                customRequest={customUpload(
                                  "partner_id_proof_photo"
                                )}
                                fileList={partnerIdProofPhotoList}
                                onRemove={(file) => {
                                  setPartnerInfo({
                                    ...partnerInfo,
                                    partner_id_proof_photo: "",
                                  });
                                  handleRemove(file, "partner_id_proof_photo");
                                }}
                                onError={(error, response) => {
                                  showErrorMessage(
                                    error,
                                    response,
                                    "partner_photo"
                                  );
                                }}
                                listType="text"
                              >
                                <div className="upload_wrap">
                                  <img src={UploadIcon} alt="" />
                                  <p>Click to upload or drag & drop</p>
                                  <span>Browse</span>
                                </div>
                              </Upload>
                            </Col>
                          </Row>
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Contact Information</h3>
              <ul className="grid_wrapper">
                <li className="w_25 w_xs_100">
                  <Form.Item
                    label="Patient Email"
                    name="patient_email"
                    rules={
                      !patientDetailsValidation.includes(
                        basicInfo?.type_of_patient
                      ) && [
                        {
                          required: true,
                          message: "",
                        },
                        {
                          type: "email",
                          message: "Please enter a valid email!",
                        },
                      ]
                    }
                  >
                    <Input
                      placeholder="Enter Patient Email"
                      name="patient_email"
                      value={contactInfo?.patient_email}
                      onChange={(e) => {
                        setContactInfo({
                          ...contactInfo,
                          patient_email: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="patientMobileNumber"
                    label="Patient Mobile No."
                    className={isSubmitError?.patientMobileNumber
                      && "star_input_required"
                    }
                    rules={
                      !patientDetailsValidation.includes(
                        basicInfo?.type_of_patient
                      ) && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }
                  >
                    <PhoneWithCountry
                      handlePhoneChange={handlePatientMobileNoChange}
                      phoneNumber={patientMobileNumber}
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    label="Partner Email"
                    name="partner_email"
                    rules={
                      !partnerDetailsValidation.includes(
                        basicInfo?.type_of_patient
                      ) && [
                        {
                          required: true,
                          message: "",
                        },
                        {
                          type: "email",
                          message: "Please enter a valid email!",
                        },
                      ]
                    }
                  >
                    <Input
                      placeholder="Enter Partner Email"
                      name="partner_email"
                      value={contactInfo?.partner_email}
                      onChange={(e) => {
                        setContactInfo({
                          ...contactInfo,
                          partner_email: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item label="Partner Mobile No."
                    name="partnerMobileNo"
                    className={isSubmitError?.partnerMobileNo
                      && "star_input_required"
                    }
                    rules={
                      !partnerDetailsValidation.includes(
                        basicInfo?.type_of_patient
                      ) && [
                        {
                          required: true,
                          message: "",
                        },
                      ]
                    }>
                    <PhoneWithCountry
                      handlePhoneChange={handlePartnerMobileNoChange}
                      phoneNumber={partnerMobileNo}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Address</h3>
              <ul className="grid_wrapper">
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Street Address"
                    name="street_address"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Street Address"
                      name="street_address"
                      value={addressInfo?.street_address}
                      onChange={(e) => {
                        setAddressInfo({
                          ...addressInfo,
                          street_address: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="City"
                    name="city"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter City"
                      name="city"
                      value={addressInfo?.city}
                      onChange={(e) => {
                        setAddressInfo({
                          ...addressInfo,
                          city: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="State"
                    name="state"
                    rules={[
                      {
                        required: true,
                        message: "",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter State"
                      name="state"
                      value={addressInfo?.state}
                      onChange={(e) => {
                        setAddressInfo({
                          ...addressInfo,
                          state: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50 flex_0">
                  <Form.Item
                    label="Nationality"
                    className="custom_select"
                    name="nationality"
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
                      name="nationality"
                      placeholder="Select Nationality"
                      options={options}
                      value={addressInfo?.nationality}
                      onChange={changeHandler}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Other Information</h3>
              <ul className="grid_wrapper">
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Anniversary"
                    name="anniversary"
                    rules={marriedCouplelsValidation.includes(
                      basicInfo?.type_of_patient
                    ) && [
                        {
                          required: true,
                          message: "",
                        },
                        {
                          validator: validatorAnniversary,
                        },
                      ]}
                  >
                    <DatePicker
                      value={dayjs(otherInfo?.anniversary, dateFormat)}
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      placeholder="DD-MM-YYYY"
                      onChange={(value) => {
                        setOtherInfo({
                          ...otherInfo,
                          anniversary: value
                            ? moment(new Date(value)).format("DD-MM-YYYY")
                            : null,
                        });
                      }}
                      disabledDate={(current) => current && current > moment().endOf("day")
                      }
                    />
                  </Form.Item>
                </li>
                <li className="w_180 w_xs_50">
                  <Form.Item label="Allergy" className="custom_select">
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
                      options={allergyOptions}
                      name="allergy"
                      value={otherInfo?.allergy}
                      onChange={(value) => {
                        setOtherInfo({
                          ...otherInfo,
                          allergy: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_50">
                  <Form.Item
                    label="Reference Type"
                    className="custom_select"
                    name="reference_by"
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
                      options={referenceTypeOption}
                      name="reference_by"
                      value={otherInfo?.reference_by}
                      onChange={(value) => {
                        setOtherInfo({
                          ...otherInfo,
                          reference_by: value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item label="Reference">
                    <Input
                      placeholder="Enter Reference"
                      name="reference"
                      value={otherInfo?.reference}
                      onChange={(e) => {
                        setOtherInfo({
                          ...otherInfo,
                          reference: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="Senior Consultant"
                    className="custom_select"
                    name="senior_consultant"
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
                      options={seniorConsultant}
                      value={otherInfo?.senior_consultant}
                      onChange={(value) => {
                        setOtherInfo({
                          ...otherInfo,
                          senior_consultant: value,
                        });
                      }}
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
                    value={otherInfo?.notes}
                    onChange={(e) => {
                      setOtherInfo({
                        ...otherInfo,
                        notes: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            <Button
              className="btn_border mx-sm-3 mx-1"
              disabled={Object.entries(patientDetail).length === 0}
              onClick={() => {
                Object.entries(patientDetail).length > 0 &&
                  printPatientStickerData();
              }}
            >
              Sticker
            </Button>
            {selectedPatient?.patient_id
              ? (userType === 1 || selectedModule?.edit) && (
                <Button className="btn_primary mx-sm-3 mx-1" htmlType="submit">
                  Update
                </Button>
              )
              : (userType === 1 || selectedModule?.create) && (
                <Button className="btn_primary mx-sm-3 mx-1" htmlType="submit">
                  Save
                </Button>
              )}
            <Button className="btn_gray mx-sm-3 mx-1" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              disabled={Object.entries(patientDetail).length === 0}
              className="btn_print mx-sm-3 mx-1"
              onClick={() => {
                Object.entries(patientDetail).length > 0 &&
                  printPatientRegistrationData();
              }}
            >
              Print
            </Button>
          </div>
        </Form>
      </div>
    </div >
  );
}
