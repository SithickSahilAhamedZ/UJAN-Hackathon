
import React from 'react';
import Card from '../components/Card';
import { Siren, HeartPulse, Shield, Share2, AlertTriangle, Phone, CheckCircle, Car, ArrowRight, Search, ShieldAlert, Flame, TowerControl, PersonStanding, Baby } from 'lucide-react';
import { useI18n } from '../i18n';

const colorClasses: { [key: string]: string } = {
    orange: 'bg-orange-100 text-orange-500 dark:bg-orange-900/50 dark:text-orange-400',
    red: 'bg-red-100 text-red-500 dark:bg-red-900/50 dark:text-red-400',
    blue: 'bg-blue-100 text-blue-500 dark:bg-blue-900/50 dark:text-blue-400',
    green: 'bg-green-100 text-green-500 dark:bg-green-900/50 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-500 dark:bg-purple-900/50 dark:text-purple-400',
    pink: 'bg-pink-100 text-pink-500 dark:bg-pink-900/50 dark:text-pink-400',
    cyan: 'bg-cyan-100 text-cyan-500 dark:bg-cyan-900/50 dark:text-cyan-400',
};

interface EmergencyAssistItemProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
}

const EmergencyAssistItem = ({icon: Icon, title, desc, color}: EmergencyAssistItemProps) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${colorClasses[color] || 'bg-gray-100 text-gray-500'}`}><Icon size={20}/></div>
            <div>
                <p className="font-bold text-gray-800 dark:text-gray-200">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
        </div>
        <button aria-label={`Report ${title}`}>
          <ArrowRight size={20} className="text-gray-400"/>
        </button>
    </div>
);

interface ContactItemProps {
  icon: React.ElementType;
  title: string;
  number: string;
  color: string;
}

const ContactItem = ({icon: Icon, title, number, color}: ContactItemProps) => {
    const { t } = useI18n();
    return (
        <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}><Icon size={20}/></div>
                <div>
                    <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">{title}</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{number}</p>
                </div>
            </div>
            <button className="flex items-center bg-green-500 text-white px-3 py-2 rounded-lg font-semibold text-sm hover:bg-green-600">
                <Phone size={14} className="mr-1.5" /> {t('call')}
            </button>
        </div>
    );
};


const EmergencyPage = () => {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Siren size={32} className="text-red-500" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('emergencyServices')}</h1>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-6 lg:space-y-0">
        <div className="lg:col-span-1 space-y-6 lg:flex lg:flex-col lg:gap-6 lg:space-y-0">
            <Card className="text-center lg:flex-grow flex flex-col justify-center items-center">
              <button className="w-40 h-40 bg-red-500 text-white rounded-full flex flex-col items-center justify-center mx-auto shadow-lg animate-pulse hover:bg-red-600 transition-colors">
                <Siren size={56} />
                <span className="font-bold text-3xl">{t('sos')}</span>
              </button>
              <p className="text-gray-600 dark:text-gray-400 mt-4 font-semibold text-lg">{t('sosHelpText')}</p>
            </Card>

            <Card>
              <h3 className="font-bold mb-3 text-gray-800 dark:text-white">{t('emergencyContacts')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <ContactItem icon={Shield} title={t('police')} number="100" color="blue" />
                <ContactItem icon={HeartPulse} title={t('ambulance')} number="108" color="red" />
                <ContactItem icon={Flame} title={t('fireBrigade')} number="101" color="orange" />
                <ContactItem icon={TowerControl} title={t('disasterManagement')} number="1077" color="purple" />
                <ContactItem icon={PersonStanding} title={t('womensHelpline')} number="1091" color="pink" />
                <ContactItem icon={Baby} title={t('childHelpline')} number="1098" color="cyan" />
              </div>
            </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
           <Card>
              <h3 className="font-bold mb-3 text-gray-800 dark:text-white">{t('emergencyAssist')}</h3>
              <div className="space-y-2">
                <EmergencyAssistItem icon={Car} title={t('accident')} desc={t('accidentDesc')} color="orange"/>
                <EmergencyAssistItem icon={HeartPulse} title={t('medical')} desc={t('medicalDesc')} color="red"/>
                <EmergencyAssistItem icon={Search} title={t('lostAndFound')} desc={t('lostAndFoundDesc')} color="green"/>
                <EmergencyAssistItem icon={ShieldAlert} title={t('theftHarassment')} desc={t('theftHarassmentDesc')} color="purple"/>
                <EmergencyAssistItem icon={AlertTriangle} title={t('issue')} desc={t('issueDesc')} color="blue"/>
              </div>
            </Card>

            <Card>
                <h3 className="font-bold text-gray-800 dark:text-white mb-1">{t('liveLocationSharing')}</h3>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <p>{t('currentLocation')}</p>
                    <div className="flex items-center space-x-1 text-blue-500">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>{t('active')}</span>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mb-4">{t('locationSharingDisabled')}</p>
                <button className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors flex items-center justify-center">
                  <Share2 className="mr-2" size={20} /> {t('shareLocation')}
                </button>
            </Card>
            
            <Card>
              <h3 className="font-bold mb-3 text-gray-800 dark:text-white">{t('activeAlerts')}</h3>
              <div className="border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/50 p-3 rounded-r-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-orange-800 dark:text-orange-300">{t('lostPerson')}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <span className="font-semibold">{t('team')}</span> {t('police')}
                            </p>
                        </div>
                        <span className="text-xs bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-2 py-0.5 rounded-full font-semibold">{t('active')}</span>
                    </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('minsAgo', { count: 15 })}</p>
              </div>
            </Card>

            <Card>
              <h3 className="font-bold mb-3 text-gray-800 dark:text-white">{t('recentAlerts')}</h3>
              <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                        <p className="font-semibold text-gray-700 dark:text-gray-300">{t('medicalEmergency')} <span className="font-normal text-gray-500 dark:text-gray-400 text-sm">({t('hoursAgo', { count: 2 })})</span></p>
                        <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold"><CheckCircle size={16} className="mr-1"/> {t('resolved')}</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                        <p className="font-semibold text-gray-700 dark:text-gray-300">{t('trafficAccident')} <span className="font-normal text-gray-500 dark:text-gray-400 text-sm">({t('hoursAgo', { count: 5 })})</span></p>
                        <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-semibold"><CheckCircle size={16} className="mr-1"/> {t('resolved')}</div>
                  </div>
              </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
