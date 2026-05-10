/**
 * storage.service.js
 * ─────────────────────────────────────────────────────────
 * LEZZETTAT uygulamasında kullanılan tüm localStorage
 * anahtar sabitleri ve jenerik okuma/yazma/silme yardımcıları.
 *
 * Kullanım örneği:
 *   import { StorageService, STORAGE_KEYS } from '../services/storage.service';
 *   const recipes = StorageService.get(STORAGE_KEYS.RECIPES, []);
 */

// ─── Key Sabitleri ────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  /** Oturum açmış kullanıcı nesnesi */
  USER: 'lezzettat_user',

  /** Kullanıcının oluşturduğu tarifler (seed veriler dahil değil) */
  RECIPES: 'lezzettat_recipes',

  /** Kullanıcının yazdığı yorumlar (seed yorumlar dahil değil) */
  COMMENTS: 'lezzettat_comments',

  /** Haftalık yemek planı */
  WEEKLY_PLAN: 'lezzettat_weekly_plan',

  /** "Ben de yaptım" sayaçları */
  MADE_IT: 'lezzettat_made_it',

  /** Defterdeki tarif girdileri */
  NOTEBOOK: 'lezzettat_notebook',

  /** Tarif koleksiyonları */
  RECIPE_COLLECTIONS: 'lezzettat_recipe_collections',

  /** Öne çıkan koleksiyonlar */
  HIGHLIGHTED_COLLECTIONS: 'lezzettat_highlighted_collections',

  /** Uygulama ayarları */
  SETTINGS: 'app-settings',
};

// ─── Jenerik Yardımcılar ──────────────────────────────────────────────────────

/**
 * localStorage'dan veri okur
 */
export function storageGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    return fallback;
  }
}

/**
 * localStorage'a veri yazar
 */
export function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[StorageService] '${key}' kaydedilemedi:`, err);
  }
}

/**
 * localStorage'dan veri siler
 */
export function storageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[StorageService] '${key}' silinemedi:`, err);
  }
}

/**
 * Birden fazla key siler
 */
export function storageClearKeys(keys) {
  keys.forEach(storageRemove);
}

// ─── Servis Objesi ────────────────────────────────────────────────────────────
export const StorageService = {
  get: storageGet,
  set: storageSet,
  remove: storageRemove,
  clearKeys: storageClearKeys,
};