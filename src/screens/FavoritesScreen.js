import React, { useMemo } from 'react';
import { Pin, Clock as ClockIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useData } from '../contexts/DataContext';

// Kart dönüş açıları
const ROTATIONS = ['-2deg', '3deg', '-1deg', '2deg', '-3deg', '1deg'];

// ─── Pushpin ────────────────────────────────────────────────────────────────
function Pushpin({ color = '#FF1744' }) {
  return (
    <div
      className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
      style={{ color }}
    >
      <Pin size={28} fill="currentColor" strokeWidth={1} />
    </div>
  );
}

// ─── Ana Ekran ────────────────────────────────────────────────────────────────
export function FavoritesScreen() {
  const navigate = useNavigate();
  const { recipes, notebookEntries, removeFromNotebook } = useData();

  const pinnedRecipes = useMemo(() => {
    return notebookEntries
      .map((entry) => {
        const recipe = recipes.find((r) => r.id === entry.recipeId);
        return recipe ? { ...recipe, category: entry.category } : null;
      })
      .filter(Boolean);
  }, [recipes, notebookEntries]);

  // ── Boş durum ────────────────────────────────────────────────────────────
  if (pinnedRecipes.length === 0) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-10 text-center bg-[#FFF8F0]">
        <div className="text-8xl mb-6">📌</div>
        <h2 className="font-['Righteous'] text-2xl text-[#1A1A2E] mb-2">
          Pinboard Boş!
        </h2>

        <p className="font-['Nunito'] font-bold text-[#1A1A2E]/60 mb-8">
          Yeni tarifler keşfet ve defterine iğnele!
        </p>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-[#FF6B00] py-4 rounded-[22px] border-[3px] border-[#1A1A2E] shadow-[4px_4px_0_#1A1A2E] font-['Righteous'] text-white"
        >
          Tarif Keşfet 🚀
        </button>
      </div>
    );
  }

  // ── Pinboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full bg-[#FFF8F0] p-5 pb-24 relative overflow-hidden">
      {/* Doku */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#1A1A2E 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Header */}
      <div className="relative z-10 mb-8 flex items-center justify-between">
        <h1 className="font-['Righteous'] text-2xl text-[#1A1A2E]">
          Pinboard
        </h1>

        <span className="font-['Nunito'] font-black text-xs bg-[#FF6B00] text-white px-3 py-1 rounded-full border-2 border-[#1A1A2E]">
          {pinnedRecipes.length} tarif
        </span>
      </div>

      {/* Kartlar */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-12 relative z-10">
        {pinnedRecipes.map((recipe, idx) => {
          const rotation = ROTATIONS[idx % ROTATIONS.length];

          const isWide = idx % 7 === 1;

          const pinColors = [
            '#FF1744',
            '#FF6B00',
            '#E83F6F',
            '#00C853',
            '#0091FF',
          ];

          const pinColor = pinColors[idx % pinColors.length];

          return (
            <div
              key={recipe.id}
              className={`relative group ${
                isWide ? 'col-span-2' : 'col-span-1'
              }`}
              style={{ transform: `rotate(${rotation})` }}
            >
              {/* Kaldır */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromNotebook(recipe.id);
                }}
                className="absolute -top-2 -left-2 z-20 w-6 h-6 bg-[#FF1744] border-2 border-white rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100"
              >
                <X size={10} strokeWidth={3} />
              </button>

              {/* Pin */}
              <Pushpin color={pinColor} />

              {/* Kart */}
              <div
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className="bg-white border-2 border-gray-200 shadow-xl p-2 cursor-pointer"
              >
                <div
                  className={`overflow-hidden ${
                    isWide ? 'h-[200px]' : 'h-[120px]'
                  }`}
                >
                  <ImageWithFallback
                    src={recipe.image}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="pt-3 pb-1">
                  <h3 className="font-['Righteous'] text-xs truncate">
                    {recipe.title}
                  </h3>

                  <div className="flex justify-between mt-1">
                    <span
                      className="text-[8px] px-1.5 py-0.5 rounded border font-black"
                      style={{
                        backgroundColor: pinColor + '20',
                        color: pinColor,
                        borderColor: pinColor + '40',
                      }}
                    >
                      {recipe.category}
                    </span>

                    <span className="flex items-center gap-1 text-[8px] font-black text-black/40">
                      <ClockIcon size={8} />
                      {recipe.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alt yazı */}
      <p className="mt-12 text-center text-[10px] font-['Nunito'] font-black text-black/30">
        Tüm iğnelenen tarifler burada 📌
      </p>
    </div>
  );
}