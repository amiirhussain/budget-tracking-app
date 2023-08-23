import { notification } from 'antd';
import { FormData } from '../types/User';
import { FormInstance } from 'antd/lib/form';

export const loginUser = async (formData: FormData) => {
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
};

export const registerUser = async (
  formData: FormData,
  formRef: React.RefObject<FormInstance>,
) => {
  if (
    formData.firstName === '' ||
    formData.lastName === '' ||
    formData.email === '' ||
    formData.password === '' ||
    formData.budget === 0
  ) {
    notification.error({
      message: 'Invalid Input',
      description: 'please do not send inavlid input',
    });
    return;
  }
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
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      notification.success({
        message: 'Signup Success',
        description: 'Your account has been successfully created!',
      });
      formRef.current?.resetFields();
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
