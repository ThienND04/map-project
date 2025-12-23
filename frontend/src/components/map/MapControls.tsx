import { Plus, Minus, Locate } from 'lucide-react';

interface MapControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
}

export default function MapControls({ onZoomIn, onZoomOut }: MapControlsProps) {
    return (
        <div className="flex flex-col gap-2 bg-white/90 backdrop-blur-sm p-1 rounded-md shadow-lg border border-gray-200">
            {/* Nút Zoom In (+/Phóng to) */}
            <button
                onClick={onZoomIn}
                className="p-2 hover:bg-gray-100 rounded transition-colors border-b border-gray-100"
                title="Phóng to"
                type="button"
            >
                <span className="text-xl font-bold text-gray-700">+</span>
            </button>

            {/* Nút Zoom Out (-/Thu nhỏ) */}
            <button
                onClick={onZoomOut}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Thu nhỏ"
                type="button"
            >
                <span className="text-xl font-bold text-gray-700">−</span>
            </button>
        </div>
    );
}