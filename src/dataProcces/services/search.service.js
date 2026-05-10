/**
 * search.service.js
 * ─────────────────────────────────────────────────────────
 * Arama işlemleri için TheMealDB API yönlendirmeleri.
 */

import { mealClient } from '../client/apiClient';

export const SearchService = {
  /**
   * Kelimeye göre TheMealDB'de yemek araması yapar.
   * @param {string} query - Aranacak kelime
   * @returns {Promise<Array>} Tarif listesi
   */
  async searchByQuery(query) {
    const response = await mealClient.get(`/search.php?s=${query}`);
    return response.data.meals || [];
  },

  /**
   * Kategori adına göre TheMealDB'de filtreleme yapar.
   * @param {string} category - Kategori adı (örn: Seafood)
   * @returns {Promise<Array>} Tarif listesi
   */
  async filterByCategory(category) {
    const response = await mealClient.get(`/filter.php?c=${category}`);
    return response.data.meals || [];
  }
};