import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, DatePicker, Form, Input, Popconfirm, Select, Spin, Table, TimePicker } from "antd";
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from 'react-router-dom';
import { getAttendingDrList, setSelectedPatient } from 'redux/reducers/common.slice';
import { clearData, getGlobalSearch } from 'redux/reducers/SearchPanel/globalSearch.slice';
import { createSstData, editSstData, getSstData, printSst, setSstDetails } from 'redux/reducers/Sst/sstData.slice';
import { collectionOptions, completeCollectionOptions, debriesOptions, referringClinicOptions, visualAppearance } from 'utils/FieldValues';
import moment from 'moment';
import dayjs from 'dayjs';
import { ageCalculate } from 'utils/CommonFunctions';


const sstInitialdata = {
    patient_reg_id: "",
    collections: null,
    complete_collection: null,
    rec_no: "",
    date: null,
    refer_clinic: null,
    method_collection: "Masturbation",
    abstinance_period: "",
    collection_time: "",
    assay_time: "",
    ejaculate_volume: "",
    liquification_time: "",
    visual_appeareance: null,
    viscosity: null,
    pus_cells_leucocytes: "",
    debries: null,
    normal_forms: "",
    total_motile: "",
    concentration: "",
    motility: "",
    preparation_method: "",
    culturing_days: "",
    culture_media: "",
    batch_no: "",
    exp_date: null,
    concentration_prelim: "",
    concentration_post: "",
    concentration_after_24: "",
    concentration_after_48: "",
    concentration_after_72: "",
    motility_prelim: "",
    motility_post: "",
    motility_after_24: "",
    motility_after_48: "",
    motility_after_72: "",
    interpretation: null,
    examination_done_by: "",
    notes: "",
};


const Sst = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const location = useLocation();
    const [sstData, setsstData] = useState(sstInitialdata);
    const [doctorList, setDoctorList] = useState([]);

    const { moduleList, userType, selectedLocation } = useSelector(
        ({ role }) => role,
    );
    const { selectedPatient, attendingDrList } = useSelector(
        ({ common }) => common,
    );
    const { sstDetails, sstLoading, sstDataUpdate } = useSelector(
        ({ sstDataStore }) => sstDataStore,
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


    const clearSst = useCallback(() => {
        setsstData(sstInitialdata);
        dispatch(setSstDetails({}));
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
            Object.keys(sstDetails)?.length === 0
        ) {
            dispatch(
                getSstData({
                    location_id: selectedLocation,
                    patient_reg_id: selectedPatient?._id,
                    module_id: selectedModule?._id,
                })
            );
        }
        return () => {
            clearSst();
        }
    }, [selectedPatient,
        selectedLocation
    ]);



    useEffect(() => {
        if (Object.keys(sstDetails)?.length > 0) {
            setsstData({
                patient_reg_id: sstDetails?.patient_reg_id || "",
                collections: sstDetails?.collections || null,
                complete_collection: sstDetails?.complete_collection || null,
                rec_no: sstDetails?.rec_no || "",
                date: sstDetails.date
                    ? moment(sstDetails.date).format("YYYY-MM-DD")
                    : null,
                refer_clinic: sstDetails?.refer_clinic || null,
                method_collection: sstDetails?.method_collection || "",
                abstinance_period: sstDetails?.abstinance_period || "",
                collection_time: sstDetails?.collection_time
                    ? dayjs(sstDetails?.collection_time, "HH:mm:ss").format("HH:mm:ss")
                    : null,
                assay_time:
                    sstDetails?.assay_time
                        ? dayjs(sstDetails?.assay_time, "HH:mm:ss").format("HH:mm:ss")
                        : null,
                ejaculate_volume: sstDetails?.ejaculate_volume || "",
                liquification_time: sstDetails?.liquification_time || "",
                visual_appeareance: sstDetails?.visual_appeareance || null,
                viscosity: sstDetails?.viscosity || null,
                pus_cells_leucocytes: sstDetails?.pus_cells_leucocytes || "",
                debries: sstDetails?.debries || null,
                normal_forms: sstDetails?.normal_forms || "",
                total_motile: sstDetails?.total_motile || "",
                concentration: sstDetails?.concentration || "",
                motility: sstDetails?.motility || "",
                preparation_method: sstDetails?.preparation_method || "",
                culturing_days: sstDetails?.culturing_days || "",
                culture_media: sstDetails?.culture_media || "",
                batch_no: sstDetails?.batch_no || "",
                exp_date: sstDetails.exp_date
                    ? moment(sstDetails.exp_date).format("YYYY-MM-DD")
                    : null,
                concentration_prelim: sstDetails?.concentration_prelim || "",
                concentration_post: sstDetails?.concentration_post || "",
                concentration_after_24: sstDetails?.concentration_after_24 || "",
                concentration_after_48: sstDetails?.concentration_after_48 || "",
                concentration_after_72: sstDetails?.concentration_after_72 || "",
                motility_prelim: sstDetails?.motility_prelim || "",
                motility_post: sstDetails?.motility_post || "",
                motility_after_24: sstDetails?.motility_after_24 || "",
                motility_after_48: sstDetails?.motility_after_48 || "",
                motility_after_72: sstDetails?.motility_after_72 || "",
                interpretation: sstDetails?.interpretation || null,
                examination_done_by: sstDetails?.examination_done_by || "",
                notes: sstDetails?.notes || "",
            });
            form.setFieldsValue({
                patient_reg_id: sstDetails?.patient_reg_id || "",
                collections: sstDetails?.collections || null,
                complete_collection: sstDetails?.complete_collection || null,
                rec_no: sstDetails?.rec_no || "",
                date: sstDetails.date
                    ? dayjs(
                        moment(sstDetails.date).format(
                            "DD/MM/YYYY"
                        ),
                        "DD/MM/YYYY"
                    )
                    : null,
                refer_clinic: sstDetails?.refer_clinic || null,
                method_collection: sstDetails?.method_collection || "",
                abstinance_period: sstDetails?.abstinance_period || "",
                collection_time: sstDetails?.collection_time
                    ? dayjs(sstDetails?.collection_time, "HH:mm:ss")
                    : null,
                assay_time:
                    sstDetails?.assay_time
                        ? dayjs(sstDetails?.assay_time, "HH:mm:ss")
                        : null,
                ejaculate_volume: sstDetails?.ejaculate_volume || "",
                liquification_time: sstDetails?.liquification_time || "",
                visual_appeareance: sstDetails?.visual_appeareance || null,
                viscosity: sstDetails?.viscosity || null,
                pus_cells_leucocytes: sstDetails?.pus_cells_leucocytes || "",
                debries: sstDetails?.debries || null,
                normal_forms: sstDetails?.normal_forms || "",
                total_motile: sstDetails?.total_motile || "",
                concentration: sstDetails?.concentration || "",
                motility: sstDetails?.motility || "",
                preparation_method: sstDetails?.preparation_method || "",
                culturing_days: sstDetails?.culturing_days || "",
                culture_media: sstDetails?.culture_media || "",
                batch_no: sstDetails?.batch_no || "",
                exp_date: sstDetails.exp_date
                    ? dayjs(
                        moment(sstDetails.exp_date).format(
                            "DD/MM/YYYY"
                        ),
                        "DD/MM/YYYY"
                    )
                    : null,
                concentration_prelim: sstDetails?.concentration_prelim || "",
                concentration_post: sstDetails?.concentration_post || "",
                concentration_after_24: sstDetails?.concentration_after_24 || "",
                concentration_after_48: sstDetails?.concentration_after_48 || "",
                concentration_after_72: sstDetails?.concentration_after_72 || "",
                motility_prelim: sstDetails?.motility_prelim || "",
                motility_post: sstDetails?.motility_post || "",
                motility_after_24: sstDetails?.motility_after_24 || "",
                motility_after_48: sstDetails?.motility_after_48 || "",
                motility_after_72: sstDetails?.motility_after_72 || "",
                interpretation: sstDetails?.interpretation || null,
                examination_done_by: sstDetails?.examination_done_by || "",
                notes: sstDetails?.notes || "",
            });
        }
    }, [sstDetails, form])

    const columns = [
        {
            title: "Perameter",
            dataIndex: "perameter",
            key: "perameter",
        },
        {
            title: "Preliminary",
            dataIndex: "preliminary",
            key: "preliminary",
            render: (_, { tags }) => (
                <>
                    <div className='table_input_wrap'>
                        <Form.Item label="" className='m-0'>
                            <Input
                                placeholder=""
                                name="male_Partner"
                            />
                        </Form.Item>
                    </div>
                </>
            ),
        },
        {
            title: "Post Wash",
            dataIndex: "post_wash",
            key: "post_wash",
            render: (_, { tags }) => (
                <>
                    <div className='table_input_wrap'>
                        <Form.Item label="" className='m-0'>
                            <Input
                                placeholder=""
                                name="male_Partner"
                            />
                        </Form.Item>
                    </div>
                </>
            ),
        },
        {
            title: "After 24 hrs.",
            dataIndex: "after_24_hrs",
            key: "after_24_hrs",
            render: (_, { tags }) => (
                <>
                    <div className='table_input_wrap'>
                        <Form.Item label="" className='m-0'>
                            <Input
                                placeholder=""
                                name="male_Partner"
                            />
                        </Form.Item>
                    </div>
                </>
            ),
        },
        {
            title: "After 48 hrs.",
            dataIndex: "after_48_hrs",
            key: "after_48_hrs",
            render: (_, { tags }) => (
                <>
                    <div className='table_input_wrap'>
                        <Form.Item label="" className='m-0'>
                            <Input
                                placeholder=""
                                name="male_Partner"
                            />
                        </Form.Item>
                    </div>
                </>
            ),
        },
        {
            title: "After 72 hrs.",
            dataIndex: "after_72_hrs",
            key: "after_72_hrs",
            render: (_, { tags }) => (
                <>
                    <div className='table_input_wrap'>
                        <Form.Item label="" className='m-0'>
                            <Input
                                placeholder=""
                                name="male_Partner"
                            />
                        </Form.Item>
                    </div>
                </>
            ),
        },
    ];

    const SSTData = [
        {
            key: '1',
            perameter: 'No. of sperms with Large halo',
            preliminary: 32,
            post_wash: 'New York No. 1 Lake Park',
            after_24_hrs: 'New York No. 1 Lake Park',
            after_48_hrs: 'New York No. 1 Lake Park',
            after_72_hrs: 'New York No. 1 Lake Park',
        },
        {
            key: '1',
            perameter: 'No. of sperms with Large halo',
            preliminary: 32,
            post_wash: 'New York No. 1 Lake Park',
            after_24_hrs: 'New York No. 1 Lake Park',
            after_48_hrs: 'New York No. 1 Lake Park',
            after_72_hrs: 'New York No. 1 Lake Park',
        },
        {
            key: '1',
            perameter: 'No. of sperms with Large halo',
            preliminary: 32,
            post_wash: 'New York No. 1 Lake Park',
            after_24_hrs: 'New York No. 1 Lake Park',
            after_48_hrs: 'New York No. 1 Lake Park',
            after_72_hrs: 'New York No. 1 Lake Park',
        },
    ];


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

    const createSstFunc = useCallback(
        async (obj) => {
            const { payload } = await
                dispatch(
                    createSstData({
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

    const onFinishFailed = errorInfo => {
        const firstErrorField = document.querySelector('.ant-form-item-has-error');
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const onFinish = useCallback(
        async values => {
            if (selectedLocation &&
                Object.keys(selectedPatient)?.length > 0 &&
                Object.keys(selectedModule)?.length > 0) {
                if (Object.keys(sstDetails)?.length > 0) {
                    dispatch(
                        editSstData({
                            location_id: selectedLocation,
                            _id: sstDetails?._id,
                            module_id: selectedModule._id,
                            payload: { ...sstData, patient_reg_id: selectedPatient?._id },
                        }),
                    );
                } else {
                    createSstFunc(
                        { ...sstData, patient_reg_id: selectedPatient?._id }
                    )
                }
            }
        },
        [dispatch, sstData],
    );

    const handleClear = () => {
        clearSst();
        dispatch(setSelectedPatient({}));
        dispatch(clearData());
    };


    const handleRepeatTest = useCallback(
        () => {
            dispatch(setSstDetails({}));
            setsstData(sstInitialdata);
            form.setFieldsValue(sstInitialdata);
        },
        [form, dispatch],
    )


    const printSstData = useCallback(async () => {
        Object.keys(selectedPatient)?.length > 0 &&
            dispatch(
                printSst({
                    module_id: selectedModule?._id,
                    patient_reg_id: selectedPatient?._id,
                    location_id: selectedLocation
                })
            );
    }, [dispatch, selectedModule, selectedPatient, selectedLocation]);

    return (
        <div className='page_main_content'>
            <div className='page_inner_content'>
                {sstLoading && (
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
                                                setsstData((prevState) => (
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
                                                setsstData((prevState) => (
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
                                            onChange={(e) => {
                                                setsstData((prevState) => (
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
                                                setsstData((prevState) => (
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
                                    <Form.Item
                                        className="custom_select"
                                        label="Referring clinic/clinician"
                                        name="refer_clinic">
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
                                                setsstData((prevState) => (
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
                                                setsstData((prevState) => (
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
                                                setsstData((prevState) => (
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
                                                setsstData((prevState) => (
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
                            </ul>
                        </div>
                        <div className='form_info_wrapper filled'>
                            <h3 className="mb-3">Preliminary Semen Analysis</h3>
                            <ul className='grid_wrapper'>
                                <li className="w_220 w_xs_100">
                                    <Form.Item label="Ejaculate volume" className='input_with_text'
                                        name="ejaculate_volume" tooltip={{
                                            title: 'normal > 1.4 ml',
                                            placement: "bottom",
                                            icon: <InfoCircleOutlined />,

                                        }}
                                    >
                                        <Input
                                            placeholder="Enter Ejaculate volume"
                                            value={sstData?.ejaculate_volume}
                                            onChange={(e) => {
                                                setsstData((prevState) => (
                                                    { ...prevState, ejaculate_volume: e.target.value }
                                                ))
                                            }}
                                        />
                                        <span className='ms-1'>ml</span>
                                    </Form.Item>
                                </li>
                                <li className="w_220 w_xs_100">
                                    <Form.Item label="Liquification Time" className='input_with_text'
                                        name="liquification_time" tooltip={{
                                            title: 'normal - within 60 mins',
                                            placement: "bottom",
                                            icon: <InfoCircleOutlined />,

                                        }}
                                    >
                                        <Input
                                            value={sstData?.liquification_time}
                                            placeholder="Enter Liquification Time"
                                            onChange={(e) => {
                                                setsstData((prevState) => (
                                                    { ...prevState, liquification_time: e.target.value }
                                                ))
                                            }}
                                        />
                                        <span className='ms-1'>min</span>
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_100">
                                    <Form.Item
                                        label="Visual appearance"
                                        name="visual_appeareance"
                                        className="custom_select"
                                    >
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
                                                setsstData((prevState) => (
                                                    { ...prevState, visual_appeareance: val }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_100">
                                    <Form.Item
                                        label="Viscosity"
                                        name="viscosity"
                                        className="custom_select"
                                    >
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
                                                setsstData((prevState) => (
                                                    { ...prevState, viscosity: val }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_300 w_xs_100">
                                    <Form.Item label="Pus cells/Leucocytes"
                                        className='input_with_text'
                                        name="pus_cells_leucocytes"
                                        tooltip={{
                                            title: '8-10/hpf',
                                            placement: "bottom",
                                            icon: <InfoCircleOutlined />,

                                        }}
                                    >
                                        <Input
                                            value={sstData?.pus_cells_leucocytes}
                                            placeholder="Enter Pus cells/Leucocytes"
                                            onChange={(e) => {
                                                setsstData((prevState) => (
                                                    { ...prevState, pus_cells_leucocytes: e.target.value }
                                                ))
                                            }}
                                        />
                                        <span className='ms-1'>/hpf</span>
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_100">
                                    <Form.Item
                                        label="Debries"
                                        name="debries"
                                        className="custom_select"
                                    >
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
                                                setsstData((prevState) => (
                                                    { ...prevState, debries: val }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_220 w_xs_100">
                                    <Form.Item label="Normal forms" name="normal_forms" tooltip={{
                                        title: 'normal > 4%',
                                        placement: "bottom",
                                        icon: <InfoCircleOutlined />,

                                    }}
                                    >
                                        <Input
                                            placeholder="Enter Normal forms"
                                            onChange={(e) => {
                                                setsstData((prevState) => (
                                                    { ...prevState, normal_forms: e.target.value }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_300 w_xs_100">
                                    <Form.Item label="Concentration"
                                        className='input_with_text'
                                        name="concentration"
                                        tooltip={{
                                            title: 'normal > 16 Million/ml',
                                            placement: "bottom",
                                            icon: <InfoCircleOutlined />,

                                        }}
                                    >
                                        <Input
                                            placeholder="Enter Concentration"
                                            value={sstData?.concentration}
                                            onChange={(e) => {
                                                setsstData((prevState) => (
                                                    { ...prevState, concentration: e.target.value }
                                                ))
                                            }}
                                        />
                                        <span className='ms-1'>Million/ml</span>
                                    </Form.Item>
                                </li>
                                <li className="w_120 w_xs_100">
                                    <Form.Item label="Motility" name="motility">
                                        <Input
                                            placeholder="Enter Motility"
                                            onChange={(e) => {
                                                setsstData((prevState) => (
                                                    { ...prevState, motility: e.target.value }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_250 w_xs_100">
                                    <Form.Item label="Preparation Method" name="preparation_method">
                                        <Input
                                            placeholder="Enter Preparation Method"
                                            onChange={(e) => {
                                                setsstData((prevState) => (
                                                    { ...prevState, preparation_method: e.target.value }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_100">
                                    <Form.Item label="Culturing days" name="culturing_days">
                                        <Input
                                            placeholder="Enter Culturing days"
                                            onChange={(e) => {
                                                setsstData((prevState) => (
                                                    { ...prevState, culturing_days: e.target.value }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_100">
                                    <Form.Item label="Culture media" name="culture_media">
                                        <Input
                                            placeholder="Enter Culture media"
                                            onChange={(e) => {
                                                setsstData((prevState) => (
                                                    { ...prevState, culture_media: e.target.value }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_100">
                                    <Form.Item label="Batch No." name="batch_no">
                                        <Input
                                            placeholder="Enter Batch No."
                                            onChange={(e) => {
                                                setsstData((prevState) => (
                                                    { ...prevState, batch_no: e.target.value }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_180 w_xs_50">
                                    <Form.Item
                                        label="Expiry Date"
                                        name="exp_date"
                                    >
                                        <DatePicker
                                            placeholder="DD-MM-YYYY"
                                            format={{
                                                format: "DD-MM-YYYY",
                                                type: "mask",
                                            }}
                                            onChange={(e) => {
                                                setsstData((prevState) => (
                                                    {
                                                        ...prevState, exp_date: moment(new Date(e)).format(
                                                            "YYYY/MM/DD" || null
                                                        )
                                                    }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                            </ul>
                        </div>
                        {/* <div className='form_info_wrapper filled'>
                        <h3 className="mb-3">Subsequent Semen Analysis</h3>
                        <ul className='grid_wrapper'>
                            <li className="w_320 w_xs_100">
                                <Form.Item label="Preparation Method & Media" name="preparation_method_Media">
                                    <Input
                                        placeholder="Enter Method & Media"
                                        name="preparation_method_Media"
                                    />
                                </Form.Item>
                            </li>
                            <li className="w_170 w_xs_100">
                                <Form.Item label="Batch No." name="batch_No">
                                    <Input
                                        placeholder="Enter No"
                                        name="batch_No"
                                    />
                                </Form.Item>
                            </li>

                            <li className="w_250 w_xs_100">
                                <Form.Item label="Insemination volume" className='input_with_text' name="insemination_volume" tooltip={{
                                    title: 'normal > 1.4 ml',
                                    placement: "bottom",
                                    icon: <InfoCircleOutlined />,

                                }}
                                >
                                    <Input
                                        placeholder="Enter"
                                        name="insemination_volume"
                                    />
                                    <span className='ms-1'>ml</span>
                                </Form.Item>
                            </li>
                            <li className="w_250 w_xs_100">
                                <Form.Item label="Concentration" className='input_with_text' name="concentration" tooltip={{
                                    title: 'normal > 16 Million/ml',
                                    placement: "bottom",
                                    icon: <InfoCircleOutlined />,

                                }}
                                >
                                    <Input
                                        placeholder="Enter"
                                        name="concentration"
                                    />
                                    <span className='ms-1'>Million/ml</span>
                                </Form.Item>
                            </li>
                            <li className='w-100'>
                                <ul className='grid_wrapper'>
                                    <li className="w_220 w_xs_100">
                                        <Form.Item label="Total motile (a+b+c)" name="total_motile">
                                            <Input
                                                placeholder="Enter"
                                                name="total_motile"
                                            />
                                        </Form.Item>
                                    </li>
                                    <li className="w_200 w_xs_100">
                                        <Form.Item label="All progressive (a+b)" name="all_progressive(a+b)">
                                            <Input
                                                placeholder="Enter"
                                                name="all_progressive(a+b)"
                                            />
                                        </Form.Item>
                                    </li>
                                    <li className="w_170 w_xs_100">
                                        <Form.Item label="a) Rapid progressive" name="rapid_progressive">
                                            <Input
                                                placeholder="Enter"
                                                name="rapid_progressive"
                                            />
                                        </Form.Item>
                                    </li>
                                    <li className="w_170 w_xs_100">
                                        <Form.Item label="b) Slow progressive" name="slow_progressive">
                                            <Input
                                                placeholder="Enter"
                                                name="slow_progressive"
                                            />
                                        </Form.Item>
                                    </li>
                                    <li className="w_170 w_xs_100">
                                        <Form.Item label="c) Non-progressive" name="non_progressive">
                                            <Input
                                                placeholder="Enter"
                                                name="non_progressive"
                                            />
                                        </Form.Item>
                                    </li>
                                    <li className="w_120 w_xs_100">
                                        <Form.Item label="d) Immotile" name="immotile">
                                            <Input
                                                placeholder="Enter"
                                                name="immotile"
                                            />
                                        </Form.Item>
                                    </li>
                                    <li className="w_270 w_xs_100">
                                        <Form.Item label="Prepared by" name="prepared_by">
                                            <Input
                                                placeholder="Enter Prepared by"
                                                name="prepared_by"
                                            />
                                        </Form.Item>
                                    </li>
                                    <li className="w_270 w_xs_100">
                                        <Form.Item label="Approved by" name="approved_by">
                                            <Input
                                                placeholder="Enter Prepared by"
                                                name="approved_by"
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
                                    <li className="w_320 w_xs_100">
                                        <Form.Item label="Inseminated by" name="inseminated_by">
                                            <Input
                                                placeholder="Enter Inseminated by"
                                                name="inseminated_by"
                                            />
                                        </Form.Item>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div> */}
                        <div className='form_info_wrapper filled'>
                            <h3 className="mb-3">Subsequent Semen Analysis</h3>
                            <div className='row'>
                                <div className='col-xl-9'>
                                    <div className="custom_table_wrap mb-3">
                                        <div className="table-responsive">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Perameter</th>
                                                        <th className="text-center">Preliminary</th>
                                                        <th className="text-center">Post wash</th>
                                                        <th className="text-center">After 24 hrs.</th>
                                                        <th className="text-center">After 48 hrs.</th>
                                                        <th className="text-center">After 72 hrs.</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            Concentration
                                                        </td>
                                                        <td>
                                                            <Form.Item
                                                                className="m-0 text-center"
                                                                name="concentration_prelim"
                                                            >
                                                                <Input
                                                                    placeholder="Enter Concentration"
                                                                    onChange={(e) => {
                                                                        setsstData((prevState) => (
                                                                            { ...prevState, concentration_prelim: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                        <td>
                                                            <Form.Item
                                                                className="m-0 text-center"
                                                                name="concentration_post"
                                                            >
                                                                <Input
                                                                    placeholder="Enter Concentration"
                                                                    onChange={(e) => {
                                                                        setsstData((prevState) => (
                                                                            { ...prevState, concentration_post: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center"
                                                                name="concentration_after_24">
                                                                <Input
                                                                    placeholder="Enter Concentration"
                                                                    onChange={(e) => {
                                                                        setsstData((prevState) => (
                                                                            { ...prevState, concentration_after_24: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center"
                                                                name="concentration_after_48">
                                                                <Input
                                                                    placeholder="Enter Concentration"
                                                                    onChange={(e) => {
                                                                        setsstData((prevState) => (
                                                                            { ...prevState, concentration_after_48: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center"
                                                                name="concentration_after_72">
                                                                <Input
                                                                    placeholder="Enter Concentration"
                                                                    onChange={(e) => {
                                                                        setsstData((prevState) => (
                                                                            { ...prevState, concentration_after_72: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Motility
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center"
                                                                name="motility_prelim">
                                                                <Input
                                                                    placeholder="Enter Motility"
                                                                    onChange={(e) => {
                                                                        setsstData((prevState) => (
                                                                            { ...prevState, motility_prelim: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center"
                                                                name="motility_post">
                                                                <Input
                                                                    placeholder="Enter Motility"
                                                                    onChange={(e) => {
                                                                        setsstData((prevState) => (
                                                                            { ...prevState, motility_post: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center"
                                                                name="motility_after_24">
                                                                <Input
                                                                    placeholder="Enter Motility"
                                                                    onChange={(e) => {
                                                                        setsstData((prevState) => (
                                                                            { ...prevState, motility_after_24: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center" name="motility_after_48">
                                                                <Input
                                                                    placeholder="Enter Motility"
                                                                    onChange={(e) => {
                                                                        setsstData((prevState) => (
                                                                            { ...prevState, motility_after_48: e.target.value }
                                                                        ))
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </td>
                                                        <td>
                                                            <Form.Item className="m-0 text-center" name="motility_after_72">
                                                                <Input
                                                                    placeholder="Enter Motility"
                                                                    onChange={(e) => {
                                                                        setsstData((prevState) => (
                                                                            { ...prevState, motility_after_72: e.target.value }
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
                                </div>
                            </div>
                            <p className='text_primary'><b className='me-2'>Normal Range:</b>After 72 hrs. Concentration should be
                         > 10 Million/ml & Motility should be >
                                50% of preliminary motility</p>
                            <ul className='grid_wrapper'>
                                <li className="w_270 w_xs_100">
                                    <Form.Item
                                        label="Interpretation"
                                        name="interpretation"
                                        className="custom_select"
                                    >
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
                                                setsstData((prevState) => (
                                                    { ...prevState, interpretation: val }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_320 w_xs_100">
                                    <Form.Item label="Examination done by" name="examination_done_by">
                                        <Input
                                            placeholder="Enter Examination Done By"
                                            onChange={(e) => {
                                                setsstData((prevState) => (
                                                    { ...prevState, examination_done_by: e.target.value }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_320 w_xs_100">
                                    <Form.Item label="Notes" name="notes">
                                        <Input
                                            placeholder="Notes"
                                            onChange={(e) => {
                                                setsstData((prevState) => (
                                                    { ...prevState, notes: e.target.value }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='button_group d-flex align-items-center justify-content-center mt-4'>
                        {Object.keys(sstDetails)?.length > 0
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
                            disabled={Object.keys(selectedPatient)?.length === 0}
                            className="btn_print mx-sm-2 mx-1"
                            onClick={printSstData}
                        >
                            Print
                        </Button>
                        <Button className="btn_gray mx-ms-2 mx-1" onClick={handleClear}>
                            Cancel
                        </Button>

                    </div>
                </Form>
            </div>

        </div>
    )
}

export default Sst