
import DNAImage from "../../Img/dna-img.png"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, DatePicker, Form, Input, Popconfirm, Select, Spin, Table, TimePicker } from "antd";
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from 'react-router-dom';
import { collectionOptions, completeCollectionOptions, referringClinicOptions } from "utils/FieldValues";
import moment from "moment";
import dayjs from "dayjs";
import { createDna, editDnaData, getDnaData, printDna, setDnaDetails } from "redux/reducers/Dna/dnaData.slice";
import { clearData, getGlobalSearch } from "redux/reducers/SearchPanel/globalSearch.slice";
import { getAttendingDrList, setSelectedPatient } from "redux/reducers/common.slice";
import { ageCalculate } from "utils/CommonFunctions";
import { printSFreezing } from "redux/reducers/SFreezing/sFreezingData.slice";

const dnainginitialdata = {
    patient_reg_id: "",
    collections: null,
    complete_collection: null,
    rec_no: "",
    date: null,
    refer_clinic: null,
    abstinance_period: "",
    method_collection: "method_collection",
    collection_time: "",
    assay_time: "",
    ejaculate_volume: "",
    liquification_time: "",
    batch_no: "",
    kit: "Sperm Chromatin Dispersion",
    expiry_date: null,
    large_halo_500: "",
    large_halo_100: "",
    medium_halo_500: "",
    medium_halo_100: "",
    small_halo_500: "",
    small_halo_100: "",
    without_halo_500: "",
    without_halo_100: "",
    degraded_sperm_500: "",
    degraded_sperm_100: "",
    dfi: "",
    interpretation: "",
    notes: "",
    done_by: "",
};
const Dna = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const location = useLocation();
    const [dnaData, setDnaData] = useState(dnainginitialdata);
    const [doctorList, setDoctorList] = useState([]);
    const { moduleList, userType, selectedLocation } = useSelector(
        ({ role }) => role,
    );
    const { selectedPatient, attendingDrList } = useSelector(
        ({ common }) => common,
    );

    const { dnaDetails, dnaDataLoading, dnaDataUpdate } = useSelector(
        ({ dnaDataStore }) => dnaDataStore,
    );

    const selectedModule = useMemo(() => {
        let module = moduleList?.find(mod => mod.module_name === location?.pathname);
        if (!module) {
            moduleList.forEach(mod => {
                if (mod.submenu) {
                    const subModule = mod.submenu.find(sub => sub.module_name === location?.pathname);
                    if (subModule) {
                        // module = { ...subModule };
                        module = mod;
                    }
                }
            });
        }
        return module ? module : null;
    }, [moduleList, location?.pathname]);

    const columns = [
        {
            title: "DNA fragmentation / No. of sperms evaluated",
            dataIndex: "DNA_fragmentation",
            key: "DNA_fragmentation",
        },
        {
            title: "500",
            dataIndex: "500",
            key: "500",
            render: (_, { tags }) => (
                <>
                    <div className='table_input_wrap'>
                        <Form.Item label="" className='m-0'>
                            <Input
                                placeholder=""
                                name="male_Partner"
                                onChange={(e) => {
                                    setDnaData((prevState) => (
                                        { ...prevState, ejaculate_volume: e.target.value }
                                    ))
                                }}
                            />
                        </Form.Item>
                    </div>
                </>
            ),
        },
        {
            title: "100",
            dataIndex: "100",
            key: "100",
            render: (_, { tags }) => (
                <>
                    <div className='table_input_wrap'>
                        <Form.Item label="" className='m-0'>
                            <Input
                                placeholder=""
                                name="male_Partner"
                                onChange={(e) => {
                                    setDnaData((prevState) => (
                                        { ...prevState, ejaculate_volume: e.target.value }
                                    ))
                                }}
                            />
                        </Form.Item>
                    </div>
                </>
            ),
        },
    ];

    const DNAData = [
        {
            key: '1',
            DNA_fragmentation: 'No. of sperms with Large halo',
            500: 32,
            100: 'New York No. 1 Lake Park',
        },
        {
            key: '1',
            DNA_fragmentation: 'No. of sperms with Medium halo',
            500: 32,
            100: 'New York No. 1 Lake Park',
        },
        {
            key: '1',
            DNA_fragmentation: 'No. of sperms with small halo',
            500: 32,
            100: 'New York No. 1 Lake Park',
        },
        {
            key: '1',
            DNA_fragmentation: 'No. of sperms without halo',
            500: 32,
            100: 'New York No. 1 Lake Park',
        },
        {
            key: '1',
            DNA_fragmentation: 'No. of degraded sperm',
            500: 32,
            100: 'New York No. 1 Lake Park',
        },
    ];

    const refrenceColumns = [
        {
            title: "DFI ranges",
            dataIndex: "DFI_ranges",
            key: "DFI_ranges",
        },
        {
            title: "Sperm chromatin dispersion",
            dataIndex: "sperm_chromatin_dispersion",
            key: "sperm_chromatin_dispersion",
        },
    ];

    const refrenceData = [
        {
            key: '1',
            DFI_ranges: "0-30%",
            sperm_chromatin_dispersion: "Within acceptable limit",
        },
        {
            key: '1',
            DFI_ranges: "31-60%",
            sperm_chromatin_dispersion: "Equivocal limit",
        },
        {
            key: '1',
            DFI_ranges: "61%-90%",
            sperm_chromatin_dispersion: "Abnormal limit",
        },
    ];

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
            Object.keys(selectedModule)?.length > 0) {
            dispatch(
                getDnaData({
                    location_id: selectedLocation,
                    patient_reg_id: selectedPatient?._id,
                    module_id: selectedModule?._id,
                })
            );
        }
        return () => {
            clearDna();
        }
    }, [selectedPatient,
        selectedLocation,
    ]);

    useEffect(() => {
        if (Object.keys(dnaDetails)?.length > 0) {
            setDnaData({
                collections: dnaDetails?.collections || null,
                complete_collection: dnaDetails?.complete_collection || null,
                rec_no: dnaDetails?.rec_no || "",
                date: dnaDetails?.date
                    ? moment(dnaDetails?.date).format("YYYY-MM-DD")
                    : null,
                refer_clinic: dnaDetails?.refer_clinic || null,
                abstinance_period: dnaDetails?.abstinance_period || "",
                method_collection: dnaDetails?.method_collection || "",
                collection_time: dnaDetails?.collection_time
                    ? dayjs(dnaDetails?.collection_time, "HH:mm:ss").format("HH:mm:ss")
                    : null,
                assay_time:
                    dnaDetails?.assay_time
                        ? dayjs(dnaDetails?.assay_time, "HH:mm:ss").format("HH:mm:ss")
                        : null,
                ejaculate_volume: dnaDetails?.ejaculate_volume || "",
                liquification_time: dnaDetails?.liquification_time || "",
                batch_no: dnaDetails?.batch_no || "",
                kit: dnaDetails?.kit || "",
                expiry_date:
                    dnaDetails?.expiry_date
                        ? moment(dnaDetails?.expiry_date).format("YYYY-MM-DD")
                        : null,
                large_halo_500: dnaDetails?.large_halo_500 || "",
                large_halo_100: dnaDetails?.large_halo_100 || "",
                medium_halo_500: dnaDetails?.medium_halo_500 || "",
                medium_halo_100: dnaDetails?.medium_halo_100 || "",
                small_halo_500: dnaDetails?.small_halo_500 || "",
                small_halo_100: dnaDetails?.small_halo_100 || "",
                without_halo_500: dnaDetails?.without_halo_500 || "",
                without_halo_100: dnaDetails?.without_halo_100 || "",
                degraded_sperm_500: dnaDetails?.degraded_sperm_500 || "",
                degraded_sperm_100: dnaDetails?.degraded_sperm_100 || "",
                dfi: dnaDetails?.dfi || "",
                interpretation: dnaDetails?.interpretation || "",
                notes: dnaDetails?.notes || "",
                done_by: dnaDetails?.done_by || "",
            });
            form.setFieldsValue({
                collections: dnaDetails?.collections || null,
                complete_collection: dnaDetails?.complete_collection || null,
                rec_no: dnaDetails?.rec_no || "",
                date:
                    dnaDetails?.date
                        ? dayjs(
                            moment(dnaDetails?.date).format(
                                "DD/MM/YYYY"
                            ),
                            "DD/MM/YYYY"
                        )
                        : null,

                refer_clinic: dnaDetails?.refer_clinic || null,
                abstinance_period: dnaDetails?.abstinance_period || "",
                method_collection: dnaDetails?.method_collection || "",
                collection_time: dnaDetails?.collection_time
                    ? dayjs(dnaDetails?.collection_time, "HH:mm:ss")
                    : null,
                assay_time:
                    dnaDetails?.assay_time
                        ? dayjs(dnaDetails?.assay_time, "HH:mm:ss")
                        : null,
                ejaculate_volume: dnaDetails?.ejaculate_volume || "",
                liquification_time: dnaDetails?.liquification_time || "",
                batch_no: dnaDetails?.batch_no || "",
                kit: dnaDetails?.kit || "",
                expiry_date:
                    dnaDetails?.expiry_date
                        ? dayjs(
                            moment(dnaDetails?.expiry_date).format(
                                "DD/MM/YYYY"
                            ),
                            "DD/MM/YYYY"
                        )
                        : null,
                large_halo_500: dnaDetails?.large_halo_500 || "",
                large_halo_100: dnaDetails?.large_halo_100 || "",
                medium_halo_500: dnaDetails?.medium_halo_500 || "",
                medium_halo_100: dnaDetails?.medium_halo_100 || "",
                small_halo_500: dnaDetails?.small_halo_500 || "",
                small_halo_100: dnaDetails?.small_halo_100 || "",
                without_halo_500: dnaDetails?.without_halo_500 || "",
                without_halo_100: dnaDetails?.without_halo_100 || "",
                degraded_sperm_500: dnaDetails?.degraded_sperm_500 || "",
                degraded_sperm_100: dnaDetails?.degraded_sperm_100 || "",
                dfi: dnaDetails?.dfi || "",
                interpretation: dnaDetails?.interpretation || "",
                notes: dnaDetails?.notes || "",
                done_by: dnaDetails?.done_by || "",
            });
        }
    }, [dnaDetails, form])

    const onFinishFailed = errorInfo => {
        const firstErrorField = document.querySelector('.ant-form-item-has-error');
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth' });
        }
    };
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



    const createDnaDataFunc = useCallback(
        async (obj) => {
            const { payload } = await
                dispatch(
                    createDna({
                        location_id: selectedLocation,
                        patient_reg_id: selectedPatient?._id,
                        module_id: selectedModule._id,
                        payload: obj,
                    }),
                );
            if (payload?.hasOwnProperty("_id")) {
                getNewSelectedPatientData();
            }
        },
        [dispatch, getNewSelectedPatientData, selectedLocation, selectedModule, selectedPatient],
    )

    const onFinish = useCallback(
        async values => {
            if (selectedLocation &&
                Object.keys(selectedPatient).length > 0 &&
                Object.keys(selectedModule).length > 0) {
                if (Object.keys(dnaDetails).length > 0) {
                    dispatch(
                        editDnaData({
                            location_id: selectedLocation,
                            _id: dnaDetails?._id,
                            module_id: selectedModule._id,
                            payload: { ...dnaData, patient_reg_id: selectedPatient?._id },
                        }),
                    );
                } else {
                    createDnaDataFunc({ ...dnaData, patient_reg_id: selectedPatient?._id })
                }
            }
        },
        [dispatch, dnaData],
    );

    const clearDna = useCallback(() => {
        setDnaData(dnainginitialdata);
        dispatch(setDnaDetails({}));
        form.resetFields();
    }, [form, dispatch]);

    const handleClear = () => {
        clearDna();
        dispatch(setSelectedPatient({}));
        dispatch(clearData());
    };

    const printDnaData = useCallback(async () => {
        Object.keys(selectedPatient)?.length > 0 &&
            dispatch(
                printDna({
                    module_id: selectedModule?._id,
                    patient_reg_id: selectedPatient?._id,
                    location_id: selectedLocation
                })
            );
    }, [dispatch, selectedModule, selectedPatient, selectedLocation]);
    const handleRepeatTest = useCallback(
        () => {
            setDnaData(dnainginitialdata);
            dispatch(setDnaDetails({}));
            form.setFieldsValue(dnainginitialdata);
        },
        [form, dispatch],
    )


    return (
        <div className='page_main_content'>
            <div className='page_inner_content'>
                {dnaDataLoading && (
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
                    <div className='form_process_wrapper'>
                        <div className='form_info_wrapper filled'>
                            <div className="patient_detail_wrap">
                                <ul>
                                    <li>
                                        <label>Patient ID :</label>
                                        <span>{selectedPatient?.patient_id ? selectedPatient?.patient_id : ""}</span>
                                    </li>
                                    <li>
                                        <label>Patient :</label>
                                        <span>
                                            {selectedPatient?.patient_full_name ? selectedPatient?.patient_full_name : ""}
                                        </span>
                                    </li>
                                    <li>
                                        <label>Patient Age :</label>
                                        <span>
                                            {selectedPatient?.patient_dob
                                                ? ageCalculate(selectedPatient?.patient_dob)
                                                : ""}
                                        </span>
                                    </li>
                                    <li>
                                        <label>Partner :</label>
                                        <span>
                                            {selectedPatient?.partner_full_name ? selectedPatient?.partner_full_name : ""}
                                        </span>
                                    </li>
                                    <li>
                                        <label>Partner Age :</label>
                                        <span>
                                            {selectedPatient?.partner_dob
                                                ? ageCalculate(selectedPatient?.partner_dob)
                                                : ""}
                                        </span>

                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='form_info_wrapper filled'>
                            <h3 className="mb-3">Patient Registration & Basic info from patient</h3>
                            <ul className='grid_wrapper'>
                                <li className="w_270 w_xs_100">
                                    <Form.Item label="Male Partner" name="male_partner">
                                        <Input
                                            disabled
                                            placeholder="Enter Male Partner"
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_120 w_xs_100">
                                    <Form.Item label="Age (Male)" name="age_male">
                                        <Input
                                            disabled
                                            placeholder="Enter Age"
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_270 w_xs_100">
                                    <Form.Item label="Female Partner" name="female_partner">
                                        <Input
                                            disabled
                                            placeholder="Enter Female Partner"
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_120 w_xs_50">
                                    <Form.Item label="Age (Female)" name="age_female">
                                        <Input
                                            disabled
                                            placeholder="Enter Age"
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_50">
                                    <Form.Item label="Pt. ID" name="pt_id">
                                        <Input
                                            disabled
                                            placeholder="Enter ID"
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_100">
                                    <Form.Item
                                        label="Collection"
                                        name="collections"
                                        className="custom_select"
                                    >
                                        <Select
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
                                            allowClear={true}
                                            placeholder="Select"
                                            onChange={(val) => {
                                                setDnaData((prevState) => (
                                                    { ...prevState, collections: val }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_100">
                                    <Form.Item
                                        label="Complete Collection"
                                        name="complete_collection"
                                        className="custom_select"
                                    >
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
                                                setDnaData((prevState) => (
                                                    { ...prevState, complete_collection: val }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_120 w_xs_50">
                                    <Form.Item label="Rec.No." name="rec_no">
                                        <Input
                                            placeholder="Rec.No."
                                            value={dnaData?.rec_no}
                                            onChange={(e) => {
                                                setDnaData((prevState) => (
                                                    { ...prevState, rec_no: e.target.value }
                                                ))
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
                                        ]}
                                    >
                                        <DatePicker
                                            placeholder="DD-MM-YYYY"
                                            format={{
                                                format: "DD-MM-YYYY",
                                                type: "mask",
                                            }}
                                            onChange={(e) => {
                                                setDnaData((prevState) => (
                                                    {
                                                        ...prevState, date: moment(new Date(e)).format(
                                                            "YYYY/MM/DD"
                                                        )
                                                    }
                                                ))
                                            }}

                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_270 w_xs_100">
                                    <Form.Item label="Referring clinic/clinician"
                                        name="refer_clinic"
                                        className="custom_select"
                                    >
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
                                                setDnaData((prevState) => (
                                                    { ...prevState, refer_clinic: val }
                                                ))
                                            }}

                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_100">
                                    <Form.Item label="Abstinance Period" name="abstinance_period">
                                        <Input
                                            placeholder="Enter Abstinance Period"
                                            onChange={(e) => {
                                                setDnaData((prevState) => (
                                                    { ...prevState, abstinance_period: e.target.value }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_100">
                                    <Form.Item label="Method Of Collection">
                                        <div className='default_value_wrap'>
                                            <span>Masturbation</span>
                                        </div>
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_50">
                                    <Form.Item label="Collection time(CT)" name="collection_time">
                                        <TimePicker
                                            format="h:mm a"
                                            onChange={(value) => {
                                                setDnaData((prevState) => (
                                                    {
                                                        ...prevState,
                                                        collection_time: value
                                                            ? dayjs(value).format("HH:mm:ss")
                                                            : null,
                                                    }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_50">
                                    <Form.Item label="Assay time (AT)" name="assay_time">
                                        <TimePicker
                                            format="h:mm a"
                                            onChange={(value) => {
                                                setDnaData((prevState) => (
                                                    {
                                                        ...prevState,
                                                        assay_time: value
                                                            ? dayjs(value).format("HH:mm:ss")
                                                            : null,
                                                    }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_250 w_xs_100">
                                    <Form.Item label="Ejaculate volume"
                                        className='input_with_text'
                                        name="ejaculate_volume"
                                        tooltip={{
                                            title: 'normal > 1.4 ml',
                                            placement: "bottom",
                                            icon: <InfoCircleOutlined />,

                                        }}
                                    >
                                        <Input
                                            value={dnaData?.ejaculate_volume}
                                            placeholder="Enter Ejaculate volume"
                                            onChange={(e) => {
                                                setDnaData((prevState) => (
                                                    { ...prevState, ejaculate_volume: e.target.value }
                                                ))
                                            }}
                                        />
                                        <span className='ms-1'>ml</span>
                                    </Form.Item>
                                </li>
                                <li className="w_250 w_xs_100">
                                    <Form.Item label="Liquification Time" className='input_with_text' name="liquification_time" tooltip={{
                                        title: 'normal - within 60 mins',
                                        placement: "bottom",
                                        icon: <InfoCircleOutlined />,

                                    }}
                                    >
                                        <Input
                                            placeholder="Enter Liquification Time"
                                            value={dnaData?.liquification_time}
                                            onChange={(e) => {
                                                setDnaData((prevState) => (
                                                    { ...prevState, liquification_time: e.target.value }
                                                ))
                                            }}
                                        />
                                        <span className='ms-1'>min</span>
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_100">
                                    <Form.Item label="Batch" name="batch_no">
                                        <Input
                                            placeholder="Enter Batch"
                                            onChange={(e) => {
                                                setDnaData((prevState) => (
                                                    { ...prevState, batch_no: e.target.value }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="custom_default_value">
                                    <Form.Item label="Kit">
                                        <div className='default_value_wrap'>
                                            <span>Sperm Chromatin Dispersion</span>
                                        </div>
                                    </Form.Item>
                                </li>
                                <li className="w_220 w_xs_50">
                                    <Form.Item
                                        label="Expiry Date"
                                        name="expiry_date"
                                    >
                                        <DatePicker
                                            placeholder="DD-MM-YYYY"
                                            format={{
                                                format: "DD-MM-YYYY",
                                                type: "mask",
                                            }}
                                            onChange={(e) => {
                                                setDnaData((prevState) => (
                                                    {
                                                        ...prevState, expiry_date: moment(new Date(e)).format(
                                                            "YYYY/MM/DD"
                                                        )
                                                    }
                                                ))
                                            }}

                                        />
                                    </Form.Item>
                                </li>
                            </ul>
                        </div>
                        <div className='form_info_wrapper filled'>
                            <ul className='grid_wrapper result_row'>
                                <li className='result_col'>
                                    <h3 className="mb-3">Result</h3>
                                    <div className="custom_table_wrap">
                                        <div className="table-responsive">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>DNA fragmentation / No. of sperms evaluated</th>
                                                        <th className="text-center">500</th>
                                                        <th className="text-center">100</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            No. of sperms with Large halo
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center" name="large_halo_500">
                                                                <Input
                                                                    placeholder="Enter %"
                                                                    onChange={(e) => {
                                                                        setDnaData((prevState) => (
                                                                            { ...prevState, large_halo_500: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center" name="large_halo_100">
                                                                <Input
                                                                    placeholder="Enter %"
                                                                    onChange={(e) => {
                                                                        setDnaData((prevState) => (
                                                                            { ...prevState, large_halo_100: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            No. of sperms with Medium halo
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center" name="medium_halo_500">
                                                                <Input
                                                                    placeholder="Enter %"
                                                                    onChange={(e) => {
                                                                        setDnaData((prevState) => (
                                                                            { ...prevState, medium_halo_500: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center" name="medium_halo_100">
                                                                <Input
                                                                    placeholder="Enter %"
                                                                    onChange={(e) => {
                                                                        setDnaData((prevState) => (
                                                                            { ...prevState, medium_halo_100: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            No. of sperms with small halo
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center" name="small_halo_500">
                                                                <Input
                                                                    placeholder="Enter %"
                                                                    onChange={(e) => {
                                                                        setDnaData((prevState) => (
                                                                            { ...prevState, small_halo_500: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center" name="small_halo_100">
                                                                <Input
                                                                    placeholder="Enter %"
                                                                    onChange={(e) => {
                                                                        setDnaData((prevState) => (
                                                                            { ...prevState, small_halo_100: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            No. of sperms without halo
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center" name="without_halo_500">
                                                                <Input
                                                                    placeholder="Enter %"
                                                                    onChange={(e) => {
                                                                        setDnaData((prevState) => (
                                                                            { ...prevState, without_halo_500: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center" name="without_halo_100">
                                                                <Input
                                                                    placeholder="Enter %"
                                                                    onChange={(e) => {
                                                                        setDnaData((prevState) => (
                                                                            { ...prevState, without_halo_100: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            No. of degraded sperm
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center" name="degraded_sperm_500">
                                                                <Input
                                                                    placeholder="Enter %"
                                                                    onChange={(e) => {
                                                                        setDnaData((prevState) => (
                                                                            { ...prevState, degraded_sperm_500: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center" name="degraded_sperm_100">
                                                                <Input
                                                                    placeholder="Enter %"
                                                                    onChange={(e) => {
                                                                        setDnaData((prevState) => (
                                                                            { ...prevState, degraded_sperm_100: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className='table_custom_footer mt-3'>
                                        <div className='row g-3 align-items-center'>
                                            <div className='col-sm-6'>
                                                <h5 className="m-0">DNA fragmentation index (DFI) (%)</h5>
                                            </div>
                                            <div className='col-sm-6 text-sm-end'>
                                                <Form.Item label="" name="dfi" className="m-0 footer_input" >
                                                    <Input
                                                        placeholder="Enter %"
                                                        onChange={(e) => {
                                                            setDnaData((prevState) => (
                                                                { ...prevState, dfi: e.target.value }
                                                            ))
                                                        }}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className='result_col'>
                                    <h3 className="mb-3">Principle of method</h3>
                                    <div className='Principle_method_wrap'>
                                        <p>The method is based on interpreting the difference between fragmented and intact DNA in spermatozoa. The spermatozoa embedded in agarose matrix are overlaid on the coated slide and exposed to acid solution followed by lysis solution. After exposure, the spermatozoa with non-fragmented DNA shows the dispersed halos of DNA while the spermatozoa with fragmented DNA shows minimal or no halos.</p>
                                        <div className='Principle_img_wrap'>
                                            <img src={DNAImage} alt="Img" />
                                        </div>
                                        <p>DFI (%) = Total no. of fragmented sperms (small halo+no halo+degraded)</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className='form_info_wrapper filled'>
                            <h3 className="mb-3">Reference value</h3>
                            <div className='row'>
                                <div className='col-xl-4 col-lg-5'>
                                    <div className="cmn_table_wrap pb-4">
                                        <Table
                                            columns={refrenceColumns}
                                            dataSource={refrenceData}
                                            pagination={false}
                                        />
                                    </div>
                                </div>
                                <div className='col-xl-8 col-lg-7'>
                                    <ul className='grid_wrapper'>
                                        <li className="w_270 w_xs_100">
                                            <Form.Item label="Interpretation" name="interpretation">
                                                <Input
                                                    placeholder="Enter Interpretationr"
                                                    onChange={(e) => {
                                                        setDnaData((prevState) => (
                                                            { ...prevState, interpretation: e.target.value }
                                                        ))
                                                    }}
                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_320 w_xs_100">
                                            <Form.Item label="Notes" name="notes">
                                                <Input
                                                    placeholder="Notes"
                                                    name="notes"
                                                    onChange={(e) => {
                                                        setDnaData((prevState) => (
                                                            { ...prevState, notes: e.target.value }
                                                        ))
                                                    }}
                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_270 w_xs_100">
                                            <Form.Item label="Done by" name="done_by">
                                                <Input
                                                    placeholder="Enter Done by"
                                                    onChange={(e) => {
                                                        setDnaData((prevState) => (
                                                            { ...prevState, done_by: e.target.value }
                                                        ))
                                                    }}
                                                />
                                            </Form.Item>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* <ul className='grid_wrapper'>
                            <li className='w_400 w_xs_100'>
                                <div className="cmn_table_wrap pb-4">
                                    <Table
                                        columns={refrenceColumns}
                                        dataSource={refrenceData}
                                        pagination={false}
                                    />
                                </div>
                            </li>
                            <li className="w_270 w_xs_100">
                                <Form.Item label="Interpretation" name="interpretation">
                                    <Input
                                        placeholder="Enter Interpretationr"
                                        name="interpretation"
                                    />
                                </Form.Item>
                            </li>
                            <li className="w_320 w_xs_100">
                                <Form.Item label="Notes" name="notes">
                                    <Input
                                        placeholder="Enter Notes"
                                        name="notes"
                                    />
                                </Form.Item>
                            </li>
                            <li className="w_270 w_xs_100">
                                <Form.Item label="Done by" name="done_by">
                                    <Input
                                        placeholder="Enter Done by"
                                        name="done_by"
                                    />
                                </Form.Item>
                            </li>
                        </ul> */}
                        </div>
                    </div>
                    <div className='button_group d-flex align-items-center justify-content-center mt-4'>
                        {Object.keys(dnaDetails)?.length > 0
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
                            onClick={printDnaData}
                        >
                            Print
                        </Button>
                        <Button className="btn_gray mx-sm-2 mx-1"
                            onClick={handleClear}
                        >
                            Cancel
                        </Button>

                    </div>
                </Form>
            </div>

        </div>
    )
}

export default Dna