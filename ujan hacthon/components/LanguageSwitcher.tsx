
import React from 'react';
import { useI18n } from '../i18n';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useI18n();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'en' | 'hi');
  };

  return (
    <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
      <label htmlFor="language-select" className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300">
        <Globe size={18} className="mr-2" />
        {t('language')}
      </label>
      <select
        id="language-select"
        value={language}
        onChange={handleLanguageChange}
        className="w-full mt-1.5 p-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
