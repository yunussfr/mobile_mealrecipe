import React, { useState, useMemo, forwardRef } from 'react';
import {
  motion as Motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from 'motion/react';

import {
  Search,
  User,
  ChevronRight,
  Clock as ClockIcon,
  Sparkles,
  ChefHat,
  Bell,
} from 'lucide-react';

import { Link, useNavigate } from 'react-router';

import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useData } from '../contexts/DataContext';
import { FULL_CATEGORIES } from '../lib/seed-data';
import { NotificationsPopup } from '../components/notifications-popup';
import { SearchService } from '../services/search.service';

// ─── Ana Ekran ────────────────────────────────────────────────────────────────
export function DiscoverScreen() {
  const navigate = useNavigate();

  const {
    recipes,
    addToNotebook,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // ── Swipe Mantığı ──────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);

  const swipeRecipes = useMemo(
    () => recipes.filter((r) => r.isPublic),
    [recipes]
  );

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      const recipe = swipeRecipes[currentIndex];
      if (recipe) addToNotebook(recipe.id, 'Genel');
    }
    setCurrentIndex((prev) => prev + 1);
  };

  // ── Arama Filtresi ─────────────────────────────────────────────────────────
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipes;
    return SearchService.fullTextSearch(recipes, searchQuery);
  }, [recipes, searchQuery]);

  const popularRecipes = useMemo(
    () => filteredRecipes.slice(0, 15),
    [filteredRecipes]
  );

  const newRecipes = useMemo(
    () => filteredRecipes.slice(15, 30),
    [filteredRecipes]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col min-h-full bg-[#FFF8F0] pb-24">
      {/* ── Header ── */}
      <div className="sticky top-0 z-50 bg-[#FFF8F0] border-b-[3px] border-[#1A1A2E] px-4 py-4 space-y-4 shadow-sm">
        <header className="flex items-center justify-between">
          <Link
            to="/profile"
            className="w-10 h-10 rounded-full bg-[#FFD600] border-[3px] border-[#1A1A2E] shadow-[3px_3px_0_#1A1A2E] flex items-center justify-center"
          >
            <User size={20} strokeWidth={3} />
          </Link>

          <h1 className="font-['Righteous'] text-2xl text-[#1A1A2E] flex items-center gap-1">
            <span className="text-[#FF6B00]">LEZZET</span>
            <span className="bg-[#FF6B00] text-white px-2 py-0.5 rounded-lg border-2 border-[#1A1A2E]">
              TAT
            </span>
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotifications(true)}
              className="relative w-10 h-10 rounded-full bg-white border-[3px] border-[#1A1A2E] flex items-center justify-center"
            >
              <Bell size={20} strokeWidth={3} />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E83F6F] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1A1A2E]">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="bg-[#FF6B00] text-white font-black px-3 py-1 rounded-full text-xs border-[3px] border-[#1A1A2E]">
              {recipes.length}
            </div>
          </div>
        </header>

        {/* Arama */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="lezzettat'ta ara..."
            className="w-full bg-white border-[3px] border-[#1A1A2E] rounded-2xl py-3 px-12 font-['Nunito'] font-bold"
          />

          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2"
            size={20}
            strokeWidth={3}
          />
        </div>
      </div>

      {/* Notifications */}
      <NotificationsPopup
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        markNotificationAsRead={markNotificationAsRead}
        markAllNotificationsAsRead={markAllNotificationsAsRead}
      />

      {/* ── Swipe Section ── */}
      <div className="px-4 mt-8 h-[380px] relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['Righteous'] text-xl text-[#1A1A2E] flex items-center gap-2">
            <Sparkles size={24} />
            Keşfet
          </h2>
        </div>

        <div className="relative h-full">
          <AnimatePresence mode="popLayout">
            {currentIndex < swipeRecipes.length ? (
              <SwipeCard
                key={swipeRecipes[currentIndex].id}
                recipe={swipeRecipes[currentIndex]}
                onSwipe={handleSwipe}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="font-['Righteous'] text-[#1A1A2E]/40 text-center">
                  Bugünlük bu kadar
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Popüler */}
      <div className="mt-14 px-4">
        <RecipeSection
          title="Popüler"
          recipes={popularRecipes}
          isExpanded={expandedSection === 'Popüler'}
          onToggleExpand={() =>
            setExpandedSection(
              expandedSection === 'Popüler' ? null : 'Popüler'
            )
          }
        />
      </div>

      {/* Yeni */}
      <div className="mt-8 px-4">
        <RecipeSection
          title="Yeni Tarifler"
          recipes={newRecipes}
          isExpanded={expandedSection === 'Yeni Tarifler'}
          onToggleExpand={() =>
            setExpandedSection(
              expandedSection === 'Yeni Tarifler' ? null : 'Yeni Tarifler'
            )
          }
        />
      </div>

      {/* Kategoriler */}
      <div className="px-4 mt-12 mb-10">
        <div className="grid grid-cols-2 gap-4">
          {FULL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/category/${cat.id}`)}
              className="flex items-center gap-3 p-3 bg-white border-[3px] border-[#1A1A2E] rounded-2xl"
            >
              <div
                style={{ backgroundColor: cat.color }}
                className="w-12 h-12 rounded-xl flex items-center justify-center"
              >
                {cat.emoji}
              </div>
              <span className="font-['Nunito'] font-black text-sm">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* AI FAB */}
      <Motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/ai-chef')}
        className="fixed bottom-24 right-6 w-16 h-16 bg-[#FF6B00] border-[4px] border-[#1A1A2E] rounded-2xl flex flex-col items-center justify-center text-white"
      >
        <ChefHat size={28} />
        <span className="text-[8px] font-black">AI</span>
      </Motion.button>
    </div>
  );
}

// ─── Swipe Card ───────────────────────────────────────────────────────────────
const SwipeCard = forwardRef(function SwipeCard({ recipe, onSwipe }, ref) {
  const navigate = useNavigate();

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);

  return (
    <Motion.div
      ref={ref}
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) onSwipe('right');
        else if (info.offset.x < -120) onSwipe('left');
      }}
      className="absolute inset-0"
    >
      <div
        onClick={() => navigate(`/recipe/${recipe.id}`)}
        className="w-full h-full rounded-[32px] border-[4px] border-[#1A1A2E] overflow-hidden bg-white"
      >
        <ImageWithFallback
          src={recipe.image}
          className="w-full h-full object-cover"
        />
      </div>
    </Motion.div>
  );
});

// ─── Section ────────────────────────────────────────────────────────────────
function RecipeSection({ title, recipes, isExpanded, onToggleExpand }) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="font-['Righteous'] text-xl">{title}</h2>
        <button onClick={onToggleExpand}>Tümü</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            className="bg-white border-[3px] border-[#1A1A2E] rounded-2xl"
          >
            <ImageWithFallback
              src={recipe.image}
              className="h-32 w-full object-cover"
            />
            <div className="p-3">
              <h3 className="font-bold text-sm">{recipe.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}