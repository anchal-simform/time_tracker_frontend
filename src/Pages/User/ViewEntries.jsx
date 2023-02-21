import { Tabs } from 'antd';
import ViewAllTimeLogs from './ViewAllTimeLogs';
import ViewByProject from './ViewByProject';
import ViewByTask from './ViewByTask';
import ViewByTime from './ViewByTime';

const items = [
  {
    key: '1',
    label: `View All Logs`,
    children: <ViewAllTimeLogs />
  },
  {
    key: '2',
    label: `View Project Logs`,
    children: <ViewByProject />
  },
  {
    key: '3',
    label: `View Task Logs`,
    children: <ViewByTask />
  },
  {
    key: '4',
    label: `View Time Range Logs`,
    children: <ViewByTime />
  }
];
const ViewEntries = () => <Tabs defaultActiveKey="1" items={items} />;

export default ViewEntries;
