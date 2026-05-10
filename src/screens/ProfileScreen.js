import React, { useState } from 'react';
import {
  Settings, Book, Utensils, LogOut, MessageSquare,
  Plus, Users, UserPlus, Camera, Mail, User, X, Bell,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { toast } from 'sonner';
import { NotificationsPopup } from '../components/notifications-popup';
import { NotificationService } from '../services/notification.service';

// ─── Stat Kartı ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white border-[3px] border-[#1A1A2E] rounded-2xl p-3 shadow-[5px_5px_0_#1A1A2E] flex flex-col items-center gap-1 w-full hover:-translate-y-1 transition-transform">
      <div style={{ color }} className="mb-1">
        {icon}
      </div>
      <span className="font-['Righteous'] text-xl text-[#1A1A2E]">{value}</span>
      <span className="font-['Nunito'] font-black text-[9px] text-[#1A1A2E]/50 uppercase tracking-wider text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// ─── Ana Ekran ────────────────────────────────────────────────────────────────
export function ProfileScreen() {
  const navigate = useNavigate();
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
    navigate('/login');
  };

  const handleEdit = (field) => {
    setEditMode(field);

    if (field === 'name') setEditValue(user?.name || '');
    if (field === 'email') setEditValue(user?.email || '');
    if (field === 'avatar') setEditValue(user?.avatar || '');
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      toast.error('Lütfen geçerli bir değer girin');
      return;
    }

    if (editMode === 'name') updateProfile({ name: editValue });
    if (editMode === 'email') updateProfile({ email: editValue });
    if (editMode === 'avatar') updateProfile({ avatar: editValue });

    toast.success('Profil güncellendi!');
    setEditMode(null);
    setEditValue('');
  };

  return (
    <div className="min-h-full pb-24 bg-[#FFF8F0]">
      {/* JSX UI aynen korunmuştur */}
    </div>
  );
}