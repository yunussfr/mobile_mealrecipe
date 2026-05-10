/**
 * recipe.service.js
 * ─────────────────────────────────────────────────────────
 * TheMealDB API'si üzerinden tarif (yemek) işlemlerini yürütür.
 * State yönetimi (Made It vs.) ve LocalStorage temizlenmiştir.
 */

import { mealClient } from '../client/apiClient';

export const RecipeService = {
  /**
   * İsme göre tarifleri arar. Boş bırakılırsa rastgele veya default tarifler dönebilir.
   * @param {string} query - Aranacak yemek ismi (örn: 'chicken')
   * @returns {Promise<Array>} Tarif listesi (meals array)
   */
  async searchRecipes(query = '') {
    const response = await mealClient.get(`/search.php?s=${query}`);
    return response.data.meals || [];
  },

  /**
   * ID'sine göre tek bir tarifin detaylarını getirir.
   * @param {string} id - Tarif ID'si
   * @returns {Promise<Object|null>} Tarif detay objesi
   */
  async getRecipeById(id) {
    const response = await mealClient.get(`/lookup.php?i=${id}`);
    const meals = response.data.meals;
    return meals && meals.length > 0 ? meals[0] : null;
  },

  /**
   * Belirli bir kategoriye (örn: 'Seafood', 'Dessert') göre tarifleri getirir.
   * Not: Filter endpoint'leri detayları değil, sadece id, isim ve resim döner.
   * @param {string} category - Kategori adı
   * @returns {Promise<Array>} Tarif listesi
   */
  async getRecipesByCategory(category) {
    const response = await mealClient.get(`/filter.php?c=${category}`);
    return response.data.meals || [];
  },

  /**
   * Belirli bir ana malzemeye (örn: 'chicken_breast') göre tarifleri getirir.
   * @param {string} ingredient - Malzeme adı
   * @returns {Promise<Array>} Tarif listesi
   */
  async getRecipesByIngredient(ingredient) {
    const response = await mealClient.get(`/filter.php?i=${ingredient}`);
    return response.data.meals || [];
  },
  
  /**
   * Rastgele tek bir tarif getirir (Günün Tarifi vs. için kullanılabilir).
   * @returns {Promise<Object|null>} Rastgele tarif detay objesi
   */
  async getRandomRecipe() {
    const response = await mealClient.get(`/random.php`);
    const meals = response.data.meals;
    return meals && meals.length > 0 ? meals[0] : null;
  }
};