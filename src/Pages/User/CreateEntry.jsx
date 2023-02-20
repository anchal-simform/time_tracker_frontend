import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Spin,
  theme
} from 'antd';
import React, { useEffect, useState } from 'react';
import DurationPicker from 'react-duration-picker';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  createEntry,
  getAllProjects,
  getTasksByProjectId
} from '../../api/api';
import { queryClient } from '../../App';
import { SERVER_DATE_FORMAT } from '../../constants';
import { formatInMinutes, formatOptions } from '../../utils/helper';

const CreateEntry = () => {
  const timeLogMutation = useMutation((payload) => createEntry(payload), {
    onError: ({ data }) => {
      toast.error(data.message);
    }
  });
  const { data, isLoading } = useQuery('projects', getAllProjects);
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  const [form] = Form.useForm();
  const { setFieldValue } = form;
  const navigate = useNavigate();
  const [projectOptions, setProjectOptions] = useState([]);
  const [taskOptions, setTaskOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const formLayout = 'vertical';
  const formItemLayout = null;
  const buttonItemLayout = null;

  const handleProjectChange = async (projectId) => {
    try {
      const { data: tasks } = await queryClient.fetchQuery(
        [`projects/${projectId}/tasks`],
        {
          queryFn: () => getTasksByProjectId(projectId)
        }
      );
      const allOptions = formatOptions(tasks.data);
      // Set task id null when the project is changed as the task if selected may not be associated to that project
      setFieldValue('task', null);
      setTaskOptions(allOptions);
    } catch (error) {}
  };

  const onFinish = async (values) => {
    try {
      values.date = values['date'].format(SERVER_DATE_FORMAT);
      values.duration = formatInMinutes(values['timeDuration']);
      setLoading(true);
      await timeLogMutation.mutate(values);
      toast.success('Time log created Successfully');
      navigate('/user/entries');
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error('Failure in Adding Time log');
    }
  };

  useEffect(() => {
    if (!isLoading && data?.data?.data && Array.isArray(data?.data?.data)) {
      //  Format the options in the Select component accepted Format
      const allOptions = formatOptions(data.data.data);
      setProjectOptions(allOptions);
    }
  }, [data, isLoading]);

  return (
    <div
      style={{
        padding: 24,
        background: colorBgContainer
      }}
    >
      <Card title="User Create Time Log entry">
        <div className="center__form">
          <Form
            {...formItemLayout}
            layout={formLayout}
            form={form}
            style={{
              maxWidth: 500,
              textAlign: 'center',
              margin: 'auto'
            }}
            initialValues={{
              project: '',
              task: '',
              comment: '',
              date: ''
            }}
            size={'default'}
            onFinish={onFinish}
          >
            <Spin spinning={loading}>
              <Form.Item
                label="Select Project"
                name="project"
                rules={[
                  {
                    required: true,
                    message: 'Select Project'
                  }
                ]}
              >
                <Select
                  onSelect={handleProjectChange}
                  options={projectOptions}
                />
              </Form.Item>
              <Form.Item
                label="Select Task"
                name={'task'}
                rules={[
                  {
                    required: true,
                    message: 'Select Task'
                  }
                ]}
              >
                <Select options={taskOptions} />
              </Form.Item>
              <Form.Item
                label="Enter Date"
                name="date"
                rules={[
                  {
                    required: true,
                    message: 'Select Date'
                  }
                ]}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label="Enter Comment"
                name="comment"
                rules={[
                  {
                    required: true,
                    message: 'Please input comment'
                  }
                ]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                label="Task Duration"
                name={'timeDuration'}
                rules={[
                  {
                    required: true,
                    message: 'Please Enter duration'
                  }
                ]}
              >
                <DurationPicker
                  initialDuration={{ hours: 0, minutes: 0, seconds: 0 }}
                  maxHours={70}
                />
              </Form.Item>
              <Form.Item
                {...buttonItemLayout}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%'
                }}
              >
                <Button
                  style={{
                    width: '200px'
                  }}
                  type="dashed"
                  htmlType="reset"
                >
                  Cancel
                </Button>
                <Button
                  style={{
                    width: '200px'
                  }}
                  type="primary"
                  htmlType="submit"
                >
                  Submit
                </Button>
              </Form.Item>
            </Spin>
          </Form>
        </div>
      </Card>
    </div>
  );
};
export default CreateEntry;
