import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, Spin } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSetPassword, setPassword, verifyToken } from 'redux/reducers/auths.slice';
import { setAuthToken } from 'Helper/AuthTokenHelper';

export default function ResetPassword() {
  let { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const { isSetPassword, isSetPasswordLoading, isResetPasswordLoading } = useSelector(({ auth }) => auth);
  useEffect(() => {
    const checkTokenValid = async () => {
      if (token) {
        const { payload } = await dispatch(verifyToken(token))
        if (!payload?.tokenValidate) {
          navigate('/link-expired')
        }
        else {
          setAuthToken(token)
        }
      }
    }
    checkTokenValid()
  }, [dispatch, navigate, token])
  const onFinish = values => {
    dispatch(setPassword(values));
  };
  useEffect(() => {
    if (isSetPassword) {
      navigate('/login');
      dispatch(setIsSetPassword(false))
    }
  }, [dispatch, navigate, isSetPassword])

  const validatePassword = (rule, value) => {
    if (!value) return Promise.reject('Please input your password!');
    if (value.length < 8)
      return Promise.reject('Password must be at least 8 characters long');
    if (!/\d/.test(value))
      return Promise.reject('Password must contain at least one digit');
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(value))
      return Promise.reject(
        'Password must contain at least one special character',
      );
    return Promise.resolve();
  };
  const onFinishFailed = errorInfo => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const validateConfirmPassword = (_, value) => {
    const { password } = form.getFieldValue();
    if (value && value !== password) {
      return Promise.reject(new Error('Passwords do not match'));
    } else {
      return Promise.resolve();
    }
  };

  return (
    <div className='login_wrapper set_password_wrap'>
      {
        (isSetPasswordLoading || isResetPasswordLoading) && <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      }
      <div className="reset_password_wrap">
        <div className='reset_password_inner_wrap'>
          <div className="login_form_Inner">
            <div className="login_form_wrap">
              <div class="logo d-none d-lg-flex">
                <img src="/static/media/logo-icon.a446c59c9c8e98c723ef49585d0d73a8.svg" class="logo_icon" alt="" />
                <img src="/static/media/logo-text.577471c866d27c12f41ee2622a317ee8.svg" class="logo_text" alt="" />
              </div>
              <h1 className="mb-3 text-center">Set New Password</h1>
              <p className="text-center mb-4">
                Must be at least 8 characters.
              </p>
            </div>
            <div className="reset_password_form">
              <Form
                form={form}
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
                <Form.Item
                  label="Password"
                  name="password"
                  className="mb-3 text-dark"
                  rules={[
                    {
                      validator: validatePassword,
                    },
                  ]}
                >
                  <Input.Password placeholder="Enter a password" />
                </Form.Item>
                <Form.Item
                  label="Confirm Password"
                  name="confirm_password"
                  className="mb-5"
                  dependencies={['password']}
                  rules={[
                    {
                      required: true,
                      message: 'Please input your confirm password!',
                      key: 'confirmPasswordRequired',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        return validateConfirmPassword(_, value);
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirm Password" />
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="ResetPassword"
                    className="w-100 btn_primary"
                  >
                    Reset Password
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
