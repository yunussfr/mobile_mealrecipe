import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Book, Clock as ClockIcon, ChevronRight, ArrowLeft, Bookmark } from 'lucide-react-native';
import { useData } from '../contexts/DataContext';
import { NotebookService } from '../services/notebook.service';

export function NotebookScreen() {
  const navigation = useNavigation();
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

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
      style={styles.recipeCard}
    >
      <View style={styles.recipeImageContainer}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
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

  const renderCategoryItem = ({ item, index }) => {
    const isEven = index % 2 === 0;
    const rotationStyle = { transform: [{ rotate: isEven ? '-1deg' : '2deg' }] };

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setSelectedCategory(item.name)}
        style={[styles.categoryWrapper, rotationStyle]}
      >
        <View style={styles.categoryShadow} />
        
        <View style={styles.categoryCard}>
          {/* Notebook binding rings */}
          <View style={styles.binding}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <View key={i} style={styles.bindingRing} />
            ))}
          </View>

          <View style={styles.categoryImageContainer}>
            {item.coverImage ? (
              <Image
                source={typeof item.coverImage === 'string' ? { uri: item.coverImage } : item.coverImage}
                style={styles.categoryImage}
              />
            ) : (
              <View style={styles.categoryPlaceholder}>
                <Bookmark size={32} color="rgba(26,26,46,0.1)" />
              </View>
            )}

            <View style={styles.countBadge}>
              <Text style={styles.countText}>{item.recipes.length}</Text>
            </View>
          </View>

          <View style={styles.categoryFooter}>
            <Text style={styles.categoryName} numberOfLines={2}>{item.name}</Text>
            <View style={styles.exploreRow}>
              <Text style={styles.exploreText}>İncele</Text>
              <ChevronRight size={12} color="rgba(26,26,46,0.6)" strokeWidth={4} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (selectedCategory) {
    const categoryData = categoriesWithRecipes.find((c) => c.name === selectedCategory);

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.selectedHeader}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedCategory(null)}
              style={styles.backButton}
            >
              <ArrowLeft size={20} color="#1A1A2E" />
            </TouchableOpacity>
            <Text style={styles.selectedTitle}>{selectedCategory}</Text>
          </View>

          <FlatList
            data={categoryData?.recipes || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRecipeItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.mainHeader}>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIconBox}>
              <Book size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.mainTitle}>Koleksiyon</Text>
          </View>
          <Text style={styles.subTitle}>
            {notebookEntries.length} Tarif Kaydedildi
          </Text>
        </View>

        {categoriesWithRecipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Bookmark size={40} color="rgba(26,26,46,0.2)" />
            </View>
            <Text style={styles.emptyTitle}>Defterin Bomboş!</Text>
            <Text style={styles.emptyText}>Beğendiğin tarifleri kategorilerine ayırıp burada saklayabilirsin.</Text>
          </View>
        ) : (
          <FlatList
            data={categoriesWithRecipes}
            keyExtractor={(item) => item.name}
            renderItem={renderCategoryItem}
            numColumns={2}
            columnWrapperStyle={styles.categoryRow}
            contentContainerStyle={styles.categoryList}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  container: { flex: 1 },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 4,
    borderBottomColor: '#1A1A2E',
  },
  backButton: {
    width: 40, height: 40, backgroundColor: '#FFD600',
    borderRadius: 12, borderWidth: 3, borderColor: '#1A1A2E',
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
    shadowColor: '#1A1A2E', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, elevation: 4,
  },
  selectedTitle: { fontFamily: 'Righteous', fontSize: 24, color: '#1A1A2E', textTransform: 'uppercase' },
  listContent: { padding: 20, paddingBottom: 100 },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  recipeCard: {
    width: '48%', backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#1A1A2E',
    borderRadius: 16, overflow: 'hidden', shadowColor: '#1A1A2E',
    shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, elevation: 4,
  },
  recipeImageContainer: { height: 120, borderBottomWidth: 3, borderBottomColor: '#1A1A2E' },
  recipeImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  recipeCardBody: { padding: 12 },
  recipeCardTitle: { fontFamily: 'Righteous', fontSize: 12, color: '#1A1A2E', height: 32, marginBottom: 8 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 10, fontFamily: 'Nunito-Black', fontWeight: '900', color: 'rgba(26,26,46,0.5)', textTransform: 'uppercase', marginLeft: 4 },
  
  mainHeader: { padding: 20, zIndex: 10 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  headerIconBox: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#FF6B00',
    borderWidth: 3, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center',
    transform: [{ rotate: '3deg' }], marginRight: 12,
  },
  mainTitle: { fontFamily: 'Righteous', fontSize: 28, color: '#1A1A2E', textTransform: 'uppercase', fontStyle: 'italic' },
  subTitle: { fontFamily: 'Nunito-Black', fontSize: 12, fontWeight: '900', color: 'rgba(26,26,46,0.6)', textTransform: 'uppercase', marginLeft: 52 },
  
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIconBox: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: '#FFFFFF',
    borderWidth: 3, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center',
    marginBottom: 24, shadowColor: '#FFD600', shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, elevation: 4,
  },
  emptyTitle: { fontFamily: 'Righteous', fontSize: 20, color: '#1A1A2E', textTransform: 'uppercase', marginBottom: 8 },
  emptyText: { fontFamily: 'Nunito-Bold', fontWeight: 'bold', color: 'rgba(26,26,46,0.5)', textAlign: 'center' },

  categoryList: { padding: 20, paddingBottom: 100 },
  categoryRow: { justifyContent: 'space-between', marginBottom: 24 },
  categoryWrapper: { width: '46%', marginBottom: 10 },
  categoryShadow: {
    position: 'absolute', top: 4, left: 4, right: -4, bottom: -4,
    backgroundColor: '#1A1A2E', borderRadius: 16,
  },
  categoryCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#1A1A2E',
    borderTopRightRadius: 16, borderBottomRightRadius: 16, borderTopLeftRadius: 6, borderBottomLeftRadius: 6,
    overflow: 'hidden', aspectRatio: 3/4,
  },
  binding: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 12,
    backgroundColor: '#E5E5E5', borderRightWidth: 3, borderRightColor: '#1A1A2E',
    justifyContent: 'space-around', paddingVertical: 16, zIndex: 5,
  },
  bindingRing: {
    width: 16, height: 6, marginLeft: -6, backgroundColor: '#1A1A2E',
    borderRadius: 3,
  },
  categoryImageContainer: {
    height: '60%', marginLeft: 12, borderBottomWidth: 3, borderBottomColor: '#1A1A2E',
    position: 'relative',
  },
  categoryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  categoryPlaceholder: { width: '100%', height: '100%', backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  countBadge: {
    position: 'absolute', top: 8, right: 8, backgroundColor: '#FFD600',
    borderWidth: 2, borderColor: '#1A1A2E', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 8, shadowColor: '#1A1A2E', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, elevation: 2,
  },
  countText: { fontFamily: 'Righteous', fontSize: 10, color: '#1A1A2E' },
  categoryFooter: {
    flex: 1, marginLeft: 12, padding: 12, backgroundColor: '#FFD600', justifyContent: 'center',
  },
  categoryName: { fontFamily: 'Righteous', fontSize: 14, color: '#1A1A2E', textTransform: 'uppercase' },
  exploreRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  exploreText: { fontSize: 10, fontFamily: 'Nunito-Black', fontWeight: '900', color: 'rgba(26,26,46,0.6)', textTransform: 'uppercase', marginRight: 4 },
});