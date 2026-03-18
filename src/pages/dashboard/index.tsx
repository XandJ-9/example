// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { UserOutlined, SafetyCertificateOutlined, AppstoreOutlined } from '@ant-design/icons';
import { api } from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, roles: 0, modules: 5 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, roles] = await Promise.all([
          api.getUsers(),
          api.getRoles()
        ]);
        
        setStats(prev => ({
          ...prev,
          users: users.length,
          roles: roles.length,
        }));
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">系统概览</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic
              title="用户总数"
              value={stats.users}
              prefix={<UserOutlined style={{ color: 'var(--ant-color-primary)' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic
              title="角色总数"
              value={stats.roles}
              prefix={<SafetyCertificateOutlined className="text-green-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card variant="borderless" className="shadow-sm">
            <Statistic
              title="系统模块"
              value={stats.modules}
              prefix={<AppstoreOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>
      </Row>
      <div className="mt-8">
        <Card title="欢迎回来" variant="borderless" className="shadow-sm">
          <p className="text-gray-600 dark:text-gray-400">
            这是您的基础后台管理系统。您可以在左侧菜单中管理用户和角色。
            系统采用了现代化的 UI 设计，支持响应式布局和动态面包屑导航。
          </p>
        </Card>
      </div>
    </div>
  );
}

