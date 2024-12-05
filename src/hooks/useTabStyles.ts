import { useMemo } from 'react';
import { useThemeColors } from './useThemeColors';

interface TabStyles {
  active: React.CSSProperties;
  inactive: React.CSSProperties;
  base: string;
}

export function useTabStyles(): TabStyles {
  const colors = useThemeColors();

  return useMemo(() => ({
    active: {
      backgroundColor: colors.button.background,
      color: colors.button.text
    },
    inactive: {
      backgroundColor: 'transparent',
      color: '#4B5563' // text-gray-600
    },
    base: 'px-6 py-3 text-base font-normal rounded-xl transition-all'
  }), [colors.button]);
}