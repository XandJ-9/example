import React, { useState, useEffect } from 'react';
import { Layout, theme } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import * as Icons from '@ant-design/icons';
import { systemService } from '../services/systemService';
import { Menu as MenuType } from '../services/mockData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const { Content, Footer } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menus, setMenus] = useState<MenuType[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await systemService.getMenus();
        setMenus(data);
      } catch (error) {
        console.error('Failed to fetch menus:', error);
      }
    };
    fetchMenus();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Helper to get icon component from string
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  // Helper to build menu tree and render items
  const buildMenuTree = (items: MenuType[], parentId?: string): any[] => {
    return items
      .filter(item => item.parentId === parentId && item.status === 'active')
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(item => {
        const children = buildMenuTree(items, item.key);
        if (children.length > 0) {
          return {
            key: item.key,
            icon: getIcon(item.icon),
            label: item.label,
            children: children,
          };
        }
        return {
          key: item.path || item.key,
          icon: getIcon(item.icon),
          label: <Link to={item.path || '#'}>{item.label}</Link>,
        };
      });
  };

  const menuItems = buildMenuTree(menus);

  // Dynamic breadcrumb logic
  const getBreadcrumbs = () => {
    const breadcrumbs = [{ title: <Link to="/">首页</Link> }];
    
    const findPath = (items: MenuType[], targetPath: string): string[] | null => {
      const item = items.find(i => i.path === targetPath);
      if (!item) return null;

      const path = [item.label];
      let current = item;
      while (current.parentId) {
        const parent = items.find(i => i.key === current.parentId);
        if (parent) {
          path.unshift(parent.label);
          current = parent;
        } else {
          break;
        }
      }
      return path;
    };

    const labels = findPath(menus, location.pathname);
    if (labels) {
      labels.forEach(label => {
        if (label !== '仪表盘') {
          breadcrumbs.push({ title: label });
        }
      });
    }
    
    return breadcrumbs;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar 
        collapsed={collapsed}
        mobileVisible={mobileVisible}
        setMobileVisible={setMobileVisible}
        isMobile={isMobile}
        menuItems={menuItems}
        pathname={location.pathname}
      />

      <Layout style={{ 
        marginLeft: isMobile ? 0 : (collapsed ? 80 : 220), 
        transition: 'all 0.2s',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Header 
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
          setMobileVisible={setMobileVisible}
          breadcrumbs={getBreadcrumbs()}
          colorBgContainer={colorBgContainer}
        />
        
        <Content className="m-4 md:m-6 flex-1">
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        
        <Footer style={{ textAlign: 'center' }}>
          Admin Management System ©{new Date().getFullYear()} Created by AI Studio
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
