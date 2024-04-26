import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Form, Input, Popconfirm, Select, Spin } from "antd";
import { Table } from "antd";
import { Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  PGProgressOption,
  deliveryMethodOptions,
  indicationOption,
  noOfFetalSacOption,
} from "utils/FieldValues";
import { Link, useLocation } from "react-router-dom";
import EditIcon from "../../Img/edit.svg";
import CancelIcon from "../../Img/cancel.svg";
import TranshIcon from "../../Img/trash.svg";
import { getAuthToken } from "Helper/AuthTokenHelper";
import moment from "moment";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  getAttendingDrList,
  getIvfId,
  setIvfIdList,
  setSelectedPatient,
} from "redux/reducers/common.slice";
import {
  createCycleOutcome,
  editCycleOutcome,
  getCycleOutcome,
  setCycleOutComeData,
  setCycleOutComeUpdate,
} from "redux/reducers/CycleOutCome/cycleOutCome.slice";
import {
  clearData,
  getGlobalSearch,
} from "redux/reducers/SearchPanel/globalSearch.slice";

export default function CycleOutCome() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();
  const UserData = getAuthToken();
  const { selectedPatient, ivfIdList, isIvfListLoading, attendingDrList } =
    useSelector(({ common }) => common);
  const { moduleList, userType, selectedLocation } = useSelector(
    ({ role }) => role
  );
  const { cycleOutComeData, cycleOutComeLoading, cycleOutComeUpdate } =
    useSelector(({ cycleOutcome }) => cycleOutcome);
  // const [patientDetails, setPatientDetails] = useState({
  //   patient_id: "",
  //   patient_full_name: "",
  //   partner_full_name: "",
  // });

  const [ivfIdOption, setIvfIdOption] = useState([]);
  const [ivfIdDetails, setIvfIdDetails] = useState({
    ivf_Id: "",
    id_name: "",
    weeks: "",
    days: "",
    current_preg_week_days: "",
    finalOutComeModuleId: "",
    lmp: "",
  });
  const [cycleOutCome, setCycleOutCome] = useState({
    ivf_flow_id: null,
    bhcg_1: "",
    bhcg_2: "",
    clinical_preg_determine_on: null,
    clinical_preg_outcome: null,
    calculated_birth_date: null,
    no_of_fatal_sac: null,
    cervical_encerclage: null,
    pg_week: "",
    method: null,
    right_tube: null,
    left_tube: null,
    extrauterine_no: null,
    ovarian: null,
    cervical: null,
    done_by: null,
    no_of_intrauterine: "",
    live: false,
    blighted: false,
    management_date: null,
    operating_gynec: "",
    laparoscopy: false,
    paratomy: false,
    medical: false,
    note: "",
    _id: "",
  });

  const [doctorList, setDoctorList] = useState([{}]);
  const [iscycleOutComeTableObj, setIsCycleOutComeTableObj] = useState({});
  const [cycleOutComeTableData, setCycleOutComeTableData] = useState([]);
  const [cycleOutComeTable, setCycleOutComeTable] = useState({
    no_of_embryo: null,
    date: null,
    pg_progress: null,
    indication: null,
    week: "",
    notes: "",
  });
  const selectedModule = useMemo(() => {
    return (
      moduleList?.find((item) => item?.module_name === location?.pathname) || {}
    );
  }, [moduleList, location?.pathname]);
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
        }))
      );
    }
  }, [dispatch, attendingDrList]);

  const clearCycleOutCome = useCallback(() => {
    // setPatientDetails({
    //   patient_id: "",
    //   patient_full_name: "",
    //   partner_full_name: "",
    // });
    setCycleOutComeTable({
      no_of_embryo: null,
      date: null,
      pg_progress: null,
      indication: null,
      week: "",
      notes: "",
    });
    setCycleOutCome({
      ivf_flow_id: null,
      bhcg_1: "",
      bhcg_2: "",
      clinical_preg_determine_on: null,
      clinical_preg_outcome: null,
      calculated_birth_date: null,
      no_of_fatal_sac: null,
      cervical_encerclage: null,
      pg_week: "",
      method: null,
      right_tube: null,
      left_tube: null,
      extrauterine_no: null,
      ovarian: null,
      cervical: null,
      done_by: null,
      no_of_intrauterine: "",
      live: false,
      blighted: false,
      management_date: null,
      operating_gynec: "",
      laparoscopy: false,
      paratomy: false,
      medical: false,
      note: "",
    });
    form.resetFields();
    setIvfIdOption([]);
    setCycleOutComeTableData([]);
  }, [form]);

  // useEffect(() => {
  //   if (selectedPatient && Object.keys(selectedPatient)?.length > 0) {
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
  //     return () => {
  //       dispatch(setIvfIdList([]));
  //       setIvfIdOption([]);
  //       clearCycleOutCome();
  //       dispatch(setCycleOutComeData({}));
  //     };
  //   }
  // }, [form, selectedPatient]);

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
      dispatch(setIvfIdList([]));
      setIvfIdOption([]);
      clearCycleOutCome();
      dispatch(setCycleOutComeData({}));
    };
  }, [dispatch, selectedPatient, selectedModule, selectedLocation]);

  useEffect(() => {
    if (ivfIdList?.length > 0) {
      const ivfListId = ivfIdList?.map((item) => ({
        value: item._id,
        label: item.ivf_id,
        current_preg_week_days: item.current_preg_week_days,
        weeks: item.weeks,
        days: item.days,
        lmp: item?.last_menstrual_period
          ? moment(item?.last_menstrual_period).format("DD/MM/YYYY")
          : null,
      }));
      setIvfIdOption(ivfListId);
      setIvfIdDetails({
        ivf_Id: ivfListId[0]?.value || "",
        weeks: ivfListId[0]?.weeks || "",
        days: ivfListId[0]?.days || "",
        current_preg_week_days: ivfListId[0]?.current_preg_week_days || "",
        id_name: ivfListId[0]?.label,
        lmp: ivfListId[0]?.last_menstrual_period
          ? moment(ivfListId[0]?.last_menstrual_period).format("DD/MM/YYYY")
          : null,
        selectedModuleId: selectedModule,
      });
      setCycleOutCome((prevDetails) => ({
        ...prevDetails,
        ivf_flow_id: ivfListId[0]?.value,
      }));
      form.setFieldsValue({
        ivf_flow_id: ivfListId[0]?.value,
        current_preg_week_days: ivfListId[0]?.current_preg_week_days,
        weeks: ivfListId[0]?.weeks,
        lmp: ivfListId[0]?.last_menstrual_period
          ? dayjs(
            moment(ivfListId[0]?.last_menstrual_period).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
      });
    }
  }, [form, ivfIdList]);

  useEffect(() => {
    if (cycleOutCome?.ivf_flow_id && selectedPatient?._id) {
      dispatch(
        getCycleOutcome({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
          ivf_flow_id: cycleOutCome?.ivf_flow_id,
        })
      );
    }
  }, [cycleOutCome?.ivf_flow_id, dispatch]);

  useEffect(() => {
    if (cycleOutComeUpdate) {
      setIsCycleOutComeTableObj({});
      clearCycleOutComeTable();
      dispatch(
        getCycleOutcome({
          location_id: selectedLocation,
          patient_reg_id: selectedPatient?._id,
          module_id: selectedModule?._id,
          ivf_flow_id: cycleOutCome?.ivf_flow_id,
        })
      );
      dispatch(setCycleOutComeUpdate(false));
    }
  }, [cycleOutComeUpdate]);

  useEffect(() => {
    if (Object.keys(cycleOutComeData)?.length > 0) {
      const cycleOutComeDataList =
        cycleOutComeData.table_detail?.map((item) => {
          return {
            ...item,
            id: Math.random().toString().substring(2, 9),
            isDelete: UserData?.other === false ? true : false,
          };
        }) || [];
      setCycleOutCome({
        _id: cycleOutComeData?._id || "",
        ivf_flow_id: cycleOutComeData?.ivf_flow_id || "",
        bhcg_1: cycleOutComeData?.bhcg_1 || "--",
        bhcg_2: cycleOutComeData?.bhcg_2 || "--",

        clinical_preg_determine_on: cycleOutComeData.clinical_preg_determine_on
          ? moment(cycleOutComeData.clinical_preg_determine_on).format(
            "YYYY-MM-DD"
          )
          : null,
        clinical_preg_outcome: cycleOutComeData.clinical_preg_outcome
          ? cycleOutComeData.clinical_preg_outcome
          : null,
        calculated_birth_date: cycleOutComeData.calculated_birth_date
          ? moment(cycleOutComeData.calculated_birth_date).format("YYYY-MM-DD")
          : null,
        no_of_fatal_sac: cycleOutComeData?.no_of_fatal_sac || null,
        cervical_encerclage: cycleOutComeData.cervical_encerclage
          ? moment(cycleOutComeData.cervical_encerclage).format("YYYY-MM-DD")
          : null,
        pg_week: cycleOutComeData?.pg_week || "--",
        method: cycleOutComeData?.method || null,
        right_tube: cycleOutComeData?.right_tube || null,
        left_tube: cycleOutComeData?.left_tube || null,
        extrauterine_no: cycleOutComeData?.extrauterine_no || null,
        ovarian: cycleOutComeData?.ovarian || null,
        cervical: cycleOutComeData?.cervical || null,
        done_by: cycleOutComeData?.done_by || null,
        no_of_intrauterine: cycleOutComeData?.no_of_intrauterine || "--",
        live: cycleOutComeData?.live || false,
        blighted: cycleOutComeData?.blighted || false,
        management_date: cycleOutComeData.management_date
          ? moment(cycleOutComeData.management_date).format("YYYY-MM-DD")
          : null,
        operating_gynec: cycleOutComeData?.operating_gynec || "--",
        laparoscopy: cycleOutComeData?.laparoscopy || false,
        paratomy: cycleOutComeData?.paratomy || false,
        medical: cycleOutComeData?.medical || false,
        note: cycleOutComeData?.note || "--",
      });
      setCycleOutComeTableData(cycleOutComeDataList);
      form.setFieldsValue({
        ivf_flow_id: cycleOutComeData?.ivf_flow_id || "",
        bhcg_1: cycleOutComeData?.bhcg_1 || "--",
        bhcg_2: cycleOutComeData?.bhcg_2 || "--",
        clinical_preg_determine_on: cycleOutComeData?.clinical_preg_determine_on
          ? dayjs(
            moment(cycleOutComeData?.clinical_preg_determine_on).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : null,
        clinical_preg_outcome: cycleOutComeData.clinical_preg_outcome
          ? cycleOutComeData.clinical_preg_outcome
          : null,
        calculated_birth_date: cycleOutComeData?.calculated_birth_date
          ? dayjs(
            moment(cycleOutComeData?.calculated_birth_date).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : null,
        no_of_fatal_sac: cycleOutComeData?.no_of_fatal_sac || null,
        cervical_encerclage: cycleOutComeData?.cervical_encerclage
          ? dayjs(
            moment(cycleOutComeData?.cervical_encerclage).format(
              "DD/MM/YYYY"
            ),
            "DD/MM/YYYY"
          )
          : null,
        pg_week: cycleOutComeData?.pg_week || "--",
        method: cycleOutComeData?.method || null,
        right_tube: cycleOutComeData?.right_tube || null,
        left_tube: cycleOutComeData?.left_tube || null,
        extrauterine_no: cycleOutComeData?.extrauterine_no || null,
        ovarian: cycleOutComeData?.ovarian || null,
        cervical: cycleOutComeData?.cervical || null,
        done_by: cycleOutComeData?.done_by || null,
        no_of_intrauterine: cycleOutComeData?.no_of_intrauterine || "--",
        live: cycleOutComeData?.live || false,
        blighted: cycleOutComeData?.blighted || false,
        management_date: cycleOutComeData?.management_date
          ? dayjs(
            moment(cycleOutComeData?.management_date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          )
          : null,
        operating_gynec: cycleOutComeData?.operating_gynec || "--",
        laparoscopy: cycleOutComeData?.laparoscopy || false,
        paratomy: cycleOutComeData?.paratomy || false,
        medical: cycleOutComeData?.medical || false,
        note: cycleOutComeData?.note || "--",
      });
    }
  }, [form, cycleOutComeData]);

  const onFinish = (values) => {
    if (cycleOutCome?.ivf_flow_id) {
      let cycleOutComeTableSet =
        cycleOutComeTableData?.map((item) => {
          delete item.id;
          return item;
        }) || [];
      const obj = {
        ...cycleOutCome,
        table_detail: cycleOutComeTableSet,
      };
      if (Object.keys(cycleOutComeData)?.length > 0) {
        dispatch(
          editCycleOutcome({
            location_id: selectedLocation,
            _id: cycleOutComeData?._id,
            module_id: selectedModule?._id,
            payload: obj,
          })
        );
      } else {
        dispatch(
          createCycleOutcome({
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
    clearCycleOutComeTable();
    setIsCycleOutComeTableObj({});
  };
  const onFinishFailed = (errorInfo) => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const onDeleteTableData = useCallback(
    (record) => {
      let deleteData = [...cycleOutComeTableData] || [];
      deleteData = deleteData.filter((item) => item.id !== record.id);
      setCycleOutComeTableData(deleteData);
      toast.success("Delete Succesfully.");
    },
    [cycleOutComeTableData]
  );

  const handleIvfId = useCallback(
    (id) => {
      const findList = ivfIdOption?.find((item) => item.value === id);
      const cycleOutComeDataList =
        cycleOutComeData.table_detail?.map((item) => {
          return {
            ...item,
            id: Math.random().toString().substring(2, 9),
            isDelete: UserData?.other === false ? true : false,
          };
        }) || [];
      if (findList) {
        setIvfIdDetails({
          ivf_Id: findList?.value,
          current_preg_week_days: findList?.current_preg_week_days,
          weeks: findList?.weeks,
          days: findList?.days,
          id_name: findList?.label,
          selectedModuleId: selectedModule,
          lmp: findList?.lmp
            ? moment(findList?.lmp).format("DD/MM/YYYY")
            : null,
        });
        setCycleOutCome((prevDetails) => ({
          ...prevDetails,
          ivf_flow_id: findList?.value,
          bhcg_1: cycleOutComeData?.bhcg_1 || "--",
          bhcg_2: cycleOutComeData?.bhcg_2 || "--",
          clinical_preg_determine_on:
            cycleOutComeData.clinical_preg_determine_on
              ? moment(cycleOutComeData.clinical_preg_determine_on).format(
                "YYYY-MM-DD"
              )
              : null,
          clinical_preg_outcome: cycleOutComeData.clinical_preg_outcome
            ? cycleOutComeData.clinical_preg_outcome
            : null,
          calculated_birth_date: cycleOutComeData.calculated_birth_date
            ? moment(cycleOutComeData.calculated_birth_date).format(
              "YYYY-MM-DD"
            )
            : null,
          no_of_fatal_sac: cycleOutComeData?.no_of_fatal_sac || null,
          cervical_encerclage: cycleOutComeData.cervical_encerclage
            ? moment(cycleOutComeData.cervical_encerclage).format("YYYY-MM-DD")
            : null,
          pg_week: cycleOutComeData?.pg_week || "--",
          method: cycleOutComeData?.method || null,
          right_tube: cycleOutComeData?.right_tube || null,
          left_tube: cycleOutComeData?.left_tube || null,
          extrauterine_no: cycleOutComeData?.extrauterine_no || null,
          ovarian: cycleOutComeData?.ovarian || null,
          cervical: cycleOutComeData?.cervical || null,
          done_by: cycleOutComeData?.done_by || null,
          no_of_intrauterine: cycleOutComeData?.no_of_intrauterine || "--",
          live: cycleOutComeData?.live || false,
          blighted: cycleOutComeData?.blighted || false,
          management_date: cycleOutComeData.management_date
            ? moment(cycleOutComeData.management_date).format("YYYY-MM-DD")
            : null,
          operating_gynec: cycleOutComeData?.operating_gynec || "--",
          laparoscopy: cycleOutComeData?.laparoscopy || false,
          paratomy: cycleOutComeData?.paratomy || false,
          medical: cycleOutComeData?.medical || false,
          note: cycleOutComeData?.note || "--",
        }));
        setCycleOutComeTableData(cycleOutComeDataList);
        form.setFieldsValue({
          ivf_flow_id: findList?.value,
          current_preg_week_days: findList?.current_preg_week_days,
          weeks: findList?.weeks,
          days: findList?.days,
          lmp: findList?.lmp
            ? dayjs(moment(findList?.lmp).format("DD/MM/YYYY"), "DD/MM/YYYY")
            : null,
          bhcg_1: cycleOutComeData?.bhcg_1 || "--",
          bhcg_2: cycleOutComeData?.bhcg_2 || "--",
          clinical_preg_determine_on:
            cycleOutComeData?.clinical_preg_determine_on
              ? dayjs(
                moment(cycleOutComeData?.clinical_preg_determine_on).format(
                  "DD/MM/YYYY"
                ),
                "DD/MM/YYYY"
              )
              : null,
          clinical_preg_outcome: cycleOutComeData?.clinical_preg_outcome
            ? cycleOutComeData?.clinical_preg_outcome
            : null,
          calculated_birth_date: cycleOutComeData?.calculated_birth_date
            ? dayjs(
              moment(cycleOutComeData?.calculated_birth_date).format(
                "DD/MM/YYYY"
              ),
              "DD/MM/YYYY"
            )
            : null,
          no_of_fatal_sac: cycleOutComeData?.no_of_fatal_sac || null,
          cervical_encerclage: cycleOutComeData?.cervical_encerclage
            ? dayjs(
              moment(cycleOutComeData?.cervical_encerclage).format(
                "DD/MM/YYYY"
              ),
              "DD/MM/YYYY"
            )
            : null,
          pg_week: cycleOutComeData?.pg_week || "--",
          method: cycleOutComeData?.method || null,
          right_tube: cycleOutComeData?.right_tube || null,
          left_tube: cycleOutComeData?.left_tube || null,
          extrauterine_no: cycleOutComeData?.extrauterine_no || null,
          ovarian: cycleOutComeData?.ovarian || null,
          cervical: cycleOutComeData?.cervical || null,
          done_by: cycleOutComeData?.done_by || null,
          no_of_intrauterine: cycleOutComeData?.no_of_intrauterine || "--",
          live: cycleOutComeData?.live || false,
          blighted: cycleOutComeData?.blighted || false,
          management_date: cycleOutComeData?.management_date
            ? dayjs(
              moment(cycleOutComeData?.management_date).format("DD/MM/YYYY"),
              "DD/MM/YYYY"
            )
            : null,
          operating_gynec: cycleOutComeData?.operating_gynec || "--",
          laparoscopy: cycleOutComeData?.laparoscopy || false,
          paratomy: cycleOutComeData?.paratomy || false,
          medical: cycleOutComeData?.medical || false,
          note: cycleOutComeData?.note || "--",
        });
      }
    },
    [form, ivfIdOption]
  );
  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "srNo",
      key: "srNo",
      render: (text, data, index) => index + 1,
    },
    {
      title: "No. of Embryo",
      dataIndex: "no_of_embryo",
      key: "no_of_embryo",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (e) => {
        return e ? moment(e).format("DD/MM/YYYY") : null;
      },
    },
    {
      title: "PG Progress",
      dataIndex: "pg_progress",
      key: "pg_progress",
    },
    {
      title: "Indication",
      dataIndex: "indication",
      key: "indication",
    },
    {
      title: "Week",
      dataIndex: "week",
      key: "week",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
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
                  {(record?.id && record?.id === iscycleOutComeTableObj?.id) ||
                    (record?._id &&
                      record?._id === iscycleOutComeTableObj?._id) ? (
                    <img
                      src={CancelIcon}
                      alt="CancelIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        clearCycleOutComeTable();
                        setIsCycleOutComeTableObj({});
                      }}
                    />
                  ) : (
                    <img
                      src={EditIcon}
                      alt="EditIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        setCycleOutComeTable({
                          date: record?.date
                            ? moment(record?.date).format("DD/MM/YYYY")
                            : null,
                          no_of_embryo: record?.no_of_embryo,
                          pg_progress: record?.pg_progress,
                          indication: record?.indication,
                          week: record?.week,
                          notes: record?.notes,
                        });
                        form.setFieldsValue({
                          date: record?.date
                            ? dayjs(
                              moment(record.date).format("DD/MM/YYYY"),
                              "DD/MM/YYYY"
                            )
                            : null,
                          no_of_embryo: record?.no_of_embryo,
                          pg_progress: record?.pg_progress,
                          indication: record?.indication,
                          week: record?.week,
                          notes: record?.notes,
                        });
                        setIsCycleOutComeTableObj(record);
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
                    onDeleteTableData(record)
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    className="btn_transparent"
                  // onConfirm={(record) => {
                  //   onDeleteTableData(record)
                  // }}
                  >
                    <img src={TranshIcon} alt="TranshIcon" />
                  </Button>
                </Popconfirm>
              </li>
            )
            }
          </ul >
        );
      },
    },
  ];
  const clearCycleOutComeTable = useCallback(() => {
    setCycleOutComeTable({
      no_of_embryo: null,
      date: null,
      pg_progress: null,
      indication: null,
      week: "",
      notes: "",
    });
    form.setFieldsValue({
      no_of_embryo: null,
      date: null,
      pg_progress: null,
      indication: null,
      week: "",
      notes: "",
    });
  }, [form]);
  const onChangeCycleOutComeTable = useCallback((name, values) => {
    const value =
      name === "date"
        ? values
          ? moment(new Date(values)).format("DD/MM/YYYY")
          : null
        : values;
    setCycleOutComeTable((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleCycleOutComeTable = useCallback(() => {
    const { no_of_embryo, date, pg_progress, indication, week, notes } =
      cycleOutComeTable;
    if (
      Object.keys(selectedPatient)?.length > 0 &&
      no_of_embryo &&
      date &&
      pg_progress &&
      indication &&
      week
    ) {
      if (Object.keys(iscycleOutComeTableObj)?.length > 0) {
        let editedData = [...cycleOutComeTableData] || [];
        editedData =
          editedData?.map((item) => {
            if (
              (item?.id && item?.id === iscycleOutComeTableObj?.id) ||
              (item?._id && item?._id === iscycleOutComeTableObj?._id)
            ) {
              return {
                ...item,
                date: cycleOutComeTable.date
                  ? moment(cycleOutComeTable?.date, "DD/MM/YYYY").format(
                    "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
                  )
                  : null,
                no_of_embryo: no_of_embryo,
                pg_progress: pg_progress,
                indication: indication,
                week: week,
                notes: notes,
              };
            }
            return item;
          }) || editedData;
        setCycleOutComeTableData(editedData);
        setIsCycleOutComeTableObj({});
        toast.success("Update Succesfully.");
      } else {
        setCycleOutComeTableData((prev) => [
          ...prev,
          {
            ...cycleOutComeTable,
            date: cycleOutComeTable.date
              ? moment(cycleOutComeTable?.date, "DD/MM/YYYY").format(
                "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
              )
              : null,
            id: Math.random().toString().substring(2, 9),
            isDelete: true,
          },
        ]);
        toast.success("Add Succesfully.");
      }
      clearCycleOutComeTable();
    } else {
      toast.error("Please Fill Child Details.");
    }
  }, [
    clearCycleOutComeTable,
    iscycleOutComeTableObj,
    selectedPatient,
    cycleOutComeTable,
    cycleOutComeTableData,
  ]);
  const handleClear = () => {
    clearCycleOutCome();
    dispatch(setSelectedPatient({}));
    dispatch(setIvfIdList([]));
    dispatch(clearData());
  };
  const handleChange = useCallback(
    (val) => {
      setCycleOutCome((prevDetails) => ({
        ...prevDetails,
        clinical_preg_outcome: val,
        cervical_encerclage: null,
        pg_week: "",
        method: null,
        right_tube: null,
        left_tube: null,
        extrauterine_no: null,
        ovarian: null,
        cervical: null,
        done_by: null,
        no_of_intrauterine: "",
        live: false,
        blighted: false,
        management_date: null,
        operating_gynec: "",
        laparoscopy: false,
        paratomy: false,
        medical: false,
        note: "",
      }));
      setCycleOutComeTable({
        no_of_embryo: null,
        date: null,
        pg_progress: null,
        indication: null,
        week: "",
        notes: "",
      });
      form.setFieldsValue({
        cervical_encerclage: null,
        pg_week: "",
        method: null,
        right_tube: null,
        left_tube: null,
        extrauterine_no: null,
        ovarian: null,
        cervical: null,
        done_by: null,
        no_of_intrauterine: "",
        live: false,
        blighted: false,
        management_date: null,
        operating_gynec: "",
        laparoscopy: false,
        paratomy: false,
        medical: false,
        note: "",
        no_of_embryo: null,
        date: null,
        pg_progress: null,
        indication: null,
        week: "",
        notes: "",
      });
      setCycleOutComeTableData([]);
    },
    [form]
  );
  const getNewSelectedPatientData = useCallback(async () => {
    if (
      cycleOutComeUpdate &&
      Object.keys(selectedPatient)?.length > 0 &&
      Object.keys(cycleOutComeData)?.length === 0
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
    cycleOutComeUpdate,
    cycleOutComeData,
  ]);
  useEffect(() => {
    getNewSelectedPatientData();
  }, [cycleOutComeUpdate]);
  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {(cycleOutComeLoading || isIvfListLoading) && (
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
          autoComplete="off"
          scrollToFirstError
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
                      value={cycleOutCome?.ivf_flow_id}
                      onChange={(value) => {
                        handleIvfId(value);
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
                <li className="w_190 w_xs_100">
                  <Form.Item label="1st BHCG (miU/ml)" name="bhcg_1">
                    <Input
                      placeholder="6944"
                      name="bhcg_1"
                      value={cycleOutCome?.bhcg_1}
                      onChange={(e) => {
                        setCycleOutCome({
                          ...cycleOutCome,
                          bhcg_1: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_190 w_xs_100">
                  <Form.Item label="2nd BHCG (miU/ml)" name="bhcg_2">
                    <Input
                      placeholder="52680.8"
                      name="bhcg_2"
                      value={cycleOutCome?.bhcg_2}
                      onChange={(e) => {
                        setCycleOutCome({
                          ...cycleOutCome,
                          bhcg_2: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="LMP" name="lmp">
                    <DatePicker
                      placeholder="06/11/2022"
                      name="lmp"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      value={ivfIdDetails?.lmp}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Clinical Preg. Determine on"
                    name="clinical_preg_determine_on"
                  >
                    <DatePicker
                      placeholder="29/10/2022"
                      name="clinical_preg_determine_on"
                      value={cycleOutCome?.clinical_preg_determine_on}
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      onChange={(e) => {
                        setCycleOutCome({
                          ...cycleOutCome,
                          clinical_preg_determine_on: moment(
                            new Date(e)
                          ).format("YYYY/MM/DD"),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_100">
                  <Form.Item
                    label="Clinical Preg. Outcome"
                    name="clinical_preg_outcome"
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
                      name="clinical_preg_outcome"
                      options={[
                        { value: "Unknown", label: "Unknown" },
                        { value: "Pregnancy", label: "Pregnancy" },
                        { value: "NoPregnancy", label: "No Pregnancy" },
                        { value: "Bichemical PG", label: "Bichemical PG" },
                        { value: "--", label: "--" },
                      ]}
                      value={cycleOutCome?.clinical_preg_outcome}
                      onChange={(value) => {
                        handleChange(value);
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item
                    label="Calculated Birth Date"
                    name="calculated_birth_date"
                  >
                    <DatePicker
                      placeholder="29/10/2022"
                      name="calculated_birth_date"
                      value={cycleOutCome?.calculated_birth_date}
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      onChange={(e) => {
                        setCycleOutCome({
                          ...cycleOutCome,
                          calculated_birth_date: moment(new Date(e)).format(
                            "YYYY/MM/DD"
                          ),
                        });
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_270 w_xs_50">
                  <Form.Item
                    label="Current Preg. Week & Rest Days"
                    name="current_preg_week_days"
                  >
                    <Input
                      placeholder="7W 2D"
                      name="current_preg_week_days"
                      value={ivfIdDetails?.current_preg_week_days}
                      disabled
                    />
                  </Form.Item>
                </li>
                <li className="w_170 w_xs_100">
                  <Form.Item
                    label="No. of Fetal Sac"
                    name="no_of_fatal_sac"
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
                      name="no_of_fatal_sac"
                      value={cycleOutCome?.no_of_fatal_sac}
                      onChange={(value) => {
                        setCycleOutCome({
                          ...cycleOutCome,
                          no_of_fatal_sac: value,
                        });
                      }}
                      options={noOfFetalSacOption}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            {cycleOutCome?.clinical_preg_outcome === "Pregnancy" && (
              <>
                <div className="form_info_wrapper filled">
                  <h3 className="mb-3">Other Details</h3>
                  <ul className="grid_wrapper">
                    <li className="w_170 w_xs_100">
                      <Form.Item
                        label="No. of Embryo"
                        name="no_of_embryo"
                        className="custom_select"
                        rules={
                          cycleOutComeTable?.no_of_embryo && [
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
                          name="no_of_embryo"
                          value={cycleOutComeTable?.no_of_embryo}
                          onChange={(value) =>
                            onChangeCycleOutComeTable("no_of_embryo", value)
                          }
                          options={[
                            { value: "1", label: "1" },
                            { value: "2", label: "2" },
                            { value: "3", label: "3" },
                            { value: "4", label: "4" },
                            { value: "5", label: "5" },
                            { value: "6", label: "6" },
                            { value: "7", label: "7" },
                            { value: "8", label: "8" },
                            { value: "--", label: "--" },
                          ]}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_220 w_xs_50">
                      <Form.Item
                        label="Date"
                        name="date"
                        rules={
                          cycleOutComeTable?.no_of_embryo && [
                            {
                              required: true,
                              message: "",
                            },
                          ]
                        }
                      >
                        <DatePicker
                          placeholder="10/08/2023"
                          name="date"
                          value={
                            cycleOutComeTable?.date
                              ? dayjs(cycleOutComeTable?.date, "DD/MM/YYYY")
                              : null
                          }
                          format={{
                            format: "DD-MM-YYYY",
                            type: "mask",
                          }}
                          onChange={(value) =>
                            onChangeCycleOutComeTable("date", value)
                          }
                        />
                      </Form.Item>
                    </li>
                    <li className="w_220 w_xs_100">
                      <Form.Item
                        label="PG Progress"
                        name="pg_progress"
                        className="custom_select"
                        rules={
                          cycleOutComeTable?.no_of_embryo && [
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
                          name="pg_progress"
                          value={cycleOutComeTable?.pg_progress}
                          onChange={(value) =>
                            onChangeCycleOutComeTable("pg_progress", value)
                          }
                          options={PGProgressOption}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_400 w_xs_100">
                      <Form.Item
                        label="Indication"
                        name="indication"
                        className="custom_select"
                        rules={
                          cycleOutComeTable?.no_of_embryo && [
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
                          name="indication"
                          value={cycleOutComeTable?.indication}
                          onChange={(value) =>
                            onChangeCycleOutComeTable("indication", value)
                          }
                          options={indicationOption}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_120 w_xs_50">
                      <Form.Item
                        label="Week"
                        name="week"
                        rules={
                          cycleOutComeTable?.no_of_embryo && [
                            {
                              required: true,
                              message: "",
                            },
                          ]
                        }
                      >
                        <Input
                          placeholder="7W 2D"
                          name="week"
                          value={cycleOutComeTable?.week}
                          onChange={(e) =>
                            onChangeCycleOutComeTable("week", e.target.value)
                          }
                        />
                      </Form.Item>
                    </li>
                    <li className="w_300 w_xs_50">
                      <Form.Item label="Notes" name="notes">
                        <Input
                          placeholder="Notes"
                          name="notes"
                          value={cycleOutComeTable?.notes}
                          onChange={(e) =>
                            onChangeCycleOutComeTable("notes", e.target.value)
                          }
                        />
                      </Form.Item>
                    </li>
                    <li className="w_300 w_xs_100 align-self-end">
                      {Object.keys(iscycleOutComeTableObj)?.length > 0
                        ? (userType === 1 || selectedModule?.edit) && (
                          <Button
                            className="btn_primary mb24"
                            onClick={handleCycleOutComeTable}
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
                            onClick={handleCycleOutComeTable}
                          >
                            Add
                          </Button>
                        )}
                    </li>
                  </ul>
                  <div className="cmn_table_wrap pb-4">
                    <Table
                      columns={columns}
                      dataSource={cycleOutComeTableData}
                      pagination={false}
                    />
                  </div>
                </div>
                <div className="form_info_wrapper filled">
                  <h3 className="mb-3">Other Details</h3>
                  <ul className="grid_wrapper">
                    <li className="w_220 w_xs_50">
                      <Form.Item
                        label="Cervical Encerclage"
                        name="cervical_encerclage"
                      >
                        <DatePicker
                          placeholder="10/08/2023"
                          name="cervical_encerclage"
                          format={{
                            format: "DD-MM-YYYY",
                            type: "mask",
                          }}
                          value={cycleOutCome?.cervical_encerclage}
                          onChange={(e) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              cervical_encerclage: moment(new Date(e)).format(
                                "YYYY/MM/DD"
                              ),
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_90 w_xs_100">
                      <Form.Item label="PG Week" name="pg_week">
                        <Input
                          placeholder="0"
                          name="pg_week"
                          value={cycleOutCome?.pg_week}
                          onChange={(e) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              pg_week: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_320 w_xs_100">
                      <Form.Item
                        label="Method"
                        name="method"
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
                          name="method"
                          value={cycleOutCome?.method}
                          onChange={(value) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              method: value,
                            });
                          }}
                          options={deliveryMethodOptions}
                        />
                      </Form.Item>
                    </li>
                  </ul>
                </div>
                <div className="form_info_wrapper filled">
                  <h3 className="mb-3">Heterotopic Pregnancy Details</h3>
                  <ul className="grid_wrapper align-items-center">
                    <li className="w_270 w_xs_100">
                      <Form.Item
                        label="Right Tube"
                        name="right_tube"
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
                          name="right_tube"
                          value={cycleOutCome?.right_tube}
                          onChange={(value) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              right_tube: value,
                            });
                          }}
                          options={[
                            { value: "Hydrosalpinx", label: "Hydrosalpinx" },
                            {
                              value: "Pertitubal Adhesions",
                              label: "Pertitubal Adhesions",
                            },
                            { value: "--", label: "--" },
                          ]}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_270 w_xs_100">
                      <Form.Item
                        label="Left Tube"
                        name="left_tube"
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
                          name="left_tube"
                          value={cycleOutCome?.left_tube}
                          onChange={(value) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              left_tube: value,
                            });
                          }}
                          options={[
                            { value: "Hydrosalpinx", label: "Hydrosalpinx" },
                            {
                              value: "Pertitubal Adhesions",
                              label: "Pertitubal Adhesions",
                            },
                            { value: "--", label: "--" },
                          ]}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_200 w_xs_100">
                      <Form.Item
                        label="Extrautenne No."
                        name="extrauterine_no"
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
                          name="extrauterine_no"
                          value={cycleOutCome?.extrauterine_no}
                          onChange={(value) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              extrauterine_no: value,
                            });
                          }}
                          options={[
                            { value: "Hydrosalpinx", label: "Hydrosalpinx" },
                            {
                              value: "Pertitubal Adhesions",
                              label: "Pertitubal Adhesions",
                            },
                            { value: "--", label: "--" },
                          ]}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_200 w_xs_100">
                      <Form.Item
                        label="Ovarian"
                        name="ovarian"
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
                          name="ovarian"
                          value={cycleOutCome?.ovarian}
                          onChange={(value) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              ovarian: value,
                            });
                          }}
                          options={[
                            { value: "Hydrosalpinx", label: "Hydrosalpinx" },
                            {
                              value: "Pertitubal Adhesions",
                              label: "Pertitubal Adhesions",
                            },
                            { value: "--", label: "--" },
                          ]}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_200 w_xs_100">
                      <Form.Item
                        label="Cervical"
                        name="cervical"
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
                          name="cervical"
                          value={cycleOutCome?.cervical}
                          onChange={(value) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              cervical: value,
                            });
                          }}
                          options={[
                            { value: "Hydrosalpinx", label: "Hydrosalpinx" },
                            {
                              value: "Pertitubal Adhesions",
                              label: "Pertitubal Adhesions",
                            },
                            { value: "--", label: "--" },
                          ]}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_270 w_xs_100">
                      <Form.Item
                        label="Done By"
                        name="done_by"
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
                          value={cycleOutCome?.done_by}
                          onChange={(value) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              done_by: value,
                            });
                          }}
                          options={doctorList}
                        />
                      </Form.Item>
                    </li>
                  </ul>
                  <ul className="grid_wrapper align-items-center">
                    <li className="w_220 w_xs_100">
                      <Form.Item
                        label="No. of Intrauterine"
                        name="no_of_intrauterine"
                      >
                        <Input
                          placeholder="--"
                          name="no_of_intrauterine"
                          value={cycleOutCome?.no_of_intrauterine}
                          onChange={(e) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              no_of_intrauterine: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li>
                      <Form.Item name="live" className="mb-0">
                        <Checkbox
                          name="live"
                          checked={cycleOutCome?.live}
                          onChange={(e) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              live: e.target.checked,
                            });
                          }}
                        >
                          Live
                        </Checkbox>
                      </Form.Item>
                    </li>
                    <li>
                      <Form.Item className="mb-0" name="Blighted">
                        <Checkbox
                          name="blighted"
                          checked={cycleOutCome?.blighted}
                          onChange={(e) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              blighted: e.target.checked,
                            });
                          }}
                        >
                          Blighted
                        </Checkbox>
                      </Form.Item>
                    </li>
                  </ul>
                </div>
                <div className="form_info_wrapper filled">
                  <h3 className="mb-3">Management Details</h3>
                  <ul className="grid_wrapper align-items-center">
                    <li className="w_220 w_xs_50">
                      <Form.Item label="Date" name="management_date">
                        <DatePicker
                          placeholder="10/08/2023"
                          format={{
                            format: "DD-MM-YYYY",
                            type: "mask",
                          }}
                          name="management_date"
                          value={cycleOutCome?.management_date}
                          onChange={(e) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              management_date: moment(new Date(e)).format(
                                "YYYY/MM/DD"
                              ),
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li className="w_220 w_xs_100">
                      <Form.Item label="Operatic Gynec" name="operating_gynec">
                        <Input
                          placeholder="--"
                          value={cycleOutCome?.operating_gynec}
                          onChange={(e) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              operating_gynec: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                    <li>
                      <Form.Item name="Laparoscopy" className="mb-0">
                        <Checkbox
                          name="laparoscopy"
                          checked={cycleOutCome?.laparoscopy}
                          onChange={(e) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              laparoscopy: e.target.checked,
                            });
                          }}
                        >
                          Laparoscopy
                        </Checkbox>
                      </Form.Item>
                    </li>
                    <li>
                      <Form.Item name="Parotomy" className="mb-0">
                        <Checkbox
                          name="paratomy"
                          checked={cycleOutCome?.paratomy}
                          onChange={(e) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              paratomy: e.target.checked,
                            });
                          }}
                        >
                          Parotomy
                        </Checkbox>
                      </Form.Item>
                    </li>
                    <li>
                      <Form.Item name="Medical" className="mb-0">
                        <Checkbox
                          name="medical"
                          checked={cycleOutCome?.medical}
                          onChange={(e) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              medical: e.target.checked,
                            });
                          }}
                        >
                          Medical
                        </Checkbox>
                      </Form.Item>
                    </li>
                    <li className="w_370 w_xs_100">
                      <Form.Item label="Note (Complications)" name="note">
                        <Input
                          placeholder="Type here"
                          name="note"
                          value={cycleOutCome?.note}
                          onChange={(e) => {
                            setCycleOutCome({
                              ...cycleOutCome,
                              note: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            {cycleOutComeData?.clinical_preg_outcome === "Pregnancy" &&
              cycleOutCome?.clinical_preg_outcome === "Pregnancy" && (
                <Link
                  to="/final-out-come"
                  state={ivfIdDetails}
                  className="btn_border"
                >
                  Final Out Come
                </Link>
              )}
            {Object.keys(cycleOutComeData)?.length > 0
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
