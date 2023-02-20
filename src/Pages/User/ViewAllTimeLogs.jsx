import { Card, Table, Typography } from 'antd';
import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getUserTimeLogs } from '../../api/api';
import { formatDate, minutesToHour } from '../../utils/helper';

const { Column } = Table;

const ViewAllTimeLogs = () => {
  const {
    data: timeLogs,
    isLoading,
    isFetching
  } = useQuery('time-logs/by-user', getUserTimeLogs);

  return (
    <div className="container">
      <Card size="default" title="View Pending Time logs">
        <Typography.Text>
          Total Duration : {minutesToHour(timeLogs?.data?.totalDuration)}
        </Typography.Text>
        <Table
          style={{ margin: 10 }}
          loading={isLoading || isFetching}
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
          <Column title="Comment" dataIndex="comment" />
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
                      Edit
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

export default ViewAllTimeLogs;
