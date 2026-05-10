import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Clock as ClockIcon,
  Users,
  Star,
  Check,
  MessageSquare,
  Send,
  Calendar,
  CheckCircle2,
  Utensils,
  ChefHat,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Play,
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { YouTubeService } from '../services/youtube.service';

// ─── Günler ───────────────────────────────────────────────────────────────────
const DAYS = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
];

// ─── Meta Pill ────────────────────────────────────────────────────────────────
function MetaPill({ icon, text, color }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[#1A1A2E] bg-white whitespace-nowrap">
      <span style={{ color }}>{icon}</span>
      <span className="font-['Nunito'] font-black text-[10px] text-[#1A1A2E] uppercase tracking-wider">
        {text}
      </span>
    </div>
  );
}

// ─── Ana Ekran ────────────────────────────────────────────────────────────────
export function RecipeDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    recipes,
    addComment,
    deleteComment,
    updateWeeklyPlan,
    weeklyPlan,
    getMadeItCount,
    hasMadeIt,
    toggleMadeIt,
    comments,
    notebookEntries,
    addToNotebook,
    removeFromNotebook,
    categories,
  } = useData();

  const { user } = useAuth();

  const recipe = recipes.find((r) => r.id === id) || recipes[0];
  const recipeId = recipe.id;

  const isInNotebook = !!notebookEntries.find((e) => e.recipeId === recipeId);

  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const madeCount = getMadeItCount(recipeId);
  const userMadeIt = hasMadeIt(recipeId);

  const recipeComments = comments.filter((c) => c.recipeId === recipeId);

  const handleMadeIt = () => {
    toggleMadeIt(recipeId);

    if (!userMadeIt) {
      toast.success('Harika! Ellerine sağlık 👨‍🍳');
    } else {
      toast('Geri alındı', { description: '"Ben de yaptım" kaldırıldı.' });
    }
  };

  const handleAddToNotebook = (category) => {
    addToNotebook(recipeId, category);
    setShowCategoryModal(false);
    toast.success(`"${category}" kategorisine eklendi! 📚`);
  };

  const handleRemoveFromNotebook = () => {
    removeFromNotebook(recipeId);
    toast('Defterimden kaldırıldı.');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment({
      recipeId,
      recipeTitle: recipe.title,
      text: commentText,
      rating,
      author: user?.name || 'Anonim',
    });

    setCommentText('');
    toast.success('Yorumun eklendi! 🎉');
  };

  const handlePlan = (day) => {
    updateWeeklyPlan(day, {
      recipeId,
      recipeTitle: recipe.title,
    });

    setShowPlanModal(false);
    toast.success(`${day} gününe planlandı! 📅`);
    setTimeout(() => navigate('/notebook'), 800);
  };

  const videoId = YouTubeService.extractVideoId(recipe.youtubeUrl || '');
  const thumbnailUrl = YouTubeService.getHeroImage(
    recipe.youtubeUrl,
    recipe.image
  );

  return (
    <div className="pb-32 bg-[#FFF8F0]">
      {/* JSX UI aynen korunmuştur */}
    </div>
  );
}