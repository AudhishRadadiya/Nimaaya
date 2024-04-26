import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, DatePicker, Form, Input, Select, Spin, TimePicker } from "antd";
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from "react-redux";
import { ageCalculate } from 'utils/CommonFunctions';
import { collectionOptions, completeCollectionOptions, debriesOptions, fructoseOptions, interpretationOptions, referringClinicOptions, visualAppearance } from 'utils/FieldValues';
import moment from 'moment';
import dayjs from 'dayjs';
import { createSemenAnalysisData, editSemenAnalysisData, getSemenAnalysisData, printSemenAnalysisData, setSemenAnalysisDetails, setSemenAnalysisUpdate } from 'redux/reducers/SemenAnalysis/semenAnalysisData.slice';
import { useLocation } from 'react-router-dom';
import { clearData, getGlobalSearch } from 'redux/reducers/SearchPanel/globalSearch.slice';
import { getAttendingDrList, setSelectedPatient } from 'redux/reducers/common.slice';

const semenAnalysisinitialdata = {
    patient_reg_id: "",
    collections: null,
    complete_collection: null,
    rec_no: "",
    date: null,
    refer_clinic: null,
    method_collection: "Masturbation",
    abstinance_period: "",
    collection_time: null,
    assay_time: null,
    ejaculate_volume: "",
    liquification_time: "",
    ph: "",
    visual_appeareance: null,
    viscosoty: "",
    treatment: null,
    fructose: null,
    concentration: "",
    concentration_ml: "",
    total_motile_count: "",
    pus_cells_leucocytes: "",
    debries: null,
    total_motile: "",
    all_progressive: "",
    rapid_progressive: "",
    slow_progressive: "",
    non_progressive: "",
    immotile: "",
    hos_test: "",
    vitality: "",
    normal_forms: "",
    abnormal_heads: "",
    abnormal_midpieces: "",
    abnormal_tails: "",
    excess_residual_cytoplasm: "",
    teratozoospermia_index: "",
    agglutination: null,
    aggregations: null,
    interpretations: null,
    notes: "",
    examination_done_by: ""
};


const SemenAnalysis = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const location = useLocation();
    const [semenAnalysisData, setSemenAnalysisData] = useState(semenAnalysisinitialdata);
    const [doctorList, setDoctorList] = useState([]);
    const { moduleList, userType, selectedLocation } = useSelector(
        ({ role }) => role,
    );
    const { selectedPatient, attendingDrList } = useSelector(
        ({ common }) => common,
    );
    const { semenAnalysisDetails, semenAnalysisLoading, semenAnalysisUpdate } = useSelector(
        ({ semenAnalysisDataStore }) => semenAnalysisDataStore,
    );
    const selectedModule = useMemo(() => {
        return (
            moduleList?.find((item) => item?.module_name === location?.pathname) || {}
        );
    }, [moduleList, location?.pathname]);

    const clearSemenAnalysis = useCallback(() => {
        setSemenAnalysisData(semenAnalysisinitialdata);
        dispatch(setSemenAnalysisDetails({}));
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
            Object.keys(selectedPatient).length > 0 &&
            Object.keys(selectedModule).length > 0 &&
            Object.keys(semenAnalysisDetails).length === 0
        ) {
            dispatch(
                getSemenAnalysisData({
                    location_id: selectedLocation,
                    patient_reg_id: selectedPatient?._id,
                    module_id: selectedModule?._id,
                })
            );
        }
        return () => {
            clearSemenAnalysis();
        }
    }, [selectedPatient,
        selectedLocation,
    ]);





    useEffect(() => {
        if (Object.keys(semenAnalysisDetails)?.length > 0) {
            setSemenAnalysisData({
                ...semenAnalysisDetails,
                date: semenAnalysisDetails.date
                    ? moment(semenAnalysisDetails.date).format("YYYY-MM-DD")
                    : null,
                ssay_time: semenAnalysisDetails?.assay_time
                    ? dayjs(semenAnalysisDetails?.assay_time, "HH:mm:ss").format("HH:mm:ss")
                    : null,
                collection_time: semenAnalysisDetails?.collection_time
                    ? dayjs(semenAnalysisDetails?.collection_time, "HH:mm:ss").format("HH:mm:ss")
                    : null,
            });
            form.setFieldsValue({
                ...semenAnalysisDetails,
                date: semenAnalysisDetails.date
                    ? dayjs(
                        moment(semenAnalysisDetails.date).format(
                            "DD/MM/YYYY"
                        ),
                        "DD/MM/YYYY"
                    )
                    : null,
                assay_time: semenAnalysisDetails?.assay_time
                    ? dayjs(semenAnalysisDetails?.assay_time, "HH:mm:ss")
                    : null,
                collection_time: semenAnalysisDetails?.collection_time
                    ? dayjs(semenAnalysisDetails?.collection_time, "HH:mm:ss")
                    : null,
            });
        }
    }, [semenAnalysisDetails, form])


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


    const createSemenAnalysisDataFunc = useCallback(
        async (obj) => {
            const { payload } = await
                dispatch(
                    createSemenAnalysisData({
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


    const onFinishFailed = errorInfo => {
        const firstErrorField = document.querySelector('.ant-form-item-has-error');
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth' });
        }
    };



    const onFinish = useCallback(
        async values => {
            if (selectedLocation &&
                Object.keys(selectedPatient).length > 0 &&
                Object.keys(selectedModule).length > 0) {
                if (Object.keys(semenAnalysisDetails).length > 0) {
                    dispatch(
                        editSemenAnalysisData({
                            locationId: selectedLocation,
                            id: semenAnalysisDetails?._id,
                            moduleId: selectedModule._id,
                            payload: { ...semenAnalysisData, patient_reg_id: selectedPatient?._id },
                        }),
                    );
                } else {
                    createSemenAnalysisDataFunc({ ...semenAnalysisData, patient_reg_id: selectedPatient?._id })
                }
            }
        },
        [dispatch, semenAnalysisData],
    );


    const handleRepeatTest = useCallback(
        () => {
            dispatch(setSemenAnalysisDetails({}));
            setSemenAnalysisData(semenAnalysisinitialdata);
            form.setFieldsValue(semenAnalysisinitialdata);
        },
        [form, dispatch],
    )

    const handleClear = () => {
        clearSemenAnalysis();
        dispatch(setSelectedPatient({}));
        dispatch(clearData());
    };
    const handleprintSemenAnalysisData = useCallback(async () => {
        Object.keys(selectedPatient)?.length > 0 &&
            dispatch(
                printSemenAnalysisData({
                    module_id: selectedModule?._id,
                    patient_reg_id: selectedPatient?._id,
                    location_id: selectedLocation
                })
            );
    }, [dispatch, selectedModule, selectedPatient, selectedLocation]);
    return (
        <div className='page_main_content'>
            <div className='page_inner_content'>
                {semenAnalysisLoading && (
                    <Spin tip="Loading" size="large">
                        <div className="content" />
                    </Spin>
                )}
                <div className='text-end'>
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
                                    <Form.Item label="Male Partner" name="male_partner" >
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
                                            placeholder="Enter Pt. ID"
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
                                                setSemenAnalysisData((prevState) => (
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
                                                setSemenAnalysisData((prevState) => (
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
                                                setSemenAnalysisData((prevState) => (
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
                                                setSemenAnalysisData((prevState) => (
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
                                        label="Referring clinic/clinician"
                                        className="custom_select"
                                        name="refer_clinic">
                                        {/* <Input
                                            placeholder="Enter Referring"
                                            onChange={(e) => {
                                                setSemenAnalysisData((prevState) => (
                                                    { ...prevState, refer_clinic: e.target.value }
                                                ))
                                            }}
                                        /> */}
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
                                                setSemenAnalysisData((prevState) => (
                                                    { ...prevState, refer_clinic: val }
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
                                <li className="w_170 w_xs_100">
                                    <Form.Item label="Abstinance Period" name="abstinance_period">
                                        <Input
                                            placeholder="Enter Abstinance Period"
                                            onChange={(e) => {
                                                setSemenAnalysisData((prevState) => (
                                                    { ...prevState, abstinance_period: e.target.value }
                                                ))
                                            }}


                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_100">
                                    <Form.Item label="Collection time(CT)" name="collection_time">
                                        <TimePicker
                                            format="h:mm a"
                                            onChange={(value) => {
                                                setSemenAnalysisData((prevState) => (
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
                                <li className="w_170 w_xs_100">
                                    <Form.Item label="Assay time (AT)" name="assay_time">
                                        <TimePicker
                                            name="assay_time"
                                            format="h:mm a"
                                            onChange={(value) => {
                                                setSemenAnalysisData((prevState) => (
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
                            <h3 className="mb-3">Ejaculate – Macroscopic examination</h3>
                            <ul className='grid_wrapper'>
                                <li className="w_190 w_xs_100">
                                    <Form.Item
                                        label="Ejaculate volume"
                                        className='input_with_text'
                                        name="ejaculate_volume"
                                        tooltip={{
                                            title: 'normal > 1.4 ml',
                                            placement: "bottom",
                                            icon: <InfoCircleOutlined />,

                                        }}
                                    >
                                        <Input
                                            value={semenAnalysisData?.ejaculate_volume}
                                            placeholder="Enter Ejaculate volume"
                                            onChange={(e) => {
                                                setSemenAnalysisData((prevState) => (
                                                    { ...prevState, ejaculate_volume: e.target.value }
                                                ))
                                            }}

                                        />
                                        <span className='ms-1'>ml</span>
                                    </Form.Item>
                                </li>
                                <li className="w_190 w_xs_100">
                                    <Form.Item label="Liquification Time"
                                        className='input_with_text'
                                        name="liquification_time"
                                        tooltip={{
                                            title: 'normal - within 60 mins',
                                            placement: "bottom",
                                            icon: <InfoCircleOutlined />,

                                        }}
                                    >
                                        <Input
                                            value={semenAnalysisData?.liquification_time}
                                            name="liquification_time"
                                            placeholder="Enter Liquification Time"
                                            onChange={(e) => {
                                                setSemenAnalysisData((prevState) => (
                                                    { ...prevState, liquification_time: e.target.value }
                                                ))
                                            }}

                                        />
                                        <span className='ms-1'>min</span>
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_100">
                                    <Form.Item label="PH" name="ph"
                                        value={semenAnalysisData?.ph}
                                        tooltip={{
                                            title: 'normal - 7.2 to 8.0 (alkaline)',
                                            placement: "bottom",
                                            icon: <InfoCircleOutlined />,


                                        }}
                                    >
                                        <Input
                                            placeholder="Enter PH"
                                            onChange={(e) => {
                                                setSemenAnalysisData((prevState) => (
                                                    { ...prevState, ph: e.target.value }
                                                ))
                                            }}

                                        />
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
                                                setSemenAnalysisData((prevState) => (
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
                                                setSemenAnalysisData((prevState) => (
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
                                                setSemenAnalysisData((prevState) => (
                                                    {
                                                        ...prevState,
                                                        treatment
                                                            : val
                                                    }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                                <li className="w_170 w_xs_100">
                                    <Form.Item
                                        label="Fructose"
                                        name="fructose"
                                        className="custom_select"
                                    >
                                        <Select
                                            allowClear={true}
                                            placeholder="Select"
                                            options={fructoseOptions}
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
                                                setSemenAnalysisData((prevState) => (
                                                    { ...prevState, fructose: val }
                                                ))
                                            }}
                                        />
                                    </Form.Item>
                                </li>
                            </ul>
                        </div>
                        <div className='form_info_wrapper filled'>
                            <h3 className="mb-3">Ejaculate – Macroscopic examination</h3>
                            <div className='light_box_wrap mb-3'>
                                <div className='light_box'>
                                    <h4 className='text-decoration-underline'>Count</h4>
                                    <ul className='grid_wrapper'>
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
                                                    value={semenAnalysisData?.concentration}
                                                    placeholder="Enter Concentration"
                                                    onChange={(e) => {
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, concentration: e.target.value }
                                                        ))
                                                    }}

                                                />
                                                <span className='ms-1'>Million/ml</span>
                                            </Form.Item>
                                        </li>
                                        <li className="w_320 w_xs_100">
                                            <Form.Item label="Concentration (if less than Million/ml)"
                                                name="concentration_ml">
                                                <Input
                                                    placeholder="Enter Concentration"
                                                    onChange={(e) => {
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, concentration_ml: e.target.value }
                                                        ))
                                                    }}

                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_280 w_xs_100">
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
                                                    value={semenAnalysisData?.total_motile_count}
                                                    onChange={(e) => {
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, total_motile_count: e.target.value }
                                                        ))
                                                    }}

                                                />
                                                <span className='ms-1'>Million/ejaculate</span>
                                            </Form.Item>
                                        </li>
                                    </ul>
                                </div>
                                <div className='light_box'>
                                    <h4 className='text-decoration-underline'>Other then sperm cells</h4>
                                    <ul className='grid_wrapper'>
                                        <li className="w_250 w_xs_100">
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
                                                    value={semenAnalysisData?.pus_cells_leucocytes}
                                                    placeholder="Enter Pus cells/Leucocytes"
                                                    onChange={(e) => {
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, pus_cells_leucocytes: e.target.value }
                                                        ))
                                                    }}

                                                />
                                                <span className='ms-1'>/hpf</span>
                                            </Form.Item>
                                        </li>
                                        <li className="w_180 w_xs_100">
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
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, debries: val }
                                                        ))
                                                    }}
                                                />
                                            </Form.Item>
                                        </li>
                                    </ul>
                                </div>
                                <div className='light_box'>
                                    <h4 className='text-decoration-underline'>Motility</h4>
                                    <ul className='grid_wrapper'>
                                        <li className="w_250 w_xs_100">
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
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, total_motile: e.target.value }
                                                        ))
                                                    }}

                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_250 w_xs_100">
                                            <Form.Item label="All progressive (a+b)"
                                                name="all_progressive"
                                                tooltip={{
                                                    title: 'normal > 30%',
                                                    placement: "bottom",
                                                    icon: <InfoCircleOutlined />,


                                                }}
                                            >
                                                <Input
                                                    placeholder="Enter All progressive"
                                                    onChange={(e) => {
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, all_progressive: e.target.value }
                                                        ))
                                                    }}

                                                />
                                            </Form.Item>
                                        </li>
                                    </ul>
                                </div>
                                <div className='light_box'>
                                    <h4 className='text-decoration-underline'>Motility progression</h4>
                                    <ul className='grid_wrapper'>
                                        <li className="w_150 w_xs_100">
                                            <Form.Item
                                                label="a) Rapid progressive"
                                                name="rapid_progressive">
                                                <Input
                                                    placeholder="Enter Rapid progressive"
                                                    name="rapid_progressive"
                                                    onChange={(e) => {
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, rapid_progressive: e.target.value }
                                                        ))
                                                    }}

                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_150 w_xs_100">
                                            <Form.Item
                                                label="b) Slow progressive"
                                                name="slow_progressive">
                                                <Input
                                                    placeholder="Enter Slow progressive"
                                                    onChange={(e) => {
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, slow_progressive: e.target.value }
                                                        ))
                                                    }}

                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_170 w_xs_100">
                                            <Form.Item
                                                label="c) Non-progressive"
                                                name="non_progressive">
                                                <Input
                                                    placeholder="Enter Non-progressive"
                                                    onChange={(e) => {
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, non_progressive: e.target.value }
                                                        ))
                                                    }}

                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_120 w_xs_100">
                                            <Form.Item
                                                label="d) Immotile"
                                                name="immotile">
                                                <Input
                                                    placeholder="Enter Immotile"
                                                    onChange={(e) => {
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, immotile: e.target.value }
                                                        ))
                                                    }}

                                                />
                                            </Form.Item>
                                        </li>
                                    </ul>
                                </div>
                                <ul className='grid_wrapper align-items-end'>
                                    <li className="w_120 w_xs_100">
                                        <Form.Item label="HOS test"
                                            name="hos_test"
                                            tooltip={{
                                                title: 'normal > 58%',
                                                placement: "bottom",
                                                icon: <InfoCircleOutlined />
                                            }}>
                                            <Input
                                                placeholder="Enter HOS test"
                                                onChange={(e) => {
                                                    setSemenAnalysisData((prevState) => (
                                                        { ...prevState, hos_test: e.target.value }
                                                    ))
                                                }}

                                            />
                                        </Form.Item>
                                    </li>
                                    <li className="w_120 w_xs_100">
                                        <Form.Item label="Vitality" name="vitality" tooltip={{
                                            title: 'normal > 58%',
                                            placement: "bottom",
                                            icon: <InfoCircleOutlined />
                                        }}>
                                            <Input
                                                placeholder="Enter Vitality"
                                                onChange={(e) => {
                                                    setSemenAnalysisData((prevState) => (
                                                        { ...prevState, vitality: e.target.value }
                                                    ))
                                                }}

                                            />
                                        </Form.Item>
                                    </li>
                                </ul>
                            </div>
                            <div className='light_box_wrap mb-3'>
                                <div className='light_box'>
                                    <h4 className='text-decoration-underline'>Morphology</h4>
                                    <ul className='grid_wrapper'>
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
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, normal_forms: e.target.value }
                                                        ))
                                                    }}

                                                />
                                            </Form.Item>
                                        </li>
                                    </ul>
                                </div>
                                <div className='light_box'>
                                    <h4 className='text-decoration-underline'>Abnormality</h4>
                                    <ul className='grid_wrapper'>
                                        <li className="w_140 w_xs_100">
                                            <Form.Item label="Abnormal heads" name="abnormal_heads">
                                                <Input
                                                    placeholder="Enter Abnormal heads"
                                                    onChange={(e) => {
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, abnormal_heads: e.target.value }
                                                        ))
                                                    }}

                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_170 w_xs_100">
                                            <Form.Item
                                                label="Abnormal midpieces"
                                                name="abnormal_midpieces">
                                                <Input
                                                    placeholder="Enter Abnormal midpieces"
                                                    onChange={(e) => {
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, abnormal_midpieces: e.target.value }
                                                        ))
                                                    }}

                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_140 w_xs_100">
                                            <Form.Item
                                                label="Abnormal tails"
                                                name="abnormal_tails">
                                                <Input
                                                    placeholder="Enter Abnormal tails"
                                                    onChange={(e) => {
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, abnormal_tails: e.target.value }
                                                        ))
                                                    }}

                                                />
                                            </Form.Item>
                                        </li>
                                        <li className="w_240 w_xs_100">
                                            <Form.Item label="Excess residual cytoplasm"
                                                name="excess_residual_cytoplasm">
                                                <Input
                                                    placeholder="Enter Excess residual cytoplasm"
                                                    onChange={(e) => {
                                                        setSemenAnalysisData((prevState) => (
                                                            { ...prevState, excess_residual_cytoplasm: e.target.value }
                                                        ))
                                                    }}

                                                />
                                            </Form.Item>
                                        </li>
                                    </ul>
                                </div>
                                <ul className='grid_wrapper align-items-end'>
                                    <li className="w_240 w_xs_100">
                                        <Form.Item label="Teratozoospermia index"
                                            name="teratozoospermia_index"
                                            tooltip={{
                                                title: '(1.00-4.00)',
                                                placement: "bottom",
                                                icon: <InfoCircleOutlined />
                                            }}>
                                            <Input
                                                placeholder="Enter Teratozoospermia"
                                                onChange={(e) => {
                                                    setSemenAnalysisData((prevState) => (
                                                        { ...prevState, teratozoospermia_index: e.target.value }
                                                    ))
                                                }}

                                            />
                                        </Form.Item>
                                    </li>
                                    <li className="w_170 w_xs_100">
                                        <Form.Item
                                            label="Agglutination"
                                            name="agglutination"
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
                                                    setSemenAnalysisData((prevState) => (
                                                        { ...prevState, agglutination: val }
                                                    ))
                                                }}
                                            />
                                        </Form.Item>
                                    </li>
                                    <li className="w_170 w_xs_100">
                                        <Form.Item
                                            label="Aggregations"
                                            name="aggregations"
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
                                                    setSemenAnalysisData((prevState) => (
                                                        { ...prevState, aggregations: val }
                                                    ))
                                                }}
                                            />
                                        </Form.Item>
                                    </li>
                                </ul>
                            </div>
                            <ul className='grid_wrapper'>
                                <li className="w_320 w_xs_100">
                                    <Form.Item
                                        label="Interpretation"
                                        name="interpretations"
                                        className="custom_select"
                                    >
                                        <Select
                                            allowClear={true}
                                            placeholder="Select"
                                            options={interpretationOptions}
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
                                                setSemenAnalysisData((prevState) => (
                                                    { ...prevState, interpretations: val }
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
                                                setSemenAnalysisData((prevState) => (
                                                    { ...prevState, notes: e.target.value }
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
                                                setSemenAnalysisData((prevState) => (
                                                    { ...prevState, examination_done_by: e.target.value }
                                                ))
                                            }}

                                        />
                                    </Form.Item>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='button_group d-flex align-items-center justify-content-center mt-4'>
                        {Object.keys(semenAnalysisDetails)?.length > 0
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
                            onClick={handleprintSemenAnalysisData}
                        >
                            Print
                        </Button>
                        <Button
                            className="btn_gray  mx-sm-2 mx-1"
                            onClick={handleClear}
                        >
                            Cancel
                        </Button>

                    </div>
                </Form>
            </div>

        </div >
    )
}

export default SemenAnalysis