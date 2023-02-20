import { Button, Card, Table } from 'antd';
import React from 'react';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery } from 'react-query';
import { getUpdatedLogs, updateTimeLogStatus } from '../../api/api';
import { queryClient } from '../../App';
import { formatDate, minutesToHour } from '../../utils/helper';

const { Column } = Table;

const ViewUpdatedLogs = () => {
  const { data: timeLogs, isLoading } = useQuery(
    'updated-logs',
    getUpdatedLogs
  );

  const updateTimeLogMutation = useMutation(updateTimeLogStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries('updated-logs');
    }
  });

  const onActionClick = (timeLogId, actionType) => {
    try {
      updateTimeLogMutation.mutate({
        timeLogId: timeLogId,
        status: actionType
      });
    } catch (error) {
      toast.error('Failed to update time log status');
    }
  };

  return (
    <div className="container">
      <Card size="default" title="View Updated Time logs">
        <Table
          loading={isLoading}
          rowKey={(record) => record.id}
          dataSource={timeLogs?.data?.data?.timeLogs}
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
            render={(text, record) => (
              <span style={{ zIndex: '-1' }}>
                <Button
                  onClick={() => onActionClick(record.id, 'PENDING')}
                  type="primary"
                >
                  Move to Pending
                </Button>{' '}
              </span>
            )}
          />
        </Table>
      </Card>
    </div>
  );
};

export default ViewUpdatedLogs;
