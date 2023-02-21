import { BarChartOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Layout, Menu, Row, Space, theme } from 'antd';
import Typography from 'antd/es/typography/Typography';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { queryClient } from '../App';
import NavSidebar from '../Components/NavSidebar';
import { COOKIE_KEYS } from '../constants';
import { getCookie } from '../utils/cookieManager';
import { deleteInitialCookies } from '../utils/helper';

const { Header, Content } = Layout;

const adminMenuItems = [
  {
    icon: React.createElement(UserOutlined),
    key: 'pending-entries',
    label: 'Pending Logs'
  },
  {
    icon: React.createElement(BarChartOutlined),
    key: 'updated-entries',
    label: 'Updated Logs'
  }
];

const Styles = {
  layout: {
    marginLeft: 200
  },
  content: {
    margin: '24px 16px 0',
    overflow: 'initial'
  },
  button: {
    marginRight: 10
  }
};

//TODO - Convert layout component in single Component

const AdminLayout = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  const email = getCookie(COOKIE_KEYS.email) ?? '';
  const navigate = useNavigate();
  const handleClick = (data) => {
    const { key } = data;
    navigate(`/admin/${key}`);
  };

  const handleLogoutClick = () => {
    deleteInitialCookies();
    queryClient.invalidateQueries();
    navigate('/');
  };

  return (
    <Layout hasSider>
      <NavSidebar>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['pending-entries']}
          onClick={(e) => handleClick(e)}
          items={adminMenuItems}
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
                <Typography>Hi Admin <strong>{email ? `(${email})` : ''}</strong></Typography>
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
export default AdminLayout;
