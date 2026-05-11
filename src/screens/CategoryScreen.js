import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react-native';

import { useData } from '../contexts/DataContext';
import { FULL_CATEGORIES } from '../lib/seed-data';
import { SearchService } from '../services/search.service';
import { RecipeCard } from '../components/RecipeCard';

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
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};
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

  const renderRecipe = ({ item }) => (
    <View style={styles.gridItem}>
      <RecipeCard recipe={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color="#1A1A2E" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            {categoryInfo && (
              <View style={[styles.emojiBox, { backgroundColor: categoryInfo.color }]}>
                <Text style={styles.emojiText}>{categoryInfo.emoji}</Text>
              </View>
            )}
            <Text style={styles.titleText}>{categoryName}</Text>
          </View>

          {/* Filtre Butonu */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowFilters(!showFilters)}
            style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          >
            <SlidersHorizontal size={18} color={showFilters ? "#FFFFFF" : "#1A1A2E"} />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Filtre Paneli */}
        {showFilters && (
          <View style={styles.filterPanel}>
            <TextInput
              style={styles.searchInput}
              placeholder="Kategoride ara..."
              placeholderTextColor="rgba(26, 26, 46, 0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <View style={styles.filterRow}>
              {DIFFICULTY_OPTIONS.map((d) => (
                <TouchableOpacity
                  key={d || 'all'}
                  onPress={() => setDifficulty(d)}
                  style={[styles.chip, difficulty === d && styles.chipActive]}
                >
                  <Text style={[styles.chipText, difficulty === d && styles.chipTextActive]}>
                    {d || 'Tümü'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.filterRow}>
              {SORT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setSortOption(opt.value)}
                  style={[styles.chip, sortOption === opt.value ? styles.chipSortActive : null]}
                >
                  <Text style={[styles.chipText, sortOption === opt.value && styles.chipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {activeFilterCount > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setDifficulty('');
                  setSortOption('default');
                }}
                style={styles.clearFiltersBtn}
              >
                <X size={12} color="#FF1744" />
                <Text style={styles.clearFiltersText}>Filtreleri Temizle</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.resultsCount}>
          <Text style={styles.resultsText}>
            <Text style={styles.resultsHighlight}>{categoryRecipes.length}</Text> tarif bulundu
          </Text>
        </View>

        {categoryRecipes.length > 0 ? (
          <FlatList
            data={categoryRecipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRecipe}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>{categoryInfo?.emoji || '🍽️'}</Text>
            <Text style={styles.emptyTitle}>Tarif Bulunamadı</Text>
            <Text style={styles.emptyDesc}>
              {activeFilterCount > 0
                ? 'Filtreleri değiştir.'
                : 'Bu kategoride tarif yok.'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#1A1A2E',
    backgroundColor: '#FFF8F0',
    zIndex: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  emojiBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  emojiText: {
    fontSize: 20,
  },
  titleText: {
    fontFamily: 'Righteous',
    fontSize: 24,
    color: '#1A1A2E',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  filterButtonActive: {
    backgroundColor: '#FF6B00',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E83F6F',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  filterPanel: {
    padding: 16,
    paddingBottom: 4,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#1A1A2E',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 12,
    color: '#1A1A2E',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#1A1A2E',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: '#FF6B00',
  },
  chipSortActive: {
    backgroundColor: '#1A1A2E',
  },
  chipText: {
    fontFamily: 'Nunito-Black',
    fontWeight: '900',
    fontSize: 12,
    color: '#1A1A2E',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  clearFiltersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearFiltersText: {
    color: '#FF1744',
    fontFamily: 'Nunito-Black',
    fontWeight: '900',
    fontSize: 12,
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
    marginLeft: 4,
  },
  resultsCount: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsText: {
    fontFamily: 'Nunito-Black',
    fontWeight: '900',
    fontSize: 12,
    color: 'rgba(26, 26, 46, 0.5)',
    textTransform: 'uppercase',
  },
  resultsHighlight: {
    color: '#FF6B00',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
  },
  emptyContainer: {
    margin: 16,
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#1A1A2E',
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'Righteous',
    fontSize: 18,
    color: '#1A1A2E',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: 'rgba(26, 26, 46, 0.6)',
  },
});