import {
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  FormOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import React from 'react';

export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

export const menuConfig: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: <DashboardOutlined />,
    path: '/',
  },
  {
    key: 'attendance-mgmt',
    label: '考勤管理',
    icon: <CalendarOutlined />,
    children: [
      {
        key: 'employee-mgmt',
        label: '员工管理',
        icon: <TeamOutlined />,
        path: '/attendance/employee',
      },
      {
        key: 'daily-attendance',
        label: '每日出勤',
        icon: <CalendarOutlined />,
        path: '/attendance/daily',
      },
      {
        key: 'attendance-request',
        label: '考勤申请',
        icon: <FormOutlined />,
        path: '/attendance/request',
      },
      {
        key: 'monthly-summary',
        label: '月度汇总',
        icon: <BarChartOutlined />,
        path: '/attendance/summary',
      },
    ],
  },
  {
    key: 'system-mgmt',
    label: '系统管理',
    icon: <SettingOutlined />,
    children: [
      {
        key: 'user-mgmt',
        label: '用户管理',
        icon: <TeamOutlined />,
        path: '/system/users',
      },
      {
        key: 'role-mgmt',
        label: '角色管理',
        icon: <SafetyCertificateOutlined />,
        path: '/system/roles',
      },
      {
        key: 'menu-mgmt',
        label: '菜单管理',
        icon: <SettingOutlined />,
        path: '/system/menus',
      },
    ],
  },
];
