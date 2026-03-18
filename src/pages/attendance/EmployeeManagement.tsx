// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, DatePicker, Space, Input, Button, Upload, message, Modal, Form, Switch, TimePicker } from 'antd';
import { SearchOutlined, ImportOutlined, PlusOutlined, UserOutlined, ClockCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { attendanceService } from '../../services/attendanceService';
import { EmployeeRecord } from '../../services/mockData';

const EmployeeManagement: React.FC = () => {
  const [dataSource, setDataSource] = useState<EmployeeRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getEmployees();
      setDataSource(data);
    } catch (error) {
      message.error('获取员工列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRecord | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '入职日期',
      dataIndex: 'joinDate',
      key: 'joinDate',
      sorter: (a: EmployeeRecord, b: EmployeeRecord) => dayjs(a.joinDate).unix() - dayjs(b.joinDate).unix(),
    },
    {
      title: '离职日期',
      dataIndex: 'resignationDate',
      key: 'resignationDate',
      render: (date?: string) => date || '-',
    },
    {
      title: '上班时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time: string) => <Tag icon={<ClockCircleOutlined />} color="blue">{time}</Tag>,
    },
    {
      title: '下班时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (time: string) => <Tag icon={<ClockCircleOutlined />} color="cyan">{time}</Tag>,
    },
    {
      title: '是否试用',
      dataIndex: 'isProbation',
      key: 'isProbation',
      render: (isProbation: boolean) => (
        <Tag color={isProbation ? 'orange' : 'green'}>
          {isProbation ? '试用中' : '正式员工'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: EmployeeRecord) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record.key)}>删除</Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: EmployeeRecord) => {
    setEditingEmployee(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该员工吗？',
      onOk: async () => {
        try {
          await attendanceService.deleteEmployee(key);
          message.success('删除成功');
          fetchEmployees();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleImport = (file: File) => {
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
          return;
        }

        const newEntries = parsedData.map((item: any, index: number) => ({
          key: `import-${Date.now()}-${index}`,
          name: item['姓名'] || item['员工姓名'] || '未知',
          department: item['部门'] || '未分配',
          joinDate: item['入职日期'] || dayjs().format('YYYY-MM-DD'),
          resignationDate: item['离职日期'] || undefined,
          isProbation: item['是否试用'] === '是' || item['是否试用'] === true,
          startTime: item['上班时间'] || '09:00',
          endTime: item['下班时间'] || '18:00',
        }));

        await attendanceService.batchAddEmployees(newEntries);
        fetchEmployees();
        message.success(`成功导入 ${newEntries.length} 名员工信息`);
      } catch (error) {
        console.error('Import error:', error);
        message.error('解析 Excel 文件失败，请检查文件格式');
      }
    };
    reader.readAsBinaryString(file);
    return false;
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        '姓名': '张三',
        '部门': '技术部',
        '入职日期': '2023-01-01',
        '离职日期': '',
        '是否试用': '否',
        '上班时间': '09:00',
        '下班时间': '18:00'
      },
      {
        '姓名': '李四',
        '部门': '市场部',
        '入职日期': '2023-06-15',
        '离职日期': '',
        '是否试用': '是',
        '上班时间': '09:30',
        '下班时间': '18:30'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '员工模板');
    XLSX.writeFile(wb, '员工导入模板.xlsx');
    message.success('模板下载成功');
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (isModalVisible) {
      if (editingEmployee) {
        form.setFieldsValue({
          ...editingEmployee,
          joinDate: dayjs(editingEmployee.joinDate),
          resignationDate: editingEmployee.resignationDate ? dayjs(editingEmployee.resignationDate) : undefined,
          startTime: dayjs(editingEmployee.startTime, 'HH:mm'),
          endTime: dayjs(editingEmployee.endTime, 'HH:mm'),
        });
      } else {
        form.resetFields();
      }
    }
  }, [isModalVisible, editingEmployee, form]);

  const handleOk = () => {
    form.validateFields().then(async values => {
      const recordData = {
        ...values,
        joinDate: values.joinDate.format('YYYY-MM-DD'),
        resignationDate: values.resignationDate?.format('YYYY-MM-DD'),
        startTime: values.startTime.format('HH:mm'),
        endTime: values.endTime.format('HH:mm'),
      };

      try {
        if (values.key) {
          await attendanceService.updateEmployee(values.key, recordData);
          message.success('更新成功');
        } else {
          await attendanceService.addEmployee({
            ...recordData,
            key: Date.now().toString(),
          });
          message.success('添加成功');
        }
        setIsModalVisible(false);
        fetchEmployees();
      } catch (error) {
        message.error('保存失败');
      }
    });
  };

  return (
    <Card 
      title="员工管理"
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
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增员工
          </Button>
        </Space>
      }
    >
      <Space style={{ marginBottom: 16 }} wrap>
        <Input placeholder="搜索员工姓名" prefix={<SearchOutlined />} style={{ width: 200 }} />
        <Button type="primary">查询</Button>
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

      <Modal
        title={editingEmployee ? "编辑员工" : "新增员工"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        forceRender
      >
        <Form form={form} layout="vertical">
          <Form.Item name="key" hidden><Input /></Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item name="department" label="部门" rules={[{ required: true, message: '请输入部门' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="joinDate" label="入职日期" rules={[{ required: true, message: '请选择入职日期' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="resignationDate" label="离职日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="isProbation" label="是否试用" valuePropName="checked">
            <Switch />
          </Form.Item>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item name="startTime" label="上班时间" rules={[{ required: true, message: '请选择上班时间' }]} style={{ flex: 1 }}>
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="endTime" label="下班时间" rules={[{ required: true, message: '请选择下班时间' }]} style={{ flex: 1 }}>
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </Card>
  );
};

export default EmployeeManagement;
