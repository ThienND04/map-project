import { Menu, Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-md shadow-md flex items-center w-96">
      <button className="p-3 text-gray-500 hover:text-gray-700">
        <Menu size={20} />
      </button>
      <input
        type="text"
        placeholder="Search..."
        className="flex-grow p-2 bg-transparent focus:outline-none"
      />
      <button className="p-3 text-gray-500 hover:text-gray-700">
        <Search size={20} />
      </button>
    </div>
  );
}
