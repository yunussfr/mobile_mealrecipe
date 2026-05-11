import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Calendar, ChevronRight, Plus, X } from 'lucide-react-native';
import { useData } from '../contexts/DataContext';
import { WeeklyPlanService, WEEK_DAYS } from '../services/weekly-plan.service';

const DAY_COLORS = [
  '#FF6B00',
  '#E83F6F',
  '#00C853',
  '#0091FF',
  '#FFD600',
  '#8B5CF6',
  '#F43F5E',
];

export function WeeklyPlanScreen() {
  const navigation = useNavigation();
  const { weeklyPlan, updateWeeklyPlan } = useData();

  const todayName = WeeklyPlanService.getTodayName();
  const plannedCount = WeeklyPlanService.countPlannedDays(weeklyPlan);

  const handleClearPlan = () => {
    Alert.alert(
      'Planı Temizle',
      'Tüm haftalık plan silinsin mi?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: () => {
            WEEK_DAYS.forEach(day => updateWeeklyPlan(day, null));
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={18} color="#1A1A2E" />
          </TouchableOpacity>
          <View style={styles.headerTitleRow}>
            <Calendar size={18} color="#1A1A2E" />
            <Text style={styles.headerTitle}>Haftalık Plan</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{plannedCount}/7</Text>
          </View>
        </View>

        {/* PROGRESS */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${(plannedCount / 7) * 100}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {plannedCount === 0 ? 'Henüz plan yok' : `${plannedCount} gün planlandı`}
        </Text>

        {/* DAYS */}
        <View style={styles.daysList}>
          {WEEK_DAYS.map((day, idx) => {
            const isPlanned = !!weeklyPlan[day];
            const isToday = day === todayName;
            const color = DAY_COLORS[idx];

            return (
              <TouchableOpacity
                key={day}
                activeOpacity={0.8}
                onPress={() => {
                  if (!isPlanned) navigation.navigate('Discover');
                }}
                style={[
                  styles.dayCard,
                  isToday && styles.dayCardToday
                ]}
              >
                <View style={styles.dayLeft}>
                  <View style={[styles.colorBar, { backgroundColor: color }]} />
                  <View style={styles.dayInfo}>
                    <Text style={styles.dayName}>
                      {day} {isToday && '(Bugün)'}
                    </Text>
                    {isPlanned ? (
                      <Text style={styles.recipeTitle}>{weeklyPlan[day]?.recipeTitle}</Text>
                    ) : (
                      <Text style={styles.emptyText}>Ne pişiriyoruz?</Text>
                    )}
                  </View>
                </View>

                {isPlanned ? (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      onPress={(e) => {
                        navigation.navigate('RecipeDetail', { id: weeklyPlan[day]?.recipeId });
                      }}
                      style={styles.actionBtn}
                    >
                      <ChevronRight size={16} color="#1A1A2E" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={(e) => {
                        updateWeeklyPlan(day, null);
                      }}
                      style={styles.actionBtnRed}
                    >
                      <X size={16} color="#FF1744" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.addBtnDashed}>
                    <Plus size={16} color="#1A1A2E" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RESET */}
        {plannedCount > 0 && (
          <TouchableOpacity onPress={handleClearPlan} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Planı Temizle</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  container: { flex: 1 },
  content: { paddingBottom: 100 },
  
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 4, borderBottomColor: '#1A1A2E' },
  backBtn: { width: 40, height: 40, borderWidth: 2, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 16, gap: 8 },
  headerTitle: { fontFamily: 'Righteous', fontSize: 20, color: '#1A1A2E' },
  countBadge: { marginLeft: 'auto', backgroundColor: '#FF6B00', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 2, borderColor: '#1A1A2E' },
  countText: { fontFamily: 'Nunito-Black', fontSize: 12, fontWeight: '900', color: '#FFFFFF' },

  progressContainer: { height: 12, borderWidth: 2, borderColor: '#1A1A2E', backgroundColor: '#FFFFFF', marginHorizontal: 20, marginTop: 16, borderRadius: 6, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#FF6B00' },
  progressLabel: { textAlign: 'center', fontFamily: 'Nunito-Bold', fontSize: 12, fontWeight: 'bold', color: '#1A1A2E', marginTop: 8 },

  daysList: { padding: 20, gap: 12 },
  dayCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#1A1A2E', padding: 12, borderRadius: 12 },
  dayCardToday: { borderColor: '#FF6B00', borderWidth: 3 },
  dayLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  colorBar: { width: 8, height: 40, borderWidth: 1, borderColor: '#1A1A2E', borderRadius: 4, marginRight: 12 },
  dayInfo: { flex: 1 },
  dayName: { fontFamily: 'Nunito-Black', fontSize: 10, fontWeight: '900', opacity: 0.5, color: '#1A1A2E', marginBottom: 2 },
  recipeTitle: { fontFamily: 'Nunito-Bold', fontSize: 14, fontWeight: 'bold', color: '#1A1A2E' },
  emptyText: { fontFamily: 'Nunito-Bold', fontSize: 12, fontWeight: 'bold', color: '#1A1A2E', opacity: 0.4, fontStyle: 'italic' },

  actionsRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 32, height: 32, borderWidth: 2, borderColor: '#1A1A2E', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  actionBtnRed: { width: 32, height: 32, borderWidth: 2, borderColor: '#FF1744', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  addBtnDashed: { width: 32, height: 32, borderWidth: 2, borderColor: '#1A1A2E', borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' },

  clearBtn: { marginHorizontal: 20, paddingVertical: 12, borderWidth: 2, borderColor: '#FF1744', borderRadius: 12, alignItems: 'center' },
  clearBtnText: { fontFamily: 'Nunito-Black', fontSize: 14, fontWeight: '900', color: '#FF1744' },
});