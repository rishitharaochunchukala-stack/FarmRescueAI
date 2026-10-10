import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Produce, Destination } from '@/types';
import { cropCategories } from '@/data/sampleData';
import ProduceCard from '@/components/ProduceCard';
import ProduceDetailModal from '@/components/ProduceDetailModal';

interface MarketplacePageProps {
  produce: Produce[];
  destinations?: Destination[];
}

export default function MarketplacePage({ produce, destinations = [] }: MarketplacePageProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selected, setSelected] = useState<Produce | null>(null);

  const filtered = useMemo(() => {
    return produce.filter((p) => {
      const matchesSearch =
        p.cropName.toLowerCase().includes(search.toLowerCase()) ||
        p.farmerName.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All' || p.category === category;
      const matchesPrice = p.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [produce, search, category, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Produce Marketplace</h1>
        <p className="text-gray-500">
          Browse surplus produce from local farms. Search, filter, and contact sellers directly.
        </p>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by crop, farmer, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Category */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-400 shrink-0" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              {cropCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price slider */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <span className="text-sm text-gray-500 whitespace-nowrap">Max ₹{maxPrice.toLocaleString('en-IN')}</span>
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="flex-1 accent-green-600"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {cropCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                category === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        {filtered.length} {filtered.length === 1 ? 'result' : 'results'} found
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((produce) => (
            <ProduceCard key={produce.id} produce={produce} onView={setSelected} destinations={destinations} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No produce found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setMaxPrice(1000);
            }}
            className="mt-4 text-green-600 font-medium text-sm hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <ProduceDetailModal produce={selected} onClose={() => setSelected(null)} destinations={destinations} />
      )}
    </div>
  );
}
