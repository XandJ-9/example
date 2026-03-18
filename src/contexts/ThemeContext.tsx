import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';

type ThemeMode = 'light' | 'dark';

export const PREDEFINED_COLORS = [
  '#1677ff', // Default Blue
  '#52c41a', // Green
  '#faad14', // Yellow
  '#f5222d', // Red
  '#722ed1', // Purple
  '#13c2c2', // Cyan
  '#eb2f96', // Pink
  '#fa8c16', // Orange
];

export const PREDEFINED_SIDEBAR_COLORS = [
  '#001529', // Default Dark (Ant Design)
  '#141414', // Pure Dark
  '#1e293b', // Slate 800
  '#111827', // Gray 900
  '#312e81', // Indigo 900
  '#4c1d95', // Violet 900
  '#831843', // Pink 900
  '#ffffff', // White (Light mode sidebar)
];

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  colorPrimary: string;
  setColorPrimary: (color: string) => void;
  sidebarColor: string;
  setSidebarColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return (savedMode as ThemeMode) || 'light';
  });

  const [colorPrimary, setPrimaryColor] = useState<string>(() => {
    return localStorage.getItem('theme-color') || PREDEFINED_COLORS[0];
  });

  const [sidebarColor, setSidebarColorState] = useState<string>(() => {
    return localStorage.getItem('theme-sidebar-color') || PREDEFINED_SIDEBAR_COLORS[0];
  });

  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  };

  const setColorPrimary = (color: string) => {
    setPrimaryColor(color);
    localStorage.setItem('theme-color', color);
  };

  const setSidebarColor = (color: string) => {
    setSidebarColorState(color);
    localStorage.setItem('theme-sidebar-color', color);
  };

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, colorPrimary, setColorPrimary, sidebarColor, setSidebarColor }}>
      <ConfigProvider
        theme={{
          cssVar: true,
          hashed: false,
          algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary,
            borderRadius: 8,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
