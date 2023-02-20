import { Layout, Typography } from 'antd';
import React from 'react';
const { Sider } = Layout;
const { Text } = Typography;

const NavSidebar = ({ children }) => {
  return (
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0
      }}
    >
      <div
        style={{
          height: 32,
          margin: 16,
          textAlign: 'center'
        }}
      >
        <Text
          style={{
            color: 'red'
          }}
        >
          Time Tracker
        </Text>
      </div>
      {children}
    </Sider>
  );
};

export default NavSidebar;
