//I added comments to the this file import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Clock as ClockIcon,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useData } from '../contexts/DataContext';
import { FULL_CATEGORIES } from '../lib/seed-data';
import { SearchService } from '../services/search.service';

// ─── Zorluk Filtreleri ────────────────────────────────────────────────────────
const DIFFICULTY_OPTIONS = ['', 'Kolay', 'Orta', 'Zor'];

const SORT_OPTIONS = [
  { value: 'default', label: 'Varsayılan' },
  { value: 'title_asc', label: 'A→Z' },
  { value: 'time_asc', label: 'En Hızlı' },
  { value: 'difficulty', label: 'Zorluk' },
];

// ─── Ana Ekran ────────────────────────────────────────────────────────────────
export function CategoryScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes } = useData();

  const categoryInfo = FULL_CATEGORIES.find((c) => c.id === id);
  const categoryName = categoryInfo?.name || 'Kategori';

  // ── Filtre State ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  // ── Tarif Filtrele ────────────────────────────────────────────────────────
  const categoryRecipes = useMemo(() => {
    const publicRecipes = recipes.filter((r) => r.isPublic);

    const filtered = SearchService.applyFilters(publicRecipes, {
      query: searchQuery,
      difficulty,
      sort: sortOption,
    });

    return SearchService.filterByCategory(filtered, categoryName);
  }, [recipes, searchQuery, difficulty, sortOption, categoryName]);

  const activeFilterCount = [searchQuery, difficulty].filter(Boolean).length;

  return (
    <div className="min-h-full pb-24 bg-[#FFF8F0]">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-[#FFF8F0] border-b-[3px] border-[#1A1A2E]">
        <header className="flex items-center gap-3 px-4 pt-5 pb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white rounded-full border-[3px] border-[#1A1A2E] shadow-[3px_3px_0_#1A1A2E] flex items-center justify-center active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#1A1A2E]"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-2 flex-1">
            {categoryInfo && (
              <div
                className="w-10 h-10 rounded-xl border-2 border-[#1A1A2E] flex items-center justify-center text-xl shadow-[2px_2px_0_#1A1A2E]"
                style={{ backgroundColor: categoryInfo.color }}
              >
                {categoryInfo.emoji}
              </div>
            )}

            <h1 className="font-['Righteous'] text-2xl text-[#1A1A2E]">
              {categoryName}
            </h1>
          </div>

          {/* Filtre Butonu */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative w-10 h-10 rounded-full border-[3px] border-[#1A1A2E] flex items-center justify-center transition-all shadow-[3px_3px_0_#1A1A2E] ${
              showFilters
                ? 'bg-[#FF6B00] text-white'
                : 'bg-white text-[#1A1A2E]'
            }`}
          >
            <SlidersHorizontal size={18} />

            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E83F6F] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#1A1A2E]">
                {activeFilterCount}
              </span>
            )}
          </button>
        </header>

        {/* Filtre Paneli */}
        {showFilters && (
          <div className="px-4 pb-4 space-y-3">
            {/* Arama */}
            <input
              type="text"
              placeholder="Kategoride ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-[3px] border-[#1A1A2E] rounded-xl py-2.5 px-4 font-['Nunito'] font-bold text-sm"
            />

            {/* Zorluk */}
            <div className="flex gap-2 flex-wrap">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d || 'all'}
                  onClick={() => setDifficulty(d)}
                  className={`px-3 py-1.5 rounded-full border-2 border-[#1A1A2E] font-['Nunito'] font-black text-xs ${
                    difficulty === d
                      ? 'bg-[#FF6B00] text-white'
                      : 'bg-white text-[#1A1A2E]'
                  }`}
                >
                  {d || 'Tümü'}
                </button>
              ))}
            </div>

            {/* Sıralama */}
            <div className="flex gap-2 overflow-x-auto">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortOption(opt.value)}
                  className={`shrink-0 px-3 py-1.5 rounded-full border-2 border-[#1A1A2E] font-['Nunito'] font-black text-xs ${
                    sortOption === opt.value
                      ? 'bg-[#1A1A2E] text-white'
                      : 'bg-white text-[#1A1A2E]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Temizle */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDifficulty('');
                  setSortOption('default');
                }}
                className="text-[#FF1744] font-black text-xs uppercase underline flex items-center gap-1"
              >
                <X size={12} /> Filtreleri Temizle
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sonuç sayısı */}
      <div className="px-4 py-3">
        <p className="font-['Nunito'] font-black text-xs text-[#1A1A2E]/50 uppercase">
          <span className="text-[#FF6B00]">
            {categoryRecipes.length}
          </span>{' '}
          tarif bulundu
        </p>
      </div>

      {/* Grid */}
      {categoryRecipes.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 px-4">
          {categoryRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="bg-white rounded-2xl border-[3px] border-[#1A1A2E] shadow-[6px_6px_0_#1A1A2E] overflow-hidden cursor-pointer"
            >
              <div className="h-32 relative">
                <ImageWithFallback
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />

                <div
                  className={`absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded ${
                    recipe.difficulty === 'Kolay'
                      ? 'bg-[#00C853] text-white'
                      : recipe.difficulty === 'Orta'
                      ? 'bg-[#FFD600] text-[#1A1A2E]'
                      : 'bg-[#FF1744] text-white'
                  }`}
                >
                  {recipe.difficulty}
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-['Nunito'] font-black text-sm">
                  {recipe.title}
                </h3>

                <div className="flex items-center gap-1 text-[10px] text-[#1A1A2E]/50">
                  <ClockIcon size={10} /> {recipe.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-4 p-8 bg-white rounded-2xl border-[3px] border-[#1A1A2E] text-center">
          <div className="text-5xl mb-4">
            {categoryInfo?.emoji || '🍽️'}
          </div>

          <h3 className="font-['Righteous'] text-lg">
            Tarif Bulunamadı
          </h3>

          <p className="text-sm text-[#1A1A2E]/60">
            {activeFilterCount > 0
              ? 'Filtreleri değiştir.'
              : 'Bu kategoride tarif yok.'}
          </p>
        </div>
      )}
    </div>
  );
}