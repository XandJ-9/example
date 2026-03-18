// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, Select, Upload, message } from 'antd';
import { PlusOutlined, ImportOutlined, DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { attendanceService } from '../../services/attendanceService';
import { AttendanceRequest as RequestType } from '../../services/mockData';

const { Option } = Select;

const AttendanceRequest: React.FC = () => {
  const [dataSource, setDataSource] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getAttendanceRequests();
      setDataSource(data);
    } catch (error) {
      message.error('获取申请记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const columns = [
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
    },
    {
      title: '申请类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        let color = 'blue';
        if (type === '请假') color = 'orange';
        if (type === '出差') color = 'purple';
        if (type === '外勤') color = 'cyan';
        if (type === '异常') color = 'red';
        if (type === '外出') color = 'green';
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '事由',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'processing';
        if (status === '已通过') color = 'success';
        if (status === '已拒绝') color = 'error';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link">查看详情</Button>
        </Space>
      ),
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

        // 映射导入的数据到我们的表格结构
        const newEntries = parsedData.map((item: any, index: number) => ({
          key: `import-${Date.now()}-${index}`,
          applicant: item['申请人'] || item['姓名'] || '未知',
          type: item['申请类型'] || item['类型'] || '请假',
          startTime: item['开始时间'] || item['起止时间']?.split('~')[0] || '未设置',
          endTime: item['结束时间'] || item['起止时间']?.split('~')[1] || '未设置',
          reason: item['事由'] || item['备注'] || '导入数据',
          status: '待审批',
        }));

        for (const entry of newEntries) {
          await attendanceService.addAttendanceRequest(entry);
        }
        await fetchRequests();
        message.success(`成功导入 ${newEntries.length} 条申请记录`);
      } catch (error) {
        console.error('Import error:', error);
        message.error('解析 Excel 文件失败，请检查文件格式');
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
    return false; // 阻止自动上传
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        '员工姓名': '张三',
        '部门': '技术部',
        '类型': '请假',
        '开始时间': '2024-03-18 09:00',
        '结束时间': '2024-03-18 18:00',
        '原因': '身体不适',
        '状态': '已通过'
      },
      {
        '员工姓名': '李四',
        '部门': '市场部',
        '类型': '出差',
        '开始时间': '2024-03-20 08:00',
        '结束时间': '2024-03-22 20:00',
        '原因': '客户拜访',
        '状态': '待审批'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '申请模板');
    XLSX.writeFile(wb, '考勤申请导入模板.xlsx');
    message.success('模板下载成功');
  };

  return (
    <Card 
      title="考勤申请记录" 
      variant="outlined"
      extra={
        <Space wrap>
          <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>下载模板</Button>
          <Upload 
            accept=".xlsx, .xls" 
            showUploadList={false} 
            beforeUpload={handleImport}
          >
            <Button icon={<ImportOutlined />}>导入申请</Button>
          </Upload>
          <Button type="primary" icon={<PlusOutlined />}>提交申请</Button>
        </Space>
      }
    >
      <Space style={{ marginBottom: 16 }} wrap>
        <Select defaultValue="all" style={{ width: 120 }}>
          <Option value="all">全部类型</Option>
          <Option value="leave">请假</Option>
          <Option value="trip">出差</Option>
          <Option value="field">外勤</Option>
          <Option value="outing">外出</Option>
          <Option value="abnormal">异常</Option>
        </Select>
        <Select defaultValue="all" style={{ width: 120 }}>
          <Option value="all">全部状态</Option>
          <Option value="pending">待审批</Option>
          <Option value="approved">已通过</Option>
          <Option value="rejected">已拒绝</Option>
        </Select>
      </Space>
      <Table 
        columns={columns} 
        dataSource={dataSource} 
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

export default AttendanceRequest;
