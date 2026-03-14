import { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { mockCaregivers, formatIDR } from '../data/mockData';
import { CaregiverCard } from '../components/CaregiverCard';

const CITIES = ['Semua Kota', 'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Yogyakarta', 'Semarang', 'Makassar'];

export function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('Semua Kota');
  const [selectedGender, setSelectedGender] = useState('Semua');
  const [selectedRating, setSelectedRating] = useState(0);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500000);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  const filtered = mockCaregivers
    .filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCity !== 'Semua Kota' && !c.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
      if (selectedGender !== 'Semua' && c.gender !== selectedGender) return false;
      if (selectedRating > 0 && c.rating < selectedRating) return false;
      if (c.hourlyRate < priceMin || c.hourlyRate > priceMax) return false;
      if (availableOnly && c.availabilityStatus !== 'available') return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_asc') return a.hourlyRate - b.hourlyRate;
      if (sortBy === 'price_desc') return b.hourlyRate - a.hourlyRate;
      return 0;
    });

  const clearFilters = () => {
    setSearch('');
    setSelectedCity('Semua Kota');
    setSelectedGender('Semua');
    setSelectedRating(0);
    setPriceMin(0);
    setPriceMax(500000);
    setAvailableOnly(false);
  };

  const hasActiveFilters = selectedCity !== 'Semua Kota' || selectedGender !== 'Semua' || selectedRating > 0 || priceMax < 500000 || availableOnly;

  return (
    <div style={{ background: '#F7F9FC' }} className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-gray-900 mb-2" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            Temukan Pendamping Pasien
          </h1>
          <p className="text-gray-500 mb-6">
            {filtered.length} pendamping terverifikasi tersedia untuk Anda
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama atau kota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] focus:border-transparent"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                hasActiveFilters
                  ? 'border-[#2E8BFF] bg-blue-50 text-[#2E8BFF]'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
              {hasActiveFilters && (
                <span className="w-4 h-4 bg-[#2E8BFF] text-white rounded-full text-[10px] flex items-center justify-center">
                  •
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E8BFF] cursor-pointer"
              >
                <option value="rating">Rating Tertinggi</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t border-gray-100 bg-gray-50 px-4 sm:px-8 py-5">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                {/* City */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Kota</label>
                  <div className="relative">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2E8BFF]"
                    >
                      {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Jenis Kelamin</label>
                  <div className="flex gap-2">
                    {['Semua', 'Perempuan', 'Laki-laki'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGender(g)}
                        className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
                          selectedGender === g
                            ? 'border-[#2E8BFF] bg-blue-50 text-[#2E8BFF]'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Rating Minimum</label>
                  <div className="flex gap-1">
                    {[0, 4, 4.5, 4.8].map((r) => (
                      <button
                        key={r}
                        onClick={() => setSelectedRating(r)}
                        className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
                          selectedRating === r
                            ? 'border-[#2E8BFF] bg-blue-50 text-[#2E8BFF]'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {r === 0 ? 'Semua' : `${r}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Tarif Maks: {formatIDR(priceMax)}/jam
                  </label>
                  <input
                    type="range"
                    min={50000}
                    max={500000}
                    step={10000}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-[#2E8BFF]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                    <span>{formatIDR(50000)}</span>
                    <span>{formatIDR(500000)}</span>
                  </div>
                </div>

                {/* Availability + clear */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={availableOnly}
                      onChange={(e) => setAvailableOnly(e.target.checked)}
                      className="rounded border-gray-300 text-[#2E8BFF] focus:ring-[#2E8BFF]"
                    />
                    <span className="text-xs text-gray-700">Tersedia saja</span>
                  </label>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-red-500 hover:text-red-700 text-left"
                    >
                      Hapus semua filter
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filtered.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-5">
              Menampilkan <span className="font-medium text-gray-900">{filtered.length}</span> pendamping
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((caregiver) => (
                <CaregiverCard key={caregiver.id} caregiver={caregiver} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-700 mb-2">Tidak ada pendamping ditemukan</h3>
            <p className="text-gray-500 text-sm mb-4">Coba ubah filter atau kata kunci pencarian Anda</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-[#2E8BFF] border border-[#2E8BFF] rounded-lg hover:bg-blue-50 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
