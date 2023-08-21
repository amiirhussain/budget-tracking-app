import { Form, Input } from 'antd';
import { FC } from 'react';
import { PasswordInputProps } from '../types/User';

const PasswordInput: FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder,
  rules,
}) => {
  return (
    <>
      <Form.Item name="password" rules={rules}>
        <Input.Password
          className="pswrd-input"
          placeholder={placeholder}
          value={value}
          size="large"
          onChange={(e) => onChange(e.target.value)}
        />
      </Form.Item>
    </>
  );
};

export default PasswordInput;
