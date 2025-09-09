
import React, { useState } from 'react';
import { useI18n } from '../i18n';
import { Mail, Lock, Shield, User } from 'lucide-react';
import { loginAdmin } from '../services/adminService';

interface LoginPageProps {
  onLogin: (role: 'user' | 'admin', token: string) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const { t } = useI18n();
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (loginType === 'admin') {
        const token = await loginAdmin(email, password);
        if (token) {
            onLogin('admin', token);
        } else {
            setError('Invalid credentials. Please try again.');
        }
    } else {
        if (email && password) {
            onLogin('user', 'fake-user-token');
        } else {
            setError('Please enter email and password.');
        }
    }
    setIsLoading(false);
  };

  const LoginTypeToggle = () => (
    <div className="w-full flex p-1 rounded-xl bg-gray-200 dark:bg-gray-700 mb-6">
      <button
        onClick={() => setLoginType('user')}
        className={`w-1/2 p-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
          loginType === 'user' ? 'bg-white dark:bg-gray-800 shadow text-orange-500' : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        <User size={18} />
        <span>{t('userLogin')}</span>
      </button>
      <button
        onClick={() => setLoginType('admin')}
        className={`w-1/2 p-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
          loginType === 'admin' ? 'bg-white dark:bg-gray-800 shadow text-orange-500' : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        <Shield size={18} />
        <span>{t('adminLogin')}</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-orange-50 dark:bg-gray-900 flex items-center justify-center font-sans">
      <div className="w-full h-screen lg:h-auto max-w-4xl flex lg:grid lg:grid-cols-2 bg-white dark:bg-gray-800 lg:rounded-2xl lg:shadow-2xl overflow-hidden">
        {/* Image Section - Hidden on mobile */}
        <div className="hidden lg:block w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1617877685837-77445fa8a333?q=80&w=2070&auto-format&fit=crop"
            alt="Ujjain Temple"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full p-8 flex flex-col justify-center animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome to Ujjain360</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t('loginPrompt', { type: loginType === 'user' ? t('user') : t('admin') })}</p>
          </div>

          <LoginTypeToggle />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-semibold text-gray-600 dark:text-gray-300">{t('emailAddress')}</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-orange-500 focus:outline-none focus:ring-0 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-semibold text-gray-600 dark:text-gray-300">{t('password')}</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-orange-500 focus:outline-none focus:ring-0 transition-colors"
                  required
                />
              </div>
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="text-right text-sm">
              <a href="#" className="font-semibold text-orange-500 hover:text-orange-600">{t('forgotPassword')}</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition-colors text-lg disabled:bg-orange-300"
            >
              {isLoading ? 'Logging in...' : t('login')}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-500 dark:text-gray-400">
              {t('noAccountPrompt')} <a href="#" className="font-semibold text-orange-500 hover:text-orange-600">{t('signUp')}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;