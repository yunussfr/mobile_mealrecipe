import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search, User, Sparkles, ChefHat, Bell } from 'lucide-react-native';

import { useData } from '../contexts/DataContext';
import { FULL_CATEGORIES } from '../lib/seed-data';
import { SearchService } from '../services/search.service';
import { RecipeCard } from '../components/RecipeCard';
import { SearchBar } from '../components/SearchBar';
import { NotificationsPopup } from '../components/notifications-popup'; // Varsayıyoruz ki RN uyumlu veya sonra güncellenecek

const { width } = Dimensions.get('window');

// ─── Ana Ekran ────────────────────────────────────────────────────────────────
export function DiscoverScreen() {
  const navigation = useNavigation();

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

  // ── Swipe Mantığı (Yatay FlatList ile Swipe Benzeri Görünüm) ─────────────────
  const swipeRecipes = useMemo(
    () => recipes.filter((r) => r.isPublic),
    [recipes]
  );

  const handleSwipe = (recipe) => {
    addToNotebook(recipe.id, 'Genel');
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

  const unreadCount = notifications ? notifications.filter((n) => !n.read).length : 0;

  // ── Render Bölümleri ───────────────────────────────────────────────────────
  const renderSwipeCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
      onLongPress={() => handleSwipe(item)} // Swipe yerine basılı tutarak kaydetme simülasyonu
      style={styles.swipeCardWrapper}
    >
      <View style={styles.swipeCard}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={styles.swipeCardImage}
        />
        <View style={styles.swipeCardOverlay}>
          <Text style={styles.swipeCardTitle}>{item.title}</Text>
          <Text style={styles.swipeCardHint}>Kaydetmek için basılı tut</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate('Category', { id: item.id })}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <Text style={styles.categoryEmoji}>{item.emoji}</Text>
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <User size={20} color="#1A1A2E" strokeWidth={3} />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Text style={styles.logoText1}>LEZZET</Text>
              <View style={styles.logoBadge}>
                <Text style={styles.logoText2}>TAT</Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => setShowNotifications(true)}
              >
                <Bell size={20} color="#1A1A2E" strokeWidth={3} />
                {unreadCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.recipeCountBadge}>
                <Text style={styles.recipeCountText}>{recipes.length}</Text>
              </View>
            </View>
          </View>

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="lezzettat'ta ara..."
            style={{ marginTop: 16 }}
          />
        </View>

        {/* Ekranda Scroll edilebilir ana alan */}
        <FlatList
          data={[{ id: 'content' }]} // Dummy data for FlatList as ScrollView wrapper
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={() => (
            <View style={styles.content}>
              {/* ── Swipe Section (Yatay FlatList) ── */}
              <View style={styles.sectionHeader}>
                <Sparkles size={24} color="#1A1A2E" />
                <Text style={styles.sectionTitle}>Keşfet</Text>
              </View>

              {swipeRecipes.length > 0 ? (
                <FlatList
                  data={swipeRecipes}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={width - 32}
                  decelerationRate="fast"
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderSwipeCard}
                  contentContainerStyle={styles.swipeListContent}
                />
              ) : (
                <View style={styles.emptySwipe}>
                  <Text style={styles.emptySwipeText}>Bugünlük bu kadar</Text>
                </View>
              )}

              {/* Popüler */}
              <View style={styles.sectionMargin}>
                <RecipeSection
                  title="Popüler"
                  recipes={popularRecipes}
                  isExpanded={expandedSection === 'Popüler'}
                  onToggleExpand={() => setExpandedSection(expandedSection === 'Popüler' ? null : 'Popüler')}
                />
              </View>

              {/* Yeni Tarifler */}
              <View style={styles.sectionMargin}>
                <RecipeSection
                  title="Yeni Tarifler"
                  recipes={newRecipes}
                  isExpanded={expandedSection === 'Yeni Tarifler'}
                  onToggleExpand={() => setExpandedSection(expandedSection === 'Yeni Tarifler' ? null : 'Yeni Tarifler')}
                />
              </View>

              {/* Kategoriler */}
              <View style={styles.categoriesSection}>
                <FlatList
                  data={FULL_CATEGORIES}
                  numColumns={2}
                  keyExtractor={(item) => item.id}
                  renderItem={renderCategory}
                  columnWrapperStyle={styles.categoriesRow}
                  scrollEnabled={false}
                />
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

// ─── Yardımcı Component: RecipeSection ──────────────────────────────────────
function RecipeSection({ title, recipes, isExpanded, onToggleExpand }) {
  const displayRecipes = isExpanded ? recipes : recipes.slice(0, 4);

  return (
    <View>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitleSmall}>{title}</Text>
        <TouchableOpacity onPress={onToggleExpand}>
          <Text style={styles.toggleText}>{isExpanded ? 'Gizle' : 'Tümü'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayRecipes}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.gridItemHalf}>
            <RecipeCard recipe={item} showTime={false} showDifficulty={false} />
          </View>
        )}
        columnWrapperStyle={styles.rowBetween}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  container: { flex: 1 },
  header: {
    backgroundColor: '#FFF8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#1A1A2E',
    paddingHorizontal: 16,
    paddingVertical: 16,
    zIndex: 50,
    elevation: 5,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profileButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFD600',
    borderWidth: 3, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#1A1A2E', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, elevation: 4,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoText1: { fontFamily: 'Righteous', fontSize: 24, color: '#FF6B00' },
  logoBadge: {
    backgroundColor: '#FF6B00', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 8, borderWidth: 2, borderColor: '#1A1A2E', marginLeft: 4,
  },
  logoText2: { fontFamily: 'Righteous', fontSize: 20, color: '#FFFFFF' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  notificationButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF',
    borderWidth: 3, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  notificationBadge: {
    position: 'absolute', top: -4, right: -4, backgroundColor: '#E83F6F',
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#1A1A2E',
    alignItems: 'center', justifyContent: 'center',
  },
  notificationBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  recipeCountBadge: {
    backgroundColor: '#FF6B00', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 16, borderWidth: 3, borderColor: '#1A1A2E',
  },
  recipeCountText: { color: '#FFFFFF', fontWeight: '900', fontSize: 12 },
  content: { paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 24, marginBottom: 16 },
  sectionTitle: { fontFamily: 'Righteous', fontSize: 20, color: '#1A1A2E', marginLeft: 8 },
  swipeListContent: { paddingHorizontal: 16 },
  swipeCardWrapper: { width: width - 32, marginRight: 16 },
  swipeCard: {
    width: '100%', height: 380, borderRadius: 32, borderWidth: 4, borderColor: '#1A1A2E',
    overflow: 'hidden', backgroundColor: '#FFFFFF',
  },
  swipeCardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  swipeCardOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24,
    backgroundColor: 'rgba(26,26,46,0.6)',
  },
  swipeCardTitle: { fontFamily: 'Righteous', fontSize: 24, color: '#FFFFFF', marginBottom: 8 },
  swipeCardHint: { fontFamily: 'Nunito-Bold', fontSize: 12, color: '#FFFFFF', opacity: 0.8 },
  emptySwipe: { height: 380, alignItems: 'center', justifyContent: 'center' },
  emptySwipeText: { fontFamily: 'Righteous', fontSize: 16, color: 'rgba(26,26,46,0.4)' },
  sectionMargin: { marginTop: 32, paddingHorizontal: 16 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitleSmall: { fontFamily: 'Righteous', fontSize: 20, color: '#1A1A2E' },
  toggleText: { fontFamily: 'Nunito-Bold', color: '#FF6B00', fontWeight: 'bold' },
  rowBetween: { justifyContent: 'space-between' },
  gridItemHalf: { width: '48%' },
  categoriesSection: { marginTop: 48, marginBottom: 40, paddingHorizontal: 16 },
  categoriesRow: { justifyContent: 'space-between', marginBottom: 16 },
  categoryItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderWidth: 3, borderColor: '#1A1A2E', borderRadius: 16, padding: 12, width: '48%',
  },
  categoryIcon: {
    width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  categoryEmoji: { fontSize: 24 },
  categoryName: { fontFamily: 'Nunito-Black', fontSize: 14, fontWeight: '900', color: '#1A1A2E', flex: 1 },
});