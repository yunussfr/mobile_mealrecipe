/**
 * settings.service.js
 * ─────────────────────────────────────────────────────────
 * Uygulama ayarları yönetimi
 *
 * • Tema
 * • Dil
 * • Ana renk
 * • i18n çeviri sistemi
 */

import {
  storageGet,
  storageSet,
  STORAGE_KEYS,
} from './storage.service';

// ─── Varsayılan Ayarlar ─────────────────────────────────────────────────────

export const DEFAULT_SETTINGS = {
  language: 'tr',
  theme: 'light',
  primaryColor: '#FF6B00',
};

// ─── Çeviriler ──────────────────────────────────────────────────────────────

export const TRANSLATIONS = {
  tr: {
    'app.name': 'LEZZETTAT',
    'nav.explore': 'Keşfet',
    'nav.recipes': 'Tariflerim',
    'nav.notebook': 'Defterim',
    'nav.account': 'Hesabım',
    'settings.title': 'Ayarlar',
    'settings.language': 'Dil',
    'settings.theme': 'Renk Tonu',
    'settings.color': 'Ana Renk',
    'settings.password': 'Şifre Değiştir',
    'settings.logout': 'Çıkış Yap',
    'password.current': 'Mevcut Şifre',
    'password.new': 'Yeni Şifre',
    'password.confirm': 'Yeni Şifre (Tekrar)',
    'password.update': 'Şifreyi Güncelle',
    'theme.light': 'Açık',
    'theme.dark': 'Koyu',
    'theme.auto': 'Otomatik',
    'color.orange': 'Turuncu',
    'color.green': 'Yeşil',
    'color.red': 'Kırmızı',
    'color.purple': 'Mor',
    'color.blue': 'Mavi',
    'color.yellow': 'Sarı',
    'logout.confirm':
      'Çıkış yapmak istediğinize emin misiniz?',
    'logout.success': 'Çıkış yapıldı',
  },

  en: {
    'app.name': 'LEZZETTAT',
    'nav.explore': 'Explore',
    'nav.recipes': 'My Recipes',
    'nav.notebook': 'Notebook',
    'nav.account': 'Account',
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.color': 'Primary Color',
    'settings.password': 'Change Password',
    'settings.logout': 'Log Out',
    'password.current': 'Current Password',
    'password.new': 'New Password',
    'password.confirm':
      'Confirm New Password',
    'password.update':
      'Update Password',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.auto': 'Auto',
    'color.orange': 'Orange',
    'color.green': 'Green',
    'color.red': 'Red',
    'color.purple': 'Purple',
    'color.blue': 'Blue',
    'color.yellow': 'Yellow',
    'logout.confirm':
      'Are you sure you want to log out?',
    'logout.success':
      'Logged out successfully',
  },

  de: {
    'app.name': 'LEZZETTAT',
    'nav.explore': 'Entdecken',
    'nav.recipes': 'Meine Rezepte',
    'nav.notebook': 'Notizbuch',
    'nav.account': 'Konto',
    'settings.title': 'Einstellungen',
    'settings.language': 'Sprache',
    'settings.theme': 'Farbton',
    'settings.color': 'Hauptfarbe',
    'settings.password':
      'Passwort ändern',
    'settings.logout': 'Abmelden',
    'password.current':
      'Aktuelles Passwort',
    'password.new':
      'Neues Passwort',
    'password.confirm':
      'Neues Passwort bestätigen',
    'password.update':
      'Passwort aktualisieren',
    'theme.light': 'Hell',
    'theme.dark': 'Dunkel',
    'theme.auto': 'Auto',
    'color.orange': 'Orange',
    'color.green': 'Grün',
    'color.red': 'Rot',
    'color.purple': 'Lila',
    'color.blue': 'Blau',
    'color.yellow': 'Gelb',
    'logout.confirm':
      'Möchten Sie sich wirklich abmelden?',
    'logout.success':
      'Erfolgreich abgemeldet',
  },

  fr: {
    'app.name': 'LEZZETTAT',
    'nav.explore': 'Explorer',
    'nav.recipes': 'Mes Recettes',
    'nav.notebook': 'Carnet',
    'nav.account': 'Compte',
    'settings.title': 'Paramètres',
    'settings.language': 'Langue',
    'settings.theme': 'Thème',
    'settings.color':
      'Couleur Principale',
    'settings.password':
      'Changer le mot de passe',
    'settings.logout':
      'Se déconnecter',
    'password.current':
      'Mot de passe actuel',
    'password.new':
      'Nouveau mot de passe',
    'password.confirm':
      'Confirmer le mot de passe',
    'password.update':
      'Mettre à jour',
    'theme.light': 'Clair',
    'theme.dark': 'Sombre',
    'theme.auto': 'Auto',
    'color.orange': 'Orange',
    'color.green': 'Vert',
    'color.red': 'Rouge',
    'color.purple': 'Violet',
    'color.blue': 'Bleu',
    'color.yellow': 'Jaune',
    'logout.confirm':
      'Êtes-vous sûr de vouloir vous déconnecter?',
    'logout.success':
      'Déconnexion réussie',
  },
};

// ─── Settings Service ───────────────────────────────────────────────────────

export const SettingsService = {
  /**
   * Ayarları getirir
   * @returns {Object}
   */
  get() {
    return storageGet(
      STORAGE_KEYS.SETTINGS,
      { ...DEFAULT_SETTINGS }
    );
  },

  /**
   * Ayarları kaydeder
   * @param {Object} settings
   */
  save(settings) {
    storageSet(
      STORAGE_KEYS.SETTINGS,
      settings
    );
  },

  /**
   * Ayar günceller
   * @param {Object} partial
   * @returns {Object}
   */
  update(partial) {
    const current =
      SettingsService.get();

    const updated = {
      ...current,
      ...partial,
    };

    SettingsService.save(updated);

    return updated;
  },

  /**
   * Tema uygular
   * @param {string} theme
   */
  applyTheme(theme) {
    const resolved =
      theme === 'auto'
        ? window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches
          ? 'dark'
          : 'light'
        : theme;

    document.documentElement.setAttribute(
      'data-theme',
      resolved
    );

    document.body.classList.toggle(
      'dark',
      resolved === 'dark'
    );
  },

  /**
   * Ana renk uygular
   * @param {string} color
   */
  applyPrimaryColor(color) {
    document.documentElement.style.setProperty(
      '--brand-primary',
      color
    );
  },

  /**
   * Tüm ayarları uygular
   * @param {Object} settings
   * @returns {Function|undefined}
   */
  applyAll(settings) {
    SettingsService.applyPrimaryColor(
      settings.primaryColor
    );

    SettingsService.applyTheme(
      settings.theme
    );

    if (settings.theme === 'auto') {
      const mq =
        window.matchMedia(
          '(prefers-color-scheme: dark)'
        );

      const handler = () =>
        SettingsService.applyTheme(
          'auto'
        );

      mq.addEventListener(
        'change',
        handler
      );

      return () =>
        mq.removeEventListener(
          'change',
          handler
        );
    }
  },

  // ─── i18n ───────────────────────────────────────────────────────────────

  /**
   * Çeviri getirir
   * @param {string} language
   * @param {string} key
   * @returns {string}
   */
  translate(language, key) {
    return (
      TRANSLATIONS[language]?.[
        key
      ] || key
    );
  },

  /**
   * Translator fonksiyonu oluşturur
   * @param {string} language
   * @returns {Function}
   */
  makeTranslator(language) {
    return (key) =>
      SettingsService.translate(
        language,
        key
      );
  },

  /**
   * Desteklenen diller
   * @returns {Array}
   */
  getSupportedLanguages() {
    return [
      {
        code: 'tr',
        label: 'Türkçe',
      },

      {
        code: 'en',
        label: 'English',
      },

      {
        code: 'de',
        label: 'Deutsch',
      },

      {
        code: 'fr',
        label: 'Français',
      },
    ];
  },

  /**
   * Ana renk seçenekleri
   * @returns {Array}
   */
  getPrimaryColorOptions() {
    return [
      {
        value: '#FF6B00',
        labelKey:
          'color.orange',
      },

      {
        value: '#00C853',
        labelKey:
          'color.green',
      },

      {
        value: '#FF1744',
        labelKey:
          'color.red',
      },

      {
        value: '#8B5CF6',
        labelKey:
          'color.purple',
      },

      {
        value: '#0091FF',
        labelKey:
          'color.blue',
      },

      {
        value: '#FFD600',
        labelKey:
          'color.yellow',
      },
    ];
  },
};