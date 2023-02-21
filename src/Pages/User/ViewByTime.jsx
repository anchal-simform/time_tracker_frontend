import { EditFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { getTimeLogsByRange } from "../../api/api";
import { queryClient } from "../../App";

import { DATE_FORMAT, SERVER_DATE_FORMAT, VIEW_OPTIONS } from "../../constants";
import { formatDate, getWeekDates, minutesToHour } from "../../utils/helper";

dayjs.extend(customParseFormat);
const { Column } = Table;
const { RangePicker } = DatePicker;

const Styles = {
  textStyle: {
    fontSize: 16,
    marginBottom: "0",
    display: "block",
    fontWeight: "600",
  },
};

const ViewByTime = () => {
  const [dateRange, setDateRange] = useState({
    fromDate: new Date(),
    toDate: new Date(),
  });
  const [statsTableData, setStatsTableData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [viewType, setViewType] = useState("monthly");
  const handleRangeChange = (range) => {
    const [from = "", to = ""] = range ?? ["", ""];
    // Format the date in sever accepted date format and update the date range state
    const fromDate = from.format(SERVER_DATE_FORMAT);
    const toDate = to.format(SERVER_DATE_FORMAT);
    setDateRange({ fromDate, toDate });
    // Reset the table date on filter change
    setTableData([]);
    setStatsTableData([]);
  };

  const handleViewType = (value) => {
    setViewType(value);
    // Reset the table date on filter change
    setTableData([]);
    setStatsTableData([]);
  };

  const onSubmit = async () => {
    try {
      //  check validations if date range is valid date or not
      if (!dateRange.fromDate || !dateRange.toDate) {
        toast.error("Please select valid date range");
        return;
      }

      const params = new URLSearchParams({
        ...dateRange,
        viewType,
      });
      const { data: timeLogs } = await queryClient.fetchQuery(
        [`time-logs/?${params.toString()}`],
        {
          queryFn: () => getTimeLogsByRange(params.toString()),
        }
      );
      setStatsTableData(timeLogs?.data?.stats);
      setTableData(timeLogs?.data?.timeLogs);
    } catch (error) {
      toast.error("Failure in getting Timelogs");
    }
  };

  return (
    <div className="container">
      <Card
        className="page-body-card"
        size="default"
        title="View Time Range logs"
      >
        <Form layout="vertical" style={{ marginBottom: 20 }}>
          <RangePicker
            defaultValue={[
              dayjs("2023/01/01", DATE_FORMAT),
              dayjs("2023/01/01", DATE_FORMAT),
            ]}
            onChange={handleRangeChange}
            format={DATE_FORMAT}
          />

          <Select
            style={{
              width: 300,
              marginLeft: 10,
            }}
            onChange={handleViewType}
            defaultValue={"monthly"}
            options={VIEW_OPTIONS}
          />
          <Button
            style={{
              marginLeft: 10,
            }}
            type="primary"
            onClick={onSubmit}
          >
            View Time logs
          </Button>
        </Form>
        <Space
          direction="vertical"
          style={{
            width: "100%",
            marginBottom: 20,
          }}
        >
          <Typography.Text style={Styles.textStyle}>
            Time Range Statistics
          </Typography.Text>

          <Table dataSource={statsTableData}>
            <Column
              title="Date Range"
              dataIndex={"field"}
              render={(text, record) => (
                <>
                  {viewType === "weekly"
                    ? getWeekDates(record.field)
                    : record.field}
                </>
              )}
            />
            <Column
              title="Duration"
              dataIndex={"totalDuration"}
              render={(text, record) => minutesToHour(record.totalDuration)}
            />
          </Table>
        </Space>

        <Space
          direction="vertical"
          style={{
            width: "100%",
          }}
        >
          <Typography.Text style={Styles.textStyle}>
            TimeLogs by Time Range
          </Typography.Text>
          <Table rowKey={(record) => record.id} dataSource={tableData}>
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
                <span style={{ zIndex: "-1" }}>
                  {record.status === "ACCEPTED" ? (
                    ""
                  ) : (
                    <Tooltip title="Edit">
                      <Link
                        to={`/user/update-entry/${record.id}`}
                        type="primary"
                      >
                        <EditFilled title="Edit" />
                      </Link>
                    </Tooltip>
                  )}
                </span>
              )}
            />
          </Table>
        </Space>
      </Card>
    </div>
  );
};

export default ViewByTime;
