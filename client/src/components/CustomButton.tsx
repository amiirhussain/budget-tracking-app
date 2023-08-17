import { Button } from 'antd';
import { FC } from 'react';
import { CustomButtonProps } from '../types/User';

const buttonStyle = {
  background: '#FCC315',
  color: '#fff',
};

const CustomButton: FC<CustomButtonProps> = ({ buttonText, onclick }) => {
  return (
    <>
      <Button onClick={onclick} style={buttonStyle} htmlType="submit" block>
        {buttonText}
      </Button>
    </>
  );
};

export default CustomButton;
