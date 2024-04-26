import React, { useCallback, useEffect } from 'react'
import { Button, Form, Input, Popconfirm } from 'antd';
import { Table } from 'antd';
import EditIcon from '../../../Img/edit.svg'
import TranshIcon from '../../../Img/trash.svg'
import CancelIcon from '../../../Img/cancel.svg'
import RestoreIcon from '../../../Img/restore.svg'
import { useState } from 'react';
import { createLocation, getLocationData, setIsLocationUpdated, updateLocation } from 'redux/reducers/Role/role.slice';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';

export default function UserLocation({ userType, locationData, isLocationUpdated }) {
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const [userLocation, setUserLocation] = useState('')
  const [editLocationObj, setEditLocationObj] = useState({})
  useEffect(() => {
    locationData.length === 0 && dispatch(getLocationData())
  }, [dispatch])
  const clearForm = useCallback(
    () => {
      setUserLocation('')
      form.setFieldsValue({
        userLocation: '',
      })
      setEditLocationObj({})
    }, [form])

  useEffect(() => {
    if (isLocationUpdated) {
      clearForm()
      dispatch(getLocationData())
      dispatch(setIsLocationUpdated(false))
    }
  }, [dispatch, clearForm, isLocationUpdated])

  const onFinishFailed = useCallback(
    errorInfo => {
      const firstErrorField = document.querySelector('.ant-form-item-has-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth' });
      }
    }, [])

  const onFinish = useCallback(
    values => {
      if (Object.keys(editLocationObj)?.length > 0) {
        const obj = {
          location_id: editLocationObj.location_id,
          deleted: editLocationObj.deleted,
          location_name: values.userLocation
        }
        dispatch(updateLocation(obj))
      } else {
        const obj = { location_name: values?.userLocation ? values.userLocation : '' }
        dispatch(createLocation(obj))
      }
    }, [dispatch, editLocationObj])

  const onDeleteHandler = useCallback(
    (record) => {
      const obj = {
        location_id: record.location_id,
        deleted: !record.deleted,
        location_name: record.location_name
      }
      dispatch(updateLocation(obj))
    }, [dispatch])

  const onRestoreHandler = useCallback(
    (record) => {
      const obj = {
        location_id: record.location_id,
        deleted: !record.deleted,
        location_name: record.location_name
      }
      dispatch(updateLocation(obj))
    }, [dispatch])
  const columns = useMemo(() => {
    const columns = [
      {
        title: 'Sr. No.',
        dataIndex: 'srNo',
        key: 'srNo',
      },
      {
        title: 'City Name',
        dataIndex: 'location_name',
        key: 'location_name',
      },
      {
        title: 'Status',
        dataIndex: '',
        key: 'x',
        render: (record) => {
          return (
            <span className={record?.deleted ? 'bedge bedge_inactive' : 'bedge bedge_active'}>
              {record?.deleted ? 'In Active' : 'Active'}
            </span>
          )
        },
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (record) => {
          return (
            record?.deleted ?
              <ul className='action_wrap d-flex align-items-center'>
                <li>
                  {userType === 1 &&
                    <Popconfirm
                      title="Active Location"
                      description="Are you sure to activ this location?"
                      onConfirm={(e) => {
                        onRestoreHandler(record)
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button className='btn_transparent'
                      // onClick={() => onRestoreHandler(record)}
                      >
                        <img src={RestoreIcon} alt='RestoreIcon' className='me-2' />
                      </Button>
                    </Popconfirm>}
                </li>
              </ul> :
              <ul className='action_wrap d-flex align-items-center'>
                <li>
                  {userType === 1 && <Button className='btn_transparent'>
                    {
                      (Object.keys(editLocationObj)?.length > 0 && (record.location_id === editLocationObj.location_id)) ?
                        <img src={CancelIcon} alt='CancelIcon' className='me-2 edit_img' onClick={() => {
                          clearForm()
                        }} /> :
                        < img src={EditIcon} alt='EditIcon' className='me-2 edit_img'
                          onClick={() => {
                            setEditLocationObj(record)
                            setUserLocation(record.location_name)
                            form.setFieldsValue({ userLocation: record.location_name })
                          }} />
                    }
                  </Button>}
                </li>
                <li>
                  {userType === 1 &&
                    <Popconfirm
                      title="Deactivate Location"
                      description="Are you sure to deactivate this location?"
                      onConfirm={(e) => {
                        onDeleteHandler(record)
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button Button className='btn_transparent'
                      // onClick={() => onDeleteHandler(record)}
                      >
                        <img src={TranshIcon} alt='TranshIcon' />
                      </Button>
                    </Popconfirm>}
                </li>
              </ul >
          )
        },
      },
    ];
    return columns
  }, [userType])
  return (
    <div>
      <Form
        form={form}
        name="user_location"
        initialValues={{
          remember: true,
        }}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        scrollToFirstError
      >
        <ul className='grid_wrapper'>
          <li className='w_320 w_xs_50'>
            <Form.Item
              label="Location"
              name="userLocation"
              rules={[
                {
                  required: true,
                  message: '',
                },
              ]}
            >
              <Input placeholder="Enter Location" value={userLocation} onChange={(e) => setUserLocation(e.target.value)} />
            </Form.Item>
          </li>
          <li className='w_220 w_xs_50 align-self-end'>
            {userType === 1 && <Button className='btn_primary mb-4' htmlType="submit">{Object.keys(editLocationObj)?.length > 0 ? 'Edit' : 'Add'}</Button>}
          </li>
        </ul>
        <div className='cmn_table_wrap pb-4'>
          <Table columns={columns} dataSource={locationData} pagination={false} />
        </div>
      </Form>
    </div >
  )
}
