import { Card, Select, Space, Table, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { getAllProjects, getTimeLogsByProjectId } from "../../api/api";
import { formatDate, formatOptions, minutesToHour } from "../../utils/helper";
import { EditFilled } from "@ant-design/icons";

const { Column } = Table;

const ViewByProject = () => {
  const { data, isLoading } = useQuery("projects", getAllProjects);
  const [projectOptions, setProjectOptions] = useState([]);
  const [projectId, setProjectId] = useState(null);

  const { data: timeLogs } = useQuery(
    [`time-logs/project/${projectId}`, projectId],
    () => getTimeLogsByProjectId(projectId),
    {
      // The query will not execute until the projectId exists
      enabled: !!projectId,
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
      <Card
        className="page-body-card"
        size="default"
        title="View Time logs by project"
      >
        <Space
          style={{
            width: "100%",
            marginBottom: 10,
            justifyContent: "space-between",
          }}
        >
          <Typography.Text
            style={{
              marginRight: "auto",
            }}
          >
            Total Duration : {minutesToHour(timeLogs?.data?.totalDuration)}
          </Typography.Text>
          <Select
            style={{
              width: 200,
            }}
            onChange={handleProjectChange}
            options={projectOptions}
          />
        </Space>
        <Table
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
          <Column title="Status" dataIndex="status" />
          <Column
            title="Action"
            dataIndex="Action"
            render={(_, record) => (
              <span style={{ zIndex: "-1" }}>
                {record.status === "ACCEPTED" ? (
                  ""
                ) : (
                  <Tooltip title="Edit"> 
                    <Link to={`/user/update-entry/${record.id}`} type="primary">
                      <EditFilled title="Edit" />
                    </Link> 
                  </Tooltip>
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
