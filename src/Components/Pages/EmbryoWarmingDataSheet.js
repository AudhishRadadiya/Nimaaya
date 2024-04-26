
import React from 'react'
import { Button, DatePicker, Form, Input, Select } from 'antd';
import { Table } from 'antd';

export default function EmbryoWarmingDataSheet() {
  const { TextArea } = Input;
  const onFinish = values => {
    console.log('Success:', values);
  };
  const onFinishFailed = errorInfo => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const dataSource = [
    {
      key: '1',
      srNo: '1',
      ivfID: '2022/11/1328-1',
      complication: 'Easy Clean',
    },
    {
      key: '2',
      srNo: '2',
      ivfID: '2022/11/1328-2',
      complication: 'Easy Clean',
    },
  ];

  const columns = [
    {
      title: 'Sr. No.',
      dataIndex: 'srNo',
      key: 'srNo',
    },
    {
      title: 'IVF ID',
      dataIndex: 'ivfID',
      key: 'ivfID',
    },
    {
      title: 'Complication',
      dataIndex: 'complication',
      key: 'complication',
    },
  ];

  return (
    <div className='page_main_content'>
      <div className='page_inner_content'>
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
        >
          <div className='form_process_wrapper'>
            <div className='form_info_wrapper filled'>
              <h3 className='mb-3'>Patient Details</h3>
              <ul className='grid_wrapper'>
                <li className='w_250 w_xs_100'>
                  <Form.Item
                    label="Patient ID"
                    name="PatientID"
                  >
                    <Input placeholder="Enter Patient ID" />
                  </Form.Item>
                </li>
                <li className='w_320 w_xs_100'>
                  <Form.Item
                    label="Patient Name"
                    name="PatientName"
                  >
                    <Input placeholder="Enter Patient Name" />
                  </Form.Item>
                </li>
                <li className='w_150 w_xs_100'>
                  <Form.Item
                    label="Age"
                    name="Age"
                  >
                    <Input placeholder="Enter Age" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50'>
                  <Form.Item
                    label="Date of Birth"
                    name="Date of Birth"
                  >
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      placeholder="08/03/2017" />
                  </Form.Item>
                </li>
                <li className='w_250 w_xs_50'>
                  <Form.Item
                    label="Vitrification ID"
                    name="VitrificationID"
                  >
                    <Input placeholder="Enter Patient ID" />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className='mb-3'>Vial Details</h3>
              <ul className='grid_wrapper'>
                <li className='w_200 w_xs_50'>
                  <Form.Item
                    label="Day"
                    name="Day"
                    className='custom_select'
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
                        { value: 'Zero', label: 'Zero' },
                        { value: 'Two', label: 'Two' },
                        { value: 'Three', label: 'Three' },
                        { value: 'Five', label: 'Five' },
                        { value: 'Six', label: 'Six' },
                        { value: 'Seven', label: 'Seven' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_200 w_xs_50'>
                  <Form.Item
                    label="No. of Embryos"
                    name="NoOfEmbryos"
                  >
                    <Input placeholder="N1038E" />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_50'>
                  <Form.Item
                    label="Media Used"
                    name="MediaUsed"
                    className='custom_select'
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
                        { value: 'Kitazato', label: 'Kitazato' },
                        { value: 'Cryotech', label: 'Cryotech' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_50'>
                  <Form.Item
                    label="Device Used"
                    name="Device Used"
                    className='custom_select'
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
                        { value: 'Cryotec-VC', label: 'Cryotec-VC' },
                        { value: 'Cryolock', label: 'Cryolock' },
                        { value: 'Cryoleaf', label: 'Cryoleaf' },
                        { value: 'Cryoloop', label: 'Cryoloop' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="Colour of the Device"
                    name="ColourDevice"
                    className='custom_select'
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
                        { value: 'Blue', label: 'Blue' },
                        { value: 'Green', label: 'Green' },
                        { value: 'Yellow', label: 'Yellow' },
                        { value: 'Pink', label: 'Pink' },
                        { value: 'White', label: 'White' },
                        { value: 'Orange', label: 'Orange' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="Colour of the Goblet"
                    name="ColourGoblet"
                    className='custom_select'
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
                        { value: 'Blue', label: 'Blue' },
                        { value: 'Green', label: 'Green' },
                        { value: 'Yellow', label: 'Yellow' },
                        { value: 'Pink', label: 'Pink' },
                        { value: 'White', label: 'White' },
                        { value: 'Orange', label: 'Orange' },
                        { value: 'Purple', label: 'Purple' },
                        { value: 'Light Blue', label: 'Light Blue' },
                        { value: 'Light Green', label: 'Light Green' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_170 w_xs_50'>
                  <Form.Item
                    label="Canister No."
                    name="CanisterNo"
                  >
                    <Input placeholder="03" />
                  </Form.Item>
                </li>
                <li className='w_170 w_xs_50'>
                  <Form.Item
                    label="Tank No."
                    name="TankNo"
                  >
                    <Input placeholder="04" />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="Freezing Done By"
                    name="Freezing Done By"
                    className='custom_select'
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
                        { value: 'Dr. Prabhakar Singh', label: 'Dr. Prabhakar Singh' },
                        { value: 'Dhruti Bhatt', label: 'Dhruti Bhatt' },
                        { value: 'Meha Desai', label: 'Meha Desai' },
                        { value: 'Priyanka Rajput', label: 'Priyanka Rajput' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50'>
                  <Form.Item
                    label="Date of Freezing"
                    name="DateOfFreezing"
                  >
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      placeholder="29/10/2022" />
                  </Form.Item>
                </li>
                <li className='w_100 w_xs_100'>
                  <Form.Item
                    label="Notes"
                    name="Notes"
                  >
                    <TextArea rows={4} placeholder="Notes" />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className='mb-3'>Embryos Details</h3>
              <ul className='grid_wrapper'>
                <li className='w_220 w_xs_100'>
                  <Form.Item
                    label="No. of Embryos Thawed"
                    name="NoOfThawed"
                  >
                    <Input placeholder="01" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_100'>
                  <Form.Item
                    label="No. of Embryos Obtained"
                    name="NoOfObtained"
                  >
                    <Input placeholder="01" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_100'>
                  <Form.Item
                    label="No. of Embryos Lysed"
                    name="NoOfLysed"
                  >
                    <Input placeholder="00" />
                  </Form.Item>
                </li>
                <li className='w_240 w_xs_100'>
                  <Form.Item
                    label="No. of Embryos Trabsaferred"
                    name="NoOfTrabsaferred"
                  >
                    <Input placeholder="01" />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="Thawing Media Used"
                    name="ThawingMediaUsed"
                    className='custom_select'
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
                        { value: 'Kitazato', label: 'Kitazato' },
                        { value: 'Cryotech', label: 'Cryotech' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50'>
                  <Form.Item
                    label="Expiry Date"
                    name="ExpiryDate"
                  >
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      placeholder="24/07/2023" />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="Transferred By"
                    name="TransferredBy"
                    className='custom_select'
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
                        { value: 'Dr. Pooja Nadkarni Singh', label: 'Dr. Pooja Nadkarni Singh' },
                        { value: 'Dr. Vaibhav Nadkarni', label: 'Dr. Vaibhav Nadkarni' },
                        { value: 'Dr. Yuvraj Sinh Jadeja', label: 'Dr. Yuvraj Sinh Jadeja' },
                        { value: 'Dr. Praful Doshi', label: 'Dr. Praful Doshi' },
                        { value: 'Dr. Gopal Vekariya', label: 'Dr. Gopal Vekariya' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="Embryo Loading Done By"
                    name="EmbryoBy"
                    className='custom_select'
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
                        { value: 'Dr. Prabhakar Singh', label: 'Dr. Prabhakar Singh' },
                        { value: 'Dr. Pooja Nadkarni Singh', label: 'Dr. Pooja Nadkarni Singh' },
                        { value: 'Dhruti Bhatt', label: 'Dhruti Bhatt' },
                        { value: 'Meha Desai', label: 'Meha Desai' },
                        { value: 'Priyanka Rajput', label: 'Priyanka Rajput' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="Catheter"
                    name="Catheter"
                    className='custom_select'
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
                        { value: 'Sydney, IVF', label: 'Sydney, IVF' },
                        { value: 'Cook, IVF', label: 'Cook, IVF' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="Transfer Media"
                    name="TransferMedia"
                    className='custom_select'
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
                        { value: 'Sage', label: 'Sage' },
                        { value: 'Vitromed', label: 'Vitromed' },
                        { value: 'Cook', label: 'Cook' },
                      ]}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className='mb-3'>No. of Embryos Trans Details</h3>
              <ul className='grid_wrapper'>
                <li className='w_90 w_xs_100'>
                  <Form.Item
                    label="Sr. No."
                    name="SrNo"
                  >
                    <Input placeholder="0" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_100'>
                  <Form.Item
                    label="IVF ID"
                    name="IVFID"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_100'>
                  <Form.Item
                    label="Complication"
                    name="Complication"
                    className='custom_select'
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
                        { value: 'Easy Clean', label: 'Easy Clean' },
                        { value: 'Easy', label: 'Easy' },
                        { value: 'Blood', label: 'Blood' },
                        { value: 'Difficult', label: 'Difficult' },
                        { value: 'Difficult Blood', label: 'Difficult Blood' },
                        { value: 'Difficult Clean', label: 'Difficult Clean' },
                      ]}
                    />
                  </Form.Item>
                </li>
              </ul>
              <div className='cmn_table_wrap pb-4'>
                <Table columns={columns} dataSource={dataSource} pagination={false} />
              </div>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className='mb-3'>Other Details</h3>
              <ul className='grid_wrapper'>
                <li className='w_220 w_xs_100'>
                  <Form.Item
                    label="Batch No."
                    name="BatchNo"
                  >
                    <Input placeholder="JCHA0267WSG" />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="Warming Done By"
                    name="WarmingDoneBy"
                    className='custom_select'
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
                        { value: 'Dr. Prabhakar Singh', label: 'Dr. Prabhakar Singh' },
                        { value: 'Dhruti Bhatt', label: 'Dhruti Bhatt' },
                        { value: 'Meha Desai', label: 'Meha Desai' },
                        { value: 'Priyanka Rajput', label: 'Priyanka Rajput' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="Assisted By"
                    name="AssistedBy"
                    className='custom_select'
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
                        { value: 'Dr. Prabhakar Singh', label: 'Dr. Prabhakar Singh' },
                        { value: 'Dhruti Bhatt', label: 'Dhruti Bhatt' },
                        { value: 'Meha Desai', label: 'Meha Desai' },
                        { value: 'Priyanka Rajput', label: 'Priyanka Rajput' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50'>
                  <Form.Item
                    label="Date of Warming"
                    name="DateWarming"
                  >
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      placeholder="27/11/2022" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50'>
                  <Form.Item
                    label="Transfer Date"
                    name="TransferDate"
                  >
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      placeholder="27/03/2023" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_100'>
                  <Form.Item
                    label="No. of Transferred"
                    name="NoOfTransferred"
                  >
                    <Input placeholder="00" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_100'>
                  <Form.Item
                    label="No. of Transferred"
                    name="NoOfTransferred"
                  >
                    <Input placeholder="00" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_100'>
                  <Form.Item
                    label="Distance from fundus (cm)"
                    name="DistanceFundus"
                  >
                    <Input placeholder="1.52 cm" />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="Transferred By"
                    name="TransferredBy"
                    className='custom_select'
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
                        { value: 'Dr. Pooja Nadkarni Singh', label: 'Dr. Pooja Nadkarni Singh' },
                        { value: 'Dr. Vaibhav Nadkarni', label: 'Dr. Vaibhav Nadkarni' },
                        { value: 'Dr. Yuvraj Sinh Jadeja', label: 'Dr. Yuvraj Sinh Jadeja' },
                        { value: 'Dr. Praful Doshi', label: 'Dr. Praful Doshi' },
                        { value: 'Dr. Gopal Vekariya', label: 'Dr. Gopal Vekariya' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="No. of Embryos Kept for Blastocyst"
                    name="EmbryosBlastocyst"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_100 w_xs_100'>
                  <Form.Item
                    label="Notes"
                    name="Notes"
                  >
                    <TextArea rows={4} placeholder="Notes" />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className='mb-3'>Day 5</h3>
              <ul className='grid_wrapper'>
                <li className='w_220 w_xs_100'>
                  <Form.Item
                    label="No. of Blastocyst"
                    name="NoOfBlastocyst"
                  >
                    <Input placeholder="8" />
                  </Form.Item>
                </li>
                <li className='w_140 w_xs_100'>
                  <Form.Item
                    label="Grade I"
                    name="GradeI"
                  >
                    <Input placeholder="5" />
                  </Form.Item>
                </li>
                <li className='w_140 w_xs_100'>
                  <Form.Item
                    label="Grade II"
                    name="GradeII"
                  >
                    <Input placeholder="6" />
                  </Form.Item>
                </li>
                <li className='w_140 w_xs_100'>
                  <Form.Item
                    label="Grade III"
                    name="GradeIII"
                  >
                    <Input placeholder="4" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_100'>
                  <Form.Item
                    label="No. Blastocyst Transferred"
                    name="NoBlastocystTransferred"
                  >
                    <Input placeholder="8" />
                  </Form.Item>
                </li>
                <li className='w_350 w_xs_100'>
                  <Form.Item
                    label="Distance From Funds (Decimal & Alphabetic)"
                    name="DistanceFromFunds"
                  >
                    <Input placeholder="NEHAANKIT-182" />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="Complication"
                    name="Complication"
                    className='custom_select'
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
                        { value: 'Easy Clean', label: 'Easy Clean' },
                        { value: 'Easy', label: 'Easy' },
                        { value: 'Blood', label: 'Blood' },
                        { value: 'Difficult', label: 'Difficult' },
                        { value: 'Difficult Blood', label: 'Difficult Blood' },
                        { value: 'Difficult Clean', label: 'Difficult Clean' },
                      ]}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className='mb-3'>Day 6</h3>
              <ul className='grid_wrapper'>
                <li className='w_220 w_xs_100'>
                  <Form.Item
                    label="No. of Blastocyst"
                    name="NoOfBlastocyst"
                  >
                    <Input placeholder="8" />
                  </Form.Item>
                </li>
                <li className='w_140 w_xs_100'>
                  <Form.Item
                    label="Grade I"
                    name="GradeI"
                  >
                    <Input placeholder="5" />
                  </Form.Item>
                </li>
                <li className='w_140 w_xs_100'>
                  <Form.Item
                    label="Grade II"
                    name="GradeII"
                  >
                    <Input placeholder="6" />
                  </Form.Item>
                </li>
                <li className='w_140 w_xs_100'>
                  <Form.Item
                    label="Grade III"
                    name="GradeIII"
                  >
                    <Input placeholder="4" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_100'>
                  <Form.Item
                    label="No. Blastocyst Transferred"
                    name="NoBlastocystTransferred"
                  >
                    <Input placeholder="8" />
                  </Form.Item>
                </li>
                <li className='w_350 w_xs_100'>
                  <Form.Item
                    label="Distance From Funds (Decimal & Alphabetic)"
                    name="DistanceFromFunds"
                  >
                    <Input placeholder="NEHAANKIT-182" />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="Complication"
                    name="Complication"
                    className='custom_select'
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
                        { value: 'Easy Clean', label: 'Easy Clean' },
                        { value: 'Easy', label: 'Easy' },
                        { value: 'Blood', label: 'Blood' },
                        { value: 'Difficult', label: 'Difficult' },
                        { value: 'Difficult Blood', label: 'Difficult Blood' },
                        { value: 'Difficult Clean', label: 'Difficult Clean' },
                      ]}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            <Button className='btn_border mx-3'>Vitrification</Button>
            <Button className='btn_primary mx-3'>Save</Button>
            <Button className='btn_gray'>Cancel</Button>
          </div>
        </Form>
      </div>
    </div>
  )
}




