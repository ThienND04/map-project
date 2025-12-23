import React from "react";

export default function Legend() {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md border border-gray-200 max-w-xs">
      <h3 className="text-sm font-bold text-gray-800 mb-2">Mật độ gấu xuất hiện</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm border border-white"></span>
          <span className="text-xs text-gray-600">Cao (8+ lần/năm)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-400 shadow-sm border border-white"></span>
          <span className="text-xs text-gray-600">Trung bình (5-7 lần)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm border border-white"></span>
          <span className="text-xs text-gray-600">Thấp (1-4 lần)</span>
        </div>
      </div>
    </div>
  );
}