
import React, { useState } from 'react';
import { Settings, Moon, Sun, Monitor, Bell, User, Edit3, Lock, LogOut } from 'lucide-react';
import Card from '../components/Card';
import { useI18n } from '../i18n';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const ToggleSwitch = ({ enabled, onChange }: ToggleSwitchProps) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
      enabled ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
    }`}
  >
    <span
      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

interface SettingsPageProps {
  onLogout: () => void;
}

const SettingsPage = ({ onLogout }: SettingsPageProps) => {
  const { t } = useI18n();
  const [theme, setTheme] = useState('System');
  const [notifications, setNotifications] = useState({
    crowdAlerts: true,
    bookingConfirmations: true,
    emergencyUpdates: false,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const themeOptions = [
    { value: 'Light', icon: Sun, label: t('light') },
    { value: 'Dark', icon: Moon, label: t('dark') },
    { value: 'System', icon: Monitor, label: t('system') },
  ];

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <Settings size={32} className="text-orange-500" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('settingsTitle')}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">{t('generalSettings')}</h2>
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300">{t('theme')}</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {themeOptions.map(({ value, icon: Icon, label }) => (
                    <button 
                      key={value}
                      onClick={() => setTheme(value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                        theme === value 
                          ? 'bg-orange-100 dark:bg-orange-900/50 border-orange-500 text-orange-600 dark:text-orange-400' 
                          : 'bg-gray-50 dark:bg-gray-700/50 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-sm font-medium mt-1">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">{t('notificationSettings')}</h2>
            <div className="space-y-3 divide-y divide-gray-200 dark:divide-gray-700">
              <div className="flex items-center justify-between pt-3 first:pt-0">
                <label htmlFor="crowd-alerts" className="font-semibold text-gray-700 dark:text-gray-300">{t('crowdAlerts')}</label>
                <ToggleSwitch enabled={notifications.crowdAlerts} onChange={() => handleNotificationChange('crowdAlerts')} />
              </div>
              <div className="flex items-center justify-between pt-3">
                <label htmlFor="booking-confirmations" className="font-semibold text-gray-700 dark:text-gray-300">{t('bookingConfirmations')}</label>
                <ToggleSwitch enabled={notifications.bookingConfirmations} onChange={() => handleNotificationChange('bookingConfirmations')} />
              </div>
              <div className="flex items-center justify-between pt-3">
                <label htmlFor="emergency-updates" className="font-semibold text-gray-700 dark:text-gray-300">{t('emergencyUpdates')}</label>
                <ToggleSwitch enabled={notifications.emergencyUpdates} onChange={() => handleNotificationChange('emergencyUpdates')} />
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <Card>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">{t('accountSettings')}</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <User size={20} className="text-gray-500 dark:text-gray-400" />
                    <p className="text-gray-700 dark:text-gray-300">{t('loggedInAs')}: <span className="font-bold">{t('pilgrim')}</span></p>
                </div>
                <div className="flex flex-col space-y-3">
                    <button className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors">
                        <Edit3 size={18} /><span>{t('editProfile')}</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        <Lock size={18} /><span>{t('changePassword')}</span>
                    </button>
                    <button 
                        onClick={onLogout}
                        className="flex items-center justify-center space-x-2 w-full p-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">
                        <LogOut size={18} /><span>{t('logout')}</span>
                    </button>
                </div>
              </div>
            </Card>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
