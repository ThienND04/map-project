'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import { Plus, Minus, Compass } from 'lucide-react';

export const ZoomControls = ({ onZoomIn, onZoomOut, onResetNorth }: any) => {
    return (
        <div className="absolute bottom-10 right-4 flex flex-col gap-1 z-50 shadow-md rounded-md bg-white border border-gray-200">
            <button
                onClick={onZoomIn}
                className="p-2 hover:bg-gray-100 border-b border-gray-200 text-gray-600"
                title="Phóng to"
            >
                <Plus className="w-5 h-5" />
            </button>
            <button
                onClick={onZoomOut}
                className="p-2 hover:bg-gray-100 text-gray-600"
                title="Thu nhỏ"
            >
                <Minus className="w-5 h-5" />
            </button>
        </div>
    );
};