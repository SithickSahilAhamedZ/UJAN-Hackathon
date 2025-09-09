
import React, { useState, FormEvent } from 'react';
import { X, Mic, Send } from 'lucide-react';
import { useI18n } from '../i18n';

interface Message {
    text: string;
    sender: 'user' | 'ai';
}

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    messages: Message[];
    onSendMessage: (text: string) => void;
    isListening: boolean;
    startListening: (lang: 'en-IN' | 'hi-IN') => void;
    stopListening: () => void;
    currentLang: 'en-IN' | 'hi-IN';
    setLang: (lang: 'en-IN' | 'hi-IN') => void;
}

const ChatModal = ({ isOpen, onClose, messages, onSendMessage, isListening, startListening, stopListening, currentLang, setLang }: ChatModalProps) => {
    const { t } = useI18n();
    const [inputText, setInputText] = useState('');
    
    if (!isOpen) return null;

    const handleTextSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (inputText.trim()) {
            onSendMessage(inputText);
            setInputText('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
            <div className="bg-orange-50 dark:bg-gray-800 w-full max-w-lg h-[80vh] rounded-t-2xl flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t('assistantTitle')}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isListening && <div className="text-center text-gray-500 dark:text-gray-400">{t('listening')}</div>}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                     <form onSubmit={handleTextSubmit} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={t('typeYourMessage')}
                            className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-gray-200"
                        />
                         {inputText ? (
                            <button type="submit" className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition-colors flex-shrink-0" aria-label="Send message">
                                <Send size={22} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={isListening ? stopListening : () => startListening(currentLang)}
                                className={`p-3 rounded-full text-white transition-colors flex-shrink-0 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`}
                                aria-label={isListening ? 'Stop listening' : 'Start listening'}
                            >
                                <Mic size={22} />
                            </button>
                        )}
                    </form>
                    <div className="flex items-center space-x-2 mt-2 justify-center">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{t('languageLabel')}</span>
                        <button onClick={() => setLang('en-IN')} className={`px-2 py-0.5 text-xs rounded-full ${currentLang === 'en-IN' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300'}`}>English</button>
                        <button onClick={() => setLang('hi-IN')} className={`px-2 py-0.5 text-xs rounded-full ${currentLang === 'hi-IN' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300'}`}>हिन्दी</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
