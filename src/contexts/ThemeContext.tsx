import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme | null;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    let resolved: Theme = 'dark'; // fallback if everything else fails

    try {
      const stored = window.localStorage.getItem('theme') as Theme | null;
      if (stored === 'light' || stored === 'dark') {
        resolved = stored;
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        resolved = 'dark';
      } else {
        resolved = 'light';
      }
    } catch (error) {
      console.warn(`Theme detectionf failure: ${error}`);
    }

    setTheme(resolved);
  }, []);

  useEffect(() => {
    if (theme == null) return;
    const root = window.document.documentElement;
    root.setAttribute('data-bs-theme', theme);
    try {
      window.localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Could not save theme to localStorage', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
