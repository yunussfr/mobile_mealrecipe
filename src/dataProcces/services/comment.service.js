/**
 * comment.service.js
 * ─────────────────────────────────────────────────────────
 * Tarif yorumlarını yönetir.
 * API karşılığı olmadığı için 500ms gecikmeli asenkron mock olarak çalışır.
 */

export const CommentService = {
  /**
   * Bir tarife ait yorumları getirir.
   */
  async getCommentsByRecipe(recipeId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]); // Şimdilik boş dizi
      }, 500);
    });
  },

  /**
   * Yeni bir yorum ekler.
   */
  async addComment(recipeId, commentData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: Date.now(), recipeId, ...commentData });
      }, 500);
    });
  },

  /**
   * Bir yorumu siler.
   */
  async deleteComment(commentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, commentId });
      }, 500);
    });
  }
};