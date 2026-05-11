import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Lock, LogOut, ChevronRight, Globe, Palette, Sun } from 'lucide-react-native';
import { useSettings } from '../contexts/SettingsContext';
import { SettingsService } from '../services/settings.service';

// ─── Statik Veriler ─────────────────────────────────────────────
const LANGUAGES = SettingsService.getSupportedLanguages().map(l => ({
  code: l.code,
  name: l.label,
  flag: { tr: '🇹🇷', en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷' }[l.code] || '🌐',
}));

const COLOR_OPTIONS = SettingsService.getPrimaryColorOptions();

const THEMES = [
  { nameKey: 'theme.light', value: 'light' },
  { nameKey: 'theme.dark', value: 'dark' },
  { nameKey: 'theme.auto', value: 'auto' },
];

export function SettingsScreen() {
  const navigation = useNavigation();
  const {
    settings,
    updateLanguage,
    updateTheme,
    updatePrimaryColor,
    t,
  } = useSettings();

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    Alert.alert('Başarılı', 'Şifre değiştirildi');
    setShowPasswordChange(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapılsın mı?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Bilgi', 'Çıkış yapıldı');
            // Normally: logout(), navigation.navigate('Auth', { screen: 'Login' });
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
            <ChevronRight size={20} color="#1A1A2E" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('settings.title') || 'Ayarlar'}</Text>
        </View>

        <View style={styles.sectionContainer}>
          
          {/* LANGUAGE */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Globe size={18} color="#1A1A2E" />
              <Text style={styles.cardTitle}>{t('settings.language') || 'Dil'}</Text>
            </View>
            <View style={styles.grid2}>
              {LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.gridBtn, settings.language === lang.code && styles.gridBtnActiveBlue]}
                  onPress={() => updateLanguage(lang.code)}
                >
                  <Text style={[styles.gridBtnText, settings.language === lang.code && styles.gridBtnTextActive]}>
                    {lang.flag} {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* THEME */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Sun size={18} color="#1A1A2E" />
              <Text style={styles.cardTitle}>{t('settings.theme') || 'Tema'}</Text>
            </View>
            <View style={styles.grid3}>
              {THEMES.map(theme => (
                <TouchableOpacity
                  key={theme.value}
                  style={[styles.gridBtn3, settings.theme === theme.value && styles.gridBtnActiveYellow]}
                  onPress={() => updateTheme(theme.value)}
                >
                  <Text style={[styles.gridBtnText, settings.theme === theme.value && { color: '#1A1A2E' }]}>
                    {t(theme.nameKey) || theme.nameKey}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* COLOR */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Palette size={18} color="#1A1A2E" />
              <Text style={styles.cardTitle}>{t('settings.color') || 'Renk Seçimi'}</Text>
            </View>
            <View style={styles.grid3}>
              {COLOR_OPTIONS.map(color => (
                <TouchableOpacity
                  key={color.value}
                  style={[styles.gridBtn3Color, { backgroundColor: color.value }]}
                  onPress={() => updatePrimaryColor(color.value)}
                >
                  <Text style={styles.gridBtnColorText}>
                    {t(color.labelKey) || color.labelKey}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* PASSWORD */}
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.cardHeaderTouchable}
              onPress={() => setShowPasswordChange(!showPasswordChange)}
            >
              <View style={styles.cardHeaderLeft}>
                <Lock size={18} color="#1A1A2E" />
                <Text style={styles.cardTitle}>{t('settings.password') || 'Şifre Değiştir'}</Text>
              </View>
              <ChevronRight size={18} color="#1A1A2E" style={{ transform: [{ rotate: showPasswordChange ? '90deg' : '0deg' }] }} />
            </TouchableOpacity>

            {showPasswordChange && (
              <View style={styles.passwordForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Mevcut şifre"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Yeni şifre"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Yeni şifre tekrar"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity style={styles.updateBtn} onPress={handlePasswordChange}>
                  <Text style={styles.updateBtnText}>Güncelle</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* LOGOUT */}
          <TouchableOpacity style={styles.cardLogout} onPress={handleLogout}>
            <View style={styles.cardHeaderLeft}>
              <LogOut size={18} color="#FF1744" />
              <Text style={[styles.cardTitle, { color: '#FF1744' }]}>{t('settings.logout') || 'Çıkış Yap'}</Text>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  container: { flex: 1 },
  content: { paddingBottom: 100 },
  
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 12 },
  backBtn: { width: 40, height: 40, backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#1A1A2E', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Righteous', fontSize: 24, color: '#1A1A2E' },

  sectionContainer: { paddingHorizontal: 20, gap: 16 },
  
  card: { backgroundColor: '#FFFFFF', padding: 16, borderWidth: 3, borderColor: '#1A1A2E', borderRadius: 12 },
  cardLogout: { backgroundColor: '#FFFFFF', padding: 16, borderWidth: 3, borderColor: '#1A1A2E', borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardHeaderTouchable: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontFamily: 'Nunito-Bold', fontSize: 16, fontWeight: 'bold', color: '#1A1A2E' },

  grid2: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridBtn: { width: '48%', padding: 8, borderWidth: 2, borderColor: '#1A1A2E', backgroundColor: '#FFFFFF', borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  gridBtnActiveBlue: { backgroundColor: '#0091FF' },
  
  grid3: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridBtn3: { width: '31%', padding: 8, borderWidth: 2, borderColor: '#1A1A2E', backgroundColor: '#FFFFFF', borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  gridBtnActiveYellow: { backgroundColor: '#FFD600' },
  
  gridBtnText: { fontFamily: 'Nunito-Bold', fontSize: 12, fontWeight: 'bold', color: '#1A1A2E' },
  gridBtnTextActive: { color: '#FFFFFF' },

  gridBtn3Color: { width: '31%', padding: 8, borderWidth: 2, borderColor: '#1A1A2E', borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  gridBtnColorText: { fontFamily: 'Nunito-Bold', fontSize: 10, fontWeight: 'bold', color: '#FFFFFF' },

  passwordForm: { marginTop: 12, gap: 8 },
  input: { width: '100%', padding: 12, borderWidth: 2, borderColor: '#1A1A2E', borderRadius: 8, backgroundColor: '#FFF8F0', fontFamily: 'Nunito-Bold', color: '#1A1A2E' },
  updateBtn: { width: '100%', padding: 12, backgroundColor: '#FF1744', borderRadius: 8, alignItems: 'center', borderWidth: 2, borderColor: '#1A1A2E' },
  updateBtnText: { fontFamily: 'Nunito-Black', fontSize: 14, fontWeight: '900', color: '#FFFFFF' },
});