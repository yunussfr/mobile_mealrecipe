/**
 * recipe.service.js
 * ─────────────────────────────────────────────────────────
 * Tarif CRUD işlemleri, arama/filtreleme ve
 * "Ben de yaptım" yönetimi.
 */

import {
  storageGet,
  storageSet,
  STORAGE_KEYS,
} from './storage.service';

import { SEED_RECIPES } from '../lib/seed-data';

// ─── Varsayılan MadeIt State ────────────────────────────────────────────────

const DEFAULT_MADE_IT = {
  counts: {
    '1': 47,
  },
  byUser: {},
};

// ─── Recipe Service ─────────────────────────────────────────────────────────

export const RecipeService = {
  /**
   * Tüm tarifleri getirir
   * (seed + kullanıcı tarifleri)
   * @returns {Array}
   */
  getAll() {
    const saved = storageGet(
      STORAGE_KEYS.RECIPES,
      []
    );

    const userOnly = saved.filter(
      (r) =>
        !SEED_RECIPES.find(
          (s) => s.id === r.id
        )
    );

    return [...SEED_RECIPES, ...userOnly];
  },

  /**
   * Kullanıcı tariflerini kaydeder
   * @param {Array} recipes
   */
  saveUserRecipes(recipes) {
    const userOnly = recipes.filter(
      (r) =>
        !SEED_RECIPES.find(
          (s) => s.id === r.id
        )
    );

    storageSet(
      STORAGE_KEYS.RECIPES,
      userOnly
    );
  },

  /**
   * Yeni tarif ekler
   * @param {Object} data
   * @param {Array} current
   * @returns {[Object, Array]}
   */
  add(data, current) {
    const recipe = {
      ...data,
      id: Math.random()
        .toString(36)
        .substring(2, 11),
    };

    const updated = [recipe, ...current];

    RecipeService.saveUserRecipes(updated);

    return [recipe, updated];
  },

  /**
   * Tarif siler
   * @param {string} id
   * @param {Array} current
   * @returns {Array}
   */
  remove(id, current) {
    const updated = current.filter(
      (r) => r.id !== id
    );

    RecipeService.saveUserRecipes(updated);

    return updated;
  },

  // ─── Arama & Filtreleme ────────────────────────────────────────────────

  /**
   * Tarif arama
   * @param {Array} recipes
   * @param {string} query
   * @returns {Array}
   */
  search(recipes, query) {
    if (!query.trim()) {
      return recipes;
    }

    const q = query
      .toLowerCase()
      .trim();

    return recipes.filter(
      (r) =>
        r.title
          .toLowerCase()
          .includes(q) ||
        r.author
          .toLowerCase()
          .includes(q)
    );
  },

  /**
   * Zorluk filtresi
   * @param {Array} recipes
   * @param {string} difficulty
   * @returns {Array}
   */
  filterByDifficulty(
    recipes,
    difficulty
  ) {
    if (!difficulty) {
      return recipes;
    }

    return recipes.filter(
      (r) =>
        r.difficulty === difficulty
    );
  },

  /**
   * Public tarifleri getirir
   * @param {Array} recipes
   * @returns {Array}
   */
  getPublic(recipes) {
    return recipes.filter(
      (r) => r.isPublic
    );
  },

  /**
   * Yazara göre filtreler
   * @param {Array} recipes
   * @param {string} author
   * @returns {Array}
   */
  getByAuthor(recipes, author) {
    return recipes.filter(
      (r) => r.author === author
    );
  },

  /**
   * ID ile tarif bulur
   * @param {Array} recipes
   * @param {string} id
   * @returns {Object|undefined}
   */
  findById(recipes, id) {
    return recipes.find(
      (r) => r.id === id
    );
  },

  // ─── Made It ────────────────────────────────────────────────────────────

  /**
   * MadeIt state getirir
   * @returns {Object}
   */
  getMadeItState() {
    return storageGet(
      STORAGE_KEYS.MADE_IT,
      DEFAULT_MADE_IT
    );
  },

  /**
   * MadeIt state kaydeder
   * @param {Object} state
   */
  saveMadeItState(state) {
    storageSet(
      STORAGE_KEYS.MADE_IT,
      state
    );
  },

  /**
   * MadeIt sayısını getirir
   * @param {Object} state
   * @param {string} recipeId
   * @returns {number}
   */
  getMadeItCount(
    state,
    recipeId
  ) {
    return (
      state.counts[recipeId] || 0
    );
  },

  /**
   * Kullanıcı yaptı mı kontrolü
   * @param {Object} state
   * @param {string} recipeId
   * @returns {boolean}
   */
  hasMadeIt(state, recipeId) {
    return (
      state.byUser[recipeId] || false
    );
  },

  /**
   * MadeIt toggle işlemi
   * @param {Object} prev
   * @param {string} recipeId
   * @returns {Object}
   */
  toggleMadeIt(prev, recipeId) {
    const already =
      prev.byUser[recipeId] || false;

    const currentCount =
      prev.counts[recipeId] || 0;

    const updated = {
      counts: {
        ...prev.counts,
        [recipeId]: already
          ? Math.max(
              0,
              currentCount - 1
            )
          : currentCount + 1,
      },

      byUser: {
        ...prev.byUser,
        [recipeId]: !already,
      },
    };

    RecipeService.saveMadeItState(
      updated
    );

    return updated;
  },
};