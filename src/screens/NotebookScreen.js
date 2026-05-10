import React, { useState } from 'react';
import {
  Book,
  Clock as ClockIcon,
  ChevronRight,
  ArrowLeft,
  Bookmark
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useData } from '../contexts/DataContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { NotebookService } from '../services/notebook.service';

// ─── Ana Ekran ────────────────────────────────────────────────────────────────
export function NotebookScreen() {
  const navigate = useNavigate();
  const { recipes, notebookEntries, categories } = useData();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoriesWithRecipes = categories
    .map((cat) => {
      const entries = NotebookService.getEntriesByCategory(cat, notebookEntries);

      const catRecipes = entries
        .map((e) => recipes.find((r) => r.id === e.recipeId))
        .filter(Boolean);

      return {
        name: cat,
        recipes: catRecipes,
        coverImage: catRecipes[0]?.image || null,
      };
    })
    .filter((c) => c.recipes.length > 0);

  if (selectedCategory) {
    const categoryData = categoriesWithRecipes.find(
      (c) => c.name === selectedCategory
    );

    return (
      <div className="min-h-full pb-24 bg-[#FFF8F0]">
        <div className="p-5 flex items-center gap-4 bg-white border-b-4 border-[#1A1A2E]">
          <button
            onClick={() => setSelectedCategory(null)}
            className="w-10 h-10 bg-[#FFD600] rounded-xl border-[3px] border-[#1A1A2E] flex items-center justify-center shadow-[3px_3px_0_#1A1A2E] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="font-['Righteous'] text-2xl text-[#1A1A2E] uppercase">
            {selectedCategory}
          </h1>
        </div>

        <div className="p-5 grid grid-cols-2 gap-4">
          {categoryData?.recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="bg-white border-[3px] border-[#1A1A2E] rounded-2xl overflow-hidden shadow-[4px_4px_0_#1A1A2E] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
            >
              <div className="h-32 overflow-hidden border-b-[3px] border-[#1A1A2E]">
                <ImageWithFallback
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3">
                <h3 className="font-['Righteous'] text-xs text-[#1A1A2E] line-clamp-2 leading-tight h-8 mb-2">
                  {recipe.title}
                </h3>

                <div className="flex items-center gap-1 text-[10px] font-black text-[#1A1A2E]/50 uppercase">
                  <ClockIcon size={10} /> {recipe.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-24 bg-[#FFF8F0] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1A1A2E 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="p-5 relative z-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00] border-[3px] border-[#1A1A2E] flex items-center justify-center shadow-[4px_4px_0_#1A1A2E] rotate-3">
              <Book size={20} className="text-white" />
            </div>

            <h1 className="font-['Righteous'] text-3xl text-[#1A1A2E] uppercase italic">
              Koleksiyon
            </h1>
          </div>

          <p className="font-['Nunito'] text-xs font-black text-[#1A1A2E]/60 uppercase tracking-widest ml-14">
            {notebookEntries.length} Tarif Kaydedildi
          </p>
        </div>
      </div>

      <div className="px-5 grid grid-cols-2 gap-6 mt-8 relative z-10">
        {categoriesWithRecipes.map((cat, idx) => (
          <div
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`relative group cursor-pointer transition-transform hover:-translate-y-1 ${
              idx % 2 === 0 ? '-rotate-1' : 'rotate-2'
            }`}
          >
            <div className="absolute inset-0 bg-[#1A1A2E] rounded-r-2xl translate-x-1 translate-y-1" />

            <div className="relative aspect-[3/4] bg-white border-[3px] border-[#1A1A2E] rounded-r-2xl rounded-l-md overflow-hidden flex flex-col shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#E5E5E5] border-r-[3px] border-[#1A1A2E] flex flex-col justify-around py-4">
                {[1,2,3,4,5,6,7].map((i) => (
                  <div
                    key={i}
                    className="w-4 h-1.5 -ml-1.5 bg-[#1A1A2E] rounded-full border border-white/20"
                  />
                ))}
              </div>

              <div className="ml-3 h-[60%] overflow-hidden border-b-[3px] border-[#1A1A2E] relative">
                {cat.coverImage ? (
                  <ImageWithFallback
                    src={cat.coverImage}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#F5F5F5] flex items-center justify-center">
                    <Bookmark size={32} className="text-[#1A1A2E]/10" />
                  </div>
                )}

                <div className="absolute top-2 right-2 bg-[#FFD600] border-2 border-[#1A1A2E] px-2 py-0.5 rounded-lg shadow-[2px_2px_0_#1A1A2E]">
                  <span className="font-['Righteous'] text-[10px] text-[#1A1A2E]">
                    {cat.recipes.length}
                  </span>
                </div>
              </div>

              <div className="ml-3 p-3 flex-1 flex flex-col justify-center bg-[#FFD600]">
                <h3 className="font-['Righteous'] text-sm text-[#1A1A2E] uppercase line-clamp-2">
                  {cat.name}
                </h3>

                <div className="mt-2 flex items-center text-[10px] font-black text-[#1A1A2E]/60 uppercase">
                  <span>İncele</span>
                  <ChevronRight size={12} strokeWidth={4} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {categoriesWithRecipes.length === 0 && (
          <div className="col-span-2 py-20 text-center">
            <div className="inline-flex w-24 h-24 rounded-full bg-white border-[3px] border-[#1A1A2E] items-center justify-center shadow-[6px_6px_0_#FFD600] mb-6">
              <Bookmark size={40} className="text-[#1A1A2E]/20" />
            </div>

            <h2 className="font-['Righteous'] text-xl text-[#1A1A2E] uppercase">
              Defterin Bomboş!
            </h2>

            <p className="font-['Nunito'] font-bold text-[#1A1A2E]/50 mt-2 px-10">
              Beğendiğin tarifleri kategorilerine ayırıp burada saklayabilirsin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}