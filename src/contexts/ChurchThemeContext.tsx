import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface ChurchTheme {
  buttonColor: string;
  buttonTextColor: string;
  backgroundColor: string;
  backgroundTextColor: string;
}

interface ChurchThemeContextType {
  theme: ChurchTheme;
  loading: boolean;
}

const ChurchThemeContext = createContext<ChurchThemeContextType | null>(null);

export const ChurchThemeProvider: React.FC<{ 
  children: React.ReactNode;
  churchId?: string;
}> = ({ children, churchId }) => {
  const [theme, setTheme] = useState<ChurchTheme>({
    buttonColor: '#000000',
    buttonTextColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    backgroundTextColor: '#000000'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      if (!churchId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('churches')
          .select('primary_color, button_text_color, accent_color')
          .eq('id', churchId)
          .single();

        if (error) throw error;

        if (data) {
          const buttonColor = data.primary_color || '#000000';
          const buttonTextColor = data.button_text_color || '#FFFFFF';
          const backgroundColor = data.accent_color || '#FFFFFF';
          
          setTheme({
            buttonColor,
            buttonTextColor,
            backgroundColor,
            backgroundTextColor: getContrastingTextColor(backgroundColor)
          });
        }
      } catch (error) {
        console.error('Error fetching church theme:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, [churchId]);

  return (
    <ChurchThemeContext.Provider value={{ theme, loading }}>
      {children}
    </ChurchThemeContext.Provider>
  );
};

export const useChurchTheme = () => {
  const context = useContext(ChurchThemeContext);
  if (!context) {
    throw new Error('useChurchTheme must be used within a ChurchThemeProvider');
  }
  return context;
};

function getContrastingTextColor(backgroundColor: string): string {
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? '#000000' : '#FFFFFF';
}