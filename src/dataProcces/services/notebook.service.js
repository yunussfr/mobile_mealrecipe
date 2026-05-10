/**
 * notebook.service.js
 * ─────────────────────────────────────────────────────────
 * Kullanıcının favori tariflerini ve koleksiyonlarını yönetir.
 * API karşılığı olmadığı için 500ms gecikmeli asenkron mock olarak çalışır.
 */

export const NotebookService = {
  /**
   * Defterdeki (favorilerdeki) tüm tarifleri getirir.
   */
  async getEntries() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]); // Şimdilik boş liste döner
      }, 500);
    });
  },

  /**
   * Tarifi deftere ekler.
   */
  async addEntry(recipeId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, recipeId });
      }, 500);
    });
  },

  /**
   * Tarifi defterden çıkarır.
   */
  async removeEntry(recipeId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, recipeId });
      }, 500);
    });
  }
};