// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Table, Card, DatePicker, Space, Button, message } from 'antd';
import dayjs from 'dayjs';
import { attendanceService } from '../../services/attendanceService';
import { MonthlySummaryRecord } from '../../services/mockData';

const MonthlySummary: React.FC = () => {
  const [data, setData] = useState<MonthlySummaryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const result = await attendanceService.getMonthlySummary();
      setData(result);
    } catch (error) {
      message.error('获取汇总数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const columns = [
    {
      title: '员工姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '应出勤天数',
      dataIndex: 'requiredDays',
      key: 'requiredDays',
    },
    {
      title: '实际出勤天数',
      dataIndex: 'actualDays',
      key: 'actualDays',
    },
    {
      title: '迟到次数',
      dataIndex: 'lateCount',
      key: 'lateCount',
      render: (count: number) => <span style={{ color: count > 0 ? 'red' : 'inherit' }}>{count}</span>,
    },
    {
      title: '早退次数',
      dataIndex: 'earlyLeaveCount',
      key: 'earlyLeaveCount',
      render: (count: number) => <span style={{ color: count > 0 ? 'red' : 'inherit' }}>{count}</span>,
    },
    {
      title: '缺勤天数',
      dataIndex: 'absentDays',
      key: 'absentDays',
      render: (count: number) => <span style={{ color: count > 0 ? 'red' : 'inherit' }}>{count}</span>,
    },
    {
      title: '请假天数',
      dataIndex: 'leaveDays',
      key: 'leaveDays',
    },
  ];

  return (
    <Card title="月度考勤汇总" variant="outlined">
      <Space style={{ marginBottom: 16 }} wrap>
        <DatePicker picker="month" defaultValue={dayjs()} />
        <Button type="primary">导出报表</Button>
      </Space>
      <Table 
        columns={columns} 
        dataSource={data} 
        loading={loading} 
        scroll={{ x: 'max-content' }} 
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条数据`,
          pageSizeOptions: ['10', '20', '50', '100'],
          defaultPageSize: 10,
        }}
      />
    </Card>
  );
};

export default MonthlySummary;
