/**
 * youtube.service.js
 * ─────────────────────────────────────────────────────────
 * YouTube linklerini ayrıştıran saf JavaScript fonksiyonları.
 * API isteği atmaz, sadece string manipülasyonu yapar.
 */

export const YouTubeService = {
  /**
   * TheMealDB'den gelen yemek (meal) objesinin içindeki
   * 'strYoutube' linkinden YouTube Video ID'sini çıkarır.
   * @param {Object} meal - TheMealDB yemek objesi
   * @returns {string|null} Video ID
   */
  getVideoIdFromMeal(meal) {
    const url = meal?.strYoutube;
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    return match ? match[1] : null;
  },

  /**
   * TheMealDB yemek objesindeki YouTube linkinden
   * videonun kapak fotoğrafı (thumbnail) URL'sini üretir.
   * @param {Object} meal - TheMealDB yemek objesi
   * @returns {string|null} Thumbnail resim URL'si
   */
  getThumbnailFromMeal(meal) {
    const videoId = this.getVideoIdFromMeal(meal);
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
};