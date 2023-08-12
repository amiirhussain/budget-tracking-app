import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';

const { SubMenu } = Menu;

const Navbar: React.FC = () => {
  const [currentMenu, setCurrentMenu] = useState<string>('home');
  const location = useLocation();

  const handleMenuClick: MenuClickEventHandler = (e) => {
    setCurrentMenu(e.key);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } catch (error) {
      console.log('Somthing went wrong!');
    }
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
          src={require('../assets/budget logo.png')}
          alt="Logo"
        />
        <span className="logo-text">Budget Tracker</span>
      </Menu.Item>

      <SubMenu
        key="settings"
        icon={<UserOutlined />}
        style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}
      >
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
            {/* <Menu.Item key="profile" icon={<UserOutlined />}>
              <Link to="/">Profile</Link>
            </Menu.Item> */}
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
