import { BarChartOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Layout, Menu, Row, Space, theme, Typography } from 'antd';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { queryClient } from '../App';
import NavSidebar from '../Components/NavSidebar';
import { COOKIE_KEYS } from '../constants';
import { deleteCookie, getCookie } from '../utils/cookieManager';

const { Header, Content } = Layout;

const userMenuItems = [
  {
    icon: React.createElement(UserOutlined),
    key: 'create-entry',
    label: 'Create Entry'
  },
  {
    icon: React.createElement(BarChartOutlined),
    key: 'entries',
    label: 'View Time Logs'
  }
];

const Styles = {
  layout: {
    marginLeft: 200
  },
  content: {
    padding: '24px 16px',
    overflow: 'initial',
    minHeight: 'calc(100vh - 64px)',
  },
  button: {
    marginRight: 10
  }
};

//TODO - Convert layout component in single Component

const UserLayout = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  const email = getCookie(COOKIE_KEYS.email) ?? '';
  const navigate = useNavigate();
  const handleClick = (data) => {
    const { key } = data;
    navigate(`/user/${key}`);
  };

  const handleLogoutClick = () => {
    deleteCookie(COOKIE_KEYS.token);
    queryClient.invalidateQueries();
    navigate('/');
  };

  return (
    <Layout hasSider>
      <NavSidebar>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['create-entry']}
          onClick={(e) => handleClick(e)}
          items={userMenuItems}
        />
      </NavSidebar>
      <Layout className="site-layout" style={Styles.layout}>
        <Header
          style={{ 
            background: colorBgContainer
          }}
          className="page-header"
        >
            <Space  split={<Divider type="vertical" />}>
                <Typography>Hi User <strong>{email ? `(${email})` : ''}</strong></Typography>
                <Button
                style={Styles.button}
                type="primary"
                onClick={handleLogoutClick}
              >
                Logout
              </Button>
            </Space> 
        </Header>
        <Content style={Styles.content}>
          <div
          className='user-layout'
            style={{
              padding: 0, 
              height: '100%',
              background: colorBgContainer
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default UserLayout;
