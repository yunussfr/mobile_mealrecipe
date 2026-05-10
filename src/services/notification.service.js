/**
 * notification.service.js
 * ─────────────────────────────────────────────────────────
 * Bildirim yönetimi servisi
 *
 * • Başlangıç bildirimleri
 * • Okundu işaretleme
 * • Bildirim ekleme / silme
 * • Filtreleme
 * • Hazır bildirim şablonları
 */

// ─── Başlangıç Bildirimleri ──────────────────────────────────────────────────

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'comment',
    title: 'Yeni Yorum',
    message:
      '@gurme_selin tarifine yorum yaptı: "Harika bir tarif! 👨‍🍳"',
    date: '2 saat önce',
    read: false,
    icon: '💬',
  },
  {
    id: 'n2',
    type: 'like',
    title: 'Ben de Yaptım',
    message:
      '12 kişi Baharatlı Tavuk Kanat tarifini yaptı!',
    date: '5 saat önce',
    read: false,
    icon: '👨‍🍳',
  },
  {
    id: 'n3',
    type: 'follow',
    title: 'Yeni Takipçi',
    message:
      '@chef_ali seni takip etmeye başladı!',
    date: 'Dün',
    read: true,
    icon: '👤',
  },
  {
    id: 'n4',
    type: 'plan',
    title: 'Haftalık Plan Hatırlatma',
    message:
      'Yarın için "Mantar Soslu Fettuccine" planladın!',
    date: '2 gün önce',
    read: true,
    icon: '📅',
  },
];

// ─── Notification Service ────────────────────────────────────────────────────

export const NotificationService = {
  /**
   * Başlangıç bildirimlerini getirir
   * @returns {Array}
   */
  getInitial() {
    return [...INITIAL_NOTIFICATIONS];
  },

  /**
   * Okunmamış bildirim sayısını döndürür
   * @param {Array} notifications
   * @returns {number}
   */
  getUnreadCount(notifications) {
    return notifications.filter(
      (n) => !n.read
    ).length;
  },

  /**
   * Bildirimi okundu yapar
   * @param {string} id
   * @param {Array} notifications
   * @returns {Array}
   */
  markAsRead(id, notifications) {
    return notifications.map((n) =>
      n.id === id
        ? { ...n, read: true }
        : n
    );
  },

  /**
   * Tüm bildirimleri okundu yapar
   * @param {Array} notifications
   * @returns {Array}
   */
  markAllAsRead(notifications) {
    return notifications.map((n) => ({
      ...n,
      read: true,
    }));
  },

  /**
   * Yeni bildirim ekler
   * @param {Object} data
   * @param {Array} notifications
   * @returns {Array}
   */
  add(data, notifications) {
    const notification = {
      ...data,
      id: `notif_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 7)}`,
      read: false,
    };

    return [notification, ...notifications];
  },

  /**
   * Bildirim siler
   * @param {string} id
   * @param {Array} notifications
   * @returns {Array}
   */
  remove(id, notifications) {
    return notifications.filter(
      (n) => n.id !== id
    );
  },

  /**
   * Türüne göre filtreler
   * @param {Array} notifications
   * @param {string} type
   * @returns {Array}
   */
  filterByType(notifications, type) {
    return notifications.filter(
      (n) => n.type === type
    );
  },

  /**
   * Okunmamış bildirimleri getirir
   * @param {Array} notifications
   * @returns {Array}
   */
  getUnread(notifications) {
    return notifications.filter(
      (n) => !n.read
    );
  },

  // ─── Bildirim Şablonları ────────────────────────────────────────────────

  /**
   * Yorum bildirimi oluşturur
   * @param {string} authorName
   * @param {string} recipeTitle
   * @returns {Object}
   */
  createCommentNotification(
    authorName,
    recipeTitle
  ) {
    return {
      type: 'comment',
      title: 'Yeni Yorum',
      message: `@${authorName} "${recipeTitle}" tarifine yorum yaptı!`,
      date: 'Az önce',
      icon: '💬',
    };
  },

  /**
   * Ben de yaptım bildirimi oluşturur
   * @param {number} count
   * @param {string} recipeTitle
   * @returns {Object}
   */
  createMadeItNotification(
    count,
    recipeTitle
  ) {
    return {
      type: 'like',
      title: 'Ben de Yaptım',
      message: `${count} kişi "${recipeTitle}" tarifini yaptı!`,
      date: 'Az önce',
      icon: '👨‍🍳',
    };
  },

  /**
   * Takipçi bildirimi oluşturur
   * @param {string} followerName
   * @returns {Object}
   */
  createFollowNotification(followerName) {
    return {
      type: 'follow',
      title: 'Yeni Takipçi',
      message: `@${followerName} seni takip etmeye başladı!`,
      date: 'Az önce',
      icon: '👤',
    };
  },

  /**
   * Plan bildirimi oluşturur
   * @param {string} day
   * @param {string} recipeTitle
   * @returns {Object}
   */
  createPlanNotification(day, recipeTitle) {
    return {
      type: 'plan',
      title: 'Plan Hatırlatma',
      message: `${day} için "${recipeTitle}" planlandı!`,
      date: 'Az önce',
      icon: '📅',
    };
  },
};