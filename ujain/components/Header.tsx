
import React from 'react';
import { Menu, Search, Bell, Mic } from 'lucide-react';
import { useI18n } from '../i18n';

interface HeaderProps {
  setMenuOpen: (open: boolean) => void;
  onVoiceSearch: () => void;
  onToggleNotifications: () => void;
}

const Header = ({ setMenuOpen, onVoiceSearch, onToggleNotifications }: HeaderProps) => {
  const { t } = useI18n();
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between z-40 flex-shrink-0 gap-4">
      <div className="flex items-center space-x-4 flex-shrink-0">
        <button onClick={() => setMenuOpen(true)} className="text-gray-600 dark:text-gray-300">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">Ujjain360</h1>
      </div>
      <div className="flex-1 flex justify-center px-2 sm:px-0">
        {/* Redesigned search bar to be larger and fill space */}
        <div className="w-full relative flex items-center bg-white dark:bg-gray-700 rounded-full border-2 border-orange-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-gray-800 focus-within:ring-orange-500 shadow-sm transition-all h-14">
            <Search size={22} className="absolute left-5 text-gray-400 pointer-events-none" />
            <input
              type="search"
              placeholder={t('headerSearchPlaceholder')}
              className="w-full h-full bg-transparent text-gray-800 dark:text-gray-200 rounded-full pl-14 pr-20 focus:outline-none text-base"
              aria-label="Search"
            />
            <button
              onClick={onVoiceSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white rounded-full p-3 hover:bg-orange-600 transition-colors"
              aria-label={t('voiceSearch')}
            >
              <Mic size={22} />
            </button>
        </div>
      </div>
      <div className="flex items-center space-x-4 flex-shrink-0">
        <button onClick={onToggleNotifications} className="text-gray-600 dark:text-gray-300 relative" aria-label={t('toggleNotifications')}>
          <Bell size={24} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;