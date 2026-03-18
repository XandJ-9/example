// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, message, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  FolderOpenOutlined,
  FileOutlined
} from '@ant-design/icons';
import * as Icons from '@ant-design/icons';
import { systemService } from '../../services/systemService';
import { Menu } from '../../services/mockData';

const MenuManagement: React.FC = () => {
  const [dataSource, setDataSource] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const data = await systemService.getMenus();
      const treeData = buildMenuTree(data);
      setDataSource(treeData);
    } catch (error) {
      message.error('获取菜单数据失败');
    } finally {
      setLoading(false);
    }
  };

  const buildMenuTree = (menus: Menu[]) => {
    const menuMap: { [key: string]: any } = {};
    const tree: any[] = [];

    menus.forEach(menu => {
      menuMap[menu.key] = { ...menu, children: [] };
    });

    menus.forEach(menu => {
      if (menu.parentId && menuMap[menu.parentId]) {
        menuMap[menu.parentId].children.push(menuMap[menu.key]);
      } else {
        tree.push(menuMap[menu.key]);
      }
    });

    const cleanTree = (nodes: any[]) => {
      nodes.forEach(node => {
        if (node.children.length === 0) {
          delete node.children;
        } else {
          // Sort children by order
          node.children.sort((a, b) => (a.order || 0) - (b.order || 0));
          cleanTree(node.children);
        }
      });
    };
    
    // Sort root level
    tree.sort((a, b) => (a.order || 0) - (b.order || 0));
    cleanTree(tree);

    return tree;
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent style={{ fontSize: '16px' }} /> : null;
  };

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'label',
      key: 'label',
      width: 250,
      render: (text: string, record: any) => (
        <Space>
          {record.children ? <FolderOpenOutlined style={{ color: '#1890ff' }} /> : <FileOutlined style={{ color: '#8c8c8c' }} />}
          <span className="font-medium">{text}</span>
        </Space>
      ),
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
      align: 'center',
      render: (icon: string) => renderIcon(icon),
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      width: 200,
      render: (path: string) => (
        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs text-pink-600 dark:text-pink-400">
          {path || '-'}
        </code>
      ),
    },
    {
      title: '组件Key',
      dataIndex: 'key',
      key: 'key',
      width: 150,
      render: (key: string) => <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">{key}</span>,
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'} className="rounded-full px-3">
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      render: (time: string) => <span className="text-gray-400 dark:text-gray-500 text-xs">{time}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: () => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button type="text" size="small" icon={<EditOutlined style={{ color: 'var(--ant-color-primary)' }} />} />
          </Tooltip>
          <Tooltip title="新增子项">
            <Button type="text" size="small" icon={<PlusOutlined className="text-green-500" />} />
          </Tooltip>
          <Tooltip title="删除">
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-0">
      <Card 
        variant="borderless"
        className="shadow-sm"
        title={
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: 'var(--ant-color-primary)' }} />
            <span className="text-lg font-semibold">菜单资源管理</span>
          </div>
        }
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchMenus} 
              loading={loading}
              className="flex items-center"
            >
              同步数据
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              className="flex items-center"
            >
              新增根菜单
            </Button>
          </Space>
        }
      >
        <Table 
          columns={columns} 
          dataSource={dataSource} 
          loading={loading}
          rowKey="key"
          scroll={{ x: 800 }}
          pagination={false}
          className="border border-gray-100 rounded-lg overflow-hidden"
          expandable={{
            defaultExpandAllRows: true,
            expandIcon: ({ expanded, onExpand, record }) =>
              record.children ? (
                <span 
                  className="mr-2 cursor-pointer text-gray-400 transition-colors"
                  style={{ color: expanded ? 'var(--ant-color-primary)' : undefined }}
                  onClick={e => onExpand(record, e)}
                >
                  {expanded ? '▼' : '▶'}
                </span>
              ) : <span className="mr-6" />
          }}
        />
      </Card>
    </div>
  );
};

export default MenuManagement;
