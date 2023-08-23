import { Button } from 'antd';
import { FC } from 'react';
import { CustomButtonProps } from '../types/User';

const CustomButton: FC<CustomButtonProps> = ({ buttonText, onclick }) => {
  return (
    <>
      <Button onClick={onclick} className="custom-btn" htmlType="submit" block>
        {buttonText}
      </Button>
    </>
  );
};

export default CustomButton;
