import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export type MapViewMode = 'POINTS' | 'H3_DENSITY';

interface Props {
    mode: MapViewMode;
    onChange: (mode: MapViewMode) => void;
}

export const ViewModeControl: React.FC<Props> = ({ mode, onChange }) => {
    const { t } = useLanguage();

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white p-1 rounded-md shadow-md z-10 flex gap-1">
            <button 
                className={`px-3 py-1 rounded text-sm ${mode === 'POINTS' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                onClick={() => onChange('POINTS')}
            >
                {t.viewMode.points}
            </button>
            <button 
                className={`px-3 py-1 rounded text-sm ${mode === 'H3_DENSITY' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                onClick={() => onChange('H3_DENSITY')}
            >
                {t.viewMode.h3Density}
            </button>
        </div>
    );
};