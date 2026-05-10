/**
 * weekly-plan.service.js
 * ─────────────────────────────────────────────────────────
 * Kullanıcının haftalık yemek planını yönetir.
 * API karşılığı olmadığı için 500ms gecikmeli asenkron mock olarak çalışır.
 */

export const WeeklyPlanService = {
  /**
   * Haftalık plan verisini getirir.
   */
  async getPlan() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          Pazartesi: null,
          Salı: null,
          Çarşamba: null,
          Perşembe: null,
          Cuma: null,
          Cumartesi: null,
          Pazar: null,
        });
      }, 500);
    });
  },

  /**
   * Belirli bir güne tarif atar.
   */
  async setDay(day, mealData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, day, mealData });
      }, 500);
    });
  },

  /**
   * Haftalık planı tamamen sıfırlar.
   */
  async resetPlan() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
};