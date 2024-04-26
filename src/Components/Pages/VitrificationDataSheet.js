
import React from 'react'
import { Button, DatePicker, Form, Input, Select } from 'antd';

export default function VitrificationDataSheet() {
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
          autoComplete="off"
          scrollToFirstError
        >
          <div className='form_process_wrapper'>
            <div className='form_info_wrapper filled'>
              <h3 className='mb-3'>Patient Details</h3>
              <ul className='grid_wrapper'>
                <li className='w_250 w_xs_50'>
                  <Form.Item
                    label="Patient ID"
                    name="PatientID"
                  >
                    <Input placeholder="Enter Patient ID" />
                  </Form.Item>
                </li>
                <li className='w_250 w_xs_50'>
                  <Form.Item
                    label="IVF ID"
                    name="IVF ID"
                  >
                    <Input placeholder="2022/11/1328-2" />
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
                <li className='w_150 w_xs_50'>
                  <Form.Item
                    label="Age"
                    name="Age"
                  >
                    <Input placeholder="Enter Age" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50'>
                  <Form.Item
                    label="LMP"
                    name="LMP"
                  >
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      placeholder="08/03/2017" />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className='form_info_wrapper filled'>
              <h3 className='mb-3'>Embryos Details</h3>
              <ul className='grid_wrapper'>
                <li className='w_140 w_xs_50'>
                  <Form.Item
                    label="No. of Embryos"
                    name="No. of Embryos"
                  >
                    <Input placeholder="01" />
                  </Form.Item>
                </li>
                <li className='w_140 w_xs_50'>
                  <Form.Item
                    label="Grade I"
                    name="Grade I"
                  >
                    <Input placeholder="00" />
                  </Form.Item>
                </li>
                <li className='w_140 w_xs_50'>
                  <Form.Item
                    label="Grade II"
                    name="Grade II"
                  >
                    <Input placeholder="01" />
                  </Form.Item>
                </li>
                <li className='w_140 w_xs_50'>
                  <Form.Item
                    label="Grade III"
                    name="Grade III"
                  >
                    <Input placeholder="00" />
                  </Form.Item>
                </li>
                <li className='w_140 w_xs_50'>
                  <Form.Item
                    label="No. of Oocytes"
                    name="No. of Oocytes"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_140 w_xs_50'>
                  <Form.Item
                    label="M II"
                    name="M II"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_140 w_xs_50'>
                  <Form.Item
                    label="M I"
                    name="M I"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_170 w_xs_50'>
                  <Form.Item
                    label="Blastocyst Score"
                    name="Blastocyst Score"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className='mb-3'>Status Details</h3>
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
                    label="Vitrification ID"
                    name="Vitrification ID"
                  >
                    <Input placeholder="N1038E" />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="What are you freezing?"
                    name="What are you freezing?"
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
                        { value: 'Oocytes', label: 'Oocytes' },
                        { value: 'Embryos', label: 'Embryos' },
                        { value: 'Blastocyst', label: 'Blastocyst' },
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
                <li className='w_220 w_xs_50'>
                  <Form.Item
                    label="Valid Upto"
                    name="ValidUpto"
                  >
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      placeholder="29/10/2022" />
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
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="Assisted By"
                    name="Assisted By"
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
                        { value: 'Dhruti Bhatt', label: 'Dhruti Bhatt' },
                        { value: 'Meha Desai', label: 'Meha Desai' },
                        { value: 'Priyanka Rajput', label: 'Priyanka Rajput' },
                        { value: 'Shraddha Mandaviya', label: 'Shraddha Mandaviya' },
                        { value: 'Sapna Trada', label: 'Sapna Trada' },
                      ]}
                    />
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
                    label="Batch No."
                    name="Batch No."
                  >
                    <Input placeholder="JCHA0262VSJ" />
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
                      placeholder="29/10/2022" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50'>
                  <Form.Item
                    label="Renewal Date"
                    name="RenewalDate"
                  >
                    <DatePicker
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      placeholder="29/10/2022" />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className='mb-3'>Device Details</h3>
              <ul className='grid_wrapper'>
                <li className='w_270 w_xs_100'>
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
                <li className='w_170 w_xs_100'>
                  <Form.Item
                    label="Canister No."
                    name="CanisterNo"
                  >
                    <Input placeholder="03" />
                  </Form.Item>
                </li>
                <li className='w_170 w_xs_100'>
                  <Form.Item
                    label="Tank No."
                    name="TankNo"
                  >
                    <Input placeholder="04" />
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
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            <Button className='btn_border mx-3'>Embryo Warmings</Button>
            <Button className='btn_primary mx-3'>Save</Button>
            <Button className='btn_gray'>Cancel</Button>
          </div>
        </Form>
      </div>
    </div>
  )
}



