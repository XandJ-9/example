import React from 'react';
import { Layout, Button, Breadcrumb, Tooltip, Popover, Space, Divider } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, SunOutlined, MoonOutlined, BgColorsOutlined, CheckOutlined } from '@ant-design/icons';
import { useTheme, PREDEFINED_COLORS, PREDEFINED_SIDEBAR_COLORS } from '../../contexts/ThemeContext';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  setMobileVisible: (visible: boolean) => void;
  breadcrumbs: any[];
  colorBgContainer: string;
}

const Header: React.FC<HeaderProps> = ({
  collapsed,
  setCollapsed,
  isMobile,
  setMobileVisible,
  breadcrumbs,
  colorBgContainer,
}) => {
  const { mode, toggleTheme, colorPrimary, setColorPrimary, sidebarColor, setSidebarColor } = useTheme();

  const colorContent = (
    <div className="w-56 p-2">
      <div className="mb-2 text-sm text-gray-500 font-medium">主色调</div>
      <div className="flex flex-wrap gap-2 mb-4">
        {PREDEFINED_COLORS.map((color) => (
          <div
            key={color}
            className="w-6 h-6 rounded cursor-pointer flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => setColorPrimary(color)}
          >
            {colorPrimary === color && <CheckOutlined className="text-white text-xs" />}
          </div>
        ))}
      </div>
      
      <Divider className="my-2" />
      
      <div className="mb-2 text-sm text-gray-500 font-medium">侧边栏颜色</div>
      <div className="flex flex-wrap gap-2">
        {PREDEFINED_SIDEBAR_COLORS.map((color) => (
          <div
            key={color}
            className="w-6 h-6 rounded cursor-pointer flex items-center justify-center shadow-sm hover:scale-110 transition-transform border border-gray-200"
            style={{ backgroundColor: color }}
            onClick={() => setSidebarColor(color)}
          >
            {sidebarColor === color && <CheckOutlined className={color === '#ffffff' ? "text-black text-xs" : "text-white text-xs"} />}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AntHeader style={{ 
      padding: '0 24px', 
      background: colorBgContainer, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      position: 'sticky', 
      top: 0, 
      zIndex: 99, 
      width: '100%', 
      boxShadow: '0 1px 4px rgba(0,21,41,.08)' 
    }}>
      <div className="flex items-center">
        <Button
          type="text"
          icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
          onClick={() => isMobile ? setMobileVisible(true) : setCollapsed(!collapsed)}
          className="mr-4"
        />
        <Breadcrumb items={breadcrumbs} />
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Popover content={colorContent} title="主题配色" trigger="click" placement="bottomRight">
          <Tooltip title="主题配色">
            <Button
              type="text"
              icon={<BgColorsOutlined />}
              className="flex items-center justify-center"
            />
          </Tooltip>
        </Popover>
        <Tooltip title={mode === 'light' ? '切换到暗色模式' : '切换到亮色模式'}>
          <Button
            type="text"
            icon={mode === 'light' ? <MoonOutlined /> : <SunOutlined />}
            onClick={toggleTheme}
            className="flex items-center justify-center"
          />
        </Tooltip>
        <span className="hidden sm:inline text-gray-500 ml-2">欢迎, 管理员</span>
        <Button type="link">退出</Button>
      </div>
    </AntHeader>
  );
};

export default Header;
