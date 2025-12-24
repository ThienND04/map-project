import React from "react";

export default function Legend({maxCount = 50}) {
    return (
        <div className="absolute bottom-8 right-30 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 z-10 w-[220px]">
            <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Mật độ gấu (H3)</h4>

            {/* Thanh Gradient */}
            <div className="relative h-4 w-full rounded-md mb-1"
                style={{
                    background: 'linear-gradient(to right, rgb(255, 255, 0), rgb(255, 0, 0))'
                }}>
            </div>

            {/* Số liệu */}
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>Thấp (0)</span>
                <span>Trung bình</span>
                <span>Cao ({maxCount}+)</span>
            </div>

            <p className="text-[10px] text-slate-400 mt-2 italic border-t pt-1 border-slate-100">
                *Dựa trên số lượng gấu trong vùng lục giác
            </p>
        </div>
    );
}