import React from 'react';
import { Layout, Menu, Drawer, ConfigProvider } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  mobileVisible: boolean;
  setMobileVisible: (visible: boolean) => void;
  isMobile: boolean;
  menuItems: any[];
  pathname: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  mobileVisible,
  setMobileVisible,
  isMobile,
  menuItems,
  pathname,
}) => {
  const { mode, sidebarColor } = useTheme();
  
  // Determine if the sidebar color is light or dark
  const isLightSidebar = sidebarColor === '#ffffff';
  const sidebarTheme = isLightSidebar ? 'light' : 'dark';
  const textColor = isLightSidebar ? 'text-gray-800' : 'text-white';
  const borderColor = isLightSidebar ? 'border-gray-100' : 'border-white/10';

  const SidebarContent = (
    <>
      <div className={`h-16 flex items-center justify-center text-lg font-bold border-b ${textColor} ${borderColor}`}>
        {collapsed ? 'ADMIN' : '后台管理系统'}
      </div>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              colorItemBg: 'transparent',
              colorSubItemBg: 'transparent',
              colorItemBgActive: isLightSidebar ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)',
              colorItemBgSelected: isLightSidebar ? 'var(--ant-color-primary-bg)' : 'var(--ant-color-primary)',
              colorItemTextSelected: isLightSidebar ? 'var(--ant-color-primary)' : '#fff',
            },
          },
        }}
      >
        <Menu 
          theme={sidebarTheme} 
          selectedKeys={[pathname]} 
          defaultOpenKeys={['system-mgmt']}
          mode="inline" 
          items={menuItems} 
          onClick={() => setMobileVisible(false)}
          style={{ background: 'transparent', borderRight: 0 }}
        />
      </ConfigProvider>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        title={<span className={textColor}>后台管理系统</span>}
        placement="left"
        onClose={() => setMobileVisible(false)}
        open={mobileVisible}
        styles={{
          body: { padding: 0, background: sidebarColor },
          header: { 
            background: sidebarColor, 
            borderBottom: `1px solid ${isLightSidebar ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)'}` 
          }
        }}
        width={240}
        closeIcon={<span className={textColor}>X</span>}
      >
        {SidebarContent}
      </Drawer>
    );
  }

  return (
    <Sider 
      trigger={null}
      collapsible
      collapsed={collapsed} 
      width={220}
      theme={sidebarTheme}
      className="hidden md:block"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        background: sidebarColor,
        boxShadow: isLightSidebar ? '2px 0 8px rgba(0,29,58,0.08)' : 'none'
      }}
    >
      {SidebarContent}
    </Sider>
  );
};

export default Sidebar;
