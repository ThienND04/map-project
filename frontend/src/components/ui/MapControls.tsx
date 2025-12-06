import { Plus, Minus, Locate } from 'lucide-react';

export default function MapControls() {
  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
      <div className="bg-white rounded-md shadow-md flex flex-col">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-t-md">
          <Plus size={20} />
        </button>
        <hr className="border-gray-200" />
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-b-md">
          <Minus size={20} />
        </button>
      </div>
      <button className="bg-white rounded-md shadow-md p-2 text-gray-600 hover:bg-gray-100">
        <Locate size={20} />
      </button>
    </div>
  );
}
