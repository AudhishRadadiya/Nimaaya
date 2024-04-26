
import React from 'react';
import { Button, Form, Input, Select, TimePicker } from 'antd';

export default function BasicSemenAnalysis() {
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
          scrollToFirstError
          autoComplete="off"
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
                <li className='w_320 w_xs_100'>
                  <Form.Item
                    label="Partner Name"
                    name="PartnerName"
                  >
                    <Input placeholder="Enter Partner Name" />
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
                <li className='w_200 w_xs_50'>
                  <Form.Item
                    label="Collection Time"
                    name="CollectionTime"
                  >
                    <TimePicker
                      format="h:mm a"
                      picker='time' />
                  </Form.Item>
                </li>
                <li className='w_200 w_xs_50'>
                  <Form.Item
                    label="Assay Time"
                    name="AssayTime"
                  >
                    <TimePicker
                      format="h:mm a"
                      picker='time' />
                  </Form.Item>
                </li>
                <li className='w_200 w_xs_50 w_xxs_100'>
                  <Form.Item
                    label="Abstinence (Days)"
                    name="Abstinence(Days)"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className='mb-3'>Semen Analysis</h3>
              <ul className='grid_wrapper'>
                <li className='w_170 w_xs_50'>
                  <Form.Item
                    label="Volume (ml)"
                    name="Volume(ml)"
                  >
                    <Input placeholder="1.2 ml" />
                  </Form.Item>
                </li>
                <li className='w_170 w_xs_50'>
                  <Form.Item
                    label="Round Cell"
                    name="RoundCell"
                  >
                    <Input placeholder="2 - 4" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50 w_xxs_100'>
                  <Form.Item
                    label="No. of WBC/100 Sperms"
                    name="NoOfSperms"
                  >
                    <Input placeholder="98" />
                  </Form.Item>
                </li>
                <li className='w_200 w_xs_50'>
                  <Form.Item
                    label="Appearance"
                    name="Appearance"
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
                        { value: 'Normal', label: 'Normal' },
                        { value: 'Bloody', label: 'Bloody' },
                        { value: 'Yellow', label: 'Yellow' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_200 w_xs_50'>
                  <Form.Item
                    label="Viscosity"
                    name="Viscosity"
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
                        { value: 'Normal', label: 'Normal' },
                        { value: 'Increased', label: 'Increased' }
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_200 w_xs_50 w_xxs_100'>
                  <Form.Item
                    label="Debris"
                    name="Debris"
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
                        { value: 'Few', label: 'Few' },
                        { value: 'Moderate', label: 'Moderate' },
                        { value: 'More', label: 'More' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50 w_xxs_100'>
                  <Form.Item
                    label="Liquefaction Time (Min)"
                    name="Liquefaction"
                  >
                    <Input placeholder="30 min" />
                  </Form.Item>
                </li>
                <li className='w_320 w_xs_100'>
                  <Form.Item
                    label="Count (10 / 6 ml - No. Sperm in Palette)"
                    name="CountPalette"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className='mb-3'>Morphology</h3>
              <ul className='grid_wrapper'>
                <li className='w_220 w_xs_50 w_xxs_100'>
                  <Form.Item
                    label="Normal (%)"
                    name="Normal(%)"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50 w_xxs_100'>
                  <Form.Item
                    label="Head Piece Defects (%)"
                    name="HeadDefects"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50 w_xxs_100'>
                  <Form.Item
                    label="Mid Piece Defects (%)"
                    name="MidDefects"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50 w_xxs_100'>
                  <Form.Item
                    label="Tail Defects (%)"
                    name="TailDefects"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50 w_xxs_100'>
                  <Form.Item
                    label="Cytoplasmic Residue (%)"
                    name="CytoplasmicResidue"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_300 w_xs_100'>
                  <Form.Item
                    label="Sperm Deformity Index (decimal / %)"
                    name="SpermIndex"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className='mb-3'>Sperm Motility</h3>
              <ul className='grid_wrapper'>
                <li className='w_220 w_xs_50'>
                  <Form.Item
                    label="Percentage (%)"
                    name="Percentage(%)"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50 w_xxs_100'>
                  <Form.Item
                    label="Rapidly Progressive (%)"
                    name="RapidlyProgressive"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50 w_xxs_100'>
                  <Form.Item
                    label="Slow Progressive (%)"
                    name="SlowProgressive"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50 w_xxs_100'>
                  <Form.Item
                    label="Non Progressive (%)"
                    name="NonPercentage"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50'>
                  <Form.Item
                    label="Immotile (%)"
                    name="Immotile"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50'>
                  <Form.Item
                    label="Vitality (%)"
                    name="Vitality"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50'>
                  <Form.Item
                    label="HOS Test (%)"
                    name="HOSTest"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_50'>
                  <Form.Item
                    label="pH (Decimal)"
                    name="pH"
                  >
                    <Input placeholder="--" />
                  </Form.Item>
                </li>
                <li className='w_220 w_xs_100'>
                  <Form.Item
                    label="Fructose"
                    name="Fructose"
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
                        { value: 'Present', label: 'Present' },
                        { value: 'Absent', label: 'Absent' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_350 w_xs_100'>
                  <Form.Item
                    label="Interpretation"
                    name="Interpretation"
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
                        { value: 'Normal Semen Analysis', label: 'Normal Semen Analysis' },
                        { value: 'Oligospermia', label: 'Oligospermia' },
                        { value: 'Oligoasthenospermia', label: 'Oligoasthenospermia' },
                        { value: 'Oligoteratoozoospermia', label: 'Oligoteratoozoospermia' },
                        { value: 'Oligoasthenotheratoozoospermia', label: 'Oligoasthenotheratoozoospermia' },
                      ]}
                    />
                  </Form.Item>
                </li>
                <li className='w_270 w_xs_100'>
                  <Form.Item
                    label="Reported By"
                    name="Reported By"
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
                        { value: 'Shraddha Mandaviya', label: 'Shraddha Mandaviya' },
                        { value: 'Dhruti Bhatt', label: 'Dhruti Bhatt' },
                        { value: 'Meha Desai', label: 'Meha Desai' },
                        { value: 'Priyanka Rajput', label: 'Priyanka Rajput' },
                        { value: 'Sapna Trada', label: 'Sapna Trada' },
                      ]}
                    />
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
            <Button className='btn_primary mx-3'>Save</Button>
            <Button className='btn_gray'>Cancel</Button>
          </div>
        </Form>
      </div>
    </div>
  )
}


