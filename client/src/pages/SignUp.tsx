import React, { useState, useRef } from 'react';
import { Form, Input, Card, Row, Col } from 'antd';
import Meta from 'antd/es/card/Meta';
import { Link } from 'react-router-dom';
import '../styles/auth.css';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import CustomButton from '../components/CustomButton';
import { registerUser } from '../utils/UserAuth';
import { FormData } from '../types/User';
import { FormInstance } from 'antd/lib/form';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    budget: 0,
  });

  const formRef = useRef<FormInstance>(null);

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
          <Col className="form">
            <Form
              ref={formRef}
              name="unique_form"
              // onFinish={() => registerUser(formData)}
              layout="vertical"
            >
              <Meta title={'Sign Up'} className="form-meta" />
              <p>
                Already have an account?
                <span style={{ cursor: 'pointer' }}>
                  <Link to="/login"> Login</Link>
                </span>
              </p>
              <Form.Item
                name="firstName"
                rules={[
                  { required: true, message: 'Please enter your first name' },
                ]}
              >
                <Input
                  placeholder="First Name *"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                rules={[
                  { required: true, message: 'Please enter your last name' },
                ]}
              >
                <Input
                  placeholder="Last Name *"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </Form.Item>
              <EmailInput
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                placeholder="Email *"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              />
              <PasswordInput
                value={formData.password}
                onChange={(value) =>
                  setFormData({ ...formData, password: value })
                }
                placeholder="Password"
                rules={[
                  { required: true, message: 'Please enter your password' },
                ]}
              />
              <Form.Item
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password',
                  },
                ]}
              >
                <Input.Password
                  className="pswrd-input"
                  placeholder="Confirm Password *"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </Form.Item>

              <Form.Item
                name="budgetLimit"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your Budget Limit',
                  },
                ]}
              >
                <Input
                  placeholder="Budget Limit *"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budget:
                        e.target.value !== ''
                          ? parseInt(e.target.value)
                          : undefined,
                    })
                  }
                />
              </Form.Item>
              <Form.Item>
                <CustomButton
                  onclick={() => {
                    registerUser(formData, formRef);
                  }}
                  buttonText="Sign Up"
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SignUp;
