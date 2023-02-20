import { BarChartOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Layout, Menu, Row, theme } from 'antd';
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
      <Layout
        className="site-layout"
        style={{
          marginLeft: 200
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer
          }}
        >
          <Row justify="end">
            <Col span={6}>Hi Admin {email ? `(${email})` : ''} </Col>
            <Col span={2}>
              <Button
                style={{
                  marginRight: 10
                }}
                type="primary"
                onClick={handleLogoutClick}
              >
                Logout
              </Button>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
            overflow: 'initial'
          }}
        >
          <div
            style={{
              padding: 24,
              textAlign: 'center',
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