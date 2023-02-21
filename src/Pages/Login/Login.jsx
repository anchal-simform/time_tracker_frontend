import { Button, Card, Form, Input, Layout } from 'antd';
import React from 'react';
import toast from 'react-hot-toast';
import "./Login.css"
import { Content } from 'antd/es/layout/layout';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/api';
import { queryClient } from '../../App';
import { setInititalCookies } from '../../utils/helper';

const Login = () => {
  const navigate = useNavigate();
  const mutation = useMutation(login, {
    onSuccess: ({ data }) => {
      if (data.status === 200) {
        const { role, token, email } = data?.data;
        setInititalCookies(token, email, role);
        toast.success(data.message);
        //  Invalidate and refetch
        queryClient.invalidateQueries();

        // Redirect to Main page as per user role
        if (role === 'ADMIN') {
          return navigate('/admin/pending-entries');
        }
        return navigate('/user/create-entry');
      }
    },
    onError: ({ data }) => {
      toast.error(data.message);
    }
  });

  const onSubmit = async (values) => {
    try {
      await mutation.mutate(values);
    } catch (error) {
      toast.error('Login Failed');
    }
  };

  return (
    <Layout className='login-page-wrapper'>
      <Content  className='login-form-content'
      >
        <Card title="Login" className='login-form-card'>
          <Form
            name="login_form"
             layout='vertical'
            style={{
              maxWidth: 600
            }}
            initialValues={{
              email: '',
              password: ''
            }}
            onFinish={onSubmit}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!'
                }
              ]}
            >
              <Input type="email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!'
                }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item> 
              <Button
                style={{ marginLeft: '5px' }}
                type="primary"
                htmlType="submit"
                block
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};
export default Login;
