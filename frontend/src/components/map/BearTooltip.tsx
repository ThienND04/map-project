import React from 'react';
import { BearSighting } from '@/types/bear';

interface TooltipInfo {
    object: BearSighting;
    x: number;
    y: number;
}

interface BearTooltipProps {
    info: TooltipInfo;
}

const BearTooltip: React.FC<BearTooltipProps> = ({ info }) => {
    const { object, x, y } = info;

    return (
        <div
            className="absolute z-50 bg-slate-900/90 text-white p-3 rounded-lg shadow-xl border border-slate-700 pointer-events-none text-sm max-w-[250px] backdrop-blur-sm"
            style={{
                left: x + 10, 
                top: y + 10
            }}
        >
            <div className="space-y-1 text-slate-300">
                <p><span className="font-semibold text-slate-400">Năm:</span> {object.year}</p>
                {object.name && (
                    <p><span className="font-semibold text-slate-400">Địa điểm:</span> {object.name}</p>
                )}
                {object.description && (
                    <p><span className="font-semibold text-slate-400">Mo ta?:</span> {object.description}</p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                    Lat: {object.latitude.toFixed(4)}, Lng: {object.longitude.toFixed(4)}
                </p>
            </div>
        </div>
    );
};

export default BearTooltip;