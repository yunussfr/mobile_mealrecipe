import React, { useState } from 'react';
import { Lock, LogOut, ChevronRight, Globe, Palette, Sun } from 'lucide-react';
import { useNavigate } from 'react-router';
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

// ─── Screen ─────────────────────────────────────────────
export function SettingsScreen() {
  const navigate = useNavigate();
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
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Şifreler eşleşmiyor');
      return;
    }

    alert('Şifre değiştirildi');
    setShowPasswordChange(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-full pb-24 bg-[#FFF8F0]">

      {/* HEADER */}
      <div className="p-5 flex items-center gap-3">
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 border-[3px] border-[#1A1A2E] bg-white flex items-center justify-center"
        >
          <ChevronRight className="rotate-180" size={20} />
        </button>

        <h1 className="text-2xl font-bold">
          {t('settings.title')}
        </h1>
      </div>

      <div className="px-5 space-y-4">

        {/* LANGUAGE */}
        <div className="bg-white p-4 border-[3px] border-black">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={18} />
            <span className="font-bold">{t('settings.language')}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => updateLanguage(lang.code)}
                className={`p-2 border-2 ${
                  settings.language === lang.code
                    ? 'bg-blue-500 text-white'
                    : 'bg-white'
                }`}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* THEME */}
        <div className="bg-white p-4 border-[3px] border-black">
          <div className="flex items-center gap-2 mb-3">
            <Sun size={18} />
            <span className="font-bold">{t('settings.theme')}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {THEMES.map(theme => (
              <button
                key={theme.value}
                onClick={() => updateTheme(theme.value)}
                className={`p-2 border-2 ${
                  settings.theme === theme.value
                    ? 'bg-yellow-400'
                    : 'bg-white'
                }`}
              >
                {t(theme.nameKey)}
              </button>
            ))}
          </div>
        </div>

        {/* COLOR */}
        <div className="bg-white p-4 border-[3px] border-black">
          <div className="flex items-center gap-2 mb-3">
            <Palette size={18} />
            <span className="font-bold">{t('settings.color')}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {COLOR_OPTIONS.map(color => (
              <button
                key={color.value}
                onClick={() => updatePrimaryColor(color.value)}
                style={{ backgroundColor: color.value }}
                className="p-2 border-2 text-white font-bold"
              >
                {t(color.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* PASSWORD */}
        <div className="bg-white p-4 border-[3px] border-black">

          <button
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="flex justify-between w-full"
          >
            <div className="flex items-center gap-2">
              <Lock size={18} />
              <span className="font-bold">{t('settings.password')}</span>
            </div>

            <ChevronRight
              className={showPasswordChange ? 'rotate-90' : ''}
              size={18}
            />
          </button>

          {showPasswordChange && (
            <div className="mt-3 space-y-2">
              <input
                type="password"
                placeholder="Mevcut şifre"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 border-2"
              />
              <input
                type="password"
                placeholder="Yeni şifre"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border-2"
              />
              <input
                type="password"
                placeholder="Yeni şifre tekrar"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border-2"
              />

              <button
                onClick={handlePasswordChange}
                className="w-full bg-red-500 text-white p-2 font-bold"
              >
                Güncelle
              </button>
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => {
            if (confirm('Çıkış yapılsın mı?')) {
              alert('Çıkış yapıldı');
            }
          }}
          className="w-full bg-white p-4 border-[3px] border-black flex justify-between"
        >
          <div className="flex items-center gap-2">
            <LogOut size={18} />
            <span className="font-bold">{t('settings.logout')}</span>
          </div>
        </button>
      </div>
    </div>
  );
}