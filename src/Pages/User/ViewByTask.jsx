import { Card, Select, Space, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getAllTasks, getTimeLogsByTaskId } from '../../api/api';
import { formatDate, formatOptions, minutesToHour } from '../../utils/helper';
import { EditFilled } from '@ant-design/icons';

const { Column } = Table;

const ViewByTask = () => {
  const { data, isLoading } = useQuery('tasks', getAllTasks);
  const [taskOptions, setTaskOptions] = useState([]);
  const [taskId, setTaskId] = useState(null);

  const { data: timeLogs } = useQuery(
    [`time-logs/task/${taskId}`, taskId],
    () => getTimeLogsByTaskId(taskId),
    {
      // The query will not execute until the userId exists
      enabled: !!taskId
    }
  );

  useEffect(() => {
    if (!isLoading && data?.data?.data && Array.isArray(data?.data?.data)) {
      //  Format the options in the Select component accepted Format
      const allOptions = formatOptions(data.data.data);
      setTaskOptions(allOptions);
    }
  }, [data, isLoading]);

  const handleTaskChange = async (option) => {
    setTaskId(option);
  };

  return (
    <div className="container">
      <Card size="default" title="View Time logs by Task">
        <Select
          style={{
            width: 500
          }}
          onChange={handleTaskChange}
          options={taskOptions}
        />
        <Space
          direction="vertical"
          style={{
            width: '100%',
            marginTop: 5
          }}
        >
          <Typography.Text
            style={{
              marginLeft: 10
            }}
          >
            Total Duration : {minutesToHour(timeLogs?.data?.totalDuration)}
          </Typography.Text>
        </Space>
        <Table
          style={{ margin: 10 }}
          loading={isLoading}
          rowKey={(record) => record.id}
          dataSource={timeLogs?.data?.data}
        >
          <Column
            title="Project"
            dataIndex="Project.name"
            render={(text, record) => record.Project.name}
          />
          <Column
            title="Task"
            dataIndex="Task.name"
            render={(text, record) => record.Task.name}
          />
          <Column
            title="User"
            dataIndex="User.email"
            render={(text, record) => record.User.email}
          />
          <Column
            title="Duration"
            dataIndex="duration"
            render={(text, record) => minutesToHour(record.duration)}
          />
          <Column
            title="Date"
            dataIndex="date"
            render={(text, record) => formatDate(record.date)}
          />
          <Column title="Status" dataIndex="status" />
          <Column
            title="Action"
            dataIndex="Action"
            render={(_, record) => (
              <span style={{ zIndex: '-1' }}>
                {record.status === 'ACCEPTED' ? (
                  ''
                ) : (
                  <>
                    <Link to={`/user/update-entry/${record.id}`} type="primary">
                      <EditFilled title="Edit" />
                    </Link>
                  </>
                )}
              </span>
            )}
          />
        </Table>
      </Card>
    </div>
  );
};

export default ViewByTask;
