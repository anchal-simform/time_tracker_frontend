import { Card, Select, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getAllProjects, getTimeLogsByProjectId } from '../../api/api';
import { formatDate, formatOptions, minutesToHour } from '../../utils/helper';

const { Column } = Table;

const ViewByProject = () => {
  const { data, isLoading } = useQuery('projects', getAllProjects);
  const [projectOptions, setProjectOptions] = useState([]);
  const [projectId, setProjectId] = useState(null);

  const { data: timeLogs } = useQuery(
    [`time-logs/project/${projectId}`, projectId],
    () => getTimeLogsByProjectId(projectId),
    {
      // The query will not execute until the projectId exists
      enabled: !!projectId
    }
  );

  useEffect(() => {
    if (!isLoading && data?.data?.data && Array.isArray(data?.data?.data)) {
      //  Format the options in the Select component accepted Format
      const allOptions = formatOptions(data.data.data);
      setProjectOptions(allOptions);
    }
  }, [data, isLoading]);

  const handleProjectChange = async (projectId) => {
    setProjectId(projectId);
  };

  return (
    <div className="container">
      <Card size="default" title="View Time logs by project">
        <Select
          style={{
            width: 500
          }}
          onChange={handleProjectChange}
          options={projectOptions}
        />

        <Typography.Text>
          Total Duration : {minutesToHour(timeLogs?.data?.totalDuration)}
        </Typography.Text>
        <Table
          style={{ margin: 10 }}
          loading={isLoading}
          rowKey={(record) => record.id}
          dataSource={timeLogs?.data?.data}
        >
          <Column
            title="Project"
            dataIndex="Project.name"
            render={(_, record) => record.Project.name}
          />
          <Column
            title="Task"
            dataIndex="Task.name"
            render={(_, record) => record.Task.name}
          />
          <Column
            title="User"
            dataIndex="User.email"
            render={(_, record) => record.User.email}
          />
          <Column
            title="Duration"
            dataIndex="duration"
            render={(_, record) => minutesToHour(record.duration)}
          />
          <Column
            title="Date"
            dataIndex="date"
            render={(_, record) => formatDate(record.date)}
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

export default ViewByProject;
