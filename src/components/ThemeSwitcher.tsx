import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { useTheme, ThemeType } from '../context/ThemeContext';

// Styled components
const ThemeToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: 'rgba(211, 211, 211, 0.2)',
  borderRadius: '20px',
  padding: '4px',
  '& .MuiToggleButtonGroup-grouped': {
    margin: 2,
    border: 0,
    borderRadius: '16px !important',
    color: '#787878',
    '&.Mui-selected': {
      backgroundColor: 'rgba(199, 21, 133, 0.15)',
      color: '#c71585',
    },
    '&:hover': {
      backgroundColor: 'rgba(211, 211, 211, 0.3)',
    },
  },
}));

const ThemeToggleButton = styled(ToggleButton)({
  minWidth: '40px',
  height: '40px',
  padding: '8px',
  '& .MuiSvgIcon-root': {
    fontSize: '1.25rem',
  },
});

// Theme switcher component
const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (_event: React.MouseEvent<HTMLElement>, newTheme: ThemeType | null) => {
    if (newTheme !== null) {
      setTheme(newTheme);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: '90px', sm: '100px' },
        right: { xs: '20px', sm: '6%' },
        zIndex: 1300,
      }}>
      <ThemeToggleGroup
        value={theme}
        exclusive
        onChange={handleThemeChange}
        aria-label="theme selection">
        <Tooltip
          title="Default Theme"
          placement="left">
          <ThemeToggleButton
            value="default"
            aria-label="default theme">
            <PaletteIcon />
          </ThemeToggleButton>
        </Tooltip>
        <Tooltip
          title="Fun Theme (Studio Ghibli)"
          placement="left">
          <ThemeToggleButton
            value="fun"
            aria-label="fun theme">
            <AutoAwesomeIcon />
          </ThemeToggleButton>
        </Tooltip>
        <Tooltip
          title="Clean Theme (Professional)"
          placement="left">
          <ThemeToggleButton
            value="clean"
            aria-label="clean theme">
            <WorkOutlineIcon />
          </ThemeToggleButton>
        </Tooltip>
      </ThemeToggleGroup>
    </Box>
  );
};

export default ThemeSwitcher;
