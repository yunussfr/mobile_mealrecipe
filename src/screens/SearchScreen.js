import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, X, Clock as ClockIcon, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useData } from '../contexts/DataContext';
import { SearchService } from '../services/search.service';

// ─── Sabitler ───────────────────────────────────────────────────────────────
const POPULAR_SEARCHES = [
  { text: 'Makarna', color: '#FF6B00' },
  { text: 'Burger', color: '#00C853' },
  { text: 'Salata', color: '#FF1744' },
  { text: 'Sushi', color: '#00BCD4' },
  { text: 'Kek', color: '#7C4DFF' },
  { text: 'Çorba', color: '#FF9A3C' },
  { text: 'Tavuk', color: '#E83F6F' },
  { text: 'Pilav', color: '#FFD600' },
];

const DIFFICULTY_OPTIONS = ['', 'Kolay', 'Orta', 'Zor'];

const SORT_OPTIONS = [
  { value: 'default', label: 'Varsayılan' },
  { value: 'title_asc', label: 'A→Z' },
  { value: 'time_asc', label: 'En Hızlı' },
  { value: 'difficulty', label: 'Zorluk' },
  { value: 'calories_asc', label: 'Kalori ↑' },
];

// ─── Ana Component ─────────────────────────────────────────────────────────
export function SearchScreen() {
  const navigate = useNavigate();
  const { recipes } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    if (!searchTerm.trim() && !difficulty) return [];

    return SearchService.applyFilters(
      recipes.filter(r => r.isPublic),
      {
        query: searchTerm,
        difficulty,
        sort: sortOption,
      }
    );
  }, [recipes, searchTerm, difficulty, sortOption]);

  const hasQuery = searchTerm.trim() || difficulty;
  const activeFilterCount = [difficulty].filter(Boolean).length;

  return (
    <div className="min-h-full pb-24 bg-[#FFF8F0]">

      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-[#FFF8F0] border-b-[3px] border-[#1A1A2E] px-5 py-5 space-y-4">
        <h1 className="font-['Righteous'] text-2xl text-[#1A1A2E]">Tarif Ara</h1>

        {/* Search bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tarif, malzeme veya yazar ara..."
              className="w-full h-12 pl-12 pr-10 rounded-full border-[3px] border-[#1A1A2E] bg-white font-bold"
            />

            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2" size={20} />

            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X size={16} />
              </button>
            )}
          </div>

          {/* filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-12 h-12 border-[3px] border-[#1A1A2E] bg-white flex items-center justify-center"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-black">Zorluk</p>
              <div className="flex gap-2 flex-wrap">
                {DIFFICULTY_OPTIONS.map(d => (
                  <button
                    key={d || 'all'}
                    onClick={() => setDifficulty(d)}
                    className="px-3 py-1 border-2 border-black text-xs font-black"
                  >
                    {d || 'Tümü'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-black">Sıralama</p>
              <div className="flex gap-2 overflow-x-auto">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSortOption(opt.value)}
                    className="px-3 py-1 border-2 border-black text-xs font-black"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="px-5 pt-5">

        {!hasQuery ? (
          <div>
            <h3 className="font-black mb-3">Popüler Aramalar</h3>

            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map(tag => (
                <button
                  key={tag.text}
                  onClick={() => setSearchTerm(tag.text)}
                  style={{ backgroundColor: tag.color + '20', color: tag.color }}
                  className="px-3 py-1 border-2 border-black font-bold text-sm"
                >
                  {tag.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <p className="font-black mb-4">
              {results.length} tarif bulundu
            </p>

            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {results.map(recipe => (
                  <div
                    key={recipe.id}
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                    className="border-2 border-black bg-white cursor-pointer"
                  >
                    <div className="h-32">
                      <ImageWithFallback src={recipe.image} className="w-full h-full object-cover" />
                    </div>

                    <div className="p-2">
                      <h3 className="text-xs font-black">{recipe.title}</h3>
                      <div className="text-[10px] flex items-center gap-1">
                        <ClockIcon size={10} /> {recipe.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center mt-10 font-bold">
                Sonuç bulunamadı
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}