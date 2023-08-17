import React from 'react';
import { Card, Row, Col, Form, notification } from 'antd';
import '../styles/auth.css';
import Meta from 'antd/es/card/Meta';
import { Link } from 'react-router-dom';
import { useFormContext } from '../contexts/FormContext';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import CustomButton from '../components/CustomButton';
import { FormData } from '../types/User';
import { loginUser } from '../utils/UserAuth';

const Login: React.FC = () => {
  const { formData, setFormData } = useFormContext();

  return (
    <div className="form--container">
      <Card style={{ width: 900 }}>
        <Row className="row">
          <Col>
            <img
              className="signup-image"
              src={require('../assets/display-image.png')}
              alt="Signup"
            />
          </Col>
          <Col>
            <Form
              name="unique_form"
              // onFinish={loginUser}
              layout="vertical"
              className="form"
            >
              <Meta title={'Log In'} className="form-meta" />
              <p>
                Don't have an account?
                <span style={{ cursor: 'pointer' }}>
                  <Link to="/"> Sign Up</Link>
                </span>
              </p>

              <EmailInput
                value={formData.email}
                placeholder="Email *"
                onChange={(value) => setFormData({ ...formData, email: value })}
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              />

              <PasswordInput
                value={formData.password}
                placeholder="Password *"
                onChange={(value) =>
                  setFormData({ ...formData, password: value })
                }
                rules={[
                  { required: true, message: 'Please enter your password' },
                ]}
              />

              <Form.Item>
                <CustomButton
                  onclick={() => {
                    loginUser(formData);
                  }}
                  buttonText="Login"
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Login;
