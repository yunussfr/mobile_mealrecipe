/**
 * settings.service.js
 * ─────────────────────────────────────────────────────────
 * Kullanıcı tercihlerini (dil, tema) sunucuya/mock altyapısına kaydeder.
 * HTML/DOM manipülasyon kodları tamamen kaldırılmış, sadece API mock'u kalmıştır.
 * Tema değişimi Context katmanında (React Native) yapılacaktır.
 */

export const SettingsService = {
  /**
   * Sunucudaki/uzaktaki kullanıcı ayarlarını getirir.
   */
  async fetchSettings() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ theme: 'light', language: 'tr', primaryColor: '#FF6B00' });
      }, 500);
    });
  },

  /**
   * Yeni ayarları sunucuya/uzak sisteme kaydeder.
   */
  async updateSettings(newSettings) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, settings: newSettings });
      }, 500);
    });
  }
};