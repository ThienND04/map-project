const filters = ['Restaurants', 'Cafes', 'Parks', 'Museums', 'Hotels', 'Gas Stations', 'ATMs'];

export default function FilterBar() {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-lg px-4">
      <div className="overflow-x-auto whitespace-nowrap no-scrollbar pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            className="inline-block bg-white rounded-full px-4 py-2 text-sm font-semibold text-gray-700 mr-2 shadow-sm hover:bg-gray-100"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
