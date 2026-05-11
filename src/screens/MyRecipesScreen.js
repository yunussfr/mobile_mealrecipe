import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, ChefHat, Trash2, X, Camera, Clock as ClockIcon } from 'lucide-react-native';
import { useData } from '../contexts/DataContext';
import { NotebookService } from '../services/notebook.service';

export function MyRecipesScreen() {
  const navigation = useNavigation();
  const { recipes, addRecipe } = useData();

  const [collections, setCollections] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form States
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

  const myRecipes = recipes.filter((r) => r.author === 'Ben' || r.author === 'Chef Ali');

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
  }, [recipes]); // Added recipes to dependency to update when a new one is added

  const handleAddIngredient = () => setIngredients([...ingredients, { name: '', amount: '' }]);
  const handleRemoveIngredient = (idx) => setIngredients(ingredients.filter((_, i) => i !== idx));
  const handleAddStep = () => setSteps([...steps, '']);
  const handleRemoveStep = (idx) => setSteps(steps.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!title) {
      alert('Lütfen tarif adını girin');
      return;
    }

    const newRecipeId = Math.random().toString(36).substr(2, 9);

    addRecipe({
      id: newRecipeId,
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
    });

    if (collections.length > 0) {
      const updated = collections.map((c, idx) =>
        idx === 0 ? { ...c, recipeIds: [...c.recipeIds, newRecipeId] } : c
      );
      setCollections(updated);
      NotebookService.saveCollections(updated);
    }

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
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
      style={styles.recipeCard}
    >
      <View style={styles.recipeImageContainer}>
        <Image source={{ uri: typeof item.image === 'string' ? item.image : '' }} style={styles.recipeImage} />
        {item.isPublic && (
          <View style={styles.publicBadge}>
            <Text style={styles.publicBadgeText}>Herkese Açık</Text>
          </View>
        )}
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
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIconBox}>
              <ChefHat size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.mainTitle}>Tariflerim</Text>
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>YENİ</Text>
          </TouchableOpacity>
        </View>

        {myRecipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <ChefHat size={40} color="rgba(26,26,46,0.2)" />
            </View>
            <Text style={styles.emptyTitle}>Henüz Tarif Eklemedin</Text>
            <Text style={styles.emptyText}>Kendi efsane tariflerini yaratıp paylaşmaya başla!</Text>
          </View>
        ) : (
          <FlatList
            data={myRecipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRecipeItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* Ekleme Modalı */}
        <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Tarif</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.closeButton}>
                <X size={24} color="#1A1A2E" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} contentContainerStyle={{ paddingBottom: 40 }}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tarif Adı</Text>
                <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Örn: Nefis Köfte" />
              </View>

              <View style={styles.rowForm}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Süre</Text>
                  <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="30 dk" />
                </View>
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Zorluk</Text>
                  <TextInput style={styles.input} value={difficulty} onChangeText={setDifficulty} placeholder="Kolay" />
                </View>
              </View>

              <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Malzemeler</Text>
                  <TouchableOpacity onPress={handleAddIngredient}><Text style={styles.addText}>+ Ekle</Text></TouchableOpacity>
                </View>
                {ingredients.map((ing, idx) => (
                  <View key={idx} style={styles.ingredientRow}>
                    <TextInput
                      style={[styles.input, { flex: 2, marginRight: 8 }]}
                      placeholder="Malzeme"
                      value={ing.name}
                      onChangeText={(val) => {
                        const newIngs = [...ingredients];
                        newIngs[idx].name = val;
                        setIngredients(newIngs);
                      }}
                    />
                    <TextInput
                      style={[styles.input, { flex: 1, marginRight: 8 }]}
                      placeholder="Miktar"
                      value={ing.amount}
                      onChangeText={(val) => {
                        const newIngs = [...ingredients];
                        newIngs[idx].amount = val;
                        setIngredients(newIngs);
                      }}
                    />
                    <TouchableOpacity onPress={() => handleRemoveIngredient(idx)} style={styles.deleteBtn}>
                      <Trash2 size={16} color="#FF1744" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Adımlar</Text>
                  <TouchableOpacity onPress={handleAddStep}><Text style={styles.addText}>+ Ekle</Text></TouchableOpacity>
                </View>
                {steps.map((step, idx) => (
                  <View key={idx} style={styles.stepRow}>
                    <Text style={styles.stepNumber}>{idx + 1}</Text>
                    <TextInput
                      style={[styles.input, { flex: 1, marginRight: 8 }]}
                      placeholder={`Adım ${idx + 1}`}
                      value={step}
                      multiline
                      onChangeText={(val) => {
                        const newSteps = [...steps];
                        newSteps[idx] = val;
                        setSteps(newSteps);
                      }}
                    />
                    <TouchableOpacity onPress={() => handleRemoveStep(idx)} style={styles.deleteBtn}>
                      <Trash2 size={16} color="#FF1744" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>KAYDET</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  container: { flex: 1 },
  header: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerIconBox: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#E83F6F',
    borderWidth: 3, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center',
    transform: [{ rotate: '-3deg' }], marginRight: 12,
  },
  mainTitle: { fontFamily: 'Righteous', fontSize: 28, color: '#1A1A2E', textTransform: 'uppercase' },
  addButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B00',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 3, borderColor: '#1A1A2E',
  },
  addButtonText: { fontFamily: 'Nunito-Black', fontSize: 12, fontWeight: '900', color: '#FFFFFF', marginLeft: 4 },
  
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIconBox: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: '#FFFFFF',
    borderWidth: 3, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center',
    marginBottom: 24, shadowColor: '#E83F6F', shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, elevation: 4,
  },
  emptyTitle: { fontFamily: 'Righteous', fontSize: 20, color: '#1A1A2E', textTransform: 'uppercase', marginBottom: 8 },
  emptyText: { fontFamily: 'Nunito-Bold', fontWeight: 'bold', color: 'rgba(26,26,46,0.5)', textAlign: 'center' },

  listContent: { padding: 20, paddingBottom: 100 },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  recipeCard: {
    width: '48%', backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#1A1A2E',
    borderRadius: 16, overflow: 'hidden', shadowColor: '#1A1A2E',
    shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, elevation: 4,
  },
  recipeImageContainer: { height: 120, borderBottomWidth: 3, borderBottomColor: '#1A1A2E', position: 'relative' },
  recipeImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  publicBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#00C853', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#1A1A2E' },
  publicBadgeText: { fontSize: 8, fontFamily: 'Nunito-Black', fontWeight: '900', color: '#FFFFFF' },
  recipeCardBody: { padding: 12 },
  recipeCardTitle: { fontFamily: 'Righteous', fontSize: 12, color: '#1A1A2E', height: 32, marginBottom: 8 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 10, fontFamily: 'Nunito-Black', fontWeight: '900', color: 'rgba(26,26,46,0.5)', textTransform: 'uppercase', marginLeft: 4 },

  modalSafeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 3, borderBottomColor: '#1A1A2E' },
  modalTitle: { fontFamily: 'Righteous', fontSize: 20, color: '#1A1A2E' },
  closeButton: { padding: 4 },
  modalScroll: { flex: 1, padding: 20 },
  formGroup: { marginBottom: 20 },
  rowForm: { flexDirection: 'row', justifyContent: 'space-between' },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontFamily: 'Nunito-Black', fontSize: 12, fontWeight: '900', color: '#1A1A2E', textTransform: 'uppercase', marginBottom: 8 },
  addText: { fontFamily: 'Nunito-Black', fontSize: 12, fontWeight: '900', color: '#FF6B00' },
  input: {
    backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#1A1A2E', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10, fontFamily: 'Nunito-Bold', fontWeight: 'bold', color: '#1A1A2E',
  },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  stepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFD600', borderWidth: 2, borderColor: '#1A1A2E', textAlign: 'center', lineHeight: 20, fontFamily: 'Righteous', fontSize: 12, marginRight: 8, marginTop: 10 },
  deleteBtn: { width: 40, height: 40, backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#1A1A2E', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  submitButton: { backgroundColor: '#1A1A2E', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  submitButtonText: { color: '#FFFFFF', fontFamily: 'Nunito-Black', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
});