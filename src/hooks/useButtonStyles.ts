import { useMemo } from 'react';
import { useThemeColors } from './useThemeColors';

interface ButtonStyleOptions {
  variant?: 'solid' | 'outline' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

interface ButtonStyles {
  className: string;
  style: React.CSSProperties;
}

export function useButtonStyles(options: ButtonStyleOptions = {}): ButtonStyles {
  const { variant = 'solid', size = 'md' } = options;
  const colors = useThemeColors();

  return useMemo(() => {
    const baseClassName = [
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors hover:opacity-90',
      size === 'sm' ? 'px-4 py-2 text-sm' : size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base'
    ].join(' ');

    if (variant === 'white') {
      return {
        className: baseClassName,
        style: {
          backgroundColor: '#FFFFFF',
          color: '#111827'
        }
      };
    }

    if (variant === 'outline') {
      return {
        className: baseClassName,
        style: {
          backgroundColor: 'transparent',
          color: colors.button.background,
          border: `2px solid ${colors.button.background}`
        }
      };
    }

    return {
      className: baseClassName,
      style: {
        backgroundColor: colors.button.background,
        color: colors.button.text
      }
    };
  }, [variant, size, colors.button]);
}