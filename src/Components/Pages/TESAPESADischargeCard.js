import { Button, DatePicker, Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';

export default function TESAPESADischargeCard() {
  return (
    <div className="page_main_content">
      <div className="page_inner_content">
        <Form
          name="basic"
          // initialValues={{
          //   remember: true,
          // }}
          layout="vertical"
          // onFinish={onFinish}
          // form={form}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className="form_process_wrapper">
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Patient Details</h3>
              <ul className="grid_wrapper">
                <li className="w_250 w_xs_50">
                  <Form.Item label="Patient ID" name="patient_id">
                    <Input placeholder="Enter Patient ID" name="patient_id" />
                  </Form.Item>
                </li>
                <li className="w_330 w_xs_50">
                  <Form.Item label="Patient Name" name="patient_name">
                    <Input
                      placeholder="Enter Patient Name"
                      name="patient_name"
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item label="Age" name="Age">
                    <Input placeholder="Enter Age" name="Age" />
                  </Form.Item>
                </li>
                <li className="w_330 w_xs_50">
                  <Form.Item label="Partner Name" name="PartnerName">
                    <Input
                      placeholder="Enter Partner Name"
                      name="PartnerName"
                    />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item label="Age" name="PartnerAge">
                    <Input placeholder="Enter Age" name="PartnerAge" />
                  </Form.Item>
                </li>
                <li className="w_150 w_xs_50">
                  <Form.Item label="M.S" name="M.S">
                    <Input placeholder="Enter M.S" name="M.S" />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="DOA" name="DOA">
                    <DatePicker
                      placeholder="Select Date"
                      name="DOA"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                    />
                  </Form.Item>
                </li>
                <li className="w_220 w_xs_50">
                  <Form.Item label="DOD" name="DOD">
                    <DatePicker
                      placeholder="Select Date"
                      name="DOD"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
            <div className="form_info_wrapper filled">
              <h3 className="mb-3">Final Diagnosis Details</h3>
              <ul className="grid_wrapper">
                <li className="w_250 w_xs_50">
                  <Form.Item label="ICD Code" name="ICDCode">
                    <Input placeholder="Enter ICD Code" name="ICDCode" />
                  </Form.Item>
                </li>
                <li className="w_250 w_xs_50">
                  <Form.Item
                    label="ICD Description"
                    name="ICDDescription"
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
                      name="ICDDescription"
                      options={[
                        {
                          value: '1',
                          label: '1',
                        },
                        {
                          value: '2',
                          label: '2',
                        },
                        {
                          value: '3',
                          label: '3',
                        },
                      ]}
                    />
                  </Form.Item>
                </li>
              </ul>
              <ul className="grid_wrapper">
                <li className="w_25 w_xs_100">
                  <Form.Item name="ChiefComplaints" label="Chief Complaints">
                    <TextArea
                      rows={4}
                      name="ChiefComplaints"
                      placeholder="Enter Chief Complaints"
                      className="with_arrow"
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="SignificantFindingsClinicalData"
                    label="Significant Findings Clinical Data"
                  >
                    <TextArea
                      rows={4}
                      name="SignificantFindingsClinicalData"
                      placeholder="Enter Significant Findings Clinical Data"
                      className="with_arrow"
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="RelevantInvestigations"
                    label="Relevant Investigations"
                  >
                    <TextArea
                      rows={4}
                      name="RelevantInvestigations"
                      placeholder="Enter Relevant Investigations"
                      className="with_arrow"
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="ProceduresPerformed"
                    label="Procedures Performed"
                  >
                    <TextArea
                      rows={4}
                      name="ProceduresPerformed"
                      placeholder="Enter Procedures Performed"
                      className="with_arrow"
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item name="TreatmentGiven" label="Treatment Given">
                    <TextArea
                      rows={4}
                      name="TreatmentGiven"
                      placeholder="Enter Treatment Given"
                      className="with_arrow"
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="ModicationAdvisedonDischarge"
                    label="Modication Advised on Discharge"
                  >
                    <TextArea
                      rows={4}
                      name="ModicationAdvisedonDischarge"
                      placeholder="Enter Modication Advised on Discharge"
                      className="with_arrow"
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="ConditionofPatientatDischarge"
                    label="Condition of Patient at Discharge"
                  >
                    <TextArea
                      rows={4}
                      name="ConditionofPatientatDischarge"
                      placeholder="Enter Condition of Patient at Discharge"
                      className="with_arrow"
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item name="FollowUpAdvice" label="Follow Up Advice">
                    <TextArea
                      rows={4}
                      name="FollowUpAdvice"
                      placeholder="Enter Follow Up Advice"
                      className="with_arrow"
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="OtherInstructions"
                    label="Other Instructions"
                  >
                    <TextArea
                      rows={4}
                      name="OtherInstructions"
                      placeholder="Enter Other Instructions"
                      className="with_arrow"
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="WhentoObtainUrgentCare"
                    label="When to Obtain Urgent Care"
                  >
                    <TextArea
                      rows={4}
                      name="WhentoObtainUrgentCare"
                      placeholder="Enter When to Obtain Urgent Care"
                      className="with_arrow"
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item
                    name="FinalResultofProcedure"
                    label="Final Result of Procedure"
                  >
                    <TextArea
                      rows={4}
                      name="FinalResultofProcedure"
                      placeholder="Enter Final Result of Procedure"
                      className="with_arrow"
                    />
                  </Form.Item>
                </li>
                <li className="w_25 w_xs_100">
                  <Form.Item name="BiopsyResult" label="Biopsy Result">
                    <TextArea
                      rows={4}
                      name="BiopsyResult"
                      placeholder="Enter Biopsy Result"
                      className="with_arrow"
                    />
                  </Form.Item>
                </li>
              </ul>
            </div>
          </div>
          <div className="button_group d-flex align-items-center justify-content-center mt-4">
            <Button className="btn_primary mx-3" htmlType="submit">
              Save
            </Button>
            <Button className="btn_gray">Cancel</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
