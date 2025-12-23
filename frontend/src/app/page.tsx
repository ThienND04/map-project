'use client';

import MapViz from '@/components/map/MapViz';
import { BearSighting } from '@/types/bear';
import YearSelector from '@/components/ui/YearSelector';
import React, { useState, useMemo, useEffect } from 'react';


export default function Home() {
    const [selectedYear, setSelectedYear] = useState<number>(2024);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="w-full h-screen relative">
                <MapViz selectedYear={selectedYear} />

                {/* Placeholder cho Menu chọn năm - Sẽ làm ở bước sau */}
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