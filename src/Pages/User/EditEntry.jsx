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
import { useNavigate, useParams } from 'react-router-dom';
import {
  getAllProjects,
  getTasksByProjectId,
  getTimeLogEntry,
  updateEntry
} from '../../api/api';
import { queryClient } from '../../App';
import {
  formatInMinutes,
  formatOptions,
  minutesToDurationObject
} from '../../utils/helper';
import { SERVER_DATE_FORMAT } from '../../constants';
import moment from 'moment';

const EditEntry = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  const { timeLogId } = useParams();
  const [projectId, setProjectId] = useState('');
  const [initialDuration, setInitialDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [form] = Form.useForm();
  const { setFieldValue } = form;
  const navigate = useNavigate();
  const [projectOptions, setProjectOptions] = useState([]);
  const [taskOptions, setTaskOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const formLayout = 'vertical';
  const formItemLayout = null;
  const buttonItemLayout = null;

  const timeLogMutation = useMutation((payload) => updateEntry(payload), {
    onError: ({ data }) => {
      toast.error(data.message);
    }
  });

  const { data: projectData, projectIsLoading } = useQuery(
    'projects',
    getAllProjects
  );

  const { data, isLoading } = useQuery(
    [`/time-logs/${timeLogId}`, timeLogId],
    () => getTimeLogEntry(timeLogId),
    {
      // The query will not execute until the timeLogId exists
      enabled: !!timeLogId
    }
  );

  const getTaskOptions = async (projectId) => {
    const { data: tasks } = await queryClient.fetchQuery(
      [`projects/${projectId}/tasks`],
      {
        queryFn: () => getTasksByProjectId(projectId)
      }
    );
    //  Format the options in the Select component accepted Format
    const allOptions = formatOptions(tasks?.data ?? []);
    setTaskOptions(allOptions);
  };

  useEffect(() => {
    if (projectId) {
      getTaskOptions(projectId);
    }
  }, [projectId]);

  //eslint-disable-next-line
  useEffect(() => {
    if (!isLoading && data?.data?.data) {
      const { data: timeLog } = data.data;
      const { id: ProjectId } = timeLog.Project;
      const { id: TaskId } = timeLog.Task;
      const durationObj = minutesToDurationObject(timeLog?.duration);
      setProjectId(ProjectId);
      setFieldValue('project', ProjectId);
      setFieldValue('task', TaskId);
      setFieldValue('date', moment(timeLog?.date));
      setFieldValue('comment', timeLog?.comment);
      setFieldValue('timeDuration', durationObj);
      setInitialDuration(durationObj);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (
      !projectIsLoading &&
      projectData?.data?.data &&
      Array.isArray(projectData?.data?.data)
    ) {
      //  Format the options in the Select component accepted Format
      const allOptions = formatOptions(projectData.data.data);
      setProjectOptions(allOptions);
    }
  }, [projectData, projectIsLoading]);

  const onFinish = async (values) => {
    try {
      //  Format values before passing to the api
      values.date = values['date'].format(SERVER_DATE_FORMAT);
      values.duration = formatInMinutes(values['timeDuration']);
      setLoading(true);
      await timeLogMutation.mutate({ ...values, timeLogId });
      // Invalidate queryClient cache on edit query
      await queryClient.invalidateQueries();
      toast.success('Time log Updated Successfully');
      // Navigate to user entries Page
      navigate('/user/entries');
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error('Failure in Adding Time log');
    }
  };

  const handleProjectSelect = async (projectId) => {
    try {
      const { data: tasks } = await queryClient.fetchQuery(
        [`projects/${projectId}/tasks`],
        {
          queryFn: () => getTasksByProjectId(projectId)
        }
      );
      const allOptions = formatOptions(tasks.data);
      setFieldValue('task', null);
      setTaskOptions(allOptions);
    } catch (error) {
      toast.error('Failure in getting Project tasks');
    }
  };

  return (
    <div
      style={{
        padding: 24,
        background: colorBgContainer
      }}
    >
      <Card title="User Edit Time Log entry">
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
                  onSelect={handleProjectSelect}
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
              <Form.Item label="Enter Date" name="date">
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                  rules={[
                    {
                      required: true,
                      message: 'Select Date'
                    }
                  ]}
                />
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
                {initialDuration?.hours ? (
                  <DurationPicker
                    initialDuration={initialDuration}
                    maxHours={70}
                  />
                ) : (
                  ''
                )}
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
export default EditEntry;
