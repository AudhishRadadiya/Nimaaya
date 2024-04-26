import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Menu,
  Popconfirm,
  Select,
  Space,
  Spin,
  Tag,
  Tooltip,
  Upload,
} from "antd";
import { Table } from "antd";
import {
  gobletColorOptions,
  idiopathicOption,
  incubatorOptions,
  spermsOptions,
  spermsQualityOptions,
  stage2Options,
  stageOfDevOptions,
  stageOptions,
  stageOptionsForPrint,
  statusOptions,
  strawColorOptions,
  vitrificationIdOptions,
} from "utils/FieldValues";
import { TimePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import TranshIcon from "../../Img/trash.svg";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import moment from "moment";
import {
  getAttendingDrList,
  getIvfId,
  setIvfIdList,
  setSelectedPatient,
} from "redux/reducers/common.slice";
import _ from "lodash";
import {
  clearData,
  getGlobalSearch,
} from "redux/reducers/SearchPanel/globalSearch.slice";
import {
  createEmbryologyData,
  editEmbryologyData,
  getEmbryologyData,
  getPatientSearch,
  printEmbryoWarming,
  printEmbryologyFlowSheet,
  printVitrificationReport,
  setEmbryologyData,
  setEmbryologyDataUpdate,
  setPatientListData,
} from "redux/reducers/EmbryologyData/embryologyData.slice";
import uploadIcon from "../../Img/upload.svg";
import { toast } from "react-toastify";
import { Col, Row } from "react-bootstrap";
import { CloseOutlined } from "@ant-design/icons";
import UserImg from "../../Img/placeholder.png";
import UploadIcon from "../../Img/upload.svg";
import RemoveIcon from "../../Img/Close.svg";
import { setUploadImageDetail, uploadImage } from "redux/reducers/UploadImage/uploadImage.slice";
import { ageCalculatorFunc } from "utils/CommonFunctions";


const embryologyinitialdata = {

  ivf_flow_id: "",
  _id: "",
  eggs: null,
  cycle_type: null,
  cycle_no: "",
  opu_done_by: null,
  opu_done_by_name: "",
  anesthesia_given_by: null,
  anesthesia_given_by_name: "",
  tesa_done_by: null,
  donor_partner_name: "",
  donor_partner_age: "",
  sperms: null,
  sperms_quality: null,
  sperms_prep_method: null,
  icsi_add_on: null,
  frozen_sperm_vial_id: "",
  icsi_ivf_done_by: null,
  assisted_by: null,
  opu_date: null,
  opu_time: null,
  actual_opu_time: null,
  amh: "",
  gv: "",
  progesterone: "",
  lmp: "",
  lh: "",
  e2: "",
  preimplantation_generic_testing: null,
  denudation_time: null,
  icsi_ivf_time: null,
  culture_media: null,
  embryo_dev_batch_no: "",
  embryo_dev_expiry_date: null,
  no_of_oocytes: "",
  day_0_date: null,
  day_0_time: null,
  day_1_date: null,
  day_1_hrs_post_icsi_: "",
  day_3_date: null,
  day_3_time: null,
  day_5_date: null,
  day_6_date: null,
  freezing_method: "",
  freezing_media: null,
  vitrification_devices: null,
  vitrification_batch_no: "",
  vitrification_expiry_date: null,
  pre_frozen_embryo_available: null,
  no_of_goblet: "",
  tank_no: "",
  no_of_straws: "",
  cannister_no: "",
  thawing_media: null,
  warming_batch_no: "",
  warming_expiry_date: null,
  distance_from_fundus: "",
  transfer_done_by: null,
  catheter: null,
  embryo_loading_by: null,
  transfer_media: null,
  other_prep_method: "",
  icsi_add_on_other: "",
  // total_m1: "",
  // total_m2: "",
  notes: "",
  embryo_image: "",


  cleaved: "",
  fert: "",
  degenerated: "",
  unfert: "",
  abnormal_pn: "",
  kept_for_blastocyst: "",

  total_m1: "",
  total_m2: ""
}
const isOpenBy = ["Donor frozen", "Donor fresh"];

export default function EmbryologyDataSheet() {
  const { TextArea } = Input;
  const { moduleList, userType, selectedLocation } = useSelector(
    ({ role }) => role
  );
  const { selectedPatient, ivfIdList, isIvfListLoading, attendingDrList } =
    useSelector(({ common }) => common);
  const { embryologyData, patientList, embryologyDataUpdate, embryologyDataLoading } =
    useSelector(({ embryologyData }) => embryologyData);
  const { getUploadImage, isUploadImageUpdated } = useSelector(
    ({ uploadImage }) => uploadImage
  );
  const dispatch = useDispatch();
  const [printOption, setPrintOption] = useState([]);
  const [patientPhotoList, setPatientPhotoList] = useState([]);
  const [form] = Form.useForm();
  const [totalRows, setTotalRows] = useState(0);
  const [fileName, setFileName] = useState("");
  const location = useLocation();
  const [doctorList, setDoctorList] = useState([]);
  const [ivfIdOption, setIvfIdOption] = useState([]);

  useEffect(() => {
    if (Object.keys(selectedPatient).length > 0) {
      dispatch(getAttendingDrList());
    }
  }, [dispatch, selectedPatient]);
  useEffect(() => {
    if (attendingDrList?.length > 0) {
      setDoctorList(
        attendingDrList.map((item, index) => ({
          value: item._id,
          label: item.user_name,
        }))
      );
    }
  }, [dispatch, attendingDrList]);
  // const [patientDetails, setPatientDetails] = useState({
  //   patient_id: "",
  //   patient_dob: "",
  //   patient_full_name: "",
  //   partner_full_name: "",
  // });

  const [embryologyDetails, setEmbryologyDetails] = useState(embryologyinitialdata);
  const [pDetail, setPDetail] = useState({});

  const embryoTable = {
    egg: "",
    stage_1: null,
    fert_check: null,
    grade_1: null,
    grade_2: "",
    incubator: null,
    stage_of_dev_1: null,
    date_of_freezing: null,
    score: "",
    note: "",
    vitrification_id: null,
    stage_2: null,
    device_color: null,
    goblet_color: null,
    status: null,
    vitrified_by: "",

    quality_of_egg: null,
    quality_of_embryo: null,
    icm_1: "",
    te_1: "",
    stage_of_dev_2: "",
    icm_2: "",
    te_2: "",
    date_of_thawing: null,
    thawing_done_by: null,
    date_of_transfer: null,
  };
  const transformData = useCallback((data) => {
    if (!Array.isArray(data)) {
      throw new Error("Input data must be an array.");
    }
    return data.reduce((result, item, index) => {
      Object.entries(item).forEach(([field, value]) => {
        const dynamicKey = `${field}${index}`;
        if (field.startsWith("date_") && value) {
          result[dynamicKey] = dayjs(
            moment(value).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          );
        } else {
          result[dynamicKey] = value ?? null;
        }
      });
      return result;
    }, {});
  }, []);
  const [embryoTableList, setEmbryoTableList] = useState([]);
  const countOfMI =
    (embryoTableList &&
      embryoTableList.filter((obj) => obj.stage_1 === "M1").length) ||
    0;
  const countOfMII =
    (embryoTableList &&
      embryoTableList.filter((obj) => obj.stage_1 === "M2").length) ||
    0;
  const countOfGV =
    (embryoTableList &&
      embryoTableList.filter((obj) => obj.stage_1 === "GV").length) ||
    0;

  const lastEmbryoData =
    embryoTableList.length > 0 &&
    Object.values(embryoTableList[embryoTableList.length - 1]).map((item) => {
      return item === null || item === "" ? false : true;
    });
  const isAdd =
    embryoTableList.length > 0 && lastEmbryoData?.find((item) => item === true);




  // bhaviks function start
  // const addRow = useCallback((total, m1, m2) => {
  //   const updatedPackData = [];
  //   const updatedPackObj = {};
  //   for (let i = 0; i < total; i++) {
  //     const stage = i < m1 ? "MI" : i < m1 + m2 ? "M2" : ""; // Determine stage based on values of m1 and m2
  //     updatedPackData.push({ ...embryoTable, stage_1: stage }); // Assuming embryoTable is defined somewhere
  //     Object.assign(updatedPackObj, { ...embryoTable, [`stage_1${i}`]: stage })
  //   }
  //   form.setFieldsValue({
  //     ...updatedPackObj,
  //   });
  //   setEmbryoTableList(updatedPackData);
  // }, [embryoTable, transformData]);
  // bhaviks function end

  // optimization chat gpt start
  const addRow = useCallback((total, m1, m2) => {
    // let updatedPackData = [];
    // const updatedPackObj = {};
    // const stage1 = "M2";
    // const stage2 = "M1";
    // for (let i = 0; i < total; i++) {
    //   const stage = i < m1 ? stage1 : i < m1 + m2 ? stage2 : "";
    //   const stageKey = `stage_1${i}`;
    //   updatedPackData.push({ ...embryoTable, stage_1: stage });
    //   updatedPackObj[stageKey] = stage;
    // }
    // form.setFieldsValue(updatedPackObj);
    // setEmbryoTableList(updatedPackData);

    let updatedPackData = [...embryoTableList]; // Copy existing data
    const stage1 = "M1";
    const stage2 = "M2";

    // const stage1 = "M2";
    // const stage2 = "M1";

    // Count how many items of each stage already exist in the list
    const existingM1Count = updatedPackData.filter(item => item.stage_1 === stage1).length;
    const existingM2Count = updatedPackData.filter(item => item.stage_1 === stage2).length;

    // Calculate the difference between existing counts and new counts
    const diffM1 = m1 - existingM1Count;
    const diffM2 = m2 - existingM2Count;

    // const diffM1 = m1 - existingM1Count;
    // const diffM2 = m2 - existingM2Count;

    // Add new M1 items
    for (let i = 0; i < diffM1; i++) {
      updatedPackData.push({ ...embryoTable, stage_1: stage1 });
    }

    // Add new M2 items
    for (let i = 0; i < diffM2; i++) {
      updatedPackData.push({ ...embryoTable, stage_1: stage2 });
    }

    // Remove extra items if the new counts are less than existing counts
    updatedPackData = updatedPackData.slice(0, m1 + m2);

    // Update state and form fields
    setEmbryoTableList(updatedPackData);
    form.setFieldsValue({}); // Clear form fields and then set them with updated data
    form.setFieldsValue(updatedPackData.reduce((obj, item, index) => {
      obj[`stage_1${index}`] = item.stage_1;
      return obj;
    }, {}));

  }, [embryoTable, form, setEmbryoTableList]);

  const handleValueChange = (key, value) => {
    setEmbryologyDetails({
      ...embryologyDetails,
      [key]: value,
    });
    const m2Value = key === 'total_m2' ? value : embryologyDetails.total_m2;
    const m1Value = key === 'total_m1' ? value : embryologyDetails.total_m1;
    // const m2Value = key === 'total_m1' ? value : embryologyDetails.total_m1;
    // const m1Value = key === 'total_m2' ? value : embryologyDetails.total_m2;

    const total = parseInt(m1Value || 0) + parseInt(m2Value || 0);
    setTotalRows(total);
    addRow(total, m1Value, m2Value);
  };


  const handleEmbryologyChange = (key, value) => {
    setEmbryologyDetails({
      ...embryologyDetails,
      [key]: value,
    });
  };

  const onChangeEmbryoDataOld = useCallback(
    (index, field, val) => {
      // if(field === "score")
      let data = [...embryoTableList];

      if (!Object.isExtensible(data[index])) {
        data[index] = { ...data[index], [field]: val };
      } else {
        data[index][field] = val;
      }
      setEmbryoTableList(data);
      // console.log('index, field, val', index, field, val)
      // console.log('data', data)
    },
    [embryoTableList]
  );


  // const countValues = useCallback(() => {
  //   let countFert = 0;
  //   let countDegenerated = 0;
  //   let countAbnormalPn = 0;
  //   let countUnfert = 0;
  //   embryoTableList.forEach(item => {
  //     if (item?.fert_check === '2PN' || item?.fert_check === '2 Cell') {
  //       countFert++;
  //     } else if (item?.fert_check === 'Degenerated') {
  //       countDegenerated++;
  //     } else if (item?.fert_check === 'Abnormal PN') {
  //       countAbnormalPn++;
  //     } else if (item?.fert_check === 'Unfert') {
  //       countUnfert++;
  //     }
  //   });


  //   console.log('countFert', countFert);
  //   console.log('countDegenerated', countDegenerated)
  //   console.log('countAbnormalPn', countAbnormalPn)
  //   console.log('countUnfert', countUnfert)

  // }, [embryoTableList]);



  const countValues = useCallback(() => {
    const counts = {
      fert: 0,
      degenerated: 0,
      abnormal_pn: 0,
      unfert: 0,
      gv: 0
    };

    embryoTableList.forEach(item => {
      switch (item?.fert_check) {
        case '2PN':
        case '2 Cell':
          counts.fert++;
          break;
        case 'Degenerated':
          counts.degenerated++;
          break;
        case 'Abnormal PN':
          counts.abnormal_pn++;
          break;
        case 'Unfert':
          counts.unfert++;
          break;
        case 'GV':
          counts.gv++;
          break;
        default:
          break;
      }
    });
    setEmbryologyDetails((prevDetails) => ({
      ...prevDetails,
      ...counts
      // cleaved: "",
      // kept_for_blastocyst: "",
    }));
    form.setFieldsValue(counts);

  }, [embryoTableList]);




  const onChangeEmbryoData = useCallback(
    (index, field, val) => {
      let data = [...embryoTableList];
      let dateOfDreezingCount = 0;
      let gVCount = 0;
      let grade = "";
      if (field === "score") {
        // Add validation for score
        const validScores = [
          "111", "112", "113",
          "121", "122", "123",
          "131", "132", "133",
          "211", "212", "213",
          "221", "222", "223",
          "231", "232", "233",
          "311", "312", "313",
          "321", "322", "323",
          "331", "332", "333"
        ];

        if (validScores.includes(val)) {
          // Determine grade based on the last digit of the score

          switch (val.slice(-1)) {
            case "1":
              grade = "Good";
              break;
            case "2":
              grade = "Fair";
              break;
            case "3":
              grade = "Poor";
              break;
            default:
              grade = "";
          }
          // Update both score and grade in data
          data[index] = { ...data[index], [field]: val, grade_2: grade };
        }
      } else data[index] = { ...data[index], [field]: val };
      if (field === "date_of_freezing") {
        data.forEach((item) => {
          if (item.date_of_freezing === moment(embryologyDetails?.day_3_date, 'YYYY/MM/DD').format('YYYY-MM-DD')) {
            dateOfDreezingCount++;
          }
        })
        let noOfOocytesData = parseInt(embryologyDetails?.no_of_oocytes)
        let newValKeptForBlastocyst = noOfOocytesData - dateOfDreezingCount
        setEmbryologyDetails((prevDetails) => ({
          ...prevDetails,
          kept_for_blastocyst: isNaN(newValKeptForBlastocyst) ? 0 : newValKeptForBlastocyst,
        }));
        form.setFieldsValue({
          kept_for_blastocyst: isNaN(newValKeptForBlastocyst) ? 0 : newValKeptForBlastocyst,
        });
      }


      if (field === "stage_1") {
        data.forEach((item) => {
          if (item.stage_1 === "GV") {
            gVCount++;
          }
        });
        setEmbryologyDetails((prevDetails) => ({
          ...prevDetails,
          gv: gVCount,
        }));
        form.setFieldsValue({
          gv: gVCount,
        });
      }
      setEmbryoTableList(data);
      if (field === "score") {
        const newObj = {
          [`grade_2${index}`]: grade,
          [`${field}${index}`]: val,
        };
        form.setFieldsValue({
          ...newObj,
        });
      }
    },
    [embryoTableList, embryologyDetails]
  );

  useEffect(() => {
    setEmbryologyDetails((prevDetails) => ({
      ...prevDetails,
      total_m1: countOfMI,
      total_m2: countOfMII,
      gv: countOfGV
    }));
    form.setFieldsValue({
      total_m1: countOfMI,
      total_m2: countOfMII,
      gv: countOfGV
    });

  }, [countOfMI, countOfMII]);

  const onDeleteEmbryoData = useCallback(
    (index) => {
      const updatedEmbryoData = embryoTableList?.filter(
        (item, i) => i !== index
      );
      setEmbryoTableList(updatedEmbryoData);
      const newPackageData = transformData(updatedEmbryoData || []);
      if (Object.entries(newPackageData)?.length > 0) {
        form.setFieldsValue({ ...newPackageData });
      }
    },
    [form, embryoTableList]
  );


  useEffect(() => {
    if (isUploadImageUpdated) {
      if (fileName === "embryo_image") {
        setEmbryologyDetails({
          ...embryologyDetails,
          embryo_image: getUploadImage?.file,
        });
      }

    }
  }, [fileName, isUploadImageUpdated]);


  useEffect(() => {
    if (embryologyDetails?.ivf_flow_id && selectedPatient?._id && embryologyDetails?.ivf_flow_id !== "new") {
      dispatch(
        getEmbryologyData({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
          ivf_flow_id: embryologyDetails?.ivf_flow_id,
        })
      );
    }
  }, [embryologyDetails?.ivf_flow_id]);
  useEffect(() => {
    if (embryologyDataUpdate) {
      dispatch(
        getEmbryologyData({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
          ivf_flow_id: embryologyDetails?.ivf_flow_id,
        })
      );
      dispatch(setEmbryologyDataUpdate(false));
    }
  }, [embryologyDataUpdate]);
  useEffect(() => {
    if (Object.keys(embryologyData).length > 0) {
      const printOp = createPrintOption(embryologyData?.embryo);
      setPrintOption(printOp);
      const newPackageData = transformData(embryologyData?.embryo || []);
      setEmbryoTableList(embryologyData?.embryo || [embryoTable]);
      if (isOpenBy.includes(embryologyData?.eggs)) {
        setPDetail({ _id: embryologyData?.donate_by, patient_full_name: embryologyData?.by_patient_full_name });
        form.setFieldsValue({ by: embryologyData?.by_patient_full_name })
        dispatch(setPatientListData([{ _id: embryologyData?.donate_by, patient_full_name: embryologyData?.by_patient_full_name }]));
      }
      let embryoImage = embryologyData?.embryo_image?.length > 0 ? embryologyData?.embryo_image[0] : "";
      setEmbryologyDetails({
        ivf_flow_id: embryologyData?.ivf_flow_id,
        _id: embryologyData?._id,
        eggs: embryologyData?.eggs || null,
        cycle_type: embryologyData?.cycle_type || null,
        cycle_no: embryologyData?.cycle_no || "--",
        opu_done_by: embryologyData?.opu_done_by || null,
        opu_done_by_name: embryologyData?.opu_done_by_name || "--",
        anesthesia_given_by: embryologyData?.anesthesia_given_by || null,
        anesthesia_given_by_name:
          embryologyData?.anesthesia_given_by_name || "--",
        tesa_done_by: embryologyData?.tesa_done_by || null,
        donor_partner_name: embryologyData?.donor_partner_name || "--",
        donor_partner_age: embryologyData?.donor_partner_age || "--",
        sperms: embryologyData?.sperms || null,
        sperms_quality: embryologyData?.sperms_quality || null,
        sperms_prep_method: embryologyData?.sperms_prep_method || null,
        icsi_add_on: embryologyData?.icsi_add_on || null,
        frozen_sperm_vial_id: embryologyData?.frozen_sperm_vial_id || "--",
        icsi_ivf_done_by: embryologyData?.icsi_ivf_done_by || null,
        assisted_by: embryologyData?.assisted_by || null,
        opu_date: embryologyData?.opu_date
          ? moment(embryologyData?.opu_date).format("DD/MM/YYYY")
          : null,
        opu_time: embryologyData?.opu_time
          ? dayjs(embryologyData?.opu_time, "HH:mm:ss").format("HH:mm:ss")
          : null,
        actual_opu_time: embryologyData?.actual_opu_time
          ? dayjs(embryologyData?.actual_opu_time, "HH:mm:ss").format(
            "HH:mm:ss"
          )
          : null,
        amh: embryologyData?.amh || "--",
        progesterone: embryologyData?.progesterone || "--",
        lmp: embryologyData?.lmp || "--",
        lh: embryologyData?.lh || "--",
        e2: embryologyData?.e2 || "--",
        preimplantation_generic_testing:
          embryologyData?.preimplantation_generic_testing || null,
        denudation_time: embryologyData?.denudation_time
          ? dayjs(embryologyData?.denudation_time, "HH:mm:ss").format(
            "HH:mm:ss"
          )
          : null,
        icsi_ivf_time: embryologyData?.icsi_ivf_time
          ? dayjs(embryologyData?.icsi_ivf_time, "HH:mm:ss").format("HH:mm:ss")
          : null,
        culture_media: embryologyData?.culture_media || null,
        embryo_dev_batch_no: embryologyData?.embryo_dev_batch_no || "--",
        embryo_dev_expiry_date: embryologyData?.embryo_dev_expiry_date
          ? moment(embryologyData?.embryo_dev_expiry_date).format("DD/MM/YYYY")
          : null,
        day_0_date: embryologyData?.day_0_date
          ? moment(embryologyData?.day_0_date).format("DD/MM/YYYY")
          : null,
        day_0_time: embryologyData?.day_0_time
          ? dayjs(embryologyData?.day_0_time, "HH:mm:ss").format("HH:mm:ss")
          : null,
        day_1_date: embryologyData?.day_1_date
          ? moment(embryologyData?.day_1_date).format("DD/MM/YYYY")
          : null,
        day_1_hrs_post_icsi_: embryologyData?.day_1_hrs_post_icsi_ || "--",
        day_3_date: embryologyData?.day_3_date
          ? moment(embryologyData?.day_3_date).format("DD/MM/YYYY")
          : null,
        day_3_time: embryologyData?.day_3_time
          ? dayjs(embryologyData?.day_3_time, "HH:mm:ss").format("HH:mm:ss")
          : null,
        day_5_date: embryologyData?.day_5_date
          ? moment(embryologyData?.day_5_date).format("DD/MM/YYYY")
          : null,
        day_6_date: embryologyData?.day_6_date
          ? moment(embryologyData?.day_6_date).format("DD/MM/YYYY")
          : null,
        freezing_method: embryologyData?.freezing_method || "--",
        freezing_media: embryologyData?.freezing_media || null,
        vitrification_devices: embryologyData?.vitrification_devices || null,
        vitrification_batch_no: embryologyData?.vitrification_batch_no || "--",
        vitrification_expiry_date: embryologyData?.vitrification_expiry_date
          ? moment(embryologyData?.vitrification_expiry_date).format(
            "DD/MM/YYYY"
          )
          : null,
        pre_frozen_embryo_available:
          embryologyData?.pre_frozen_embryo_available || null,
        no_of_goblet: embryologyData?.no_of_goblet || "--",
        tank_no: embryologyData?.tank_no || "--",
        no_of_straws: embryologyData?.no_of_straws || "--",
        cannister_no: embryologyData?.cannister_no || "--",
        thawing_media: embryologyData?.thawing_media || null,
        warming_batch_no: embryologyData?.warming_batch_no || "--",
        warming_expiry_date: embryologyData?.warming_expiry_date
          ? moment(embryologyData?.warming_expiry_date).format("DD/MM/YYYY")
          : null,
        distance_from_fundus: embryologyData?.distance_from_fundus || "--",
        transfer_done_by: embryologyData?.transfer_done_by || null,
        catheter: embryologyData?.catheter || null,
        embryo_loading_by: embryologyData?.embryo_loading_by || null,
        transfer_media: embryologyData?.transfer_media || null,
        total_m1: embryologyData?.total_m1 || 0,
        total_m2: embryologyData?.total_m2 || 0,
        notes: embryologyData?.notes || "--",
        embryo_image: embryoImage
      });
      form.setFieldsValue({
        ivf_flow_id: embryologyData?.ivf_flow_id,
        _id: embryologyData?._id,
        eggs: embryologyData?.eggs || null,
        cycle_type: embryologyData?.cycle_type || null,
        cycle_no: embryologyData?.cycle_no || "--",
        opu_done_by: embryologyData?.opu_done_by || null,
        opu_done_by_name: embryologyData?.opu_done_by_name || "--",
        anesthesia_given_by: embryologyData?.anesthesia_given_by || null,
        anesthesia_given_by_name:
          embryologyData?.anesthesia_given_by_name || "--",
        tesa_done_by: embryologyData?.tesa_done_by || null,
        donor_partner_name: embryologyData?.donor_partner_name || "--",
        donor_partner_age: embryologyData?.donor_partner_age || "--",
        sperms: embryologyData?.sperms || null,
        sperms_quality: embryologyData?.sperms_quality || null,
        sperms_prep_method: embryologyData?.sperms_prep_method || null,
        icsi_add_on: embryologyData?.icsi_add_on || null,
        frozen_sperm_vial_id: embryologyData?.frozen_sperm_vial_id || "--",
        icsi_ivf_done_by: embryologyData?.icsi_ivf_done_by || null,
        assisted_by: embryologyData?.assisted_by || null,
        opu_date: embryologyData?.opu_date
          ? dayjs(
            moment(embryologyData?.opu_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        opu_time: embryologyData?.opu_time
          ? dayjs(embryologyData?.opu_time, "HH:mm:ss")
          : null,
        actual_opu_time: embryologyData?.actual_opu_time
          ? dayjs(embryologyData?.actual_opu_time, "HH:mm:ss")
          : null,
        amh: embryologyData?.amh || "--",
        progesterone: embryologyData?.progesterone || "--",
        lmp: embryologyData?.lmp || "--",
        lh: embryologyData?.lh || "--",
        e2: embryologyData?.e2 || "--",
        preimplantation_generic_testing:
          embryologyData?.preimplantation_generic_testing || null,
        denudation_time: embryologyData?.denudation_time
          ? dayjs(embryologyData?.denudation_time, "HH:mm:ss")
          : null,
        icsi_ivf_time: embryologyData?.icsi_ivf_time
          ? dayjs(embryologyData?.icsi_ivf_time, "HH:mm:ss")
          : null,
        culture_media: embryologyData?.culture_media || null,
        embryo_dev_batch_no: embryologyData?.embryo_dev_batch_no || "--",
        embryo_dev_expiry_date: embryologyData?.embryo_dev_expiry_date
          ? dayjs(
            moment(embryologyData?.embryo_dev_expiry_date).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : null,
        day_0_date: embryologyData?.day_0_date
          ? dayjs(
            moment(embryologyData?.day_0_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        day_0_time: embryologyData?.day_0_time
          ? dayjs(embryologyData?.day_0_time, "HH:mm:ss")
          : null,
        day_1_date: embryologyData?.day_1_date
          ? dayjs(
            moment(embryologyData?.day_1_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        day_1_hrs_post_icsi_: embryologyData?.day_1_hrs_post_icsi_ || "--",
        day_3_date: embryologyData?.day_3_date
          ? dayjs(
            moment(embryologyData?.day_3_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        day_3_time: embryologyData?.day_3_time
          ? dayjs(embryologyData?.day_3_time, "HH:mm:ss")
          : null,
        day_5_date: embryologyData?.day_5_date
          ? dayjs(
            moment(embryologyData?.day_5_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        day_6_date: embryologyData?.day_6_date
          ? dayjs(
            moment(embryologyData?.day_6_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        freezing_method: embryologyData?.freezing_method || "--",
        freezing_media: embryologyData?.freezing_media || null,
        vitrification_devices: embryologyData?.vitrification_devices || null,
        vitrification_batch_no: embryologyData?.vitrification_batch_no || "--",
        vitrification_expiry_date: embryologyData?.vitrification_expiry_date
          ? dayjs(
            moment(embryologyData?.vitrification_expiry_date).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : null,
        pre_frozen_embryo_available:
          embryologyData?.pre_frozen_embryo_available || null,
        no_of_goblet: embryologyData?.no_of_goblet || "--",
        tank_no: embryologyData?.tank_no || "--",
        no_of_straws: embryologyData?.no_of_straws || "--",
        cannister_no: embryologyData?.cannister_no || "--",
        thawing_media: embryologyData?.thawing_media || null,
        warming_batch_no: embryologyData?.warming_batch_no || "--",
        warming_expiry_date: embryologyData?.warming_expiry_date
          ? dayjs(
            moment(embryologyData?.warming_expiry_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        distance_from_fundus: embryologyData?.distance_from_fundus || "--",
        transfer_done_by: embryologyData?.transfer_done_by || null,
        catheter: embryologyData?.catheter || null,
        embryo_loading_by: embryologyData?.embryo_loading_by || null,
        transfer_media: embryologyData?.transfer_media || null,
        notes: embryologyData?.notes || "--",
        embryo_image: embryoImage,
        ...newPackageData,
      });
    }
  }, [form, embryologyData]);

  const selectedModule = useMemo(() => {
    return (
      moduleList?.find((item) => item?.module_name === location?.pathname) || {}
    );
  }, [moduleList, location?.pathname]);

  // useEffect(() => {
  //   if (selectedPatient && Object.keys(selectedPatient).length > 0) {
  //     setPatientDetails({
  //       patient_id: selectedPatient?.patient_id,
  //       patient_full_name: selectedPatient?.patient_full_name,
  //       partner_full_name: selectedPatient?.partner_full_name,
  //       patient_dob: selectedPatient?.patient_dob,
  //       });
  //       form.setFieldsValue({
  //         patient_id: selectedPatient?.patient_id || "",
  //         patient_full_name: selectedPatient?.patient_full_name || "",
  //         partner_full_name: selectedPatient?.partner_full_name || "",
  //         patient_dob: moment().diff(selectedPatient?.patient_dob, "years") || "",
  //       });
  //       return() => {
  //         clearEmbryologyData();
  //       dispatch(setIvfIdList([]));
  //     dispatch(setEmbryologyData({}));
  //   };
  // }
  // }, [form, selectedPatient, dispatch]);

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
      clearEmbryologyData();
      dispatch(setIvfIdList([]));
      dispatch(setEmbryologyData({}));
    };
  }, [dispatch, selectedLocation, selectedModule, selectedPatient]);

  useEffect(() => {
    if (ivfIdList?.length > 0) {
      const ivfListId = ivfIdList?.map((item) => ({
        value: item._id,
        label: item.ivf_id,
        protocol: item.protocol,
      }));
      setIvfIdOption(ivfListId);
      setEmbryologyDetails((prevDetails) => ({
        ...prevDetails,
        ivf_flow_id: ivfListId[0]?.value,
        protocol: ivfListId[0]?.protocol,
      }));
      form.setFieldsValue({
        ivf_flow_id: ivfListId[0]?.value,
        protocol: ivfListId[0]?.protocol,
      });
    }
  }, [form, ivfIdList]);
  const handleIvfId = useCallback(
    (id) => {
      const findList = ivfIdOption?.find((item) => item.value === id);
      const newPackageData = transformData(
        embryologyData?.embryo || [embryoTable]
      );
      if (findList) {
        setEmbryoTableList(embryologyData?.embryo || [embryoTable]);
        setEmbryologyDetails({
          ivf_flow_id: findList?.value,
          protocol: findList?.protocol,
          eggs: embryologyData?.eggs || null,
          cycle_type: embryologyData?.cycle_type || null,
          cycle_no: embryologyData?.cycle_no || "--",
          opu_done_by: embryologyData?.opu_done_by || null,
          opu_done_by_name: embryologyData?.opu_done_by_name || "--",
          anesthesia_given_by: embryologyData?.anesthesia_given_by || null,
          anesthesia_given_by_name:
            embryologyData?.anesthesia_given_by_name || "--",
          tesa_done_by: embryologyData?.tesa_done_by || null,
          donor_partner_name: embryologyData?.donor_partner_name || "--",
          donor_partner_age: embryologyData?.donor_partner_age || "--",
          sperms: embryologyData?.sperms || null,
          sperms_quality: embryologyData?.sperms_quality || null,
          sperms_prep_method: embryologyData?.sperms_prep_method || null,
          icsi_add_on: embryologyData?.icsi_add_on || null,
          frozen_sperm_vial_id: embryologyData?.frozen_sperm_vial_id || "--",
          icsi_ivf_done_by: embryologyData?.icsi_ivf_done_by || null,
          assisted_by: embryologyData?.assisted_by || null,
          opu_date: embryologyData?.opu_date
            ? moment(embryologyData?.opu_date).format("DD/MM/YYYY")
            : null,
          opu_time: embryologyData?.opu_time
            ? dayjs(embryologyData?.opu_time, "HH:mm:ss").format("HH:mm:ss")
            : null,
          actual_opu_time: embryologyData?.actual_opu_time
            ? dayjs(embryologyData?.actual_opu_time, "HH:mm:ss").format(
              "HH:mm:ss"
            )
            : null,
          amh: embryologyData?.amh || "--",
          progesterone: embryologyData?.progesterone || "--",
          lmp: embryologyData?.lmp || "--",
          lh: embryologyData?.lh || "--",
          e2: embryologyData?.e2 || "--",
          preimplantation_generic_testing:
            embryologyData?.preimplantation_generic_testing || null,
          denudation_time: embryologyData?.denudation_time
            ? dayjs(embryologyData?.denudation_time, "HH:mm:ss").format(
              "HH:mm:ss"
            )
            : null,
          icsi_ivf_time: embryologyData?.icsi_ivf_time
            ? dayjs(embryologyData?.icsi_ivf_time, "HH:mm:ss").format(
              "HH:mm:ss"
            )
            : null,
          culture_media: embryologyData?.culture_media || null,
          embryo_dev_batch_no: embryologyData?.embryo_dev_batch_no || "--",
          embryo_dev_expiry_date: embryologyData?.embryo_dev_expiry_date
            ? moment(embryologyData?.embryo_dev_expiry_date).format(
              "DD/MM/YYYY"
            )
            : null,
          day_0_date: embryologyData?.day_0_date
            ? moment(embryologyData?.day_0_date).format("DD/MM/YYYY")
            : null,
          day_0_time: embryologyData?.day_0_time
            ? dayjs(embryologyData?.day_0_time, "HH:mm:ss").format("HH:mm:ss")
            : null,
          day_1_date: embryologyData?.day_1_date
            ? moment(embryologyData?.day_1_date).format("DD/MM/YYYY")
            : null,
          day_1_hrs_post_icsi_: embryologyData?.day_1_hrs_post_icsi_ || "--",
          day_3_date: embryologyData?.day_3_date
            ? moment(embryologyData?.day_3_date).format("DD/MM/YYYY")
            : null,
          day_3_time: embryologyData?.day_3_time
            ? dayjs(embryologyData?.day_3_time, "HH:mm:ss").format("HH:mm:ss")
            : null,
          day_5_date: embryologyData?.day_5_date
            ? moment(embryologyData?.day_5_date).format("DD/MM/YYYY")
            : null,
          day_6_date: embryologyData?.day_6_date
            ? moment(embryologyData?.day_6_date).format("DD/MM/YYYY")
            : null,
          freezing_method: embryologyData?.freezing_method || "--",
          freezing_media: embryologyData?.freezing_media || null,
          vitrification_devices: embryologyData?.vitrification_devices || null,
          vitrification_batch_no:
            embryologyData?.vitrification_batch_no || "--",
          vitrification_expiry_date: embryologyData?.vitrification_expiry_date
            ? moment(embryologyData?.vitrification_expiry_date).format(
              "DD/MM/YYYY"
            )
            : null,
          pre_frozen_embryo_available:
            embryologyData?.pre_frozen_embryo_available || null,
          no_of_goblet: embryologyData?.no_of_goblet || "--",
          tank_no: embryologyData?.tank_no || "--",
          no_of_straws: embryologyData?.no_of_straws || "--",
          cannister_no: embryologyData?.cannister_no || "--",
          thawing_media: embryologyData?.thawing_media || null,
          warming_batch_no: embryologyData?.warming_batch_no || "--",
          warming_expiry_date: embryologyData?.warming_expiry_date
            ? moment(embryologyData?.warming_expiry_date).format("DD/MM/YYYY")
            : null,
          distance_from_fundus: embryologyData?.distance_from_fundus || "--",
          transfer_done_by: embryologyData?.transfer_done_by || null,
          catheter: embryologyData?.catheter || null,
          embryo_loading_by: embryologyData?.embryo_loading_by || null,
          transfer_media: embryologyData?.transfer_media || null,
          total_m1: embryologyData?.total_m1 || 0,
          total_m2: embryologyData?.total_m2 || 0,
          notes: embryologyData?.notes || "--",
        });

        form.setFieldsValue({
          ivf_flow_id: findList?.value,
          protocol: findList?.protocol,
          eggs: embryologyData?.eggs || null,
          cycle_type: embryologyData?.cycle_type || null,
          cycle_no: embryologyData?.cycle_no || "--",
          opu_done_by: embryologyData?.opu_done_by || null,
          opu_done_by_name: embryologyData?.opu_done_by_name || "--",
          anesthesia_given_by: embryologyData?.anesthesia_given_by || null,
          anesthesia_given_by_name:
            embryologyData?.anesthesia_given_by_name || "--",
          tesa_done_by: embryologyData?.tesa_done_by || null,
          donor_partner_name: embryologyData?.donor_partner_name || "--",
          donor_partner_age: embryologyData?.donor_partner_age || "--",
          sperms: embryologyData?.sperms || null,
          sperms_quality: embryologyData?.sperms_quality || null,
          sperms_prep_method: embryologyData?.sperms_prep_method || null,
          icsi_add_on: embryologyData?.icsi_add_on || null,
          frozen_sperm_vial_id: embryologyData?.frozen_sperm_vial_id || "--",
          icsi_ivf_done_by: embryologyData?.icsi_ivf_done_by || null,
          assisted_by: embryologyData?.assisted_by || null,
          opu_date: embryologyData?.opu_date
            ? dayjs(
              moment(embryologyData?.opu_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          opu_time: embryologyData?.opu_time
            ? dayjs(embryologyData?.opu_time, "HH:mm:ss")
            : null,
          actual_opu_time: embryologyData?.actual_opu_time
            ? dayjs(embryologyData?.actual_opu_time, "HH:mm:ss")
            : null,
          amh: embryologyData?.amh || "--",
          progesterone: embryologyData?.progesterone || "--",
          lmp: embryologyData?.lmp || "--",
          lh: embryologyData?.lh || "--",
          e2: embryologyData?.e2 || "--",
          preimplantation_generic_testing:
            embryologyData?.preimplantation_generic_testing || null,
          denudation_time: embryologyData?.denudation_time
            ? dayjs(embryologyData?.denudation_time, "HH:mm:ss")
            : null,
          icsi_ivf_time: embryologyData?.icsi_ivf_time
            ? dayjs(embryologyData?.icsi_ivf_time, "HH:mm:ss")
            : null,
          culture_media: embryologyData?.culture_media || null,
          embryo_dev_batch_no: embryologyData?.embryo_dev_batch_no || "--",
          embryo_dev_expiry_date: embryologyData?.embryo_dev_expiry_date
            ? dayjs(
              moment(embryologyData?.embryo_dev_expiry_date).format(
                "DD/MM/YYYY"
              ),
              "DD/MM/YYYY"
            )
            : null,
          day_0_date: embryologyData?.day_0_date
            ? dayjs(
              moment(embryologyData?.day_0_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_0_time: embryologyData?.day_0_time
            ? dayjs(embryologyData?.day_0_time, "HH:mm:ss")
            : null,
          day_1_date: embryologyData?.day_1_date
            ? dayjs(
              moment(embryologyData?.day_1_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_1_hrs_post_icsi_: embryologyData?.day_1_hrs_post_icsi_ || "--",
          day_3_date: embryologyData?.day_3_date
            ? dayjs(
              moment(embryologyData?.day_3_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_3_time: embryologyData?.day_3_time
            ? dayjs(embryologyData?.day_3_time, "HH:mm:ss")
            : null,
          day_5_date: embryologyData?.day_5_date
            ? dayjs(
              moment(embryologyData?.day_5_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          day_6_date: embryologyData?.day_6_date
            ? dayjs(
              moment(embryologyData?.day_6_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          freezing_method: embryologyData?.freezing_method || "--",
          freezing_media: embryologyData?.freezing_media || null,
          vitrification_devices: embryologyData?.vitrification_devices || null,
          vitrification_batch_no:
            embryologyData?.vitrification_batch_no || "--",
          vitrification_expiry_date: embryologyData?.vitrification_expiry_date
            ? dayjs(
              moment(embryologyData?.vitrification_expiry_date).format(
                "DD/MM/YYYY"
              ),
              "DD/MM/YYYY"
            )
            : null,
          pre_frozen_embryo_available:
            embryologyData?.pre_frozen_embryo_available || null,
          no_of_goblet: embryologyData?.no_of_goblet || "--",
          tank_no: embryologyData?.tank_no || "--",
          no_of_straws: embryologyData?.no_of_straws || "--",
          cannister_no: embryologyData?.cannister_no || "--",
          thawing_media: embryologyData?.thawing_media || null,
          warming_batch_no: embryologyData?.warming_batch_no || "--",
          warming_expiry_date: embryologyData?.warming_expiry_date
            ? dayjs(
              moment(embryologyData?.warming_expiry_date).format(
                "DD/MM/YYYY"
              ),
              "DD/MM/YYYY"
            )
            : null,
          distance_from_fundus: embryologyData?.distance_from_fundus || "--",
          transfer_done_by: embryologyData?.transfer_done_by || null,
          catheter: embryologyData?.catheter || null,
          embryo_loading_by: embryologyData?.embryo_loading_by || null,
          transfer_media: embryologyData?.transfer_media || null,
          notes: embryologyData?.notes || "--",
          ...newPackageData,
        });
      }
    },
    [form, ivfIdOption]
  );

  const onFinish = (values) => {
    if (embryologyDetails?.ivf_flow_id) {
      const obj = {
        ...embryologyDetails,
        embryo: embryoTableList,
        embryo_image: [embryologyDetails.embryo_image],
      };
      if (Object.keys(embryologyData)?.length > 0) {
        dispatch(
          editEmbryologyData({
            location_id: selectedLocation,
            _id: embryologyDetails?._id,
            module_id: selectedModule?._id,
            payload: isOpenBy.includes(embryologyDetails?.eggs) ? { ...obj, donate_by: pDetail._id } : obj,
          })
        );
      } else {
        dispatch(
          createEmbryologyData({
            location_id: selectedLocation,
            patient_reg_id: selectedPatient?._id,
            module_id: selectedModule?._id,
            payload: isOpenBy.includes(embryologyDetails?.eggs) ? { ...obj, donate_by: pDetail._id } : obj,
          })
        );
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

  const clearEmbryologyData = useCallback(() => {
    // setPatientDetails({
    //   patient_id: "",
    //   patient_dob: "",
    //   patient_full_name: "",
    //   partner_full_name: "",
    // });
    setIvfIdOption([]);
    setEmbryoTableList([embryoTable]);
    setPrintOption([]);
    setEmbryologyDetails({
      ivf_flow_id: "",
      eggs: null,
      cycle_type: null,
      cycle_no: "",
      opu_done_by: null,
      opu_done_by_name: "",
      anesthesia_given_by: null,
      anesthesia_given_by_name: "",
      tesa_done_by: null,
      donor_partner_name: "",
      donor_partner_age: "",
      sperms: null,
      sperms_quality: null,
      sperms_prep_method: null,
      icsi_add_on: null,
      frozen_sperm_vial_id: "",
      icsi_ivf_done_by: null,
      assisted_by: null,
      opu_date: null,
      opu_time: null,
      actual_opu_time: null,
      amh: "",
      progesterone: "",
      lmp: "",
      lh: "",
      e2: "",
      preimplantation_generic_testing: null,
      denudation_time: null,
      icsi_ivf_time: null,
      culture_media: null,
      embryo_dev_batch_no: "",
      embryo_dev_expiry_date: null,
      day_0_date: null,
      day_0_time: null,
      day_1_date: null,
      day_1_hrs_post_icsi_: "",
      day_3_date: null,
      day_3_time: null,
      day_5_date: null,
      day_6_date: null,
      freezing_method: "",
      freezing_media: null,
      vitrification_devices: null,
      vitrification_batch_no: "",
      vitrification_expiry_date: null,
      pre_frozen_embryo_available: null,
      no_of_goblet: "",
      tank_no: "",
      no_of_straws: "",
      cannister_no: "",
      thawing_media: null,
      warming_batch_no: "",
      warming_expiry_date: null,
      distance_from_fundus: "",
      transfer_done_by: null,
      catheter: null,
      embryo_loading_by: null,
      transfer_media: null,
      total_m1: 0,
      total_m2: 0,
      notes: "",
    });
    form.resetFields();
  }, [form]);

  const handleClear = () => {
    clearEmbryologyData();
    dispatch(setSelectedPatient({}));
    dispatch(setIvfIdList([]));
    dispatch(clearData());
  };

  useEffect(() => {
    const slider = document.querySelector(
      ".custom_table_Wrap .table-responsive"
    );
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1;
      slider.scrollLeft = scrollLeft - walk;
    });
  }, []);

  const getNewSelectedPatientData = useCallback(async () => {
    if (
      embryologyDataUpdate &&
      Object.keys(selectedPatient)?.length > 0 &&
      Object.keys(embryologyData)?.length === 0
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
    embryologyDataUpdate,
    embryologyData,
  ]);
  useEffect(() => {
    getNewSelectedPatientData();
  }, [embryologyDataUpdate]);

  const printEmbryoTransferData = useCallback(async () => {
    dispatch(
      printEmbryologyFlowSheet({
        moduleId: selectedModule?._id,
        patientRegId: selectedPatient?._id,
        ivfFlowId: embryologyData?.ivf_flow_id,
      })
    );
  }, [selectedModule, dispatch, embryologyData, selectedPatient]);

  const printEmbryologyFlowSheetData = useCallback(async () => {
    dispatch(
      printEmbryoWarming({
        moduleId: selectedModule?._id,
        patientRegId: selectedPatient?._id,
        ivfFlowId: embryologyData?.ivf_flow_id,
      })
    );
  }, [selectedModule, dispatch, embryologyData, selectedPatient]);

  const printVitrificationReportData = useCallback(async (val) => {
    dispatch(
      printVitrificationReport({
        moduleId: selectedModule?._id,
        patientRegId: selectedPatient?._id,
        ivfFlowId: embryologyData?.ivf_flow_id,
        payload: {
          stage: val
        }
      })
    );
  }, [selectedModule, dispatch, embryologyData, selectedPatient]);


  const validateScore = (_, value) => {
    const validScores = [
      "111", "112", "113",
      "121", "122", "123",
      "131", "132", "133",
      "211", "212", "213",
      "221", "222", "223",
      "231", "232", "233",
      "311", "312", "313",
      "321", "322", "323",
      "331", "332", "333"
    ];

    if (!validScores.includes(value)) {
      return Promise.reject("");
    }

    return Promise.resolve();
  };


  const handlechangePickupDate = useCallback(
    (e) => {
      setEmbryologyDetails((prevDetails) => ({
        ...prevDetails,
        opu_date: moment(new Date(e)).format(
          "YYYY/MM/DD"
        ),
        day_0_date: moment(new Date(e)).format(
          "YYYY/MM/DD"
        ),
        day_1_date: moment(new Date(e)).add(1, "days").format(
          "YYYY/MM/DD"
        ),
        day_3_date: moment(new Date(e)).add(3, "days").format(
          "YYYY/MM/DD"
        )
      }));
      // console.log('e', e)
      // console.log('first', dayjs(
      //   moment(e).format("DD/MM/YYYY"),
      //   "DD/MM/YYYY"
      // ))
      // console.log('date1111', e, dayjs(moment(e).format("DD/MM/YYYY"), 'DD/MM/YYYY').add(1, 'day'))
      // form.setFieldsValue({
      // day_0_date: dayjs(e, 'DD/MM/YYYY').add(1, 'day').format('YYYY/MM/DD'),
      // ),
      //   day_0_date: dayjs(
      //     moment(new Date(e)).format("DD/MM/YYYY"),
      //     "DD/MM/YYYY"
      //   ),
      //     day_1_date: dayjs(moment(new Date(e)), 'DD/MM/YYYY').add(1, 'days').format('YYYY/MM/DD'),
      //       day_3_date: dayjs(moment(new Date(e)), 'DD/MM/YYYY').add(3, 'days').format('YYYY/MM/DD'),
      // })
      // console.log('moment(e).format("DD/MM/YYYY")', moment(new Date(e)))
      // console.log('first', dayjs(
      //   moment(new Date(e)).format("DD/MM/YYYY"),
      //   "DD/MM/YYYY"
      // ))
      // console.log('first', dayjs(
      //   moment(new Date(e)).add(1, "days").format("DD/MM/YYYY"),
      //   "DD/MM/YYYY"
      // ));
      form.setFieldsValue({
        // opu_date: dayjs(
        //   moment(new Date(e)).format("DD/MM/YYYY"),
        //   "DD/MM/YYYY"
        // ),
        day_0_date: dayjs(
          moment(new Date(e)).format("DD/MM/YYYY"),
          "DD/MM/YYYY"
        ),
        day_1_date:
          dayjs(
            moment(new Date(e)).add(1, "days").format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          ),
        day_3_date: dayjs(
          moment(new Date(e)).add(3, "days").format("DD/MM/YYYY"),
          "DD/MM/YYYY"
        ),

      })
    },
    [embryologyDetails],
  )

  // const dateOfFreezingHandleChange = useCallback(
  //   () => {
  //     console.log('embryologyDetails?.day_3_date', embryologyDetails?.day_3_date)
  //     console.log('embryologyDetails?.no_of_oocytes', embryologyDetails?.no_of_oocytes)
  //     console.log('embryoTableList', embryoTableList);
  //   },
  //   [embryologyDetails, embryoTableList],
  // )

  const handleChange = (newValue) => {
    const patientDetail = patientList?.find((patient) => patient?._id === newValue);
    if (patientDetail) {
      setPDetail(patientDetail)
    }
  };

  const handleSearch = useCallback(
    (newValue, selectedLocation) => {
      if (newValue && selectedLocation) {
        dispatch(
          getPatientSearch({
            patient_name: newValue,
            location_id: selectedLocation,
          })
        );
      }
    },
    [dispatch]
  );


  const globalSearchTextChange = React.useCallback(
    _.debounce(handleSearch, 800),
    []
  );

  const handleRemove = (file, fileName) => {
    if (fileName === "embryo_image") {
      const newFileList = patientPhotoList.filter(
        (item) => item.embryo_image !== file.embryo_image
      );
      setPatientPhotoList(newFileList);
    }
    dispatch(setUploadImageDetail(false));
  };

  const handleClearSearch = useCallback(
    () => {
      dispatch(setPatientListData([]));
      setPDetail({});
      form.setFieldsValue({ by: null })
    },
    [dispatch],
  );

  const showErrorMessage = (error, response, fileListName) => {
    if (fileListName === "embryo_image") {
      toast.error("Error uploading patient photo.");
    }
  };


  const customUpload =
    (name) =>
      async ({ file, onSuccess, onError }) => {
        try {
          const formData = new FormData();
          formData.append("file", file);
          setFileName(name);
          dispatch(uploadImage(formData));
          if (name === "embryo_image") {
            setPatientPhotoList([file]);
          }
          setTimeout(() => {
            onSuccess("Successfully uploaded");
          }, 1000);
        } catch (error) {
          onError("Upload failed");
        }
      };

  const validateTotalM1 = (rule, value, callback) => {
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue) || parsedValue < countOfMI) {
      callback('');
    } else if (parsedValue < embryologyDetails.total_m1) {
      callback('');
    } else {
      callback(); // Pass validation
    }
  };


  const validateTotalM2 = (rule, value, callback) => {
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue) || parsedValue < countOfMII) {
      callback('');
    } else if (parsedValue < embryologyDetails.total_m2) {
      callback('');
    } else {
      callback(); // Pass validation
    }
  };
  const menuProps = (
    <Menu>
      {printOption?.map((item) => {
        return <Menu.Item onClick={() => {
          (selectedModule?._id && selectedPatient?._id && embryologyData?.ivf_flow_id) &&
            printVitrificationReportData(item?.value);
        }} key="1">{item?.label}</Menu.Item>
      })}
    </Menu>
  );


  const createPrintOption = useCallback(
    (tblData) => {
      const filteredEmbryoTableList = tblData.filter(item => {
        return stageOptionsForPrint.some(option => option.value === item.stage_2);
      }).map(filteredItem => {
        const { stage_2 } = filteredItem;
        return { value: stage_2, label: stage_2 };
      });
      return filteredEmbryoTableList
    },
    [],
  )

  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {(isIvfListLoading || embryologyDataLoading) && (
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        )}
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          form={form}
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
                  {/* Pt. ID no. */}
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
                  <li>
                    <label>Age :</label>
                    <span>{selectedPatient?.partner_full_name ? ageCalculatorFunc(selectedPatient?.patient_dob) : ""}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Patient Details</h3>
              <ul className="grid_wrapper">
                {/* <li className="w_350 w_xs_100">
                  <Form.Item label="Patient name" name="patient_full_name">
                    <Input
                      placeholder="Enter Patient Name"
                      name="patient_full_name"
                      value={patientDetails?.patient_full_name}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                {/* <li className="w_120 w_xs_100">
                  <Form.Item label="Age" name="patient_dob">
                    <Input
                      placeholder="Enter Age"
                      name="patient_dob"
                      value={patientDetails?.patient_dob}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                <li className="w_270 w_xs_50">
                  <Form.Item label="Eggs" name="eggs" className="custom_select">
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
                      name="eggs"
                      value={embryologyDetails?.eggs}
                      onChange={(value) => {
                        handleClearSearch();
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          eggs: value,
                        });
                      }}
                      options={[
                        { value: "Own fresh", label: "Own fresh" },
                        { value: "Donor fresh", label: "Donor fresh" },
                        { value: "Own frozen", label: "Own frozen" },
                        { value: "Donor frozen", label: "Donor frozen" },
                      ]}
                    />
                  </Form.Item>
                </li>
                {
                  isOpenBy.includes(embryologyDetails?.eggs) &&
                  (<li className="w_270 w_xs_50">
                    <div className="search_top">
                      <Form.Item label="By" name="by" className="custom_select search_with_select">
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
                          name="by"
                          value={pDetail?.patient_full_name}
                          placeholder="Search here"
                          defaultActiveFirstOption={false}
                          suffixIcon={null}
                          onSearch={(e) => { Object.keys(selectedPatient)?.length > 0 && globalSearchTextChange(e, selectedLocation) }
                          }
                          onChange={handleChange}
                          notFoundContent={null}
                          options={(patientList || []).map((d) => ({
                            value: d?._id,
                            label: d?.patient_full_name,
                          }))}
                        />
                        {Object.keys(pDetail).length > 0 && (
                          <Button
                            className="clearIcon btn_transparent"
                            onClick={handleClearSearch}
                          >
                            <CloseOutlined />
                          </Button>
                        )}
                      </Form.Item>
                    </div>
                  </li>)
                }


                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Cycle type"
                    name="cycle_type"
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
                      name="cycle_type"
                      value={embryologyDetails?.cycle_type}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          cycle_type: value,
                        });
                      }}
                      options={[
                        { value: "Own", label: "Own" },
                        { value: "OD", label: "OD" },
                        { value: "DS", label: "DS" },
                        { value: "ED", label: "ED" },
                      ]}
                    />
                  </Form.Item>
                </li>
                {/* <li className="w_120 w_xs_100">
                  <Form.Item label="Cycle No" name="cycle_no">
                    <Input
                      placeholder="Enter No"
                      name="cycle_no"
                      value={embryologyDetails?.cycle_no}
                      onChange={e => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          cycle_no: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li> */}
                {/* <li className="w_170 w_xs_120">
                  <Form.Item label="Pt. ID no." name="patient_id">
                    <Input
                      placeholder="Enter No"
                      name="patient_id"
                      value={patientDetails?.patient_id}
                      disabled
                    />
                  </Form.Item>
                </li> */}
                <li className="w_180 w_xs_100">
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
                      value={embryologyDetails?.ivf_flow_id}
                      onChange={(e) => {
                        handleIvfId(e);
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="OPU done by"
                    name="opu_done_by"
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
                      name="opu_done_by"
                      value={embryologyDetails?.opu_done_by}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          opu_done_by: value,
                          opu_done_by_name: "",
                        });
                        form.setFieldsValue({
                          opu_done_by_name: "",
                        });
                      }}
                      options={doctorList.length > 0 ? [
                        ...doctorList,
                        { label: "Other", value: "Other" },
                      ] : []}
                    />
                  </Form.Item>
                </li>
                {embryologyDetails?.opu_done_by === "Other" && (
                  <li>
                    <Form.Item label="OPU done by Name" name="opu_done_by_name">
                      <Input
                        placeholder="Enter Partner Name"
                        name="opu_done_by_name"
                        value={embryologyDetails?.opu_done_by_name}
                        onChange={(e) => {
                          setEmbryologyDetails({
                            ...embryologyDetails,
                            opu_done_by_name: e.target.value,
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Anesthesia given by"
                    name="anesthesia_given_by"
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
                      name="anesthesia_given_by"
                      value={embryologyDetails?.anesthesia_given_by}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          anesthesia_given_by: value,
                          anesthesia_given_by_name: "",
                        });
                        form.setFieldsValue({
                          anesthesia_given_by_name: "",
                        });
                      }}
                      options={doctorList.length > 0 ? [
                        ...doctorList,
                        { label: "Other", value: "Other" },
                      ] : []}
                    />
                  </Form.Item>
                </li>
                {embryologyDetails?.anesthesia_given_by === "Other" && (
                  <li>
                    <Form.Item
                      label="Anesthesia given by Name"
                      name="anesthesia_given_by_name"
                    >
                      <Input
                        placeholder="Enter Partner Name"
                        name="anesthesia_given_by_name"
                        value={embryologyDetails?.anesthesia_given_by_name}
                        onChange={(e) => {
                          setEmbryologyDetails({
                            ...embryologyDetails,
                            anesthesia_given_by_name: e.target.value,
                          });
                        }}
                      />
                    </Form.Item>
                  </li>
                )}
                <li className="w_270 w_xs_100">
                  <Form.Item
                    label="TESA done by"
                    name="tesa_done_by"
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
                      name="tesa_done_by"
                      value={embryologyDetails?.tesa_done_by}
                      onChange={(value) => {
                        setEmbryologyDetails({
                          ...embryologyDetails,
                          tesa_done_by: value,
                        });
                      }}
                      options={doctorList}
                    />
                  </Form.Item>
                </li>
                {/* <li className="w_270 w_xs_100">
                  <Form.Item label="Partner Name" name="partner_full_name">
                    <Input
                      placeholder="Enter Partner Name"
                      name="partner_full_name"
                      value={patientDetails?.partner_full_name}
                      disabled
                    />
                  </Form.Item>
                </li> */}
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Partner Details</h3>
              <Row>
                <Col xl={9}>
                  <ul className="grid_wrapper">
                    <li className="w_300 w_xs_100">
                      <Form.Item label="Partner Name" name="donor_partner_name">
                        <Input
                          placeholder="Enter Partner Name"
                          name="donor_partner_name"
                          value={embryologyDetails?.donor_partner_name}
                          onChange={(e) => {
                            setEmbryologyDetails({
                              ...embryologyDetails,
                              donor_partner_name: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_120 w_xs_100">
                      <Form.Item label="Age" name="donor_partner_age">
                        <Input
                          placeholder="Enter Age"
                          name="donor_partner_age"
                          value={embryologyDetails?.donor_partner_age}
                          onChange={(e) => {
                            setEmbryologyDetails({
                              ...embryologyDetails,
                              donor_partner_age: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_250 w_xs_50">
                      <Form.Item
                        label="Sperms"
                        name="sperms"
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
                          name="sperms"
                          value={embryologyDetails?.sperms}
                          onChange={(value) => {
                            setEmbryologyDetails({
                              ...embryologyDetails,
                              sperms: value,
                            });
                          }}
                          options={spermsOptions}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_270 w_xs_50">
                      <Form.Item
                        label="Sperm quality"
                        name="sperms_quality"
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
                          name="sperms_quality"
                          value={embryologyDetails?.sperms_quality}
                          onChange={(value) => {
                            setEmbryologyDetails({
                              ...embryologyDetails,
                              sperms_quality: value,
                            });
                          }}
                          options={spermsQualityOptions}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_190 w_xs_50">
                      <Form.Item
                        label="Sperm prep. Method"
                        name="sperms_prep_method"
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
                          name="sperms_prep_method"
                          value={embryologyDetails?.sperms_prep_method}
                          onChange={(value) => {
                            setEmbryologyDetails({
                              ...embryologyDetails,
                              sperms_prep_method: value,
                            });
                          }}
                          options={[
                            { value: "SWIM-UP", label: "SWIM-UP" },
                            { value: "SIMPLE WASH", label: "SIMPLE WASH" },
                            { value: "ZYMOT", label: "ZYMOT" },
                            { value: "CAO", label: "CAO" },
                            { value: "MACS", label: "MACS" },
                            { value: "Other", label: "Other" },
                          ]}
                        />
                      </Form.Item>
                    </li>
                    {
                      embryologyDetails?.sperms_prep_method === "Other" && (
                        <li className="w_220 w_xs_100">
                          <Form.Item label="Other Prep Method" name="other_prep_method">
                            <Input
                              placeholder="Other Prep Method"
                              name="other_prep_method"
                              value={embryologyDetails?.other_prep_method}
                              onChange={(e) => {
                                setEmbryologyDetails({
                                  ...embryologyDetails,
                                  other_prep_method: e.target.value,
                                });
                              }}
                            />
                          </Form.Item>
                        </li>
                      )
                    }
                    <li className="w_220 w_xs_50">
                      <Form.Item
                        label="ICSI Add on"
                        name="icsi_add_on"
                        className={embryologyDetails?.icsi_add_on ? "custom_select select_with_hover" : "custom_select"}
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
                          name="icsi_add_on"
                          mode="multiple"
                          maxTagCount="responsive"
                          value={embryologyDetails?.icsi_add_on}
                          onChange={(value) => {
                            setEmbryologyDetails({
                              ...embryologyDetails,
                              icsi_add_on: value,
                            });
                          }}
                          options={[
                            { value: "PICSI", label: "PICSI" },
                            {
                              value: "Oocyte activation media",
                              label: "Oocyte activation media",
                            },
                            { value: "Sperm mobil", label: "Sperm mobil" },
                            { value: "LAH", label: "LAH" },
                            { value: "Other", label: "Other" },
                          ]}
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
                    </li>
                    {
                      embryologyDetails?.icsi_add_on?.includes("Other") && (
                        <li className="w_220 w_xs_100">
                          <Form.Item label="Icsi Add On Other" name="icsi_add_on_other">
                            <Input
                              placeholder="Icsi Add On Other"
                              name="icsi_add_on_other"
                              value={embryologyDetails?.icsi_add_on_other}
                              onChange={(e) => {
                                setEmbryologyDetails({
                                  ...embryologyDetails,
                                  icsi_add_on_other: e.target.value,
                                });
                              }}
                            />
                          </Form.Item>
                        </li>
                      )
                    }
                    <li className="w_170 w_xs_100">
                      <Form.Item
                        label="Frozen sperm vial ID"
                        name="frozen_sperm_vial_id"
                      >
                        <Input
                          placeholder="ID"
                          name="frozen_sperm_vial_id"
                          value={embryologyDetails?.frozen_sperm_vial_id}
                          onChange={(e) => {
                            setEmbryologyDetails({
                              ...embryologyDetails,
                              frozen_sperm_vial_id: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_220 w_xs_100">
                      <Form.Item
                        label="ICSI/IVF done by"
                        name="icsi_ivf_done_by"
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
                          name="icsi_ivf_done_by"
                          value={embryologyDetails?.icsi_ivf_done_by}
                          onChange={(value) => {
                            setEmbryologyDetails({
                              ...embryologyDetails,
                              icsi_ivf_done_by: value,
                            });
                          }}
                          options={doctorList}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_220 w_xs_100">
                      <Form.Item
                        label="Assisted by"
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
                          value={embryologyDetails?.assisted_by}
                          onChange={(value) => {
                            setEmbryologyDetails({
                              ...embryologyDetails,
                              assisted_by: value,
                            });
                          }}
                          options={doctorList}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_220 w_xs_100">
                      <Form.Item label="Protocol" name="protocol">
                        <Input
                          placeholder="Protocol"
                          name="protocol"
                          value={embryologyDetails?.protocol}
                          disabled
                        />
                      </Form.Item>
                    </li>
                  </ul>
                </Col>
                <Col xl={3}>
                  <Form.Item
                    label="Photo Of Embryo"
                    className="upload_Wrapper"
                  >
                    <div className="photo_upload_inner">
                      <Row className="g-2">
                        <Col xs={6}>
                          <div className="uploaded_img">
                            <img
                              src={
                                embryologyDetails?.embryo_image
                                  ? `${process.env.REACT_APP_SOCKET_URL}/${embryologyDetails?.embryo_image}`
                                  : UserImg
                              }
                              alt=""
                            />
                            <Button
                              className="btn_transparent"
                              onClick={() => {
                                dispatch(setUploadImageDetail(false));
                                setEmbryologyDetails({
                                  ...embryologyDetails,
                                  embryo_image: "",
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
                            customRequest={customUpload("embryo_image")}
                            fileList={patientPhotoList}
                            onRemove={(file) => {
                              setEmbryologyDetails({
                                ...embryologyDetails,
                                embryo_image: "",
                              });
                              handleRemove(file, "embryo_image");
                            }}
                            onError={(error, response) => {
                              showErrorMessage(
                                error,
                                response,
                                "embryo_image"
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

              <div className="custom_table_Wrap pb-4">
                <div className="table-responsive">
                  <table>
                    <tbody>
                      <tr>
                        <td colSpan="9">
                          <h4>EMBRYO DEVELOPMENT</h4>
                        </td>
                        <td colSpan="7">
                          <h4>VITRIFICATION DETAILS</h4>
                        </td>
                        <td colSpan="5">
                          <h4>WARMING DETAILS</h4>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="9">
                          <div className="embryo_development_wrap">
                            <ul className="grid_wrapper">
                              <li className="w_180">
                                <Form.Item label="Pickup date" name="opu_date">
                                  <DatePicker
                                    placeholder="9/11/1997"
                                    name="opu_date"
                                    value={
                                      embryologyDetails?.opu_date
                                        ? dayjs(
                                          embryologyDetails?.opu_date,
                                          "DD/MM/YYYY"
                                        )
                                        : null
                                    }
                                    format={{
                                      format: "DD-MM-YYYY",
                                      type: "mask",
                                    }}
                                    onChange={handlechangePickupDate}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_170">
                                <Form.Item label="Pickup time" name="opu_time">
                                  <TimePicker
                                    name="opu_time"
                                    format="h:mm a"
                                    value={embryologyDetails?.opu_time}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        opu_time: value
                                          ? dayjs(value).format("HH:mm:ss")
                                          : null,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_170">
                                <Form.Item
                                  label="Actual Pickup Time"
                                  name="actual_opu_time"
                                >
                                  <TimePicker
                                    name="actual_opu_time"
                                    format="h:mm a"
                                    value={embryologyDetails?.actual_opu_time}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        actual_opu_time: value
                                          ? dayjs(value).format("HH:mm:ss")
                                          : null,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_180">
                                <Form.Item label="AMH" name="amh">
                                  <Input
                                    placeholder="Enter AMH"
                                    name="amh"
                                    value={embryologyDetails?.amh}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        amh: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item
                                  label="Progesterone"
                                  name="progesterone"
                                >
                                  <Input
                                    placeholder="Enter Progesterone"
                                    name="progesterone"
                                    value={embryologyDetails?.progesterone}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        progesterone: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_180">
                                <Form.Item label="LMP" name="lmp">
                                  <Input
                                    placeholder="Enter LMP"
                                    name="lmp"
                                    value={embryologyDetails?.lmp}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        lmp: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_180">
                                <Form.Item label="LH" name="lh">
                                  <Input
                                    placeholder="Enter LH"
                                    name="lh"
                                    value={embryologyDetails?.lh}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        lh: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item label="E2" name="e2">
                                  <Input
                                    placeholder="Enter E2"
                                    name="e2"
                                    value={embryologyDetails?.e2}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        e2: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_250">
                                <Form.Item
                                  label="Preimplantation Genetic Testing ?"
                                  name="preimplantation_generic_testing"
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
                                    name="preimplantation_generic_testing"
                                    value={
                                      embryologyDetails?.preimplantation_generic_testing
                                    }
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        preimplantation_generic_testing: value,
                                      });
                                    }}
                                    options={[
                                      { value: "PGT-A", label: "PGT-A" },
                                      { value: "PGT-M", label: "PGT-M" },
                                      { value: "PGT-SR", label: "PGT-SR" },
                                      { value: "No", label: "No" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item
                                  label="Denudation time"
                                  name="denudation_time"
                                >
                                  <TimePicker
                                    format="h:mm a"
                                    name="denudation_time"
                                    value={embryologyDetails?.denudation_time}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        denudation_time: value
                                          ? dayjs(value).format("HH:mm:ss")
                                          : null,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_170">
                                <Form.Item
                                  label="ICSI/IVF TIME"
                                  name="icsi_ivf_time"
                                >
                                  <TimePicker
                                    format="h:mm a"
                                    name="icsi_ivf_time"
                                    value={embryologyDetails?.icsi_ivf_time}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        icsi_ivf_time: value
                                          ? dayjs(value).format("HH:mm:ss")
                                          : null,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_200">
                                <Form.Item
                                  label="Culture media"
                                  name="culture_media"
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
                                    name="culture_media"
                                    value={embryologyDetails?.culture_media}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        culture_media: value,
                                      });
                                    }}
                                    options={[
                                      { value: "Sage", label: "Sage" },
                                      { value: "Vitromed", label: "Vitromed" },
                                      {
                                        value: "Vitrolife",
                                        label: "Vitrolife",
                                      },
                                      { value: "Cook’s", label: "Cook’s" },
                                      { value: "Other", label: "Other" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item
                                  label="Batch no."
                                  name="embryo_dev_batch_no"
                                >
                                  <Input
                                    placeholder="Enter Batch no."
                                    name="embryo_dev_batch_no"
                                    value={
                                      embryologyDetails?.embryo_dev_batch_no
                                    }
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        embryo_dev_batch_no: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item
                                  label="Expiry Date"
                                  name="embryo_dev_expiry_date"
                                >
                                  <DatePicker
                                    placeholder="9/11/1997"
                                    name="embryo_dev_expiry_date"
                                    value={
                                      embryologyDetails?.embryo_dev_expiry_date
                                        ? dayjs(
                                          embryologyDetails?.embryo_dev_expiry_date,
                                          "DD/MM/YYYY"
                                        )
                                        : null
                                    }
                                    format={{
                                      format: "DD-MM-YYYY",
                                      type: "mask",
                                    }}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        embryo_dev_expiry_date: moment(
                                          new Date(e)
                                        ).format("YYYY/MM/DD"),
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                          </div>
                        </td>
                        <td colSpan="7" rowSpan={2}>
                          <div className="verification_detail_wrap">
                            <ul className="grid_wrapper">
                              <li className="w_220">
                                <Form.Item
                                  label="Freezing Method"
                                  name="freezing_method"
                                >
                                  <Input
                                    placeholder="Enter Freezing Method"
                                    name="freezing_method"
                                    value={embryologyDetails?.freezing_method}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        freezing_method: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_220">
                                <Form.Item
                                  label="Freezing media"
                                  name="freezing_media"
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
                                    name="freezing_media"
                                    value={embryologyDetails?.freezing_media}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        freezing_media: value,
                                      });
                                    }}
                                    options={[
                                      { value: "Cryotech", label: "Cryotech" },
                                      { value: "Kitazato", label: "Kitazato" },
                                      { value: "Origio", label: "Origio" },
                                      { value: "Other", label: "Other" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_220">
                                <Form.Item
                                  label="Vitrification Device"
                                  name="vitrification_devices"
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
                                    name="vitrification_devices"
                                    value={
                                      embryologyDetails?.vitrification_devices
                                    }
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        vitrification_devices: value,
                                      });
                                    }}
                                    options={[
                                      { value: "Cryotech", label: "Cryotech" },
                                      { value: "Cryoleaf", label: "Cryoleaf" },
                                      { value: "Cryotop", label: "Cryotop" },
                                      { value: "Cryolock", label: "Cryolock" },
                                      { value: "Other", label: "Other" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_220">
                                <Form.Item
                                  label="Batch no."
                                  name="vitrification_batch_no"
                                >
                                  <Input
                                    placeholder="Enter Batch no."
                                    name="vitrification_batch_no"
                                    value={
                                      embryologyDetails?.vitrification_batch_no
                                    }
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        vitrification_batch_no: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_220">
                                <Form.Item
                                  label="Expiry Date"
                                  name="vitrification_expiry_date"
                                >
                                  <DatePicker
                                    placeholder="9/11/1997"
                                    name="vitrification_expiry_date"
                                    value={
                                      embryologyDetails?.vitrification_expiry_date
                                        ? dayjs(
                                          embryologyDetails?.vitrification_expiry_date,
                                          "DD/MM/YYYY"
                                        )
                                        : null
                                    }
                                    format={{
                                      format: "DD-MM-YYYY",
                                      type: "mask",
                                    }}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        vitrification_expiry_date: moment(
                                          new Date(e)
                                        ).format("YYYY/MM/DD"),
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_320">
                                <Form.Item
                                  label="Previously frozen embryos available ? "
                                  name="pre_frozen_embryo_available"
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
                                    name="pre_frozen_embryo_available"
                                    value={
                                      embryologyDetails?.pre_frozen_embryo_available
                                    }
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        pre_frozen_embryo_available: value,
                                      });
                                    }}
                                    options={[
                                      { value: "Yes", label: "Yes" },
                                      { value: "No", label: "No" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_170">
                                <Form.Item
                                  label="No. of Goblet"
                                  name="no_of_goblet"
                                >
                                  <Input
                                    placeholder="Enter No."
                                    name="no_of_goblet"
                                    value={embryologyDetails?.no_of_goblet}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        no_of_goblet: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_170">
                                <Form.Item label="Tank No." name="tank_no">
                                  <Input
                                    placeholder="Enter No."
                                    name="tank_no"
                                    value={embryologyDetails?.tank_no}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        tank_no: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_170">
                                <Form.Item
                                  label="No. of straws"
                                  name="no_of_straws"
                                >
                                  <Input
                                    placeholder="Enter No."
                                    name="no_of_straws"
                                    value={embryologyDetails?.no_of_straws}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        no_of_straws: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_170">
                                <Form.Item
                                  label="Cannister No."
                                  name="cannister_no"
                                >
                                  <Input
                                    placeholder="Enter No."
                                    name="cannister_no"
                                    value={embryologyDetails?.cannister_no}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        cannister_no: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                          </div>
                        </td>
                        <td colSpan="5" rowSpan={2}>
                          <div className="warming_detail_wrap">
                            <ul className="grid_wrapper flex-nowrap">
                              <li className="w_200">
                                <Form.Item
                                  label="Thawing media"
                                  name="thawing_media"
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
                                    name="thawing_media"
                                    value={embryologyDetails?.thawing_media}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        thawing_media: value,
                                      });
                                    }}
                                    options={[
                                      { value: "Cryotech", label: "Cryotech" },
                                      { value: "Kitazato", label: "Kitazato" },
                                      { value: "Origio", label: "Origio" },
                                      { value: "Other", label: "Other" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_200">
                                <Form.Item
                                  label="Batch no."
                                  name="warming_batch_no"
                                >
                                  <Input
                                    placeholder="Enter Batch no."
                                    name="warming_batch_no"
                                    value={embryologyDetails?.warming_batch_no}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        warming_batch_no: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_190">
                                <Form.Item
                                  label="Expiry Date"
                                  name="warming_expiry_date"
                                >
                                  <DatePicker
                                    placeholder="9/11/1997"
                                    name="warming_expiry_date"
                                    value={
                                      embryologyDetails?.warming_expiry_date
                                        ? dayjs(
                                          embryologyDetails?.warming_expiry_date,
                                          "DD/MM/YYYY"
                                        )
                                        : null
                                    }
                                    format={{
                                      format: "DD-MM-YYYY",
                                      type: "mask",
                                    }}
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        warming_expiry_date: moment(
                                          new Date(e)
                                        ).format("YYYY/MM/DD"),
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                            <ul className="grid_wrapper flex-nowrap">
                              <li className="w_220">
                                <Form.Item
                                  label="Distance from fundus"
                                  name="distance_from_fundus"
                                >
                                  <Input
                                    placeholder="Enter fundus"
                                    name="distance_from_fundus"
                                    value={
                                      embryologyDetails?.distance_from_fundus
                                    }
                                    onChange={(e) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        distance_from_fundus: e.target.value,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_220">
                                <Form.Item
                                  label="Transfer done by"
                                  name="transfer_done_by"
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
                                    name="transfer_done_by"
                                    value={embryologyDetails?.transfer_done_by}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        transfer_done_by: value,
                                      });
                                    }}
                                    options={doctorList}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_220">
                                <Form.Item
                                  label="Catheter"
                                  name="catheter"
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
                                    name="catheter"
                                    value={embryologyDetails?.catheter}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        catheter: value,
                                      });
                                    }}
                                    options={[
                                      { value: "Sydney", label: "Sydney" },
                                      { value: "Cook", label: "Cook" },
                                      { value: "Other", label: "Other" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                            <ul className="grid_wrapper flex-nowrap">
                              <li className="w_220">
                                <Form.Item
                                  label="Embryo loading by"
                                  name="embryo_loading_by"
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
                                    name="embryo_loading_by"
                                    value={embryologyDetails?.embryo_loading_by}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        embryo_loading_by: value,
                                      });
                                    }}
                                    options={doctorList}
                                  />
                                </Form.Item>
                              </li>
                              <li className="w_220">
                                <Form.Item
                                  label="Transfer Media"
                                  name="transfer_media"
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
                                    name="transfer_media"
                                    value={embryologyDetails?.transfer_media}
                                    onChange={(value) => {
                                      setEmbryologyDetails({
                                        ...embryologyDetails,
                                        transfer_media: value,
                                      });
                                    }}
                                    options={[
                                      { value: "Sage", label: "Sage" },
                                      { value: "Vitromed", label: "Vitromed" },
                                      {
                                        value: "Vitrolife",
                                        label: "Vitrolife",
                                      },
                                      { value: "Cook’s", label: "Cook’s" },
                                      { value: "Other", label: "Other" },
                                    ]}
                                  />
                                </Form.Item>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3}>
                          <h4>Day 0</h4>
                          <li className="w_100">
                            <Form.Item label="Date" name="day_0_date">
                              <DatePicker
                                placeholder="DD/MM/YYYY"
                                name="day_0_date"
                                disabled
                                value={
                                  embryologyDetails?.day_0_date
                                    ? dayjs(
                                      embryologyDetails?.day_0_date,
                                      "DD/MM/YYYY"
                                    )
                                    : null
                                }
                                format={{
                                  format: "DD-MM-YYYY",
                                  type: "mask",
                                }}
                                onChange={(e) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_0_date: moment(new Date(e)).format(
                                      "YYYY/MM/DD"
                                    ),
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                          <li className="w_100">
                            <Form.Item label="Time" name="day_0_time">
                              <TimePicker
                                format="h:mm a"
                                name="day_0_time"
                                value={embryologyDetails?.day_0_time}
                                onChange={(value) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_0_time: value
                                      ? dayjs(value).format("HH:mm:ss")
                                      : null,
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                        </td>
                        <td>
                          <h4>Day 1</h4>
                          <li className="w_100">
                            <Form.Item label="Date" name="day_1_date">
                              <DatePicker
                                placeholder="9/11/1997"
                                name="day_1_date"
                                disabled
                                value={
                                  embryologyDetails?.day_1_date
                                    ? dayjs(
                                      embryologyDetails?.day_1_date,
                                      "DD/MM/YYYY"
                                    )
                                    : null
                                }
                                format={{
                                  format: "DD-MM-YYYY",
                                  type: "mask",
                                }}
                                onChange={(e) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_1_date: moment(new Date(e)).format(
                                      "YYYY/MM/DD"
                                    ),
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                          <li className="w_100">
                            <Form.Item
                              label="Hrs. post ICSI"
                              name="day_1_hrs_post_icsi_"
                            >
                              <Input
                                placeholder="Enter ICSI"
                                name="day_1_hrs_post_icsi_"
                                value={embryologyDetails?.day_1_hrs_post_icsi_}
                                onChange={(e) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_1_hrs_post_icsi_: e.target.value,
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                        </td>
                        <td colSpan={2}>
                          <h4>Day 3</h4>
                          <li className="w_100">
                            <Form.Item label="Date" name="day_3_date">
                              <DatePicker
                                placeholder="9/11/1997"
                                name="day_3_date"
                                disabled
                                value={
                                  embryologyDetails?.day_3_date
                                    ? dayjs(
                                      embryologyDetails?.day_3_date,
                                      "DD/MM/YYYY"
                                    )
                                    : null
                                }
                                format={{
                                  format: "DD-MM-YYYY",
                                  type: "mask",
                                }}
                                onChange={(e) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_3_date: moment(new Date(e)).format(
                                      "YYYY/MM/DD"
                                    ),
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                          <li className="w_100">
                            <Form.Item label="Time" name="day_3_time">
                              <TimePicker
                                format="h:mm a"
                                name="day_3_time"
                                value={embryologyDetails?.day_3_time}
                                onChange={(value) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_3_time: value
                                      ? dayjs(value).format("HH:mm:ss")
                                      : null,
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                        </td>
                        <td colSpan={3}>
                          <h4>Day 5/6/7</h4>
                          <li className="w_100">
                            <Form.Item label="Date" name="day_5_date">
                              <DatePicker
                                placeholder="9/11/1997"
                                name="day_5_date"
                                value={
                                  embryologyDetails?.day_5_date
                                    ? dayjs(
                                      embryologyDetails?.day_5_date,
                                      "DD/MM/YYYY"
                                    )
                                    : null
                                }
                                format={{
                                  format: "DD-MM-YYYY",
                                  type: "mask",
                                }}
                                onChange={(e) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_5_date: moment(new Date(e)).format(
                                      "YYYY/MM/DD"
                                    ),
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                          <li className="w_100">
                            <Form.Item label="Date" name="day_6_date">
                              <DatePicker
                                placeholder="9/11/1997"
                                name="day_6_date"
                                value={
                                  embryologyDetails?.day_6_date
                                    ? dayjs(
                                      embryologyDetails?.day_6_date,
                                      "DD/MM/YYYY"
                                    )
                                    : null
                                }
                                format={{
                                  format: "DD-MM-YYYY",
                                  type: "mask",
                                }}
                                onChange={(e) => {
                                  setEmbryologyDetails({
                                    ...embryologyDetails,
                                    day_6_date: moment(new Date(e)).format(
                                      "YYYY/MM/DD"
                                    ),
                                  });
                                }}
                              />
                            </Form.Item>
                          </li>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={21}>
                          <div className="d-flex align-items-center filter_row_wrapper">
                            <h5 className="m-0">
                              Total
                              {/* M1 : {countOfMI} , M2 : {countOfMII} */}
                            </h5>
                            <li className="w_180">
                              <Form.Item label="No of Oocytes" name="no_of_oocytes" className="mb-0">
                                <Input
                                  placeholder="No of Oocytes"
                                  name="no_of_oocytes"
                                  value={embryologyDetails?.no_of_oocytes}
                                  onChange={(e) => {
                                    setEmbryologyDetails({
                                      ...embryologyDetails,
                                      no_of_oocytes: e.target.value,
                                    });
                                  }}
                                />
                              </Form.Item>
                            </li>
                            <li className="w_180">
                              <Form.Item label="GV" name="gv" className="mb-0">
                                <Input
                                  placeholder="GV"
                                  name="gv"
                                  value={embryologyDetails?.gv}
                                  disabled
                                />
                              </Form.Item>
                            </li>
                            <li className="w_180">
                              <Form.Item label="M2" name="total_m2"
                                rules={[
                                  { validator: validateTotalM2 },
                                ]}
                                className="mb-0">
                                <Input
                                  placeholder="M2"
                                  name="total_m2"
                                  value={embryologyDetails?.m2}
                                  onBlur={(e) => {
                                    handleValueChange("total_m2", e.target.value);
                                  }}
                                // onChange={(e) => {
                                //   handleValueChange("m2", e.target.value);
                                // }}
                                />
                              </Form.Item>
                            </li>
                            <li className="w_180">
                              <Form.Item label="M1" name="total_m1"
                                rules={[
                                  { validator: validateTotalM1 },
                                ]}
                                // rules={Object.keys(selectedPatient).length > 0 && [
                                //   {
                                //     // type: 'number',
                                //     min: countOfMI, // minimum value allowed
                                //     // max: , // maximum value allowed


                                //     message: 'Value must be between 0 and 100', // custom error message
                                //   },
                                // ]}
                                className="mb-0">
                                <Input
                                  placeholder="M1"
                                  name="total_m1"
                                  value={embryologyDetails?.total_m1}
                                  onBlur={(e) => {
                                    handleValueChange("total_m1", e.target.value);
                                  }}
                                // onChange={(e) => {
                                //   handleValueChange("m1", e.target.value);
                                // }}
                                />
                              </Form.Item>
                            </li>
                            <li className="w_180">
                              <Form.Item label="Cleaved" name="cleaved" className="mb-0">
                                <Input
                                  placeholder="Cleaved"
                                  name="cleaved"
                                  disabled
                                  value={embryologyDetails?.cleaved}
                                />
                              </Form.Item>
                            </li>
                            <li className="w_180">
                              <Form.Item label="Fert" name="fert" className="mb-0">
                                <Input
                                  placeholder="Fert"
                                  name="fert"
                                  disabled
                                  value={embryologyDetails?.fert}
                                />
                              </Form.Item>
                            </li>
                            <li className="w_180">
                              <Form.Item label="Degenerated" name="degenerated" className="mb-0">
                                <Input
                                  placeholder="Degenerated"
                                  name="degenerated"
                                  disabled
                                  value={embryologyDetails?.degenerated}
                                />
                              </Form.Item>
                            </li>
                            <li className="w_180">
                              <Form.Item label="Unfert" name="unfert" className="mb-0">
                                <Input
                                  placeholder="Unfert"
                                  name="unfert"
                                  value={embryologyDetails?.unfert}
                                  disabled
                                />
                              </Form.Item>
                            </li>
                            <li className="w_180">
                              <Form.Item label="Abnormal PN" name="abnormal_pn" className="mb-0">
                                <Input
                                  placeholder="Abnormal PN"
                                  name="abnormal_pn"
                                  value={embryologyDetails?.abnormal_pn}
                                  disabled

                                />
                              </Form.Item>
                            </li>
                            <li className="w_180">
                              <Form.Item label="Kept for Blastocyst" name="kept_for_blastocyst" className="mb-0">
                                <Input
                                  placeholder="Kept for Blastocyst"
                                  name="kept_for_blastocyst"
                                  value={embryologyDetails?.kept_for_blastocyst}
                                  disabled
                                />
                              </Form.Item>
                            </li>

                            {/* <Button
                              className="btn_primary ms-2 px-2 py-1"
                              onClick={handelEmbryoData}
                            >
                              Add
                            </Button> */}
                          </div>
                        </td>
                        {/* <td colSpan={3}>
                          <h4>Score</h4>
                        </td>
                        <td colSpan={3}>
                          <h4>Score</h4>
                        </td>
                        <td colSpan={10}></td> */}
                      </tr>
                      <tr>
                        <td className="w_90"></td>
                        <td className="w_140"></td>
                        {/* <td className="w_250">> */}
                        <td className="w_170"></td>
                        <td className="w_120"></td>
                        <td className="w_170"></td>
                        {/* <td className="w_180">> */}
                        <td className="w_150"></td>
                        {/* <td className="w_90">> */}
                        {/* <td className="w_90">> */}
                        {/* <td className="w_150">> */}
                        {/* <td className="w_90">> */}
                        {/* <td className="w_90">> */}
                        <td className="w_170"></td>
                        <td className="w_170"></td>
                        <td className="w_170"></td>
                        <td className="w_170"></td>
                        <td className="w_170"></td>
                        <td className="w_170"></td>
                        <td className="w_120"></td>
                        <td className="w_120"></td>
                        <td className="w_120"></td>
                        {/* <th className="w_170">Date of Thawing</th>
                        <th className="w_170">Thawing done by</th>
                        <th className="w_170">Date of Transfer</th>
                        <th className="w_170">Action</th> */}
                      </tr>
                      <tr>
                        <td colSpan={16}>
                          <div className="inner_table_wrapper">
                            <table>
                              <thead>
                                <tr>
                                  <th className="w_90">Egg</th>
                                  <th className="w_140">Stage</th>
                                  <th className="w_250">Quality of Egg</th>
                                  <th className="w_170">Fert Check</th>
                                  <th className="w_120">Grade</th>
                                  <th className="w_170">Incubator</th>
                                  {/* <th className="w_180">Quality of Embryo</th> */}
                                  <th className="w_150">Stage of dev</th>
                                  {/* <th className="w_90">ICM</th> */}
                                  {/* <th className="w_90">TE</th> */}
                                  {/* <th className="w_150">Stage of dev.</th> */}
                                  {/* <th className="w_90">ICM</th> */}
                                  {/* <th className="w_90">TE</th> */}
                                  <th className="w_170">Date of freezing</th>
                                  <th className="w_90">Score</th>
                                  <th className="w_90">Notes</th>
                                  <th className="w_90">Grade</th>
                                  <th className="w_170">Vitrification ID</th>
                                  <th className="w_170">Stage</th>
                                  <th className="w_170">Color of Device</th>
                                  <th className="w_170">Color of Goblet</th>
                                  <th className="w_150">Status</th>
                                  <th className="w_150">Vitrified by</th>
                                  {/* <th className="w_170">Date of Thawing</th>
                                  <th className="w_170">Thawing done by</th>
                                  <th className="w_170">Date of Transfer</th>
                                  <th className="w_170">Action</th> */}
                                  <th className="w_170">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {embryoTableList?.map((item, index) => {
                                  return (
                                    <tr key={index} className={item.fert_check === "Abnormal PN" ? "red_row_wrapper" : ""} >
                                      <td>
                                        <div className="w_90">
                                          <Form.Item
                                            name={`egg${index}`}
                                            className="mb-1"
                                          >
                                            <Input
                                              placeholder="Egg"
                                              value={item?.package_amount}
                                              onChange={(e) => {
                                                onChangeEmbryoData(
                                                  index,
                                                  "egg",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="w_140">
                                          <Form.Item
                                            name={`stage_1${index}`}
                                            className="custom_select mb-1"
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
                                              value={item?.stage_1}
                                              onChange={(value) => {
                                                onChangeEmbryoData(
                                                  index,
                                                  "stage_1",
                                                  value
                                                );
                                              }}
                                              options={[
                                                { value: "GV", label: "GV" },
                                                { value: "M1", label: "M1" },
                                                { value: "M2", label: "M2" },
                                              ]}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="w_250">
                                          <Form.Item
                                            name={`quality_of_egg${index}`}
                                            className="custom_select mb-1"
                                          >
                                            <Select
                                              placeholder="Select"
                                              value={item?.quality_of_egg}
                                              onChange={(value) => {
                                                onChangeEmbryoData(
                                                  index,
                                                  "quality_of_egg",
                                                  value
                                                );
                                              }}
                                              options={[
                                                { value: "Normal", label: "Normal" },
                                                { value: "SER disc", label: "SER disc" },
                                                { value: "Vacuole", label: "Vacuole" },
                                                {
                                                  value: "Abnormal PVS",
                                                  label: "Abnormal PVS",
                                                },
                                                {
                                                  value: "Granulation in PVS",
                                                  label: "Granulation in PVS",
                                                },
                                                {
                                                  value: "Thick zona",
                                                  label: "Thick zona",
                                                },
                                                {
                                                  value: "Thin zona",
                                                  label: "Thin zona",
                                                },
                                                {
                                                  value: "Hyper mature",
                                                  label: "Hyper mature",
                                                },
                                                {
                                                  value: "Organelle cluster",
                                                  label: "Organelle cluster",
                                                },
                                                {
                                                  value: "Granulation in cytoplasm",
                                                  label: "Granulation in cytoplasm",
                                                },
                                                {
                                                  value: "Poor oocyte",
                                                  label: "Poor oocyte",
                                                },
                                                {
                                                  value: "Dark oocyte",
                                                  label: "Dark oocyte",
                                                },
                                                { value: "Others", label: "Others" },
                                              ]}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="w_170">
                                          <Form.Item
                                            name={`fert_check${index}`}
                                            className="custom_select mb-1"
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
                                              value={item?.fert_check}
                                              onChange={(value) => {
                                                onChangeEmbryoDataOld(
                                                  index,
                                                  "fert_check",
                                                  value
                                                );
                                                countValues()
                                              }}
                                              options={[
                                                { value: "2PN", label: "2PN" },
                                                {
                                                  value: "Abnormal PN",
                                                  label: "Abnormal PN",
                                                },
                                                { value: "2 Cell", label: "2 Cell" },
                                                {
                                                  value: "Degenerated",
                                                  label: "Degenerated",
                                                },
                                                { value: "Unfert", label: "Unfert" },
                                              ]}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="w_120">
                                          <Form.Item
                                            name={`grade_1${index}`}
                                            className="custom_select mb-1"
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
                                              value={item?.grade_1}
                                              onChange={(value) => {
                                                onChangeEmbryoData(index, "grade_1", value);
                                              }}
                                              options={[
                                                { value: "I", label: "I" },
                                                { value: "II", label: "II" },
                                                { value: "III", label: "III" },
                                              ]}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="w_170">
                                          <Form.Item
                                            name={`incubator${index}`}
                                            className="custom_select mb-1"
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
                                              value={item?.incubator}
                                              onChange={(value) => {
                                                onChangeEmbryoData(
                                                  index,
                                                  "incubator",
                                                  value
                                                );
                                              }}
                                              options={incubatorOptions}
                                            // options={[
                                            //   { value: "Tri-gas", label: "Tri-gas" },
                                            //   { value: "Co2", label: "Co2" },
                                            //   {
                                            //     value: "Timelapse",
                                            //     label: "Timelapse",
                                            //   },
                                            // ]}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                      {/* <td>
                              <div className="w_180">
                                <Form.Item
                                  name={`quality_of_embryo${index}`}
                                  className="custom_select mb-1"
                                >
                                  <Select
                                    placeholder="Select"
                                    value={item?.quality_of_embryo}
                                    onChange={value => {
                                      onChangeEmbryoData(
                                        index,
                                        'quality_of_embryo',
                                        value,
                                      );
                                    }}
                                    options={stage2Options}
                                    // options={[
                                    //   { value: "Good", label: "Good" },
                                    //   { value: "Fair", label: "Fair" },
                                    //   { value: "Poor", label: "Poor" },
                                    // ]}
                                  />
                                </Form.Item>
                              </div>
                            </td> */}
                                      <td>
                                        <div className="w_150">
                                          <Form.Item
                                            name={`stage_of_dev_1${index}`}
                                            className="custom_select mb-1"
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
                                              value={item?.stage_of_dev_1}
                                              onChange={(value) => {
                                                onChangeEmbryoData(
                                                  index,
                                                  "stage_of_dev_1",
                                                  value
                                                );
                                              }}
                                              options={stageOfDevOptions}
                                            // options={[
                                            //   { value: "Good", label: "Good" },
                                            //   { value: "Fair", label: "Fair" },
                                            //   { value: "Poor", label: "Poor" },
                                            // ]}
                                            />
                                            {/* <Input
                                    placeholder="Stage of dev."
                                    value={item?.stage_of_dev_1}
                                    onChange={(e) => {
                                      onChangeEmbryoData(
                                        index,
                                        "stage_of_dev_1",
                                        e.target.value
                                      );
                                    }}
                                  /> */}
                                          </Form.Item>
                                        </div>
                                      </td>
                                      {/* <td>
                              <div className="w_90">
                                <Form.Item
                                  name={`icm_1${index}`}
                                  className="mb-1"
                                >
                                  <Input
                                    placeholder="ICM"
                                    value={item?.icm_1}
                                    onChange={(e) => {
                                      onChangeEmbryoData(
                                        index,
                                        "icm_1",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td> */}
                                      {/* <td>
                              <div className="w_90">
                                <Form.Item
                                  name={`te_1${index}`}
                                  className="mb-1"
                                >
                                  <Input
                                    placeholder="TE"
                                    value={item?.te_1}
                                    onChange={(e) => {
                                      onChangeEmbryoData(
                                        index,
                                        "te_1",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td> */}
                                      {/* <td>
                              <div className="w_150">
                                <Form.Item
                                  name={`stage_of_dev_2${index}`}
                                  className="mb-1"
                                >
                                  <Input
                                    placeholder="Stage of dev."
                                    value={item?.stage_of_dev_2}
                                    onChange={(e) => {
                                      onChangeEmbryoData(
                                        index,
                                        "stage_of_dev_2",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td> */}
                                      {/* <td>
                              <div className="w_90">
                                <Form.Item
                                  name={`icm_2${index}`}
                                  className="mb-1"
                                >
                                  <Input
                                    placeholder="ICM"
                                    value={item?.icm_2}
                                    onChange={e => {
                                      onChangeEmbryoData(
                                        index,
                                        'icm_2',
                                        e.target.value,
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="W_90">
                                <Form.Item
                                  name={`te_2${index}`}
                                  className="mb-1"
                                >
                                  <Input
                                    placeholder="TE"
                                    value={item?.te_2}
                                    onChange={e => {
                                      onChangeEmbryoData(
                                        index,
                                        'te_2',
                                        e.target.value,
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td> */}
                                      <td>
                                        <div className="w_170">
                                          <Form.Item
                                            name={`date_of_freezing${index}`}
                                            className="mb-1"
                                          >
                                            <DatePicker
                                              placeholder="10/08/2023"
                                              value={dayjs(
                                                item?.date_of_freezing,
                                                "YYYY-MM-DD"
                                              )}
                                              disabled={item?.stage_of_dev_1 === "Arrested" ? true : false}
                                              format={{
                                                format: "DD-MM-YYYY",
                                                type: "mask",
                                              }}
                                              onChange={(value) => {
                                                onChangeEmbryoData(
                                                  index,
                                                  "date_of_freezing",
                                                  value
                                                    ? moment(new Date(value)).format(
                                                      "YYYY-MM-DD"
                                                    )
                                                    : null
                                                );
                                                // dateOfFreezingHandleChange(moment(new Date(value)).format(
                                                //   "YYYY-MM-DD"
                                                // ))
                                              }}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="w_90">
                                          <Form.Item
                                            name={`score${index}`}
                                            className="mb-1"
                                            rules={[{ validator: validateScore }]}
                                          >
                                            <Input
                                              disabled={item?.stage_of_dev_1 === "Arrested" ? true : false}
                                              placeholder="Score"
                                              value={item?.score}
                                              onChange={(e) => {
                                                onChangeEmbryoData(
                                                  index,
                                                  "score",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="w_90">
                                          <Form.Item
                                            name={`note${index}`}
                                            className="mb-1"
                                          >
                                            <Input
                                              placeholder="note"
                                              value={item?.note}
                                              disabled={item?.stage_of_dev_1 === "Arrested" ? true : false}
                                              onChange={(e) => {
                                                onChangeEmbryoData(
                                                  index,
                                                  "note",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="w_90">
                                          <Form.Item
                                            name={`grade_2${index}`}
                                            className="mb-1"
                                          >
                                            <Input
                                              placeholder="Grade"
                                              value={item?.grade_2}
                                              disabled
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="w_150">
                                          <Form.Item
                                            name={`vitrification_id${index}`}
                                            className="mb-1"
                                          >
                                            <Input
                                              placeholder="Vitrification ID"
                                              value={item?.vitrification_id}
                                              disabled={item?.stage_of_dev_1 === "Arrested" ? true : false}
                                              onChange={(e) => {
                                                onChangeEmbryoData(
                                                  index,
                                                  "vitrification_id",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>

                                      <td>
                                        <div className="w_170">
                                          <Form.Item
                                            name={`stage_2${index}`}
                                            className="custom_select mb-1"
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
                                              value={item?.stage_2}
                                              disabled={item?.stage_of_dev_1 === "Arrested" ? true : false}
                                              onChange={(value) => {
                                                onChangeEmbryoData(
                                                  index,
                                                  "stage_2",
                                                  value
                                                );
                                              }}
                                              options={stageOptions}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="w_170">
                                          <Form.Item
                                            name={`device_color${index}`}
                                            className="custom_select mb-1"
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
                                              disabled={item?.stage_of_dev_1 === "Arrested" ? true : false}
                                              className="color_select"
                                              value={item?.device_color}
                                              onChange={(value) => {
                                                onChangeEmbryoData(
                                                  index,
                                                  "device_color",
                                                  value
                                                );
                                              }}
                                              options={strawColorOptions}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="w_170">
                                          <Form.Item
                                            name={`goblet_color${index}`}
                                            className="custom_select mb-1"
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
                                              disabled={item?.stage_of_dev_1 === "Arrested" ? true : false}
                                              placeholder="Select"
                                              className="color_select"
                                              value={item?.goblet_color}
                                              onChange={(value) => {
                                                onChangeEmbryoData(
                                                  index,
                                                  "goblet_color",
                                                  value
                                                );
                                              }}
                                              options={gobletColorOptions}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="w_170">
                                          <Form.Item
                                            name={`status${index}`}
                                            className="custom_select mb-1"
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
                                              disabled={item?.stage_of_dev_1 === "Arrested" ? true : false}
                                              value={item?.status}
                                              onChange={(value) => {
                                                onChangeEmbryoData(
                                                  index,
                                                  "status",
                                                  value
                                                );
                                              }}
                                              options={statusOptions}
                                            />
                                          </Form.Item>
                                        </div>
                                      </td>

                                      <td>
                                        <div className="w_170">
                                          <Form.Item
                                            name={`vitrified_by${index}`}
                                            className="custom_select mb-1"
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
                                              disabled={item?.stage_of_dev_1 === "Arrested" ? true : false}
                                              value={item?.vitrified_by}
                                              onChange={(value) => {
                                                onChangeEmbryoData(
                                                  index,
                                                  "vitrified_by",
                                                  value
                                                );
                                              }}
                                              options={vitrificationIdOptions}
                                            />
                                            {/* <Input
                                    placeholder="Vitrification ID"
                                    value={item?.vitrification_id}
                                    onChange={(e) => {
                                      onChangeEmbryoData(
                                        index,
                                        "vitrification_id",
                                        e.target.value
                                      );
                                    }}
                                  /> */}
                                          </Form.Item>
                                        </div>
                                      </td>
                                      {/* <td>
                              <div className="w_170">
                                <Form.Item
                                  name={`date_of_thawing${index}`}
                                  className="mb-1"
                                >
                                  <DatePicker
                                    placeholder="10/08/2023"
                                    value={dayjs(
                                      item?.date_of_thawing,
                                      'YYYY-MM-DD',
                                    )}
                                    format={['DD/MM/YYYY']}
                                    onChange={value => {
                                      onChangeEmbryoData(
                                        index,
                                        'date_of_thawing',
                                        value
                                          ? moment(new Date(value)).format(
                                              'YYYY-MM-DD',
                                            )
                                          : null,
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td>
                            <td>
                              <div className="w_170">
                                <Form.Item
                                  name={`thawing_done_by${index}`}
                                  className="custom_select mb-1"
                                >
                                  <Select
                                    placeholder="Select"
                                    value={item?.thawing_done_by}
                                    onChange={value => {
                                      onChangeEmbryoData(
                                        index,
                                        'thawing_done_by',
                                        value,
                                      );
                                    }}
                                    options={doctorList}
                                    // options={[
                                    //   { value: "OOCYTE", label: "OOCYTE" },
                                    //   { value: "D3", label: "D3" },
                                    //   { value: "D5", label: "D5" },
                                    //   { value: "D6", label: "D6" },
                                    //   { value: "D7", label: "D7" },
                                    // ]}
                                  />
                                </Form.Item>
                              </div>
                            </td> */}

                                      {/* <td>
                              <div className="w_170">
                                <Form.Item
                                  name={`date_of_transfer${index}`}
                                  className="mb-1"
                                >
                                  <DatePicker
                                    placeholder="10/08/2023"
                                    value={dayjs(
                                      item?.date_of_transfer,
                                      'YYYY-MM-DD',
                                    )}
                                    format={['DD/MM/YYYY']}
                                    onChange={value => {
                                      onChangeEmbryoData(
                                        index,
                                        'date_of_transfer',
                                        value
                                          ? moment(new Date(value)).format(
                                              'YYYY-MM-DD',
                                            )
                                          : null,
                                      );
                                    }}
                                  />
                                </Form.Item>
                              </div>
                            </td>*/}
                                      {!item._id && (<td style={{ verticalAlign: 'middle' }}>
                                        <div className="w_100 text-center">
                                          <Popconfirm
                                            title="Delete this data"
                                            description="Are you sure to delete this data?"
                                            onConfirm={() => {
                                              onDeleteEmbryoData(index);
                                            }}
                                            // onCancel={cancel}
                                            okText="Yes"
                                            cancelText="No"
                                          >
                                            <Button
                                              className="btn_transparent"
                                            // onClick={() => {
                                            //   onDeleteEmbryoData(index);
                                            // }}
                                            >
                                              <img src={TranshIcon} alt="TranshIcon" />
                                            </Button>
                                          </Popconfirm>
                                        </div>
                                      </td>)}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Notes</h3>
              <div>
                <Form.Item name="notes">
                  <TextArea
                    rows={4}
                    name="notes"
                    value={embryologyDetails?.notes}
                    onChange={(e) => {
                      setEmbryologyDetails({
                        ...embryologyDetails,
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
            {Object.keys(embryologyData)?.length > 0
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
            <Dropdown disabled={printOption.length === 0 ? true : false} overlay={menuProps} className='custom_select custom_dropdown'>
              <Button className='btn_primary mx-3'>
                <Space>
                  Print
                </Space>
              </Button>
            </Dropdown>


            {/* <Button
              className="btn_primary mx-3"
              disabled={Object.entries(embryologyData).length === 0}
              onClick={() => {
                Object.entries(embryologyData).length > 0 &&
                  printEmbryoTransferData();
              }}
            >
              Print
            </Button> */}
            {/* <Button
              className="btn_primary mx-3"
              disabled={Object.entries(embryologyData).length === 0}
              onClick={() => {
                Object.entries(embryologyData).length > 0 &&
                  printEmbryologyFlowSheetData();
              }}
            >
              Print 2
            </Button> */}
            {/* <Button
              className="btn_primary mx-3"
              disabled={Object.entries(embryologyData).length === 0}
              onClick={() => {
                Object.entries(embryologyData).length > 0 &&
                  printVitrificationReportData();
              }}
            >
              Print 3
            </Button> */}
          </div>
        </Form>
      </div >
    </div >
  );
}
