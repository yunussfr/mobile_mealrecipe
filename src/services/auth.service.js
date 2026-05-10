/**
 * auth.service.js
 * ─────────────────────────────────────────────────────────
 * Kullanıcı kimlik doğrulama ve profil yönetimi servisi.
 *
 * • Mock login / register (gerçek backend olmadan localStorage tabanlı)
 * • Oturum okuma / yazma / silme
 * • Profil güncelleme
 */

import {
  storageGet,
  storageSet,
  storageRemove,
  STORAGE_KEYS,
} from './storage.service';

// ─── Yardımcı Fonksiyonlar ───────────────────────────────────────────────────

/** Küçük rastgele ID üretici */
function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

/** API gecikmesi simülasyonu */
function delay(ms = 800) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Auth Service ────────────────────────────────────────────────────────────

export const AuthService = {
  /**
   * Kayıtlı kullanıcı oturumunu getirir.
   * @returns {Object|null}
   */
  getSession() {
    return storageGet(STORAGE_KEYS.USER, null);
  },

  /**
   * Kullanıcı oturumunu kaydeder.
   * @param {Object} user
   */
  saveSession(user) {
    storageSet(STORAGE_KEYS.USER, user);
  },

  /**
   * Oturum bilgisini siler.
   */
  clearSession() {
    storageRemove(STORAGE_KEYS.USER);
  },

  /**
   * Mock giriş işlemi
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>}
   */
  async login(email, password) {
    await delay();

    const user = {
      id: '1',
      email,
      name: email.split('@')[0],
      followers: 127,
      following: 89,
    };

    AuthService.saveSession(user);

    return user;
  },

  /**
   * Mock kayıt işlemi
   * @param {string} email
   * @param {string} password
   * @param {string} name
   * @returns {Promise<Object>}
   */
  async register(email, password, name) {
    await delay();

    const user = {
      id: generateId(),
      email,
      name,
      followers: 0,
      following: 0,
    };

    AuthService.saveSession(user);

    return user;
  },

  /**
   * Çıkış işlemi
   */
  logout() {
    AuthService.clearSession();
  },

  /**
   * Kullanıcı profilini günceller
   * @param {Object} updates
   * @returns {Object|null}
   */
  updateProfile(updates) {
    const current = AuthService.getSession();

    if (!current) return null;

    const updated = {
      ...current,
      ...updates,
    };

    AuthService.saveSession(updated);

    return updated;
  },
};