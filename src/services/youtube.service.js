/**
 * youtube.service.js
 * ─────────────────────────────────────────────────────────
 * YouTube URL işleme yardımcıları.
 *
 * RecipeDetail sayfasında video, thumbnail ve embed işlemleri için kullanılır.
 */

export const YouTubeService = {
  /**
   * YouTube URL'sinden video ID çıkarır
   */
  extractVideoId(url) {
    if (!url) return null;

    // Direkt video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
      return url.trim();
    }

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }

    return null;
  },

  /**
   * Thumbnail URL üretir
   */
  getThumbnail(videoId, quality = 'maxresdefault') {
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  },

  /**
   * Embed URL üretir
   */
  getEmbedUrl(videoId, options = {}) {
    if (!videoId) return null;

    const params = new URLSearchParams();

    if (options.autoplay) params.set('autoplay', '1');
    if (options.controls === false) params.set('controls', '0');
    if (options.rel === false) params.set('rel', '0');
    if (options.modestbranding) params.set('modestbranding', '1');
    if (options.start) params.set('start', String(options.start));

    const base = `https://www.youtube.com/embed/${videoId}`;
    const query = params.toString();

    return query ? `${base}?${query}` : base;
  },

  /**
   * Hero image (video varsa thumbnail, yoksa fallback)
   */
  getHeroImage(youtubeUrl, fallbackImage) {
    if (!youtubeUrl) return fallbackImage;

    const videoId = this.extractVideoId(youtubeUrl);
    return this.getThumbnail(videoId) || fallbackImage;
  },

  /**
   * YouTube URL valid mi?
   */
  isValidYouTubeUrl(url) {
    return this.extractVideoId(url) !== null;
  },

  /**
   * Watch URL üretir
   */
  getWatchUrl(videoId) {
    if (!videoId) return null;
    return `https://www.youtube.com/watch?v=${videoId}`;
  },
};