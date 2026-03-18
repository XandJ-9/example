// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, DatePicker, Space, Input, Button, Upload, message } from 'antd';
import { SearchOutlined, ImportOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { attendanceService } from '../../services/attendanceService';
import { AttendanceRecord } from '../../services/mockData';

const DailyAttendance: React.FC = () => {
  const [date, setDate] = useState(dayjs());
  const [dataSource, setDataSource] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getDailyAttendance();
      setDataSource(data);
    } catch (error) {
      message.error('获取考勤记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
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
      title: '上班打卡',
      dataIndex: 'clockIn',
      key: 'clockIn',
      render: (time: string) => time || <Tag color="red">未打卡</Tag>,
    },
    {
      title: '下班打卡',
      dataIndex: 'clockOut',
      key: 'clockOut',
      render: (time: string) => time || <Tag color="red">未打卡</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        if (status === '迟到') color = 'orange';
        if (status === '早退') color = 'blue';
        if (status === '缺勤') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const handleImport = (file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);

        if (parsedData.length === 0) {
          message.warning('Excel 文件中没有有效数据');
          setLoading(false);
          return;
        }

        const newEntries = parsedData.map((item: any, index: number) => ({
          key: `import-${Date.now()}-${index}`,
          date: item['日期'] || dayjs().format('YYYY-MM-DD'),
          name: item['员工姓名'] || item['姓名'] || '未知',
          department: item['部门'] || '未分配',
          clockIn: item['上班打卡'] || item['上班时间'] || '',
          clockOut: item['下班打卡'] || item['下班时间'] || '',
          status: item['状态'] || '正常',
        }));

        await attendanceService.addAttendanceRecords(newEntries);
        await fetchAttendance();
        message.success(`成功导入 ${newEntries.length} 条打卡记录`);
      } catch (error) {
        console.error('Import error:', error);
        message.error('解析 Excel 文件失败，请检查文件格式');
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
    return false;
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        '日期': dayjs().format('YYYY-MM-DD'),
        '员工姓名': '张三',
        '部门': '技术部',
        '上班打卡': '09:00',
        '下班打卡': '18:00',
        '状态': '正常'
      },
      {
        '日期': dayjs().format('YYYY-MM-DD'),
        '员工姓名': '李四',
        '部门': '市场部',
        '上班打卡': '09:15',
        '下班打卡': '18:30',
        '状态': '迟到'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '考勤模板');
    XLSX.writeFile(wb, '每日出勤导入模板.xlsx');
    message.success('模板下载成功');
  };

  const filteredData = dataSource.filter(item => {
    if (!item.date) return true;
    return dayjs(item.date).format('YYYY-MM') === date.format('YYYY-MM');
  });

  return (
    <Card 
      title="每日出勤记录"
      variant="outlined"
      extra={
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>下载模板</Button>
          <Upload 
            accept=".xlsx, .xls" 
            showUploadList={false} 
            beforeUpload={handleImport}
          >
            <Button icon={<ImportOutlined />}>批量导入</Button>
          </Upload>
        </Space>
      }
    >
      <Space style={{ marginBottom: 16 }} wrap>
        <DatePicker picker="month" value={date} onChange={(d) => d && setDate(d)} />
        <Input placeholder="搜索员工姓名" prefix={<SearchOutlined />} style={{ width: 200 }} />
        <Button type="primary">查询</Button>
      </Space>
      <Table 
        columns={columns} 
        dataSource={filteredData} 
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

export default DailyAttendance;
