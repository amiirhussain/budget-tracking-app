import React from 'react';
import { Form, Input, Button, Card, Row, Col, notification } from 'antd';
import Meta from 'antd/es/card/Meta';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { useFormContext } from '../contexts/FormContext';

const SignUp: React.FC = () => {
  const { formData, setFormData } = useFormContext();
  const navigate = useNavigate();

  const registerUser = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      notification.error({
        message: 'Password Mismatch',
        description: 'The passwords you entered do not match.',
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:1337/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Use formData from context
      });

      const data = await response.json();

      if (response.ok) {
        notification.success({
          message: 'Signup Success',
          description: 'Your account has been successfully created!',
        });

        // Redirect to the login page after a delay
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Delay in milliseconds
      } else {
        notification.error({
          message: 'Signup Failed',
          description: 'Something Went Wrong!',
        });
      }
    } catch (error) {
      console.error('Error registering user:', error);
      notification.error({
        message: 'Error',
        description: 'An error occurred while registering.',
      });
    }
  };

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
              onFinish={registerUser}
              layout="vertical"
              className="form"
            >
              <Meta title={'Sign Up'} className="form-meta" />
              <p>
                Already have an account?{' '}
                <span style={{ cursor: 'pointer' }}>
                  <Link to="/login">Login</Link>
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
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please enter your password' },
                ]}
              >
                <Input.Password
                  className="pswrd-input"
                  placeholder="Password *"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </Form.Item>
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
                <Button
                  onClick={registerUser}
                  style={{ background: '#FCC315', color: '#fff' }}
                  htmlType="submit"
                  block
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default SignUp;
