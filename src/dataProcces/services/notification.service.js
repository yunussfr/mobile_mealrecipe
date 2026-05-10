/**
 * notification.service.js
 * ─────────────────────────────────────────────────────────
 * Uygulama içi bildirimleri yönetir.
 * API karşılığı olmadığı için 500ms gecikmeli asenkron mock olarak çalışır.
 */

export const NotificationService = {
  /**
   * Kullanıcının tüm bildirimlerini getirir.
   */
  async getNotifications() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', title: 'Hoşgeldiniz!', message: 'LEZZETTAT uygulamasına hoşgeldiniz.', isRead: false }
        ]);
      }, 500);
    });
  },

  /**
   * Belirli bir bildirimi okundu olarak işaretler.
   */
  async markAsRead(notificationId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, notificationId });
      }, 500);
    });
  },

  /**
   * Tüm bildirimleri siler.
   */
  async clearAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
};