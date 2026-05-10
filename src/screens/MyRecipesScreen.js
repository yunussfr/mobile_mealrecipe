import React, { useState, useEffect } from 'react';
import {
  ChefHat, Plus, Clock as ClockIcon, Globe, Lock,
  Trash2, X, Camera, Utensils, ArrowLeft, ChevronRight,
  Edit3, Bookmark,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useData } from '../contexts/DataContext';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { NotebookService } from '../services/notebook.service';

// ─── Ana Ekran ────────────────────────────────────────────────────────────────
export function MyRecipesScreen() {
  const navigate = useNavigate();
  const { recipes, addRecipe } = useData();

  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState(null);
  const [collectionName, setCollectionName] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('Kolay');
  const [calories, setCalories] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }]);
  const [steps, setSteps] = useState(['']);
  const [isPublic, setIsPublic] = useState(true);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=400'
  );
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const myRecipes = recipes.filter(
    (r) => r.author === 'Ben' || r.author === 'Chef Ali'
  );

  useEffect(() => {
    const saved = NotebookService.getCollections();
    if (saved.length > 0) {
      setCollections(saved);
    } else {
      const defaultCol = {
        id: 'default',
        name: 'Tüm Tariflerim',
        recipeIds: myRecipes.map((r) => r.id),
      };
      setCollections([defaultCol]);
    }
  }, []);

  useEffect(() => {
    NotebookService.saveCollections(collections);
  }, [collections]);

  const handleAddIngredient = () =>
    setIngredients([...ingredients, { name: '', amount: '' }]);

  const handleRemoveIngredient = (idx) =>
    setIngredients(ingredients.filter((_, i) => i !== idx));

  const handleAddStep = () => setSteps([...steps, '']);

  const handleRemoveStep = (idx) =>
    setSteps(steps.filter((_, i) => i !== idx));

  const handleAddCollection = () => {
    if (!collectionName.trim()) {
      toast.error('Lütfen ajanta ismi girin');
      return;
    }

    if (editingCollectionId) {
      setCollections((prev) =>
        prev.map((c) =>
          c.id === editingCollectionId ? { ...c, name: collectionName } : c
        )
      );
      toast.success('Ajanta ismi güncellendi!');
    } else {
      const newCol = {
        id: Math.random().toString(36).substr(2, 9),
        name: collectionName,
        recipeIds: [],
      };
      setCollections((prev) => [...prev, newCol]);
      toast.success('Yeni ajanta oluşturuldu!');
    }

    setCollectionName('');
    setShowCollectionModal(false);
    setEditingCollectionId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title) {
      toast.error('Lütfen tarif adını girin');
      return;
    }

    const newRecipeId = Math.random().toString(36).substr(2, 9);

    addRecipe({
      title,
      time: time || '30 dk',
      servings: servings || '2 kişi',
      difficulty,
      calories: calories || '0 kcal',
      ingredients: ingredients.filter((i) => i.name),
      steps: steps.filter((s) => s),
      isPublic,
      author: 'Ben',
      image: imageUrl,
      youtubeUrl: youtubeUrl || undefined,
    });

    if (collections.length > 0) {
      setCollections((prev) =>
        prev.map((c, idx) =>
          idx === 0 ? { ...c, recipeIds: [...c.recipeIds, newRecipeId] } : c
        )
      );
    }

    toast.success('Tarif başarıyla eklendi! 👨‍🍳');
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setTime('');
    setServings('');
    setDifficulty('Kolay');
    setCalories('');
    setIngredients([{ name: '', amount: '' }]);
    setSteps(['']);
    setIsPublic(true);
    setYoutubeUrl('');
  };

  const collectionsWithRecipes = collections.map((col) => {
    const colRecipes = col.recipeIds
      .map((id) => myRecipes.find((r) => r.id === id))
      .filter(Boolean);

    return {
      ...col,
      recipes: colRecipes,
      coverImage: colRecipes[0]?.image || null,
    };
  });

  // NOT: JSX UI kısmı aynı şekilde değişmeden kalır
  return (
    <div>
      {/* JSX UI aynı kalır */}
    </div>
  );
}