'use client';

import MapViz from '@/components/map/MapViz';
import YearSelector from '@/components/ui/YearSelector';
import React, { useState } from 'react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';


export default function Home() {
    const [selectedYear, setSelectedYear] = useState<number>(2024);
    const { lang, setLang } = useLanguage();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="w-full h-screen relative">
                <LanguageSwitcher 
                    currentLang={lang} 
                    onChange={setLang} 
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