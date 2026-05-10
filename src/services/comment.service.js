/**
 * comment.service.js
 * ─────────────────────────────────────────────────────────
 * Tarif yorumları için CRUD operasyonları.
 *
 * • Yorumları localStorage'dan okur / yazar
 * • Seed yorumlarla birleştirir
 * • Yorum ekleme, silme, filtreleme
 */

import {
  storageGet,
  storageSet,
  STORAGE_KEYS,
} from './storage.service';

import { SEED_COMMENTS_INITIAL } from '../lib/seed-data';

// ─── Comment Service ──────────────────────────────────────────────────────────

export const CommentService = {
  /**
   * Tüm yorumları getirir
   * (seed + kullanıcı yorumları)
   */
  getAll() {
    const saved = storageGet(STORAGE_KEYS.COMMENTS, []);

    // Seed yorumlarla çakışanları temizle
    const userOnly = saved.filter(
      (c) => !SEED_COMMENTS_INITIAL.find((s) => s.id === c.id)
    );

    return [...SEED_COMMENTS_INITIAL, ...userOnly];
  },

  /**
   * Sadece kullanıcı yorumlarını kaydeder
   * @param {Array} comments
   */
  saveUserComments(comments) {
    const userOnly = comments.filter(
      (c) => !SEED_COMMENTS_INITIAL.find((s) => s.id === c.id)
    );

    storageSet(STORAGE_KEYS.COMMENTS, userOnly);
  },

  /**
   * Yeni yorum ekler
   * @param {Object} data
   * @param {Array} current
   * @returns {[Object, Array]}
   */
  add(data, current) {
    const comment = {
      ...data,
      id: Math.random().toString(36).substring(2, 11),
      date: new Date().toLocaleDateString('tr-TR'),
    };

    const updated = [comment, ...current];

    CommentService.saveUserComments(updated);

    return [comment, updated];
  },

  /**
   * Yorum siler
   * @param {string} id
   * @param {Array} current
   * @returns {Array}
   */
  remove(id, current) {
    const updated = current.filter((c) => c.id !== id);

    CommentService.saveUserComments(updated);

    return updated;
  },

  /**
   * Tarife göre yorumları getirir
   * @param {Array} comments
   * @param {string} recipeId
   * @returns {Array}
   */
  getByRecipe(comments, recipeId) {
    return comments.filter((c) => c.recipeId === recipeId);
  },

  /**
   * Kullanıcıya göre yorumları getirir
   * @param {Array} comments
   * @param {string} author
   * @returns {Array}
   */
  getByAuthor(comments, author) {
    return comments.filter((c) => c.author === author);
  },

  /**
   * Ortalama puanı hesaplar
   * @param {Array} comments
   * @param {string} recipeId
   * @returns {number}
   */
  getAverageRating(comments, recipeId) {
    const recipeComments = CommentService.getByRecipe(
      comments,
      recipeId
    );

    if (recipeComments.length === 0) {
      return 0;
    }

    const total = recipeComments.reduce(
      (sum, c) => sum + c.rating,
      0
    );

    return Math.round((total / recipeComments.length) * 10) / 10;
  },
};