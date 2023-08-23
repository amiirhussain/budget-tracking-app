import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';
import { useNavigate } from 'react-router-dom';
import {
  LogoutOutlined,
  UserOutlined,
  FundProjectionScreenOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';

const { SubMenu } = Menu;

const Navbar: React.FC = () => {
  const [currentMenu, setCurrentMenu] = useState<string>('home');
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick: MenuClickEventHandler = (e) => {
    setCurrentMenu(e.key);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <Menu
      onClick={handleMenuClick}
      selectedKeys={[currentMenu]}
      mode="horizontal"
      className="menu-bar"
    >
      <Menu.Item key="home" className="logo-container">
        <img
          className="logo-icon"
          src="https://i.ibb.co/LPP3ndL/budget-logo.png"
          alt="Logo"
        />
        <span className="logo-text">Budget Tracker</span>
      </Menu.Item>

      <SubMenu key="settings" icon={<UserOutlined />} className="sub-menu">
        {location.pathname === '/' || location.pathname === '/login' ? (
          <>
            <Menu.Item key="login" icon={<UserOutlined />}>
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="signup" icon={<UserOutlined />}>
              <Link to="/">Sign Up</Link>
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item key="dashboard" icon={<HomeOutlined />}>
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="report" icon={<FundProjectionScreenOutlined />}>
              <Link to="/report">Report</Link>
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />}>
              <Link to="" onClick={handleLogout}>
                Logout
              </Link>
            </Menu.Item>
          </>
        )}
      </SubMenu>
    </Menu>
  );
};

export default Navbar;
