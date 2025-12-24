import React from 'react';
import { BearSighting } from '@/types/bear';

interface TooltipInfo {
    object: BearSighting | BearH3Data;
    x: number;
    y: number;
    type: 'POINTS' | 'H3';
}

export interface BearH3Data {
    hex: string;
    count: number;
}

interface BearTooltipProps {
    info: TooltipInfo;
}

const BearTooltip: React.FC<BearTooltipProps> = ({ info }) => {
    const { object, x, y, type } = info;
    const lang = localStorage.getItem('lang') || 'vi';

    if (type === 'H3') {
        const h3Data = object as BearH3Data; 
        return (
            <div
                className="absolute z-50 bg-slate-900/95 text-white p-3 rounded-lg shadow-xl border border-slate-700 pointer-events-none text-sm backdrop-blur-sm"
                style={{ left: x + 10, top: y + 10 }}
            >
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Khu vực H3
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-200">Số lượng phát hiện:</span>
                        <span className="text-lg font-bold text-yellow-400">
                            {h3Data.count}
                        </span>
                    </div>
                </div>
            </div>
        );
    } else if (type === 'POINTS') {
        const bearData = object as BearSighting; 

        let displayName = bearData.name;
        let displayDesc = bearData.description;

        if (lang !== 'jp') {
            const localName = (bearData as any)[`name_${lang}`];
            const localDesc = (bearData as any)[`description_${lang}`];

            if (localName) displayName = localName;
            if (localDesc) displayDesc = localDesc;
        }
        return (
            <div
                className="absolute z-50 bg-slate-900/90 text-white p-3 rounded-lg shadow-xl border border-slate-700 pointer-events-none text-sm max-w-[250px] backdrop-blur-sm"
                style={{
                    left: x + 10,
                    top: y + 10
                }}
            >
                <div className="space-y-1 text-slate-300">
                    <p><span className="font-semibold text-slate-400">Năm:</span> {bearData.year}</p>
                    {displayName && (
                        <p><span className="font-semibold text-slate-400">Địa điểm:</span> {displayName}</p>
                    )}
                    {displayDesc && (
                        <p><span className="font-semibold text-slate-400">Mo ta?:</span> {displayDesc}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-2">
                        Lat: {bearData.latitude.toFixed(4)}, Lng: {bearData.longitude.toFixed(4)}
                    </p>
                </div>
            </div>
        );
    }
};

export default BearTooltip;