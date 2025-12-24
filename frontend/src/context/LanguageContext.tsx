'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, TranslationKeys } from '@/lib/translations';

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [lang, setLangState] = useState<Language>('vi');
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const savedLang = localStorage.getItem('lang') as Language;
        if (savedLang && ['vi', 'en', 'ja'].includes(savedLang)) {
            setLangState(savedLang);
        }
        setIsHydrated(true);
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem('lang', newLang);
    };

    const t = translations[lang];

    // Tránh hydration mismatch
    if (!isHydrated) {
        return null;
    }

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
