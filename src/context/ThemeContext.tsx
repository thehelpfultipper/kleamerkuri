import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define theme types
export type ThemeType = 'default' | 'fun' | 'clean';

// Theme context interface
interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'default',
  setTheme: () => {},
});

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get theme from localStorage if available, otherwise use default
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('portfolio-theme');
      return (savedTheme as ThemeType) || 'default';
    }
    return 'default';
  });

  // Update document body class and localStorage when theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Remove all theme classes
      document.body.classList.remove('theme-default', 'theme-fun', 'theme-clean');
      // Add current theme class
      document.body.classList.add(`theme-${theme}`);
      // Save to localStorage
      localStorage.setItem('portfolio-theme', theme);
    }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

// Custom hook to use theme context
export const useTheme = () => useContext(ThemeContext);
