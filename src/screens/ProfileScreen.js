import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Settings, Book, Utensils, LogOut, MessageSquare,
  Plus, Users, UserPlus, Camera, Mail, User, X, Bell,
} from 'lucide-react-native';

import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { NotificationService } from '../services/notification.service';
import { NotificationsPopup } from '../components/notifications-popup'; // React Native popup as well!

// ─── Stat Kartı ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <View style={styles.statCard}>
      <View style={{ marginBottom: 4 }}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Ana Ekran ────────────────────────────────────────────────────────────────
export function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout, updateProfile } = useAuth();
  const {
    recipes,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useData();

  const [editMode, setEditMode] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = NotificationService.getUnreadCount(notifications);
  const myRecipes = recipes.filter((r) => r.author === 'Ben');

  const handleLogout = () => {
    logout();
    navigation.navigate('Auth', { screen: 'Login' }); // Resetting auth is typically automatic if Context provides isAuthenticated, but navigation.navigate works if stack matches
  };

  const handleEdit = (field) => {
    setEditMode(field);
    if (field === 'name') setEditValue(user?.name || '');
    if (field === 'email') setEditValue(user?.email || '');
    if (field === 'avatar') setEditValue(user?.avatar || '');
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      alert('Lütfen geçerli bir değer girin');
      return;
    }

    if (editMode === 'name') updateProfile({ name: editValue });
    if (editMode === 'email') updateProfile({ email: editValue });
    if (editMode === 'avatar') updateProfile({ avatar: editValue });

    setEditMode(null);
    setEditValue('');
  };

  const renderEditField = (field, label, icon) => {
    if (editMode === field) {
      return (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editValue}
            onChangeText={setEditValue}
            autoFocus
          />
          <View style={styles.editActions}>
            <TouchableOpacity onPress={() => setEditMode(null)} style={styles.cancelBtn}>
              <X size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSaveEdit} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.fieldRow}>
        <View style={styles.fieldLeft}>
          <View style={styles.fieldIconBox}>{icon}</View>
          <View>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Text style={styles.fieldValue}>{user?.[field] || '-'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleEdit(field)}>
          <Text style={styles.editLinkText}>Düzenle</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <X size={20} color="#1A1A2E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil</Text>
          <TouchableOpacity onPress={() => setShowNotifications(true)} style={styles.bellButton}>
            <Bell size={20} color="#1A1A2E" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image 
                source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150' }} 
                style={styles.avatarImage} 
              />
              <TouchableOpacity style={styles.avatarEditBtn} onPress={() => handleEdit('avatar')}>
                <Camera size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user?.name || 'Kullanıcı'}</Text>
            <Text style={styles.userRole}>Master Şef</Text>
          </View>

          <View style={styles.statsRow}>
            <StatCard label="Tarifler" value={myRecipes.length} icon={<Utensils size={24} color="#FF6B00" />} />
            <StatCard label="Takipçi" value="1.2K" icon={<Users size={24} color="#00C853" />} />
            <StatCard label="Puan" value="4.9" icon={<Book size={24} color="#0091FF" />} />
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hesap Bilgileri</Text>
          <View style={styles.sectionCard}>
            {renderEditField('name', 'Ad Soyad', <User size={16} color="#1A1A2E" />)}
            <View style={styles.divider} />
            {renderEditField('email', 'E-posta', <Mail size={16} color="#1A1A2E" />)}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ayarlar</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity style={styles.actionRow} onPress={() => navigation.navigate('Settings')}>
              <View style={styles.actionLeft}>
                <Settings size={20} color="#1A1A2E" />
                <Text style={styles.actionText}>Uygulama Ayarları</Text>
              </View>
              <Text style={styles.actionChevron}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.actionRow} onPress={handleLogout}>
              <View style={styles.actionLeft}>
                <LogOut size={20} color="#FF1744" />
                <Text style={[styles.actionText, { color: '#FF1744' }]}>Çıkış Yap</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8F0' },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Righteous', fontSize: 24, color: '#1A1A2E', textTransform: 'uppercase' },
  bellButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#FF1744', width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFFFFF', fontSize: 8, fontFamily: 'Nunito-Black', fontWeight: '900' },

  profileCard: { backgroundColor: '#FFD600', borderWidth: 4, borderColor: '#1A1A2E', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 32, shadowColor: '#1A1A2E', shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, elevation: 4 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatarImage: { width: 96, height: 96, borderRadius: 48, borderWidth: 4, borderColor: '#1A1A2E' },
  avatarEditBtn: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, backgroundColor: '#E83F6F', borderRadius: 16, borderWidth: 3, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center' },
  userName: { fontFamily: 'Righteous', fontSize: 24, color: '#1A1A2E', marginBottom: 4 },
  userRole: { fontFamily: 'Nunito-Black', fontSize: 12, fontWeight: '900', color: '#1A1A2E', opacity: 0.7, textTransform: 'uppercase' },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 12 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#1A1A2E', borderRadius: 16, paddingVertical: 12, alignItems: 'center', shadowColor: '#1A1A2E', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, elevation: 2 },
  statValue: { fontFamily: 'Righteous', fontSize: 18, color: '#1A1A2E' },
  statLabel: { fontFamily: 'Nunito-Black', fontSize: 8, fontWeight: '900', color: 'rgba(26,26,46,0.5)', textTransform: 'uppercase', marginTop: 2 },

  section: { marginBottom: 32 },
  sectionTitle: { fontFamily: 'Righteous', fontSize: 18, color: '#1A1A2E', marginBottom: 12, textTransform: 'uppercase' },
  sectionCard: { backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#1A1A2E', borderRadius: 20, shadowColor: '#1A1A2E', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, elevation: 3 },
  
  fieldRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  fieldLeft: { flexDirection: 'row', alignItems: 'center' },
  fieldIconBox: { width: 36, height: 36, backgroundColor: '#FFF8F0', borderRadius: 18, borderWidth: 2, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  fieldLabel: { fontFamily: 'Nunito-Black', fontSize: 10, fontWeight: '900', color: 'rgba(26,26,46,0.5)', textTransform: 'uppercase' },
  fieldValue: { fontFamily: 'Nunito-Bold', fontSize: 14, fontWeight: 'bold', color: '#1A1A2E', marginTop: 2 },
  editLinkText: { fontFamily: 'Nunito-Black', fontSize: 12, fontWeight: '900', color: '#FF6B00', textTransform: 'uppercase', textDecorationLine: 'underline' },
  
  editContainer: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  editInput: { flex: 1, backgroundColor: '#FFF8F0', borderWidth: 2, borderColor: '#1A1A2E', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontFamily: 'Nunito-Bold', fontSize: 14, marginRight: 12 },
  editActions: { flexDirection: 'row', alignItems: 'center' },
  cancelBtn: { width: 36, height: 36, backgroundColor: '#FF1744', borderRadius: 18, borderWidth: 2, borderColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  saveBtn: { backgroundColor: '#00C853', borderRadius: 18, borderWidth: 2, borderColor: '#1A1A2E', paddingHorizontal: 16, paddingVertical: 8 },
  saveBtnText: { color: '#FFFFFF', fontFamily: 'Nunito-Black', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  
  divider: { height: 2, backgroundColor: 'rgba(26,26,46,0.1)', marginHorizontal: 16 },
  
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  actionLeft: { flexDirection: 'row', alignItems: 'center' },
  actionText: { fontFamily: 'Nunito-Bold', fontSize: 14, fontWeight: 'bold', color: '#1A1A2E', marginLeft: 12 },
  actionChevron: { fontFamily: 'Righteous', fontSize: 20, color: 'rgba(26,26,46,0.3)' },
});