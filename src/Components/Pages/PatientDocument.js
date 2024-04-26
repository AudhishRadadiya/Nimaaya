import { Button, Form, Input, Pagination, Spin, Table, Upload } from "antd";
import { Col, Row } from "react-bootstrap";
import uploadIcon from "../../Img/upload.svg";
import EditIcon from "../../Img/edit.svg";
import { toast } from "react-toastify";
import TranshIcon from "../../Img/trash.svg";
import { useCallback, useEffect, useMemo, useState } from "react";
import CancelIcon from "../../Img/cancel.svg";
import pinIocn from "../../Img/pin.svg";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "redux/reducers/UploadImage/uploadImage.slice";
import { useLocation } from "react-router-dom";
import {
  addDocuments,
  deleteDocumentsList,
  getDocumentsList,
  setDocumentList,
  setTotalDocuments,
  steIsDocumentCreated,
  updateDocuments,
} from "redux/reducers/AddDocument/addDocument.slice";
import { Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
const allowedFileTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
const patientInfoDetails = {
  url: "",
  title: "",
  file: [],
};

const PatientDocument = () => {
  const { moduleList, userType, selectedLocation } = useSelector(
    ({ role }) => role
  );
  const { selectedPatient } = useSelector(({ common }) => common);
  const { isAddDocumentsLoading, documentList, totalDocuments, pageSize } =
    useSelector(({ addDocument }) => addDocument);
  const [form] = Form.useForm();
  const location = useLocation();
  const dispatch = useDispatch();
  const [startPage, setStartPage] = useState(1);
  const { getUploadImage, isUploadImageUpdated } = useSelector(
    ({ uploadImage }) => uploadImage
  );
  const selectedModule = useMemo(() => {
    return (
      moduleList?.find((item) => item?.module_name === location.pathname) || {}
    );
  }, [moduleList]);

  const [patientInfo, setPatientInfo] = useState(patientInfoDetails);

  const getdata = useCallback(
    (value) => {
      if (selectedLocation && selectedPatient?._id && selectedModule?._id) {
        value && setStartPage(value);
        dispatch(
          getDocumentsList({
            locationId: selectedLocation,
            patientRegId: selectedPatient?._id,
            moduleId: selectedModule?._id,
            start: value ? value : startPage,
            limit: pageSize,
          })
        );
      }
    },
    [
      dispatch,
      selectedLocation,
      selectedModule,
      selectedPatient,
      pageSize,
      startPage,
    ]
  );

  const deleteDocument = useCallback(
    async (record) => {
      dispatch(
        deleteDocumentsList({
          moduleId: selectedModule?._id,
          locationId: selectedLocation,
          id: record._id,
        })
      ).then(() => {
        getdata();
      });
    },
    [dispatch, selectedLocation, selectedModule, getdata]
  );

  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "srNo",
      key: "srNo",
      render: (text, data, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (text, record) => (
        <a
          href={process.env.REACT_APP_SOCKET_URL + "/" + record.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {record.url && "URL"}
        </a>
      ),
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
                  {(record?.id && record?.id === patientInfo?.id) ||
                    (record?._id && record?._id === patientInfo?._id) ? (
                    <img
                      src={CancelIcon}
                      alt="CancelIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        setPatientInfo(patientInfoDetails);
                        form.resetFields();
                      }}
                    />
                  ) : (
                    <img
                      src={EditIcon}
                      alt="EditIcon"
                      className="me-2 edit_img"
                      onClick={() => {
                        setPatientInfo(record);
                        form.setFieldsValue({
                          title: record?.title,
                          url: record?.url,
                        });
                      }}
                    />
                  )}
                </Button>
              </li>
            )}
            {
              <li>
                <Popconfirm
                  title="Delete the document"
                  description="Are you sure to delete document?"
                  onConfirm={(e) => {
                    deleteDocument(record);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button className="btn_transparent">
                    <img src={TranshIcon} alt="TranshIcon" />
                  </Button>
                </Popconfirm>
              </li>
            }
          </ul>
        );
      },
    },
  ];

  const customUpload =
    (name) =>
      async ({ file, onSuccess, onError }) => {
        const isAllowedType = allowedFileTypes.includes(file.type);
        if (isAllowedType) {
          try {
            const formData = new FormData();
            formData.append("file", file);
            dispatch(uploadImage(formData));
            setPatientInfo({ ...patientInfo, url: "", file: [file] });
            setTimeout(() => {
              onSuccess("Successfully uploaded");
            }, 1000);
          } catch (error) {
            onError("Upload failed");
          }
        } else {
          toast.error("You can only upload JPG/JPEG or PDF file types!");
        }
      };

  useEffect(() => {
    getdata();
    return () => {
      dispatch(setDocumentList([]));
      dispatch(setTotalDocuments(0));
    };
  }, [dispatch, selectedPatient]);

  useEffect(() => {
    if (isUploadImageUpdated) {
      setPatientInfo({
        ...patientInfo,
        url: getUploadImage?.file,
      });
    }
  }, [isUploadImageUpdated]);

  const onFinish = (values) => {
    const payload = {
      title: patientInfo?.title,
      url: patientInfo?.url,
    };
    if (patientInfo._id) {
      dispatch(
        updateDocuments({
          locationId: selectedLocation,
          id: patientInfo._id,
          moduleId: selectedModule?._id,
          payload: payload,
        })
      ).then(() => {
        getdata();
        setPatientInfo(patientInfoDetails);
        form.resetFields();
      });
    } else {
      dispatch(
        addDocuments({
          locationId: selectedLocation,
          patientRegId: selectedPatient?._id,
          moduleId: selectedModule?._id,
          payload: patientInfo,
        })
      ).then(() => {
        getdata();
        setPatientInfo(patientInfoDetails);
        form.resetFields();
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePageChange = useCallback(
    (value) => {
      getdata(value);
    },
    [getdata]
  );
  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        {isAddDocumentsLoading && (
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        )}
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
          <div className="form_process_wrapper p-0">
            <Row>
              <Col md={4}>
                <Form.Item label="Title" name="title">
                  <Input
                    placeholder="Title"
                    name="title"
                    value={patientInfo?.title}
                    onChange={(e) => {
                      setPatientInfo({
                        ...patientInfo,
                        title: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col md={4}>
                <Form.Item
                  label="Document"
                  className="upload_Wrapper upload_small_wrapper"
                  name="document"
                >
                  <div className="photo_upload_inner">
                    <Row className="g-2">
                      <Col xs="auto" className="upload_box">
                        <Upload
                          accept=".jpg"
                          maxCount={1}
                          customRequest={customUpload()}
                          onRemove={(file) => {
                            setPatientInfo({
                              ...patientInfo,
                              url: "",
                              file: [],
                            });
                          }}
                          beforeUpload={(file) => {
                            const isAllowedType = allowedFileTypes.includes(
                              file.type
                            );
                            if (!isAllowedType) {
                              setPatientInfo({
                                ...patientInfo,
                                url: "",
                                file: [],
                              });
                              toast.error(
                                "You can only upload JPG/JPEG or PDF file types!"
                              );
                            }
                            return isAllowedType;
                          }}
                          listType="text"
                        >
                          <div className="upload_wrap">
                            <img src={uploadIcon} className="me-2" alt="" />
                            <p>Click to upload or drag & drop</p>
                          </div>
                        </Upload>
                      </Col>
                    </Row>
                  </div>
                  {/* <div className="upload_text_wrap">
                    <div className="upload_left">
                      <img src={pinIocn} alt="PinIcon" className="me-2" />
                      pexels-pixabay-33045 (1).jpg
                    </div>
                    <DeleteOutlined />
                  </div> */}
                </Form.Item>
              </Col>
              <Col xs="auto" className="">
                {selectedPatient?.patient_id && patientInfo._id
                  ? (userType === 1 || selectedModule?.edit) && (
                    <Button
                      className="w-100 btn_primary file_upload_save_btn"
                      htmlType="submit"
                    >
                      Update
                    </Button>
                  )
                  : (userType === 1 || selectedModule?.create) && (
                    <Button
                      className="w-100 btn_primary file_upload_save_btn"
                      htmlType="submit"
                      disabled={Object.keys(selectedPatient)?.length === 0 ? true : false}
                    >
                      Save
                    </Button>
                  )}
                {/* <Button htmlType="login" className="w-100 btn_primary mb-4">
                  Save
                </Button> */}
              </Col>
            </Row>
          </div>
        </Form>
        <div className="cmn_table_wrap pb-4">
          <Table
            columns={columns}
            dataSource={documentList}
            pagination={false}
          />

          {totalDocuments > 0 && (
            <Pagination
              current={startPage}
              total={totalDocuments}
              pageSize={pageSize}
              onChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDocument;
