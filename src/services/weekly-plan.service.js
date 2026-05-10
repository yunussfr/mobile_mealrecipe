/**
 * weekly-plan.service.js
 * ─────────────────────────────────────────────────────────
 * Haftalık yemek planı (WeeklyPlan) yönetimi.
 *
 * • Planı localStorage'dan okuma / yazma
 * • Güne tarif atama / kaldırma
 * • Haftayı sıfırlama
 * • Güncel hafta bilgisi (kaç gün planlandı)
 */

import { storageGet, storageSet, STORAGE_KEYS } from './storage.service';

// ─── Sabitler ─────────────────────────────────────────────────────────────────

export const WEEK_DAYS = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
];

/** Boş haftalık plan */
export const EMPTY_PLAN = WEEK_DAYS.reduce((acc, day) => {
  acc[day] = null;
  return acc;
}, {});

// ─── Weekly Plan Service ──────────────────────────────────────────────────────

export const WeeklyPlanService = {
  /**
   * Haftalık planı getirir
   */
  getPlan() {
    return storageGet(STORAGE_KEYS.WEEKLY_PLAN, { ...EMPTY_PLAN });
  },

  /**
   * Planı kaydeder
   */
  savePlan(plan) {
    storageSet(STORAGE_KEYS.WEEKLY_PLAN, plan);
  },

  /**
   * Gün gün tarif atar
   */
  setDay(day, meal, current) {
    const updated = { ...current, [day]: meal };
    this.savePlan(updated);
    return updated;
  },

  /**
   * Belirli günü temizler
   */
  clearDay(day, current) {
    return this.setDay(day, null, current);
  },

  /**
   * Haftayı sıfırlar
   */
  resetPlan() {
    const empty = { ...EMPTY_PLAN };
    this.savePlan(empty);
    return empty;
  },

  /**
   * Kaç gün planlanmış?
   */
  countPlannedDays(plan) {
    return Object.values(plan).filter(Boolean).length;
  },

  /**
   * Bir tarif hangi günlerde var?
   */
  getDaysForRecipe(recipeId, plan) {
    return Object.entries(plan)
      .filter(([, meal]) => meal && meal.recipeId === recipeId)
      .map(([day]) => day);
  },

  /**
   * Bugünün gün adını döndürür (TR)
   */
  getTodayName() {
    const today = new Date().getDay();

    const map = {
      0: 'Pazar',
      1: 'Pazartesi',
      2: 'Salı',
      3: 'Çarşamba',
      4: 'Perşembe',
      5: 'Cuma',
      6: 'Cumartesi',
    };

    return map[today] || 'Pazartesi';
  },
};