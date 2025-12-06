import MapContainer from '@/components/map/MapContainer';
import SearchBar from '@/components/ui/SearchBar';
import FilterBar from '@/components/ui/FilterBar';
import MapControls from '@/components/ui/MapControls';

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <MapContainer />
      <SearchBar />
      <FilterBar />
      <MapControls />
    </main>
  );
}
