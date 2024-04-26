import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, DatePicker, Form, Input, Popconfirm, Select, Spin, TimePicker } from "antd";
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from "react-redux";
import { createSFreezingData, editSFreezingData, getSFreezingData, printSFreezing, setSFreezingDetailsData } from 'redux/reducers/SFreezing/sFreezingData.slice';
import { useLocation } from 'react-router-dom';
import { ageCalculate } from 'utils/CommonFunctions';
import { collectionOptions, completeCollectionOptions, debriesOptions, referringClinicOptions, visualAppearance } from 'utils/FieldValues';
import moment from 'moment';
import dayjs from 'dayjs';
import { clearData, getGlobalSearch } from 'redux/reducers/SearchPanel/globalSearch.slice';
import { getAttendingDrList, setSelectedPatient } from 'redux/reducers/common.slice';

const sFreezinginitialdata = {
    collections: null,
    complete_collection: null,
    rec_no: "",
    date: "",
    refer_clinic: null,
    method_collection: "Masturbation",
    abstinance_period: "",
    collection_time: "",
    assay_time: "",
    ejaculate_volume: "",
    liquification_time: "",
    visual_appeareance: null,
    concentration: "",
    total_motile_count: "",
    concentration_ml: "",
    viscosity: null,
    treatment: null,
    pus_cells_leucocytes: "",
    debries: null,
    normal_forms: "",
    total_motile: "",
    all_progressive: "",
    rapid_progressive: "",
    slow_progressive: "",
    non_progressive: "",
    immotile: "",
    no_of_vials: "",
    id_of_vials: "",
    canister_no: "",
    tank_no: "",
    notes: "",
    done_by: "",
};
const SFreezing = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const location = useLocation();
    const [sFreezingData, setSFreezingData] = useState(sFreezinginitialdata);
    const [doctorList, setDoctorList] = useState([]);

    const { moduleList, userType, selectedLocation } = useSelector(
        ({ role }) => role,
    );
    const { selectedPatient, attendingDrList } = useSelector(
        ({ common }) => common,
    );
    const { sFreezingDetails, sFreezingLoading, sFreezingUpdate } = useSelector(
        ({ sFreezingDataStore }) => sFreezingDataStore,
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
                getSFreezingData({
                    location_id: selectedLocation,
                    patient_reg_id: selectedPatient?._id,
                    module_id: selectedModule?._id,
                })
            );
        }
        return () => {
            clearSFreezing();
        }
    }, [selectedPatient,
        selectedLocation,
    ]);


    useEffect(() => {
        if (Object.keys(sFreezingDetails)?.length > 0) {
            setSFreezingData({
                collections: sFreezingDetails?.collections || null,
                complete_collection: sFreezingDetails?.complete_collection || null,
                rec_no: sFreezingDetails?.rec_no || "",
                date: sFreezingDetails.date
                    ? moment(sFreezingDetails.date).format("YYYY-MM-DD")
                    : null,
                refer_clinic: sFreezingDetails?.refer_clinic || null,
                method_collection: sFreezingDetails?.method_collection || "",
                abstinance_period: sFreezingDetails?.abstinance_period || "",
                assay_time: sFreezingDetails?.assay_time
                    ? dayjs(sFreezingDetails?.assay_time, "HH:mm:ss").format("HH:mm:ss")
                    : null,
                collection_time: sFreezingDetails?.collection_time
                    ? dayjs(sFreezingDetails?.collection_time, "HH:mm:ss").format("HH:mm:ss")
                    : null,
                ejaculate_volume: sFreezingDetails?.ejaculate_volume || "",
                liquification_time: sFreezingDetails?.liquification_time || "",
                visual_appeareance: sFreezingDetails?.visual_appeareance || null,
                concentration: sFreezingDetails?.concentration || "",
                total_motile_count: sFreezingDetails?.total_motile_count || "",
                concentration_ml: sFreezingDetails?.concentration_ml || "",
                viscosity: sFreezingDetails?.viscosity || null,
                treatment: sFreezingDetails?.treatment || null,
                pus_cells_leucocytes: sFreezingDetails?.pus_cells_leucocytes || "",
                debries: sFreezingDetails?.debries || null,
                normal_forms: sFreezingDetails?.normal_forms || "",
                total_motile: sFreezingDetails?.total_motile || "",
                all_progressive: sFreezingDetails?.all_progressive || "",
                rapid_progressive: sFreezingDetails?.rapid_progressive || "",
                slow_progressive: sFreezingDetails?.slow_progressive || "",
                non_progressive: sFreezingDetails?.non_progressive || "",
                immotile: sFreezingDetails?.immotile || "",
                no_of_vials: sFreezingDetails?.no_of_vials || "",
                id_of_vials: sFreezingDetails?.id_of_vials || "",
                canister_no: sFreezingDetails?.canister_no || "",
                tank_no: sFreezingDetails?.tank_no || "",
                notes: sFreezingDetails?.notes || "",
                done_by: sFreezingDetails?.done_by || "",
            });
            form.setFieldsValue({
                collections: sFreezingDetails?.collections || null,
                complete_collection: sFreezingDetails?.complete_collection || null,
                rec_no: sFreezingDetails?.rec_no || "",
                date: sFreezingDetails.date
                    ? dayjs(
                        moment(sFreezingDetails.date).format(
                            "DD/MM/YYYY"
                        ),
                        "DD/MM/YYYY"
                    )
                    : null,
                refer_clinic: sFreezingDetails?.refer_clinic || null,
                method_collection: sFreezingDetails?.method_collection || "",
                abstinance_period: sFreezingDetails?.abstinance_period || "",
                assay_time: sFreezingDetails?.assay_time
                    ? dayjs(sFreezingDetails?.assay_time, "HH:mm:ss")
                    : null,
                collection_time: sFreezingDetails?.collection_time
                    ? dayjs(sFreezingDetails?.collection_time, "HH:mm:ss")
                    : null,
                ejaculate_volume: sFreezingDetails?.ejaculate_volume || "",
                liquification_time: sFreezingDetails?.liquification_time || "",
                visual_appeareance: sFreezingDetails?.visual_appeareance || null,
                concentration: sFreezingDetails?.concentration || "",
                total_motile_count: sFreezingDetails?.total_motile_count || "",
                concentration_ml: sFreezingDetails?.concentration_ml || "",
                viscosity: sFreezingDetails?.viscosity || null,
                treatment: sFreezingDetails?.treatment || null,
                pus_cells_leucocytes: sFreezingDetails?.pus_cells_leucocytes || "",
                debries: sFreezingDetails?.debries || null,
                normal_forms: sFreezingDetails?.normal_forms || "",
                total_motile: sFreezingDetails?.total_motile || "",
                all_progressive: sFreezingDetails?.all_progressive || "",
                rapid_progressive: sFreezingDetails?.rapid_progressive || "",
                slow_progressive: sFreezingDetails?.slow_progressive || "",
                non_progressive: sFreezingDetails?.non_progressive || "",
                immotile: sFreezingDetails?.immotile || "",
                no_of_vials: sFreezingDetails?.no_of_vials || "",
                id_of_vials: sFreezingDetails?.id_of_vials || "",
                canister_no: sFreezingDetails?.canister_no || "",
                tank_no: sFreezingDetails?.tank_no || "",
                notes: sFreezingDetails?.notes || "",
                done_by: sFreezingDetails?.done_by || "",
            });
        }
    }, [sFreezingDetails, form])


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

    const createSFreezingDataFunc = useCallback(
        async (obj) => {
            const { payload } = await
                dispatch(
                    createSFreezingData({
                        locationId: selectedLocation,
                        id: selectedPatient?._id,
                        moduleId: selectedModule._id,
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
                Object.keys(selectedPatient)?.length > 0 &&
                Object.keys(selectedModule)?.length > 0) {
                if (Object.keys(sFreezingDetails)?.length > 0) {
                    dispatch(
                        editSFreezingData({
                            location_id: selectedLocation,
                            _id: sFreezingDetails?._id,
                            module_id: selectedModule._id,
                            payload: sFreezingData,
                        }),
                    );
                } else {
                    createSFreezingDataFunc(
                        sFreezingData
                    )
                }
            }
        },
        [dispatch, sFreezingData],
    );

    const clearSFreezing = useCallback(() => {
        setSFreezingData(sFreezinginitialdata);
        dispatch(setSFreezingDetailsData({}));
        form.resetFields();
    }, [form, dispatch]);


    const handleClear = () => {
        clearSFreezing();
        dispatch(setSelectedPatient({}));
        dispatch(clearData());
    };


    const printSFreezingData = useCallback(async () => {
        Object.keys(selectedPatient)?.length > 0 &&
            dispatch(
                printSFreezing({
                    module_id: selectedModule?._id,
                    patient_reg_id: selectedPatient?._id,
                    location_id: selectedLocation
                })
            );
    }, [dispatch, selectedModule, selectedPatient, selectedLocation]);

    const handleRepeatTest = useCallback(
        () => {
            setSFreezingData(sFreezinginitialdata);
            dispatch(setSFreezingDetailsData({}));
            form.setFieldsValue(sFreezinginitialdata);
        },
        [form, dispatch],
    )


    return (
        <div className='page_main_content'>
            <div className='page_inner_content'>
                {sFreezingLoading && (
                    <Spin tip="Loading" size="large">
                        <div className="content" />
                    </Spin>
                )}
                <div className='text-end repeat_test_bt'>
                    <Button
                        className="btn_primary"
                        htmlType="submit"
                        onClick={handleRepeatTest}
                    >
                        <PlusOutlined className="me-2" />
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
                                                setSFreezingData((prevState) => (
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
                                                setSFreezingData((prevState) => (
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
                                                setSFreezingData((prevState) => (
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
                                                setSFreezingData((prevState) => (
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
                                                setSFreezingData((prevState) => (
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
                                                setSFreezingData((prevState) => (
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
                                                setSFreezingData((prevState) => (
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
                                                setSFreezingData((prevState) => (
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
                            <h3 className="mb-3">Semen Analysis</h3>
                            <ul className='grid_wrapper'>
                                <li className="w_220 w_xs_100">
                                    <div>
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
                                                placeholder="Enter Ejaculate volume"
                                                onChange={(e) => {
                                                    setSFreezingData((prevState) => (
                                                        { ...prevState, ejaculate_volume: e.target.value }
                                                    ))
                                                }}
                                            />
                                            <span className='ms-1'>ml</span>
                                        </Form.Item>
                                    </div>
                                </li>
                                <li className="w_220 w_xs_100">
                                    <Form.Item label="Liquification Time" className='input_with_text' name="liquification_time" tooltip={{
                                        title: 'normal - within 60 mins',
                                        placement: "bottom",
                                        icon: <InfoCircleOutlined />,

                                    }}
                                    >
                                        <Input
                                            placeholder="Enter Liquification Time"
                                            value={sFreezingData?.liquification_time}
                                            onChange={(e) => {
                                                setSFreezingData((prevState) => (
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
                                                setSFreezingData((prevState) => (
                                                    { ...prevState, visual_appeareance: val }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_250 w_xs_100">
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
                                            value={sFreezingData?.concentration}
                                            onChange={(e) => {
                                                setSFreezingData((prevState) => (
                                                    { ...prevState, concentration: e.target.value }
                                                ))
                                            }}
                                        />
                                        <span className='ms-1'>Million/ml</span>
                                    </Form.Item>
                                </li>
                                <li className="w_300 w_xs_100">
                                    <Form.Item label="Total Motile Count"
                                        className='input_with_text'
                                        name="total_motile_count"
                                        tooltip={{
                                            title: 'normal > 39 Million/ejaculate',
                                            placement: "bottom",
                                            icon: <InfoCircleOutlined />,

                                        }}
                                    >
                                        <Input
                                            placeholder="Enter Total Motile Count"
                                            value={sFreezingData?.total_motile_count}
                                            onChange={(e) => {
                                                setSFreezingData((prevState) => (
                                                    { ...prevState, total_motile_count: e.target.value }
                                                ))
                                            }}
                                        />
                                        <span className='ms-1'>Million/ejaculate</span>
                                    </Form.Item>
                                </li>
                                <li className="w_320 w_xs_100">
                                    <Form.Item label="Concentration (if less than Million/ml)"
                                        name="concentration_ml">
                                        <Input
                                            placeholder="Enter Concentration"
                                            onChange={(e) => {
                                                setSFreezingData((prevState) => (
                                                    { ...prevState, concentration_ml: e.target.value }
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
                                                setSFreezingData((prevState) => (
                                                    { ...prevState, viscosity: val }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_100">
                                    <Form.Item
                                        label="Treatment"
                                        name="treatment"
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
                                                setSFreezingData((prevState) => (
                                                    { ...prevState, treatment: val }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_250 w_xs_100">
                                    <Form.Item label="Pus cells/Leucocytes" className='input_with_text' name="pus_cells_leucocytes" tooltip={{
                                        title: '8-10/hpf',
                                        placement: "bottom",
                                        icon: <InfoCircleOutlined />,

                                    }}
                                    >
                                        <Input
                                            placeholder="Enter Pus cells/Leucocytes"
                                            value={sFreezingData?.pus_cells_leucocytes}
                                            onChange={(e) => {
                                                setSFreezingData((prevState) => (
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
                                                setSFreezingData((prevState) => (
                                                    { ...prevState, debries: val }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_220 w_xs_100">
                                    <Form.Item
                                        label="Normal forms"
                                        name="normal_forms"
                                        tooltip={{
                                            title: 'normal > 4%',
                                            placement: "bottom",
                                            icon: <InfoCircleOutlined />,

                                        }}
                                    >
                                        <Input
                                            placeholder="Enter Normal forms"
                                            onChange={(e) => {
                                                setSFreezingData((prevState) => (
                                                    { ...prevState, normal_forms: e.target.value }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className='w-100'>
                                    <ul className='grid_wrapper'>
                                        <li className="w_220 w_xs_100">
                                            <Form.Item label="Total motile (a+b+c)"
                                                name="total_motile"
                                                tooltip={{
                                                    title: 'normal > 42%',
                                                    placement: "bottom",
                                                    icon: <InfoCircleOutlined />,

                                                }}
                                            >
                                                <Input
                                                    placeholder="Enter Total motile"
                                                    onChange={(e) => {
                                                        setSFreezingData((prevState) => (
                                                            { ...prevState, total_motile: e.target.value }
                                                        ))
                                                    }}
                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_250 w_xs_100">
                                            <Form.Item label="All progressive (a+b)" name="all_progressive" tooltip={{
                                                title: 'normal > 30%',
                                                placement: "bottom",
                                                icon: <InfoCircleOutlined />,

                                            }}
                                            >
                                                <Input
                                                    placeholder="Enter All progressive "
                                                    onChange={(e) => {
                                                        setSFreezingData((prevState) => (
                                                            { ...prevState, all_progressive: e.target.value }
                                                        ))
                                                    }}
                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_170 w_xs_100">
                                            <Form.Item label="a) Rapid progressive" name="rapid_progressive">
                                                <Input
                                                    placeholder="Enter Rapid progressive"
                                                    onChange={(e) => {
                                                        setSFreezingData((prevState) => (
                                                            { ...prevState, rapid_progressive: e.target.value }
                                                        ))
                                                    }}
                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_170 w_xs_100">
                                            <Form.Item label="b) Slow progressive" name="slow_progressive">
                                                <Input
                                                    placeholder="Enter Slow progressive"
                                                    onChange={(e) => {
                                                        setSFreezingData((prevState) => (
                                                            { ...prevState, slow_progressive: e.target.value }
                                                        ))
                                                    }}
                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_170 w_xs_100">
                                            <Form.Item label="c) Non-progressive" name="non_progressive">
                                                <Input
                                                    placeholder="Enter Non-progressive"
                                                    onChange={(e) => {
                                                        setSFreezingData((prevState) => (
                                                            { ...prevState, non_progressive: e.target.value }
                                                        ))
                                                    }}
                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_120 w_xs_100">
                                            <Form.Item label="d) Immotile" name="immotile">
                                                <Input
                                                    placeholder="Enter Immotile"
                                                    onChange={(e) => {
                                                        setSFreezingData((prevState) => (
                                                            { ...prevState, immotile: e.target.value }
                                                        ))
                                                    }}
                                                />
                                            </Form.Item>
                                        </li>
                                    </ul>
                                </li>
                                <li className='w-100'>
                                    <div className='light_box_wrap mb-3'>
                                        <div className='light_box'>
                                            <h4 className='text-decoration-underline'>Storage Details</h4>
                                            <ul className='grid_wrapper'>
                                                <li className="w_170 w_xs_100">
                                                    <Form.Item label="No. of vials" name="no_of_vials">
                                                        <Input
                                                            placeholder="Enter No. of vials"
                                                            onChange={(e) => {
                                                                setSFreezingData((prevState) => (
                                                                    { ...prevState, no_of_vials: e.target.value }
                                                                ))
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </li>
                                                <li className="w_170 w_xs_100">
                                                    <Form.Item label="ID of vials" name="id_of_vials">
                                                        <Input
                                                            placeholder="Enter ID of vials"
                                                            onChange={(e) => {
                                                                setSFreezingData((prevState) => (
                                                                    { ...prevState, id_of_vials: e.target.value }
                                                                ))
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </li>
                                                <li className="w_170 w_xs_100">
                                                    <Form.Item label="Tank No." name="tank_no">
                                                        <Input
                                                            placeholder="Enter Tank No."
                                                            onChange={(e) => {
                                                                setSFreezingData((prevState) => (
                                                                    { ...prevState, tank_no: e.target.value }
                                                                ))
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </li>
                                                <li className="w_170 w_xs_100">
                                                    <Form.Item label="Canister No." name="canister_no">
                                                        <Input
                                                            placeholder="Enter Canister No."
                                                            onChange={(e) => {
                                                                setSFreezingData((prevState) => (
                                                                    { ...prevState, canister_no: e.target.value }
                                                                ))
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </li>
                                                <li className="w_170 w_xs_100">
                                                    <Form.Item label="Notes" name="notes">
                                                        <Input
                                                            placeholder="Enter Notes"
                                                            onChange={(e) => {
                                                                setSFreezingData((prevState) => (
                                                                    { ...prevState, notes: e.target.value }
                                                                ))
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </li>
                                                <li className="w_250 w_xs_100">
                                                    <Form.Item label="Done By" name="done_by">
                                                        <Input
                                                            placeholder="Enter Done By"
                                                            onChange={(e) => {
                                                                setSFreezingData((prevState) => (
                                                                    { ...prevState, done_by: e.target.value }
                                                                ))
                                                            }}
                                                        />
                                                    </Form.Item>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='button_group d-flex align-items-center justify-content-center mt-4'>
                        {Object.keys(sFreezingDetails)?.length > 0
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
                            onClick={printSFreezingData}
                        >
                            Print
                        </Button>
                        <Button
                            className="btn_gray mx-sm-2 mx-1"
                            onClick={handleClear}>
                            Cancel
                        </Button>

                    </div>
                </Form>
            </div>
        </div>
    )
}

export default SFreezing