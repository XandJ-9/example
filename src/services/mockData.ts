// src/services/mockData.ts

export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createTime: string;
}

export interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
  createTime: string;
}

export interface EmployeeRecord {
  key: string;
  name: string;
  department: string;
  joinDate: string;
  resignationDate?: string;
  isProbation: boolean;
  startTime: string;
  endTime: string;
}

export interface AttendanceRecord {
  key: string;
  date: string;
  name: string;
  department: string;
  clockIn: string;
  clockOut: string;
  status: string;
}

export interface AttendanceRequest {
  key: string;
  applicant: string;
  type: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: string;
}

export interface MonthlySummaryRecord {
  key: string;
  name: string;
  department: string;
  requiredDays: number;
  actualDays: number;
  lateCount: number;
  earlyLeaveCount: number;
  absentDays: number;
  leaveDays: number;
}

export interface Menu {
  key: string;
  label: string;
  icon?: string;
  path?: string;
  parentId?: string;
  order?: number;
  status: 'active' | 'inactive';
  createTime: string;
}

export const mockUsers: User[] = [
  { id: 1, username: 'admin', nickname: '超级管理员', email: 'admin@example.com', role: 'Admin', status: 'active', createTime: '2024-01-01' },
  { id: 2, username: 'user1', nickname: '普通用户', email: 'user1@example.com', role: 'User', status: 'active', createTime: '2024-02-15' },
  { id: 3, username: 'guest', nickname: '访客', email: 'guest@example.com', role: 'Guest', status: 'inactive', createTime: '2024-03-10' },
];

export const mockRoles: Role[] = [
  { id: 1, name: '管理员', code: 'ROLE_ADMIN', description: '拥有系统所有权限', status: 'active', createTime: '2024-01-01' },
  { id: 2, name: '普通用户', code: 'ROLE_USER', description: '拥有基础业务权限', status: 'active', createTime: '2024-01-01' },
  { id: 3, name: '访客', code: 'ROLE_GUEST', description: '仅拥有查看权限', status: 'active', createTime: '2024-01-01' },
];

export const mockEmployees: EmployeeRecord[] = [
  { key: '1', name: '张三', department: '技术部', joinDate: '2023-01-01', isProbation: false, startTime: '09:00', endTime: '18:00' },
  { key: '2', name: '李四', department: '市场部', joinDate: '2023-06-15', isProbation: true, startTime: '09:30', endTime: '18:30' },
  { key: '3', name: '王五', department: '行政部', joinDate: '2022-10-20', resignationDate: '2024-01-15', isProbation: false, startTime: '08:30', endTime: '17:30' },
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  { key: '1', date: '2026-03-17', name: '张三', department: '技术部', clockIn: '08:55', clockOut: '18:05', status: '正常' },
  { key: '2', date: '2026-03-17', name: '李四', department: '市场部', clockIn: '09:15', clockOut: '18:10', status: '迟到' },
  { key: '3', date: '2026-03-16', name: '王五', department: '行政部', clockIn: '08:50', clockOut: '17:50', status: '早退' },
  { key: '4', date: '2026-03-16', name: '赵六', department: '技术部', clockIn: '', clockOut: '', status: '缺勤' },
];

export const mockAttendanceRequests: AttendanceRequest[] = [
  { key: '1', applicant: '张三', type: '请假', startTime: '2026-03-20', endTime: '2026-03-22', reason: '家里有事', status: '待审批' },
  { key: '2', applicant: '李四', type: '出差', startTime: '2026-03-18', endTime: '2026-03-25', reason: '客户拜访', status: '已通过' },
  { key: '3', applicant: '王五', type: '外勤', startTime: '2026-03-17 14:00', endTime: '2026-03-17 18:00', reason: '去税务局', status: '已拒绝' },
];

export const mockMonthlySummary: MonthlySummaryRecord[] = [
  { key: '1', name: '张三', department: '技术部', requiredDays: 22, actualDays: 22, lateCount: 0, earlyLeaveCount: 0, absentDays: 0, leaveDays: 0 },
  { key: '2', name: '李四', department: '市场部', requiredDays: 22, actualDays: 21, lateCount: 3, earlyLeaveCount: 0, absentDays: 0, leaveDays: 1 },
  { key: '3', name: '王五', department: '行政部', requiredDays: 22, actualDays: 20, lateCount: 1, earlyLeaveCount: 2, absentDays: 0, leaveDays: 2 },
];

export const mockMenus: Menu[] = [
  { key: 'dashboard', label: '仪表盘', icon: 'DashboardOutlined', path: '/', order: 1, status: 'active', createTime: '2024-01-01' },
  { key: 'attendance-mgmt', label: '考勤管理', icon: 'CalendarOutlined', order: 2, status: 'active', createTime: '2024-01-01' },
  { key: 'employee-mgmt', label: '员工管理', icon: 'TeamOutlined', path: '/attendance/employee', parentId: 'attendance-mgmt', order: 1, status: 'active', createTime: '2024-01-01' },
  { key: 'daily-attendance', label: '每日出勤', icon: 'CalendarOutlined', path: '/attendance/daily', parentId: 'attendance-mgmt', order: 2, status: 'active', createTime: '2024-01-01' },
  { key: 'attendance-request', label: '考勤申请', icon: 'FormOutlined', path: '/attendance/request', parentId: 'attendance-mgmt', order: 3, status: 'active', createTime: '2024-01-01' },
  { key: 'monthly-summary', label: '月度汇总', icon: 'BarChartOutlined', path: '/attendance/summary', parentId: 'attendance-mgmt', order: 4, status: 'active', createTime: '2024-01-01' },
  { key: 'system-mgmt', label: '系统管理', icon: 'SettingOutlined', order: 3, status: 'active', createTime: '2024-01-01' },
  { key: 'user-mgmt', label: '用户管理', icon: 'TeamOutlined', path: '/system/users', parentId: 'system-mgmt', order: 1, status: 'active', createTime: '2024-01-01' },
  { key: 'role-mgmt', label: '角色管理', icon: 'SafetyCertificateOutlined', path: '/system/roles', parentId: 'system-mgmt', order: 2, status: 'active', createTime: '2024-01-01' },
  { key: 'menu-mgmt', label: '菜单管理', icon: 'MenuOutlined', path: '/system/menus', parentId: 'system-mgmt', order: 3, status: 'active', createTime: '2024-01-01' },
];
