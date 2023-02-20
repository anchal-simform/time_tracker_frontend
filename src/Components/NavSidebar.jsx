import { Layout, Typography } from 'antd';
import React from 'react';
const { Sider } = Layout;
const { Text } = Typography;

const Styles = {
  sider: {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0
  },
  div: {
    height: 32,
    margin: 16,
    textAlign: 'center'
  }
};

const NavSidebar = ({ children }) => {
  return (
    <Sider style={Styles.sider}>
      <div style={Styles.div}>
        <Text
          style={{
            color: 'white',
            fontSize: '18px'
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
