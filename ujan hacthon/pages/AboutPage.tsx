
import React from 'react';
import { Info, Target, Cpu, Smartphone, Navigation, Calendar, Siren, Users } from 'lucide-react';
import Card from '../components/Card';
import { useI18n } from '../i18n';

const AboutPage = () => {
  const { t } = useI18n();

  const features = [
    { icon: Navigation, text: t('featureNav') },
    { icon: Calendar, text: t('featureBooking') },
    { icon: Siren, text: t('featureEmergency') },
  ];

  const team = [
    { name: t('teamMember1Name'), role: t('teamMember1Role') },
    { name: t('teamMember2Name'), role: t('teamMember2Role') },
    { name: t('teamMember3Name'), role: t('teamMember3Role') },
  ];

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <Info size={32} className="text-orange-500" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('aboutTitle')}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center space-x-3 mb-2">
              <Target size={24} className="text-orange-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('ourMission')}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {t('ourMissionDesc')}
            </p>
          </Card>
          <Card>
            <div className="flex items-center space-x-3 mb-2">
              <Cpu size={24} className="text-orange-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('ourTech')}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {t('ourTechDesc1')}
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
             {t('ourTechDesc2')}
            </p>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="flex items-center space-x-3 mb-2">
              <Smartphone size={24} className="text-orange-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('theApp')}</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {t('theAppDesc')}
            </p>
            <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">{t('keyFeatures')}</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Icon className="text-green-500" size={18} />
                    <span>{feature.text}</span>
                  </li>
                );
              })}
            </ul>
          </Card>
          <Card>
            <div className="flex items-center space-x-3 mb-3">
              <Users size={24} className="text-orange-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('meetTheTeam')}</h2>
            </div>
            <div className="space-y-3">
              {team.map((member, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                   <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center font-bold text-orange-500">
                     {member.name.charAt(0)}
                   </div>
                   <div>
                     <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{member.name}</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                   </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default AboutPage;
