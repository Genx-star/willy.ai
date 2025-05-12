import { Box } from '@mui/material';
import { useThemeStore } from '../../stores/themeStore';

interface LogoProps {
  variant?: 'full' | 'symbol';
  width?: number | string;
  height?: number | string;
}

export const Logo = ({ variant = 'full', width = 'auto', height = 40 }: LogoProps) => {
  const { isDarkMode } = useThemeStore();
  
  // Logo simbolico (W)
  const symbolLogo = (
    <svg width={height} height={height} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 8L14 32L20 16L26 32L32 8"
        stroke={isDarkMode ? '#9D00FF' : '#6B00B3'}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Logo completo (WILLY.AI)
  const fullLogo = (
    <svg width={width === 'auto' ? 160 : width} height={height} viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 8L14 32L20 16L26 32L32 8"
        stroke={isDarkMode ? '#9D00FF' : '#6B00B3'}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="40"
        y="28"
        fontFamily="Arial"
        fontSize="24"
        fontWeight="bold"
        fill={isDarkMode ? '#9D00FF' : '#6B00B3'}
      >
        ILLY.AI
      </text>
    </svg>
  );

  return (
    <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
      {variant === 'symbol' ? symbolLogo : fullLogo}
    </Box>
  );
};