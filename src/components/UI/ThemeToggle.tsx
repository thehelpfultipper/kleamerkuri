import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import SunIcon from '../../icons/SunIcon';
import MoonIcon from '../../icons/MoonIcon';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      {theme === 'light' ? (
        <MoonIcon style={{ width: '1.25rem', height: '1.25rem' }} />
      ) : (
        <SunIcon style={{ width: '1.25rem', height: '1.25rem' }} />
      )}
    </button>
  );
};

export default ThemeToggle;
