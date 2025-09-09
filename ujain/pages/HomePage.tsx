
import React from 'react';
import { Page } from '../types';
import { HOME_FEATURES } from '../constants';
import Card from '../components/Card';
import { useI18n, TranslationKey } from '../i18n';
import { Bot, Sun, Clock } from 'lucide-react';

interface HomePageProps {
  setChatOpen: (isOpen: boolean) => void;
  setActivePage: (page: Page, context?: any) => void;
}

const colorClasses: { [key: string]: { bg: string, text: string, iconBg: string } } = {
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-600 dark:text-blue-300', iconBg: 'bg-blue-200/70 dark:bg-blue-800/60' },
    green: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-600 dark:text-green-300', iconBg: 'bg-green-200/70 dark:bg-green-800/60' },
    yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-600 dark:text-yellow-300', iconBg: 'bg-yellow-200/70 dark:bg-yellow-800/60' },
    cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/40', text: 'text-cyan-600 dark:text-cyan-300', iconBg: 'bg-cyan-200/70 dark:bg-cyan-800/60' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-600 dark:text-orange-300', iconBg: 'bg-orange-200/70 dark:bg-orange-800/60' },
    pink: { bg: 'bg-pink-100 dark:bg-pink-900/40', text: 'text-pink-600 dark:text-pink-300', iconBg: 'bg-pink-200/70 dark:bg-pink-800/60' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-600 dark:text-purple-300', iconBg: 'bg-purple-200/70 dark:bg-purple-800/60' },
};

interface FeatureButtonProps {
  feature: { icon: React.ElementType; label: string; color: string };
  onClick: () => void;
  className?: string;
  isCentered?: boolean;
}

const FeatureButton = ({ feature, onClick, className = '', isCentered = false }: FeatureButtonProps) => {
  const { t } = useI18n();
  const Icon = feature.icon;
  const colors = colorClasses[feature.color] || { bg: 'bg-gray-100', text: 'text-gray-500', iconBg: 'bg-gray-200' };
  const alignmentClass = isCentered ? 'justify-center' : 'justify-start';

  // Convert label like "Holy Site" to camelCase "holySite" for i18n key
  const translationKey = (feature.label.charAt(0).toLowerCase() + feature.label.slice(1)).replace(/\s+/g, '');

  return (
    <button
      onClick={onClick}
      className={`flex items-center p-3 md:p-4 rounded-2xl w-full h-full transition-all duration-300 hover:shadow-md hover:scale-105 ${colors.bg} ${alignmentClass} ${className}`}
    >
      <div className={`p-3 rounded-xl mr-4 ${colors.iconBg}`}>
        <Icon size={24} className={colors.text} />
      </div>
      <span className={`font-bold text-base md:text-lg ${colors.text}`}>{t(translationKey as TranslationKey)}</span>
    </button>
  );
};


const HomePage = ({ setChatOpen, setActivePage }: HomePageProps) => {
  const { t } = useI18n();

  const handleFeatureClick = (label: string) => {
    switch (label) {
      case 'Ride':
        setActivePage(Page.Booking, { initialTab: 'Transport' });
        break;
      case 'Stay':
        setActivePage(Page.Booking, { initialTab: 'Stay' });
        break;
      case 'Food':
      case 'Water':
      case 'Holy Site':
        setActivePage(Page.Navigation);
        break;
      case 'Doctor':
        setActivePage(Page.Emergency);
        break;
      case 'Report':
        setActivePage(Page.Report);
        break;
      default:
        break;
    }
  };

  const spiritualFeatures = HOME_FEATURES.spiritualSafety;
  const reportFeature = spiritualFeatures.find(f => f.label === 'Report');

  // Define cards as variables for clarity and reordering
  const highlightsCard = (
    <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('todaysHighlights')}</h2>
        <div className="flex flex-col justify-evenly flex-grow space-y-4">
            <div className="flex items-center space-x-4 rounded-2xl p-4 bg-orange-100/60 dark:bg-orange-900/40">
                <div className="p-3 rounded-xl bg-orange-200/80 dark:bg-orange-800/50">
                    <Clock className="w-6 h-6 text-orange-700 dark:text-orange-300" />
                </div>
                <div>
                    <p className="font-bold text-orange-800 dark:text-orange-300">{t('mainEvent')}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-400">{t('eveningAarti')}</p>
                </div>
            </div>
            <div className="flex items-center space-x-4 rounded-2xl p-4 bg-blue-100/60 dark:bg-blue-900/40">
                <div className="p-3 rounded-xl bg-blue-200/80 dark:bg-blue-800/50">
                    <Sun className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                </div>
                <div>
                    <p className="font-bold text-blue-800 dark:text-blue-300">{t('weather')}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-400">{t('weatherInfo')}</p>
                </div>
            </div>
        </div>
    </Card>
  );

  const dailyNeedsCard = (
    <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('dailyNeeds')}</h2>
        <div className="flex-grow grid grid-cols-2 gap-4 content-evenly">
            {HOME_FEATURES.dailyNeeds.map((feature) => (
                <FeatureButton key={feature.label} feature={feature} onClick={() => handleFeatureClick(feature.label)} />
            ))}
        </div>
    </Card>
  );

  const spiritualSafetyCard = (
    <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('spiritualSafety')}</h2>
         <div className="flex-grow grid grid-cols-2 gap-4 content-evenly">
            {spiritualFeatures.filter(f => f.label !== 'Report').map(feature => (
                <FeatureButton key={feature.label} feature={feature} onClick={() => handleFeatureClick(feature.label)} />
            ))}
            {reportFeature && (
                <FeatureButton 
                    feature={reportFeature} 
                    onClick={() => handleFeatureClick(reportFeature.label)} 
                    className="col-span-2"
                    isCentered={true}
                />
            )}
        </div>
    </Card>
  );

  const aiAssistantCard = (
    <Card className="animate-fade-in-up flex flex-col items-center justify-center text-center" style={{ animationDelay: '0.4s' }}>
        <div className="p-4 bg-orange-100 dark:bg-orange-900/50 rounded-full mb-4">
          <Bot size={32} className="text-orange-500" />
        </div>
        <h3 className="font-bold text-xl text-gray-800 dark:text-white">{t('needHelp')}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('askAIAssistant')}</p>
        <button
            onClick={() => setChatOpen(true)}
            className="bg-orange-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
            {t('startChat')}
        </button>
    </Card>
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('welcomePilgrim')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('dashboardTitle')}</p>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6 flex flex-col">
          {highlightsCard}
          {dailyNeedsCard}
        </div>
        <div className="space-y-6 flex flex-col">
          {spiritualSafetyCard}
          {aiAssistantCard}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
