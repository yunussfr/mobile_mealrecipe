import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  ArrowLeft, Clock as ClockIcon, Users, Star, Check, MessageSquare,
  Send, Calendar, CheckCircle2, Utensils, ChefHat, Trash2,
  Bookmark, BookmarkCheck, Play, X
} from 'lucide-react-native';

import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { YouTubeService } from '../services/youtube.service';

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

function MetaPill({ icon, text, color }) {
  return (
    <View style={styles.metaPill}>
      {icon}
      <Text style={styles.metaPillText}>{text}</Text>
    </View>
  );
}

export function RecipeDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const {
    recipes, addComment, deleteComment, updateWeeklyPlan, weeklyPlan,
    getMadeItCount, hasMadeIt, toggleMadeIt, comments, notebookEntries,
    addToNotebook, removeFromNotebook, categories,
  } = useData();

  const { user } = useAuth();

  const recipe = recipes.find((r) => r.id === id) || recipes[0];
  const recipeId = recipe?.id;

  const isInNotebook = !!notebookEntries.find((e) => e.recipeId === recipeId);

  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const madeCount = getMadeItCount(recipeId);
  const userMadeIt = hasMadeIt(recipeId);
  const recipeComments = comments.filter((c) => c.recipeId === recipeId);

  if (!recipe) return null;

  const handleMadeIt = () => {
    toggleMadeIt(recipeId);
    if (!userMadeIt) {
      alert('Harika! Ellerine sağlık 👨‍🍳');
    } else {
      alert('Geri alındı. "Ben de yaptım" kaldırıldı.');
    }
  };

  const handleAddToNotebook = (category) => {
    addToNotebook(recipeId, category);
    setShowCategoryModal(false);
    alert(`"${category}" kategorisine eklendi! 📚`);
  };

  const handleRemoveFromNotebook = () => {
    removeFromNotebook(recipeId);
    alert('Defterimden kaldırıldı.');
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    addComment({
      recipeId,
      recipeTitle: recipe.title,
      text: commentText,
      rating,
      author: user?.name || 'Anonim',
    });

    setCommentText('');
    alert('Yorumun eklendi! 🎉');
  };

  const handlePlan = (day) => {
    updateWeeklyPlan(day, {
      recipeId,
      recipeTitle: recipe.title,
    });
    setShowPlanModal(false);
    alert(`${day} gününe planlandı! 📅`);
    setTimeout(() => navigation.navigate('WeeklyPlan'), 800);
  };

  const videoId = YouTubeService.extractVideoId(recipe.youtubeUrl || '');
  const thumbnailUrl = YouTubeService.getHeroImage(recipe.youtubeUrl, recipe.image);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <ArrowLeft size={24} color="#1A1A2E" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => setShowPlanModal(true)} style={styles.iconBtn}>
              <Calendar size={20} color="#1A1A2E" />
            </TouchableOpacity>
            {isInNotebook ? (
              <TouchableOpacity onPress={handleRemoveFromNotebook} style={styles.iconBtnActive}>
                <BookmarkCheck size={20} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setShowCategoryModal(true)} style={styles.iconBtn}>
                <Bookmark size={20} color="#1A1A2E" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Hero Image */}
        <View style={styles.heroWrapper}>
          <Image source={{ uri: typeof thumbnailUrl === 'string' ? thumbnailUrl : '' }} style={styles.heroImage} />
          {videoId && (
            <View style={styles.playOverlay}>
              <TouchableOpacity style={styles.playButton}>
                <Play size={32} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
              <Text style={styles.playText}>VİDEOYU İZLE</Text>
            </View>
          )}
        </View>

        {/* Title & Meta */}
        <View style={styles.titleSection}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <View style={styles.authorBadge}>
            <ChefHat size={14} color="#FF6B00" />
            <Text style={styles.authorText}>{recipe.author}</Text>
          </View>

          <View style={styles.metaRow}>
            <MetaPill icon={<ClockIcon size={14} color="#FF6B00" />} text={recipe.time} color="#FF6B00" />
            <MetaPill icon={<Users size={14} color="#0091FF" />} text={recipe.servings} color="#0091FF" />
            <MetaPill icon={<Star size={14} color="#FFD600" fill="#FFD600" />} text="4.8" color="#FFD600" />
          </View>
        </View>

        {/* Made It Button */}
        <TouchableOpacity
          style={[styles.madeItBtn, userMadeIt && styles.madeItBtnActive]}
          onPress={handleMadeIt}
        >
          <View style={styles.madeItLeft}>
            {userMadeIt ? <CheckCircle2 size={24} color="#FFFFFF" /> : <Utensils size={24} color="#1A1A2E" />}
            <Text style={[styles.madeItText, userMadeIt && styles.madeItTextActive]}>
              {userMadeIt ? 'BEN DE YAPTIM!' : 'YAPACAKLAR LİSTESİNE EKLE'}
            </Text>
          </View>
          {madeCount > 0 && (
            <View style={styles.madeItCount}>
              <Text style={styles.madeItCountText}>{madeCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Malzemeler</Text>
          <View style={styles.ingredientsBox}>
            {recipe.ingredients.map((ing, idx) => (
              <View key={idx} style={styles.ingredientItem}>
                <View style={styles.ingredientDot} />
                <Text style={styles.ingredientName}>{ing.name}</Text>
                <View style={styles.ingredientDottedLine} />
                <Text style={styles.ingredientAmount}>{ing.amount}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adımlar</Text>
          <View style={styles.stepsContainer}>
            {recipe.steps.map((step, idx) => (
              <View key={idx} style={styles.stepItem}>
                <View style={styles.stepNumberBox}>
                  <Text style={styles.stepNumberText}>{idx + 1}</Text>
                </View>
                <View style={styles.stepTextBox}>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Comments */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Yorumlar</Text>
            <View style={styles.commentCount}>
              <Text style={styles.commentCountText}>{recipeComments.length}</Text>
            </View>
          </View>

          <View style={styles.commentInputBox}>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Star size={24} color={star <= rating ? "#FFD600" : "#E5E5E5"} fill={star <= rating ? "#FFD600" : "none"} />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Düşüncelerini paylaş..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleAddComment}>
                <Send size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {recipeComments.map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{comment.author}</Text>
                {comment.author === user?.name && (
                  <TouchableOpacity onPress={() => deleteComment(comment.id)}>
                    <Trash2 size={14} color="#FF1744" />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.commentStars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={10} color={s <= comment.rating ? "#FFD600" : "#E5E5E5"} fill={s <= comment.rating ? "#FFD600" : "none"} />
                ))}
              </View>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Plan Modal */}
      <Modal visible={showPlanModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Haftalık Plana Ekle</Text>
              <TouchableOpacity onPress={() => setShowPlanModal(false)}>
                <X size={24} color="#1A1A2E" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              {DAYS.map((day) => (
                <TouchableOpacity key={day} style={styles.modalBtn} onPress={() => handlePlan(day)}>
                  <Text style={styles.modalBtnText}>{day}</Text>
                  {weeklyPlan[day]?.recipeId === recipeId && <Check size={16} color="#00C853" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Category Modal */}
      <Modal visible={showCategoryModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Deftere Ekle</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <X size={24} color="#1A1A2E" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              {categories.map((cat) => (
                <TouchableOpacity key={cat} style={styles.modalBtn} onPress={() => handleAddToNotebook(cat)}>
                  <Text style={styles.modalBtnText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  container: { flex: 1 },
  content: { paddingBottom: 100 },
  
  headerActions: { flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10 },
  iconBtn: { width: 44, height: 44, backgroundColor: '#FFFFFF', borderRadius: 22, borderWidth: 3, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', shadowColor: '#1A1A2E', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, elevation: 4 },
  iconBtnActive: { width: 44, height: 44, backgroundColor: '#FF6B00', borderRadius: 22, borderWidth: 3, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', shadowColor: '#1A1A2E', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, elevation: 4 },
  headerRight: { flexDirection: 'row', gap: 12 },

  heroWrapper: { width: '100%', height: 300, borderBottomWidth: 4, borderBottomColor: '#1A1A2E', position: 'relative' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  playOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(26,26,46,0.3)', alignItems: 'center', justifyContent: 'center' },
  playButton: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FF1744', borderWidth: 4, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#1A1A2E', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, elevation: 4, marginBottom: 12 },
  playText: { fontFamily: 'Nunito-Black', fontSize: 12, fontWeight: '900', color: '#FFFFFF', letterSpacing: 2 },

  titleSection: { padding: 20 },
  recipeTitle: { fontFamily: 'Righteous', fontSize: 32, color: '#1A1A2E', lineHeight: 36, marginBottom: 8 },
  authorBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#FFF8F0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, borderWidth: 2, borderColor: '#1A1A2E', marginBottom: 16 },
  authorText: { fontFamily: 'Nunito-Bold', fontSize: 12, fontWeight: 'bold', color: '#1A1A2E', marginLeft: 6 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 2, borderColor: '#1A1A2E', marginRight: 8 },
  metaPillText: { fontFamily: 'Nunito-Black', fontSize: 10, fontWeight: '900', color: '#1A1A2E', marginLeft: 6 },

  madeItBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFD600', marginHorizontal: 20, padding: 16, borderRadius: 16, borderWidth: 4, borderColor: '#1A1A2E', shadowColor: '#1A1A2E', shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, elevation: 4, marginBottom: 32 },
  madeItBtnActive: { backgroundColor: '#00C853', shadowOffset: { width: 2, height: 2 }, transform: [{ translateY: 4 }, { translateX: 4 }] },
  madeItLeft: { flexDirection: 'row', alignItems: 'center' },
  madeItText: { fontFamily: 'Nunito-Black', fontSize: 14, fontWeight: '900', color: '#1A1A2E', marginLeft: 12 },
  madeItTextActive: { color: '#FFFFFF' },
  madeItCount: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#1A1A2E', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  madeItCountText: { fontFamily: 'Righteous', fontSize: 12, color: '#1A1A2E' },

  section: { paddingHorizontal: 20, marginBottom: 32 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontFamily: 'Righteous', fontSize: 24, color: '#1A1A2E', marginBottom: 16 },
  commentCount: { backgroundColor: '#FF6B00', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, borderWidth: 2, borderColor: '#1A1A2E', marginLeft: 12 },
  commentCountText: { fontFamily: 'Righteous', fontSize: 12, color: '#FFFFFF' },

  ingredientsBox: { backgroundColor: '#FFFFFF', borderWidth: 4, borderColor: '#1A1A2E', borderRadius: 24, padding: 20, shadowColor: '#1A1A2E', shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, elevation: 4 },
  ingredientItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  ingredientDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF6B00', marginRight: 12 },
  ingredientName: { fontFamily: 'Nunito-Bold', fontSize: 14, fontWeight: 'bold', color: '#1A1A2E' },
  ingredientDottedLine: { flex: 1, height: 1, borderBottomWidth: 1, borderBottomColor: 'rgba(26,26,46,0.2)', borderStyle: 'dashed', marginHorizontal: 8 },
  ingredientAmount: { fontFamily: 'Nunito-Black', fontSize: 14, fontWeight: '900', color: '#1A1A2E' },

  stepsContainer: { gap: 16 },
  stepItem: { flexDirection: 'row' },
  stepNumberBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FF6B00', borderWidth: 3, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', marginRight: 16, marginTop: 4 },
  stepNumberText: { fontFamily: 'Righteous', fontSize: 16, color: '#FFFFFF' },
  stepTextBox: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#1A1A2E', borderRadius: 16, padding: 16, shadowColor: '#1A1A2E', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, elevation: 2 },
  stepText: { fontFamily: 'Nunito-Bold', fontSize: 14, fontWeight: 'bold', color: '#1A1A2E', lineHeight: 22 },

  commentInputBox: { backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#1A1A2E', borderRadius: 20, padding: 16, marginBottom: 24 },
  ratingRow: { flexDirection: 'row', marginBottom: 12, gap: 4 },
  commentInputRow: { flexDirection: 'row', gap: 12 },
  commentInput: { flex: 1, backgroundColor: '#FFF8F0', borderWidth: 2, borderColor: '#1A1A2E', borderRadius: 12, padding: 12, fontFamily: 'Nunito-Bold', minHeight: 48 },
  sendBtn: { width: 48, height: 48, backgroundColor: '#1A1A2E', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  
  commentCard: { backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#1A1A2E', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#1A1A2E', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, elevation: 2 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  commentAuthor: { fontFamily: 'Righteous', fontSize: 14, color: '#1A1A2E' },
  commentStars: { flexDirection: 'row', marginBottom: 8, gap: 2 },
  commentText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: '#1A1A2E' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(26,26,46,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderWidth: 4, borderColor: '#1A1A2E', borderRadius: 24, padding: 20, shadowColor: '#1A1A2E', shadowOffset: { width: 8, height: 8 }, shadowOpacity: 1, elevation: 8 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 3, borderBottomColor: '#1A1A2E', paddingBottom: 16 },
  modalTitle: { fontFamily: 'Righteous', fontSize: 20, color: '#1A1A2E' },
  modalBody: { gap: 12 },
  modalBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF8F0', padding: 16, borderRadius: 12, borderWidth: 3, borderColor: '#1A1A2E' },
  modalBtnText: { fontFamily: 'Nunito-Bold', fontSize: 14, fontWeight: 'bold', color: '#1A1A2E' },
});