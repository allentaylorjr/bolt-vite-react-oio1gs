import React from 'react';
import { useChurchTheme } from '../../contexts/ChurchThemeContext';

interface TabNavigationProps {
  activeTab: 'sermons' | 'series' | 'speakers';
  onTabChange: (tab: 'sermons' | 'series' | 'speakers') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const { theme } = useChurchTheme();

  return (
    <div className="bg-[#F2F2F2] rounded-xl p-2">
      <div className="flex space-x-2">
        {[
          { id: 'sermons', label: 'Sermons' },
          { id: 'series', label: 'Series' },
          { id: 'speakers', label: 'Speakers' }
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id as 'sermons' | 'series' | 'speakers')}
            className={`
              px-6 py-3 text-base font-normal rounded-xl transition-all
              ${activeTab === id 
                ? '' 
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
            style={
              activeTab === id 
                ? {
                    backgroundColor: theme.buttonColor,
                    color: theme.buttonTextColor
                  }
                : undefined
            }
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;