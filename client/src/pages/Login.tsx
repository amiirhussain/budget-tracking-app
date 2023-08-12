import React from 'react';
import { Card, Row, Col, Button, Form, Input, notification } from 'antd';
import '../styles/auth.css';
import Meta from 'antd/es/card/Meta';
import { Link } from 'react-router-dom';
import { useFormContext } from '../contexts/FormContext';

const Login: React.FC = () => {
  const { formData, setFormData } = useFormContext();

  async function loginUser(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:1337/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.user) {
        localStorage.setItem('token', data.user);
        notification.success({
          message: 'Login Success',
          description: 'You have successfully logged in!',
        });
        window.location.href = '/dashboard';
      } else {
        notification.error({
          message: 'Login Failed',
          description: 'Please check your email and password',
        });
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  }

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
              onFinish={loginUser}
              layout="vertical"
              className="form"
            >
              <Meta title={'Log In'} className="form-meta" />
              <p>
                Don't have an account?{' '}
                <span style={{ cursor: 'pointer' }}>
                  <Link to="/">Sign Up</Link>
                </span>
              </p>
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

              <Form.Item>
                <Button
                  onClick={loginUser}
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

export default Login;
