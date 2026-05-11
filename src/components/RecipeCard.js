import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Clock } from 'lucide-react-native';

export function RecipeCard({ recipe, style, showDifficulty = true, showTime = true }) {
  const navigation = useNavigation();

  // "Kolay", "Orta", "Zor" için renkler
  const getDifficultyColor = (diff) => {
    if (diff === 'Kolay') return { bg: '#00C853', text: '#FFFFFF' };
    if (diff === 'Orta') return { bg: '#FFD600', text: '#1A1A2E' };
    return { bg: '#FF1744', text: '#FFFFFF' };
  };

  const diffStyle = getDifficultyColor(recipe.difficulty);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('RecipeDetail', { id: recipe.id })}
      style={[styles.card, style]}
    >
      <View style={styles.imageContainer}>
        {/* Placeholder if no image is present, otherwise use source */}
        <Image 
          source={typeof recipe.image === 'string' ? { uri: recipe.image } : recipe.image} 
          style={styles.image} 
          resizeMode="cover"
        />

        {showDifficulty && recipe.difficulty && (
          <View style={[styles.badge, { backgroundColor: diffStyle.bg }]}>
            <Text style={[styles.badgeText, { color: diffStyle.text }]}>
              {recipe.difficulty}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>

        {showTime && recipe.time && (
          <View style={styles.timeContainer}>
            <Clock size={12} color="rgba(26, 26, 46, 0.5)" />
            <Text style={styles.timeText}>{recipe.time}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#1A1A2E',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8, // for Android
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    height: 128,
    position: 'relative',
    borderBottomWidth: 3,
    borderBottomColor: '#1A1A2E',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1A1A2E',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  content: {
    padding: 12,
  },
  title: {
    fontFamily: 'Nunito-Black',
    fontWeight: '900',
    fontSize: 14,
    color: '#1A1A2E',
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    color: 'rgba(26, 26, 46, 0.5)',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
