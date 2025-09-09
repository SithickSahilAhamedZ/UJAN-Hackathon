
import React from 'react';
import { Home, Map, CalendarCheck, Siren, FileWarning } from 'lucide-react';
import { Page } from '../types';

interface BottomNavProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const navItems = [
  { page: Page.Home, icon: Home, label: 'Home' },
  { page: Page.Navigation, icon: Map, label: 'Navigation' },
  { page: Page.Booking, icon: CalendarCheck, label: 'Booking' },
  { page: Page.Emergency, icon: Siren, label: 'Emergency' },
  { page: Page.Report, icon: FileWarning, label: 'Report' },
];

const BottomNav = ({ activePage, setActivePage }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-t-lg z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => setActivePage(item.page)}
            className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${
              activePage === item.page
                ? 'text-orange-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
            }`}
            aria-current={activePage === item.page ? 'page' : undefined}
          >
            <item.icon size={24} strokeWidth={activePage === item.page ? 2.5 : 2} />
            <span className={`text-xs font-semibold mt-1 ${activePage === item.page ? 'text-orange-600' : ''}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
