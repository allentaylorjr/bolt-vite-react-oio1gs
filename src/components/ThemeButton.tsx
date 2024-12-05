import React from 'react';
import { useChurchTheme } from '../contexts/ChurchThemeContext';

interface ThemeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  children: React.ReactNode;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ 
  variant = 'solid',
  children,
  className = '',
  ...props 
}) => {
  const { theme } = useChurchTheme();
  
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-colors hover:opacity-90";
  
  const style = variant === 'solid' 
    ? {
        backgroundColor: theme.buttonColor,
        color: theme.buttonTextColor,
        border: 'none'
      }
    : {
        backgroundColor: 'transparent',
        color: theme.buttonColor,
        border: `2px solid ${theme.buttonColor}`
      };
  
  return (
    <button
      className={`${baseStyles} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default ThemeButton;