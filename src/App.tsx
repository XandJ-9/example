import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/dashboard';
import UserManagement from './pages/system/UserManagement';
import RoleManagement from './pages/system/RoleManagement';
import MenuManagement from './pages/system/MenuManagement';
import DailyAttendance from './pages/attendance/DailyAttendance';
import EmployeeManagement from './pages/attendance/EmployeeManagement';
import AttendanceRequest from './pages/attendance/AttendanceRequest';
import MonthlySummary from './pages/attendance/MonthlySummary';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/system/users" element={<UserManagement />} />
            <Route path="/system/roles" element={<RoleManagement />} />
            <Route path="/system/menus" element={<MenuManagement />} />
            <Route path="/attendance/employee" element={<EmployeeManagement />} />
            <Route path="/attendance/daily" element={<DailyAttendance />} />
            <Route path="/attendance/request" element={<AttendanceRequest />} />
            <Route path="/attendance/summary" element={<MonthlySummary />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
