// src/services/attendanceService.ts
import { 
  AttendanceRecord, 
  AttendanceRequest, 
  MonthlySummaryRecord, 
  EmployeeRecord,
  mockAttendanceRecords as initialRecords, 
  mockAttendanceRequests as initialRequests, 
  mockMonthlySummary as initialSummary,
  mockEmployees as initialEmployees
} from './mockData';

let mockAttendanceRecords: AttendanceRecord[] = [...initialRecords];
let mockAttendanceRequests: AttendanceRequest[] = [...initialRequests];
let mockMonthlySummary: MonthlySummaryRecord[] = [...initialSummary];
let mockEmployees: EmployeeRecord[] = [...initialEmployees];

export const attendanceService = {
  // Daily Attendance
  getDailyAttendance: async (): Promise<AttendanceRecord[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockAttendanceRecords]), 300));
  },
  addAttendanceRecords: async (records: AttendanceRecord[]): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAttendanceRecords = [...records, ...mockAttendanceRecords];
        resolve();
      }, 300);
    });
  },

  // Attendance Requests
  getAttendanceRequests: async (): Promise<AttendanceRequest[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockAttendanceRequests]), 300));
  },
  addAttendanceRequest: async (request: AttendanceRequest): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAttendanceRequests = [request, ...mockAttendanceRequests];
        resolve();
      }, 300);
    });
  },

  // Monthly Summary
  getMonthlySummary: async (): Promise<MonthlySummaryRecord[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockMonthlySummary]), 300));
  },

  // Employee Management (Merged)
  getEmployees: async (): Promise<EmployeeRecord[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockEmployees]), 300));
  },
  addEmployee: async (employee: EmployeeRecord): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockEmployees = [employee, ...mockEmployees];
        resolve();
      }, 300);
    });
  },
  updateEmployee: async (key: string, data: Partial<EmployeeRecord>): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockEmployees.findIndex(e => e.key === key);
        if (index !== -1) mockEmployees[index] = { ...mockEmployees[index], ...data };
        resolve();
      }, 300);
    });
  },
  deleteEmployee: async (key: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockEmployees = mockEmployees.filter(e => e.key !== key);
        resolve();
      }, 300);
    });
  },
  batchAddEmployees: async (employees: EmployeeRecord[]): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockEmployees = [...employees, ...mockEmployees];
        resolve();
      }, 300);
    });
  },
};
