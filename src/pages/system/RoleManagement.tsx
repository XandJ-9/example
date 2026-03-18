// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, message, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { api, Role } from '../../services/api';

const { Option } = Select;
const { TextArea } = Input;

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await api.getRoles();
      setRoles(data);
    } catch (error) {
      message.error('获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAdd = () => {
    setEditingRole(null);
    setIsModalVisible(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (isModalVisible) {
      if (editingRole) {
        form.setFieldsValue(editingRole);
      } else {
        form.resetFields();
      }
    }
  }, [isModalVisible, editingRole, form]);

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该角色吗？',
      onOk: async () => {
        try {
          await api.deleteRole(id);
          message.success('删除成功');
          fetchRoles();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRole) {
        await api.updateRole(editingRole.id, values);
        message.success('更新成功');
      } else {
        await api.addRole(values);
        message.success('添加成功');
      }
      setIsModalVisible(false);
      fetchRoles();
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  const columns = [
    { title: '角色名称', dataIndex: 'name', key: 'name' },
    { title: '角色编码', dataIndex: 'code', key: 'code' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Role) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="角色管理" 
      variant="outlined"
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增角色</Button>}
      styles={{ header: { padding: '0 16px' }, body: { padding: '16px' } }}
    >
      <Table 
        columns={columns} 
        dataSource={roles} 
        rowKey="id" 
        loading={loading} 
        scroll={{ x: 800 }}
      />
      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        forceRender
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="角色编码" rules={[{ required: true, message: '请输入角色编码' }]}>
            <Input disabled={!!editingRole} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select>
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default RoleManagement;
