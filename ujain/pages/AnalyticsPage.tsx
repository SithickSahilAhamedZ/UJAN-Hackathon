
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { useI18n } from '../i18n';
import { BarChart3, Users, CalendarCheck, FileWarning, ArrowUp, ArrowDown, Bot, Send } from 'lucide-react';
import { ai } from '../services/geminiClient';

interface AnalyticsPageProps {
  token: string;
}

interface DashboardData {
  liveCrowdCount: string;
  crowdChange: string;
  crowdChangeType: 'increase' | 'decrease';
  bookingsToday: string;
  bookingsChange: string;
  bookingsChangeType: 'increase' | 'decrease';
  incidentsToday: string;
  incidentsChange: string;
  incidentsChangeType: 'increase' | 'decrease';
}

interface AnalystMessage {
    text: string;
    sender: 'user' | 'ai';
}

interface AnalyticsCardProps {
    icon: React.ElementType;
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    color: string;
}

const AnalyticsCard = ({ icon: Icon, title, value, change, changeType, color }: AnalyticsCardProps) => {
    const isIncrease = changeType === 'increase';
    const colorClasses = {
        text: `text-${color}-600 dark:text-${color}-400`,
        bg: `bg-${color}-100 dark:bg-${color}-900/50`,
    };

    return (
        <Card>
            <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${colorClasses.bg}`}>
                    <Icon size={24} className={colorClasses.text} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
                </div>
            </div>
            <div className="mt-3 flex items-center space-x-1 text-sm">
                <div className={`flex items-center ${isIncrease ? 'text-green-600' : 'text-red-500'}`}>
                    {isIncrease ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    <span className="font-semibold">{change}</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">vs yesterday</span>
            </div>
        </Card>
    );
};

const AnalyticsPage = ({ token }: AnalyticsPageProps) => {
    const { t } = useI18n();
    const [data, setData] = useState<DashboardData | null>(null);
    const [messages, setMessages] = useState<AnalystMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const generateMockData = (): DashboardData => ({
        liveCrowdCount: `~${(15000 + Math.floor(Math.random() * 1000)).toLocaleString()}`,
        crowdChange: `${(Math.random() * 10).toFixed(1)}%`,
        crowdChangeType: Math.random() > 0.5 ? 'increase' : 'decrease',
        bookingsToday: (800 + Math.floor(Math.random() * 100)).toString(),
        bookingsChange: `${(Math.random() * 5).toFixed(1)}%`,
        bookingsChangeType: Math.random() > 0.5 ? 'increase' : 'decrease',
        incidentsToday: (40 + Math.floor(Math.random() * 15)).toString(),
        incidentsChange: `${(Math.random() * 15).toFixed(1)}%`,
        incidentsChangeType: 'increase',
    });

    useEffect(() => {
        setData(generateMockData());
        const interval = setInterval(() => setData(generateMockData()), 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || isLoading) return;

        const userMessage: AnalystMessage = { text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: inputText,
                config: {
                    systemInstruction: "You are an expert data analyst for the Ujjain360 app admin. Based on the user's query and the app's data context, provide concise, data-driven insights. Be helpful and direct.",
                }
            });
            
            const aiMessage: AnalystMessage = { text: response.text, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);

        } catch (err) {
            const errorMessage: AnalystMessage = { text: `Error: ${(err as Error).message}`, sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!data) {
        return <div>Loading analytics...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <BarChart3 size={32} className="text-orange-500" />
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Analytics</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnalyticsCard icon={Users} title="Live Crowd Count" value={data.liveCrowdCount} change={data.crowdChange} changeType={data.crowdChangeType} color="orange" />
                <AnalyticsCard icon={CalendarCheck} title="Bookings Today" value={data.bookingsToday} change={data.bookingsChange} changeType={data.bookingsChangeType} color="blue" />
                <AnalyticsCard icon={FileWarning} title="Incidents Today" value={data.incidentsToday} change={data.incidentsChange} changeType={data.incidentsChangeType} color="red" />
            </div>

            <Card className="!p-0 flex flex-col h-[60vh]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center space-x-2">
                        <Bot size={22} className="text-orange-500" />
                        <span>AI Data Analyst</span>
                    </h2>
                </div>
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                     {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xl px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="max-w-xl px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none">
                                <p className="animate-pulse">Analyzing...</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask about crowd trends, booking patterns, etc..."
                            className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-gray-200"
                            disabled={isLoading}
                        />
                        <button type="submit" className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition-colors flex-shrink-0 disabled:opacity-50" aria-label="Send message" disabled={isLoading}>
                            <Send size={22} />
                        </button>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default AnalyticsPage;