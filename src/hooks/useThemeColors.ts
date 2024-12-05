import { useMemo } from 'react';
import { useChurchTheme } from '../contexts/ChurchThemeContext';

export function useThemeColors() {
  const { theme } = useChurchTheme();

  return useMemo(() => ({
    button: {
      background: theme?.buttonColor || '#000000',
      text: theme?.buttonTextColor || '#FFFFFF'
    },
    page: {
      background: theme?.backgroundColor || '#FFFFFF',
      text: theme?.backgroundTextColor || '#000000'
    }
  }), [theme?.buttonColor, theme?.buttonTextColor, theme?.backgroundColor, theme?.backgroundTextColor]);
}