/**
 * notebook.service.js
 * ─────────────────────────────────────────────────────────
 * "Defterim" ve koleksiyon yönetimi servisi
 *
 * • NotebookEntry → Kaydedilen tarifler
 * • RecipeCollection → Tarif koleksiyonları
 * • HighlightedCollections → Öne çıkan koleksiyonlar
 */

import {
  storageGet,
  storageSet,
  STORAGE_KEYS,
} from './storage.service';

// ─── Notebook Service ─────────────────────────────────────────────────────────

export const NotebookService = {
  // ─── Notebook Entries ────────────────────────────────────────────────────

  /**
   * Tüm notebook girişlerini getirir
   * @returns {Array}
   */
  getEntries() {
    return storageGet(STORAGE_KEYS.NOTEBOOK, []);
  },

  /**
   * Notebook girişlerini kaydeder
   * @param {Array} entries
   */
  saveEntries(entries) {
    storageSet(STORAGE_KEYS.NOTEBOOK, entries);
  },

  /**
   * Tarifi notebook'a ekler
   * @param {string} recipeId
   * @param {string} category
   * @param {Array} current
   * @returns {Array}
   */
  addEntry(recipeId, category, current) {
    const exists = current.find((e) => e.recipeId === recipeId);

    const updated = exists
      ? current.map((e) =>
          e.recipeId === recipeId
            ? { ...e, category }
            : e
        )
      : [...current, { recipeId, category }];

    NotebookService.saveEntries(updated);

    return updated;
  },

  /**
   * Tarifi notebook'tan kaldırır
   * @param {string} recipeId
   * @param {Array} current
   * @returns {Array}
   */
  removeEntry(recipeId, current) {
    const updated = current.filter(
      (e) => e.recipeId !== recipeId
    );

    NotebookService.saveEntries(updated);

    return updated;
  },

  /**
   * Tarif notebook'ta var mı kontrol eder
   * @param {string} recipeId
   * @param {Array} entries
   * @returns {boolean}
   */
  isInNotebook(recipeId, entries) {
    return entries.some((e) => e.recipeId === recipeId);
  },

  /**
   * Kategoriye göre girişleri getirir
   * @param {string} category
   * @param {Array} entries
   * @returns {Array}
   */
  getEntriesByCategory(category, entries) {
    return entries.filter(
      (e) => e.category === category
    );
  },

  /**
   * Kategori istatistiklerini hesaplar
   * @param {Array} entries
   * @returns {Object}
   */
  getCategoryStats(entries) {
    return entries.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    }, {});
  },

  // ─── Recipe Collections ─────────────────────────────────────────────────

  /**
   * Tüm koleksiyonları getirir
   * @returns {Array}
   */
  getCollections() {
    return storageGet(
      STORAGE_KEYS.RECIPE_COLLECTIONS,
      []
    );
  },

  /**
   * Koleksiyonları kaydeder
   * @param {Array} collections
   */
  saveCollections(collections) {
    storageSet(
      STORAGE_KEYS.RECIPE_COLLECTIONS,
      collections
    );
  },

  /**
   * Yeni koleksiyon oluşturur
   * @param {string} name
   * @param {Array} current
   * @returns {[Object, Array]}
   */
  addCollection(name, current) {
    const collection = {
      id: Math.random()
        .toString(36)
        .substring(2, 11),
      name,
      recipeIds: [],
    };

    const updated = [...current, collection];

    NotebookService.saveCollections(updated);

    return [collection, updated];
  },

  /**
   * Koleksiyon adını günceller
   * @param {string} id
   * @param {string} newName
   * @param {Array} current
   * @returns {Array}
   */
  updateCollectionName(id, newName, current) {
    const updated = current.map((c) =>
      c.id === id
        ? { ...c, name: newName }
        : c
    );

    NotebookService.saveCollections(updated);

    return updated;
  },

  /**
   * Koleksiyon siler
   * @param {string} id
   * @param {Array} current
   * @returns {Array}
   */
  removeCollection(id, current) {
    const updated = current.filter(
      (c) => c.id !== id
    );

    NotebookService.saveCollections(updated);

    return updated;
  },

  /**
   * Tarifi koleksiyona ekler
   * @param {string} collectionId
   * @param {string} recipeId
   * @param {Array} current
   * @returns {Array}
   */
  addRecipeToCollection(
    collectionId,
    recipeId,
    current
  ) {
    const updated = current.map((c) => {
      if (c.id !== collectionId) {
        return c;
      }

      if (c.recipeIds.includes(recipeId)) {
        return c;
      }

      return {
        ...c,
        recipeIds: [...c.recipeIds, recipeId],
      };
    });

    NotebookService.saveCollections(updated);

    return updated;
  },

  /**
   * Tarifi koleksiyondan kaldırır
   * @param {string} collectionId
   * @param {string} recipeId
   * @param {Array} current
   * @returns {Array}
   */
  removeRecipeFromCollection(
    collectionId,
    recipeId,
    current
  ) {
    const updated = current.map((c) => {
      if (c.id !== collectionId) {
        return c;
      }

      return {
        ...c,
        recipeIds: c.recipeIds.filter(
          (id) => id !== recipeId
        ),
      };
    });

    NotebookService.saveCollections(updated);

    return updated;
  },

  // ─── Highlighted Collections ────────────────────────────────────────────

  /**
   * Öne çıkan koleksiyonları getirir
   * @returns {Array}
   */
  getHighlightedCollections() {
    return storageGet(
      STORAGE_KEYS.HIGHLIGHTED_COLLECTIONS,
      []
    );
  },

  /**
   * Öne çıkan koleksiyonları kaydeder
   * @param {Array} ids
   */
  saveHighlightedCollections(ids) {
    storageSet(
      STORAGE_KEYS.HIGHLIGHTED_COLLECTIONS,
      ids
    );
  },

  /**
   * Koleksiyonu öne çıkanlara ekler/kaldırır
   * @param {string} id
   * @param {Array} current
   * @returns {Array}
   */
  toggleHighlight(id, current) {
    const updated = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id];

    NotebookService.saveHighlightedCollections(
      updated
    );

    return updated;
  },
};