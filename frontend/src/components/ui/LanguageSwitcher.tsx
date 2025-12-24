'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react'; 

interface LanguageSwitcherProps {
    currentLang: string;
    onChange: (lang: string) => void;
}

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export default function LanguageSwitcher({ currentLang, onChange }: LanguageSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (code: string) => {
        onChange(code);
        setIsOpen(false);
    };

    const currentLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

    return (
        <div className="absolute top-4 right-4 z-50 font-sans">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{currentLangObj.label}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleSelect(lang.code)}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-blue-50 transition-colors
                                ${currentLang === lang.code ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'}
                            `}
                        >
                            <span>{lang.flag}</span>
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
            
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[-1]" 
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}