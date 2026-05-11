import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search as SearchIcon, X, Clock as ClockIcon, SlidersHorizontal } from 'lucide-react-native';
import { useData } from '../contexts/DataContext';
import { SearchService } from '../services/search.service';

const POPULAR_SEARCHES = [
  { text: 'Makarna', color: '#FF6B00' },
  { text: 'Burger', color: '#00C853' },
  { text: 'Salata', color: '#FF1744' },
  { text: 'Sushi', color: '#00BCD4' },
  { text: 'Kek', color: '#7C4DFF' },
  { text: 'Çorba', color: '#FF9A3C' },
  { text: 'Tavuk', color: '#E83F6F' },
  { text: 'Pilav', color: '#FFD600' },
];

const DIFFICULTY_OPTIONS = ['', 'Kolay', 'Orta', 'Zor'];

const SORT_OPTIONS = [
  { value: 'default', label: 'Varsayılan' },
  { value: 'title_asc', label: 'A→Z' },
  { value: 'time_asc', label: 'En Hızlı' },
  { value: 'difficulty', label: 'Zorluk' },
  { value: 'calories_asc', label: 'Kalori ↑' },
];

export function SearchScreen() {
  const navigation = useNavigation();
  const { recipes } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    if (!searchTerm.trim() && !difficulty) return [];

    return SearchService.applyFilters(
      recipes.filter(r => r.isPublic),
      {
        query: searchTerm,
        difficulty,
        sort: sortOption,
      }
    );
  }, [recipes, searchTerm, difficulty, sortOption]);

  const hasQuery = searchTerm.trim() || difficulty;

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
      style={styles.recipeCard}
    >
      <View style={styles.recipeImageContainer}>
        <Image
          source={{ uri: typeof item.image === 'string' ? item.image : '' }}
          style={styles.recipeImage}
        />
      </View>
      <View style={styles.recipeCardBody}>
        <Text style={styles.recipeCardTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.timeRow}>
          <ClockIcon size={10} color="rgba(26,26,46,0.5)" />
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tarif Ara</Text>

          <View style={styles.searchRow}>
            <View style={styles.searchInputContainer}>
              <SearchIcon style={styles.searchIcon} size={20} color="#1A1A2E" />
              <TextInput
                style={styles.searchInput}
                placeholder="Tarif, malzeme veya yazar ara..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholderTextColor="rgba(26,26,46,0.4)"
              />
              {searchTerm.length > 0 && (
                <TouchableOpacity style={styles.clearBtn} onPress={() => setSearchTerm('')}>
                  <X size={16} color="#1A1A2E" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity 
              style={[styles.filterBtn, showFilters && styles.filterBtnActive]} 
              onPress={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={18} color={showFilters ? '#FFFFFF' : '#1A1A2E'} />
            </TouchableOpacity>
          </View>

          {/* Filters */}
          {showFilters && (
            <View style={styles.filtersContainer}>
              <Text style={styles.filterLabel}>Zorluk</Text>
              <View style={styles.filterChipsRow}>
                {DIFFICULTY_OPTIONS.map(d => (
                  <TouchableOpacity
                    key={d || 'all'}
                    style={[styles.filterChip, difficulty === d && styles.filterChipActive]}
                    onPress={() => setDifficulty(d)}
                  >
                    <Text style={[styles.filterChipText, difficulty === d && styles.filterChipTextActive]}>
                      {d || 'Tümü'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Sıralama</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={SORT_OPTIONS}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.filterChip, sortOption === item.value && styles.filterChipActive]}
                    onPress={() => setSortOption(item.value)}
                  >
                    <Text style={[styles.filterChipText, sortOption === item.value && styles.filterChipTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.sortListContent}
              />
            </View>
          )}
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          {!hasQuery ? (
            <View>
              <Text style={styles.sectionTitle}>Popüler Aramalar</Text>
              <View style={styles.tagsContainer}>
                {POPULAR_SEARCHES.map(tag => (
                  <TouchableOpacity
                    key={tag.text}
                    style={[styles.tagBtn, { backgroundColor: tag.color + '20', borderColor: tag.color }]}
                    onPress={() => setSearchTerm(tag.text)}
                  >
                    <Text style={[styles.tagText, { color: tag.color }]}>{tag.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.resultsCount}>{results.length} tarif bulundu</Text>
              
              {results.length > 0 ? (
                <FlatList
                  data={results}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderRecipeItem}
                  numColumns={2}
                  columnWrapperStyle={styles.row}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  container: { flex: 1 },
  
  header: {
    backgroundColor: '#FFF8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#1A1A2E',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    zIndex: 10,
  },
  headerTitle: { fontFamily: 'Righteous', fontSize: 24, color: '#1A1A2E', marginBottom: 16 },
  
  searchRow: { flexDirection: 'row', gap: 8 },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#1A1A2E',
    borderRadius: 24,
    height: 48,
    position: 'relative',
  },
  searchIcon: { position: 'absolute', left: 16, zIndex: 1 },
  searchInput: { flex: 1, height: '100%', paddingLeft: 44, paddingRight: 40, fontFamily: 'Nunito-Bold', fontSize: 14, color: '#1A1A2E' },
  clearBtn: { position: 'absolute', right: 12, padding: 4, zIndex: 1 },
  
  filterBtn: { width: 48, height: 48, backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#1A1A2E', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  filterBtnActive: { backgroundColor: '#1A1A2E' },

  filtersContainer: { marginTop: 16 },
  filterLabel: { fontFamily: 'Nunito-Black', fontSize: 12, fontWeight: '900', color: '#1A1A2E', marginBottom: 8, marginTop: 8 },
  filterChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 2, borderColor: '#1A1A2E', borderRadius: 8, backgroundColor: '#FFFFFF', marginRight: 8 },
  filterChipActive: { backgroundColor: '#1A1A2E' },
  filterChipText: { fontFamily: 'Nunito-Black', fontSize: 12, fontWeight: '900', color: '#1A1A2E' },
  filterChipTextActive: { color: '#FFFFFF' },
  sortListContent: { paddingRight: 20 },

  content: { flex: 1, padding: 20 },
  sectionTitle: { fontFamily: 'Nunito-Black', fontSize: 14, fontWeight: '900', color: '#1A1A2E', marginBottom: 12 },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagBtn: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 2, borderRadius: 8 },
  tagText: { fontFamily: 'Nunito-Bold', fontSize: 14, fontWeight: 'bold' },

  resultsCount: { fontFamily: 'Nunito-Black', fontSize: 14, fontWeight: '900', color: '#1A1A2E', marginBottom: 16 },
  listContent: { paddingBottom: 100 },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  
  recipeCard: {
    width: '48%', backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#1A1A2E',
    borderRadius: 12, overflow: 'hidden', shadowColor: '#1A1A2E',
    shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, elevation: 4,
  },
  recipeImageContainer: { height: 120, borderBottomWidth: 3, borderBottomColor: '#1A1A2E' },
  recipeImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  recipeCardBody: { padding: 8 },
  recipeCardTitle: { fontFamily: 'Nunito-Black', fontSize: 12, fontWeight: '900', color: '#1A1A2E', height: 32, marginBottom: 4 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 10, fontFamily: 'Nunito-Black', fontWeight: '900', color: 'rgba(26,26,46,0.5)', marginLeft: 4 },

  emptyContainer: { flex: 1, alignItems: 'center', paddingTop: 40 },
  emptyText: { fontFamily: 'Nunito-Bold', fontSize: 16, fontWeight: 'bold', color: 'rgba(26,26,46,0.5)' },
});