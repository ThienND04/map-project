import React from 'react';

interface YearSelectorProps {
    minYear: number;
    maxYear: number;
    selectedYear: number;
    onChange: (year: number) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({
    minYear,
    maxYear,
    selectedYear,
    onChange,
}) => {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6 py-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl flex flex-col gap-2 items-center z-40">

            {/* Label hiển thị năm */}
            <div className="flex items-baseline gap-2">
                <span className="text-slate-400 text-sm font-medium">Dữ liệu năm</span>
                <span className="text-3xl font-bold text-emerald-400 tabular-nums">
                    {selectedYear}
                </span>
            </div>

            <div className="w-full flex items-center gap-4">
                <span className="text-xs text-slate-500">{minYear}</span>
                <input
                    type="range"
                    min={minYear}
                    max={maxYear}
                    value={selectedYear}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
                />
                <span className="text-xs text-slate-500">{maxYear}</span>
            </div>

            <p className="text-[10px] text-slate-500 mt-1">
                Kéo để xem sự thay đổi phân bổ gấu theo thời gian
            </p>
        </div>
    );
};

export default YearSelector;