'use client';

import MapViz from '@/components/map/MapViz';
import { BearSighting } from '@/types/bear';
import YearSelector from '@/components/ui/YearSelector';
import React, { useState, useMemo, useEffect } from 'react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';


export default function Home() {
    const [selectedYear, setSelectedYear] = useState<number>(2024);
    const [lang, setLang] = useState('vi');

    useEffect(() => {
        const savedLang = localStorage.getItem('lang');
        if (savedLang) {
            setLang(savedLang);
        }
    }, []);

    const handleChangeLanguage = (newLang: string) => {
        setLang(newLang);
        localStorage.setItem('lang', newLang);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="w-full h-screen relative">
                <LanguageSwitcher 
                    currentLang={lang} 
                    onChange={handleChangeLanguage} 
                />
                <MapViz selectedYear={selectedYear} />

                <YearSelector
                    minYear={2014}
                    maxYear={2024}
                    selectedYear={selectedYear}
                    onChange={setSelectedYear}
                />
            </div>
        </main>
    );
}