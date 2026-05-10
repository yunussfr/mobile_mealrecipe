/**
 * auth.service.js
 * ─────────────────────────────────────────────────────────
 * Kullanıcı kimlik doğrulama ve profil yönetimi servisi.
 * Tamamen saf (pure) asenkron fonksiyonlardan oluşur.
 * Veri saklama (AsyncStorage) veya state işlemleri İÇERMEZ.
 */

import { userClient } from '../client/apiClient';

export const AuthService = {
  /**
   * DummyJSON üzerinden kullanıcı girişi yapar.
   * @param {string} username - Kullanıcı adı
   * @param {string} password - Şifre
   * @returns {Promise<Object>} Kullanıcı bilgileri ve JWT token
   */
  async login(username, password) {
    const response = await userClient.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  },

  /**
   * DummyJSON üzerinden yeni kullanıcı kaydı simüle eder.
   * (DummyJSON veritabanına kalıcı kayıt yapmaz, ancak 200 döner)
   * @param {Object} userData - Ad, soyad, email vb. kullanıcı bilgileri
   * @returns {Promise<Object>} Oluşturulan kullanıcının bilgileri
   */
  async register(userData) {
    const response = await userClient.post('/users/add', userData);
    return response.data;
  },

  /**
   * Mevcut kullanıcının profil bilgilerini günceller.
   * @param {number|string} userId - Güncellenecek kullanıcının ID'si
   * @param {Object} updates - Değiştirilecek bilgiler (örn: { firstName: 'Ali' })
   * @returns {Promise<Object>} Güncellenmiş kullanıcı nesnesi
   */
  async updateProfile(userId, updates) {
    const response = await userClient.put(`/users/${userId}`, updates);
    return response.data;
  },

  /**
   * Çıkış işlemi. 
   * DummyJSON için backend'de oturum sonlandırma (logout) endpoint'i yoktur.
   * Asıl çıkış işlemi Context katmanında (Token silinerek) yapılmalıdır.
   */
  async logout() {
    return true;
  }
};