import React from 'react';
import { Form, Input } from 'antd';
import { EmailInputProps } from '../types/User';

const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  placeholder,
  rules,
}) => {
  return (
    <Form.Item name="email" rules={rules}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Form.Item>
  );
};

export default EmailInput;
