import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  Sparkles,
  ChefHat,
  Search,
  ChevronRight,
  X,
  Check,
} from 'lucide-react';

import { motion as Motion, AnimatePresence } from 'motion/react';

import { useData } from '../contexts/DataContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// ─── Yaygın Malzemeler ────────────────────────────────────────────────────────
const COMMON_INGREDIENTS = [
  'Domates',
  'Sarımsak',
  'Tavuk',
  'Limon',
  'Soğan',
  'Zeytinyağı',
  'Un',
  'Yumurta',
  'Süt',
  'Peynir',
  'Kıyma',
  'Makarna',
  'Pirinç',
  'Patates',
  'Biber',
  'Mantar',
  'Ispanak',
  'Yoğurt',
  'Balık',
  'Et',
  'Tereyağı',
  'Krema',
  'Nane',
  'Maydanoz',
  'Dereotu',
];

// Uyum yüzdesine göre renk
function getScoreColor(score) {
  if (score >= 70) return '#00C853';
  if (score >= 40) return '#FFD600';
  return '#FF6B00';
}

// ─── Ana Ekran ────────────────────────────────────────────────────────────────
export function AIChefScreen() {
  const navigate = useNavigate();
  const { recipes } = useData();

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  // ── Malzeme Toggle ────────────────────────────────────────────────────────
  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  // ── Filtrelenmiş Malzemeler ───────────────────────────────────────────────
  const filteredIngredients = useMemo(() => {
    return COMMON_INGREDIENTS.filter((i) =>
      i.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // ── Eşleşen Tarifler ──────────────────────────────────────────────────────
  const matchedRecipes = useMemo(() => {
    if (selectedIngredients.length === 0) return [];

    return recipes
      .map((recipe) => {
        const recipeIngredients = recipe.ingredients.map((i) =>
          i.name.toLowerCase()
        );

        const matches = selectedIngredients.filter((si) =>
          recipeIngredients.some((ri) =>
            ri.includes(si.toLowerCase())
          )
        );

        const score =
          (matches.length / recipe.ingredients.length) * 100;

        return {
          ...recipe,
          matchCount: matches.length,
          totalInRecipe: recipe.ingredients.length,
          matchScore: score,
          matchNames: matches,
        };
      })
      .filter((r) => r.matchScore >= 20 || r.matchCount > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [recipes, selectedIngredients]);

  return (
    <div className="min-h-full pb-24 bg-[#1A1A2E] text-white">
      {/* ── Header ── */}
      <div className="p-5 flex items-center gap-4 bg-[#1A1A2E] border-b-4 border-[#FF6B00]">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border-[3px] border-white flex items-center justify-center bg-[#1A1A2E] shadow-[3px_3px_0_#FF6B00] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#FF6B00] transition-all"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#FF6B00] border-2 border-white rounded-lg rotate-3 shadow-[3px_3px_0_#1A1A2E]">
            <Sparkles size={18} />
          </div>

          <h1 className="font-['Righteous'] text-2xl text-white">
            AI Şefim
          </h1>
        </div>

        {/* Seçili malzeme sayısı */}
        {selectedIngredients.length > 0 && (
          <div className="ml-auto bg-[#FF6B00] text-white font-black text-xs px-3 py-1 rounded-full border-2 border-white shadow-[2px_2px_0_#1A1A2E]">
            {selectedIngredients.length} malzeme
          </div>
        )}
      </div>

      <div className="p-6">
        {/* ── Robot Maskotu ── */}
        <div className="flex items-start gap-4 mb-8">
          <Motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'easeInOut',
            }}
            className="relative w-20 h-20 bg-[#FF6B00] rounded-2xl border-[4px] border-white shadow-[6px_6px_0_#1A1A2E] flex items-center justify-center text-4xl shrink-0"
          >
            🤖

            <div className="absolute -top-3 -right-3 text-2xl">
              👨‍🍳
            </div>
          </Motion.div>

          <div className="relative flex-1">
            <div className="bg-white text-[#1A1A2E] p-4 rounded-2xl rounded-tl-none border-[3px] border-[#FF6B00] font-['Nunito'] font-black text-sm relative">
              {showResults
                ? `${matchedRecipes.length} tarif buldum! En uygun olanı seçin.`
                : 'Elindeki malzemeleri seç, sana en uygun tarifleri bulayım! 🍳'}

              <div className="absolute -left-[11px] top-0 w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent" />
            </div>
          </div>
        </div>

        {/* ── Seçim Alanı ── */}
        <AnimatePresence mode="wait">
          {!showResults ? (
            <Motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Arama */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Malzeme ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1A1A2E] border-[3px] border-white rounded-xl p-3 pl-11 font-['Nunito'] font-bold text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                />

                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
                  size={18}
                />

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Malzeme Butonları */}
              <div className="flex flex-wrap gap-2">
                {filteredIngredients.map((ing) => {
                  const isSelected =
                    selectedIngredients.includes(ing);

                  return (
                    <button
                      key={ing}
                      onClick={() => toggleIngredient(ing)}
                      className={`px-4 py-2 rounded-full border-[2px] transition-all font-['Nunito'] font-black text-xs uppercase tracking-wider ${
                        isSelected
                          ? 'bg-[#FF6B00] border-white text-white scale-110 shadow-[4px_4px_0_#000]'
                          : 'bg-white/5 border-white/20 text-white/60 hover:border-white/40'
                      }`}
                    >
                      {ing}

                      {isSelected && (
                        <X
                          size={12}
                          className="inline ml-1"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </Motion.div>
          ) : (
            <Motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-['Righteous'] text-xl text-white">
                  Sonuçlar ({matchedRecipes.length})
                </h2>

                <button
                  onClick={() => setShowResults(false)}
                  className="text-[#FF6B00] font-black text-xs uppercase underline"
                >
                  Düzenle
                </button>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}