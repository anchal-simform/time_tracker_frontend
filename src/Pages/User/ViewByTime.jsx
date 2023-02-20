import {
  Button,
  Card,
  DatePicker,
  Form,
  Select,
  Space,
  Table,
  Typography
} from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { getTimeLogsByRange } from '../../api/api';
import { queryClient } from '../../App';
import { DATE_FORMAT, SERVER_DATE_FORMAT, VIEW_OPTIONS } from '../../constants';
import { formatDate, getWeekDates, minutesToHour } from '../../utils/helper';

dayjs.extend(customParseFormat);
const { Column } = Table;
const { RangePicker } = DatePicker;

const ViewByTime = () => {
  const [dateRange, setDateRange] = useState({
    fromDate: new Date(),
    toDate: new Date()
  });
  const [statsTableData, setStatsTableData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [viewType, setViewType] = useState('monthly');
  const handleRangeChange = (range) => {
    const [from = '', to = ''] = range ?? ['', ''];
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
        toast.error('Please select valid date range');
        return;
      }

      const params = new URLSearchParams({
        ...dateRange,
        viewType
      });
      const { data: timeLogs } = await queryClient.fetchQuery(
        [`time-logs/?${params.toString()}`],
        {
          queryFn: () => getTimeLogsByRange(params.toString())
        }
      );
      setStatsTableData(timeLogs?.data?.stats);
      setTableData(timeLogs?.data?.timeLogs);
    } catch (error) {
      toast.error('Failure in getting Timelogs');
    }
  };

  return (
    <div className="container">
      <Card size="default" title="View Time Range logs">
        <Form layout="vertical">
          <RangePicker
            defaultValue={[
              dayjs('2023/01/01', DATE_FORMAT),
              dayjs('2023/01/01', DATE_FORMAT)
            ]}
            onChange={handleRangeChange}
            format={DATE_FORMAT}
          />

          <Select
            style={{
              width: 300
            }}
            onChange={handleViewType}
            defaultValue={'monthly'}
            options={VIEW_OPTIONS}
          />
          <Button onClick={onSubmit}>View Entries</Button>
        </Form>
        <Space
          direction="vertical"
          style={{
            width: '100%'
          }}
        >
          <Typography.Text
            style={{
              fontSize: 32
            }}
          >
            View Stats Table Data
          </Typography.Text>

          <Table style={{ margin: 10 }} dataSource={statsTableData}>
            <Column
              title="Date Range"
              dataIndex={'field'}
              render={(text, record) => (
                <>
                  {viewType === 'weekly'
                    ? getWeekDates(record.field)
                    : record.field}
                </>
              )}
            />
            <Column
              title="Duration"
              dataIndex={'totalDuration'}
              render={(text, record) => minutesToHour(record.totalDuration)}
            />
          </Table>
        </Space>

        <Space
          direction="vertical"
          style={{
            width: '100%'
          }}
        >
          <Typography.Text
            style={{
              fontSize: 32
            }}
          >
            View TimeLogs
          </Typography.Text>
          <Table
            style={{ margin: 10 }}
            rowKey={(record) => record.id}
            dataSource={tableData}
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
                      <Link
                        to={`/user/update-entry/${record.id}`}
                        type="primary"
                      >
                        Edit
                      </Link>
                    </>
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
