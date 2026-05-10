/**
 * search.service.js
 * ─────────────────────────────────────────────────────────
 * Gelişmiş arama ve sıralama işlemleri
 */

// ─── Yardımcı Fonksiyonlar ──────────────────────────────────────────────────

/**
 * Süre string'ini dakikaya çevirir
 * Örn: "1.5 saat", "30 dk"
 * @param {string} timeStr
 * @returns {number}
 */
function parseTimeToMinutes(timeStr) {
  const lower = timeStr.toLowerCase();

  const hourMatch = lower.match(
    /(\d+(?:\.\d+)?)\s*saat/
  );

  const minuteMatch = lower.match(
    /(\d+)\s*dk/
  );

  let total = 0;

  if (hourMatch) {
    total += parseFloat(hourMatch[1]) * 60;
  }

  if (minuteMatch) {
    total += parseInt(
      minuteMatch[1],
      10
    );
  }

  return total || 999;
}

/**
 * Kalori string'ini sayıya çevirir
 * Örn: "450 kcal"
 * @param {string} calStr
 * @returns {number}
 */
function parseCalories(calStr) {
  const match = calStr.match(/(\d+)/);

  return match
    ? parseInt(match[1], 10)
    : 9999;
}

/**
 * Türkçe karakter normalize eder
 * @param {string} text
 * @returns {string}
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/i̇/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}

// ─── Search Service ─────────────────────────────────────────────────────────

export const SearchService = {
  /**
   * Tam metin arama
   * @param {Array} recipes
   * @param {string} query
   * @returns {Array}
   */
  fullTextSearch(recipes, query) {
    const q = normalizeText(
      query.trim()
    );

    if (!q) {
      return recipes;
    }

    return recipes.filter((r) => {
      const haystack = [
        r.title,
        r.author,
        r.difficulty,
        ...r.ingredients.map(
          (i) => i.name
        ),
      ]
        .map(normalizeText)
        .join(' ');

      return haystack.includes(q);
    });
  },

  /**
   * Çoklu filtre uygular
   * @param {Array} recipes
   * @param {Object} filters
   * @returns {Array}
   */
  applyFilters(recipes, filters) {
    let result = [...recipes];

    // Metin araması
    if (
      filters.query &&
      filters.query.trim()
    ) {
      result =
        SearchService.fullTextSearch(
          result,
          filters.query
        );
    }

    // Zorluk filtresi
    if (filters.difficulty) {
      result = result.filter(
        (r) =>
          r.difficulty ===
          filters.difficulty
      );
    }

    // Süre filtresi
    if (filters.maxTime) {
      result = result.filter(
        (r) =>
          parseTimeToMinutes(
            r.time
          ) <= filters.maxTime
      );
    }

    // Public filtre
    if (filters.isPublicOnly) {
      result = result.filter(
        (r) => r.isPublic
      );
    }

    // Yazara göre filtre
    if (filters.author) {
      result = result.filter(
        (r) =>
          r.author ===
          filters.author
      );
    }

    // Sıralama
    if (
      filters.sort &&
      filters.sort !== 'default'
    ) {
      result = SearchService.sort(
        result,
        filters.sort
      );
    }

    return result;
  },

  /**
   * Tarif sıralama
   * @param {Array} recipes
   * @param {string} option
   * @returns {Array}
   */
  sort(recipes, option) {
    const copy = [...recipes];

    switch (option) {
      case 'title_asc':
        return copy.sort((a, b) =>
          a.title.localeCompare(
            b.title,
            'tr'
          )
        );

      case 'title_desc':
        return copy.sort((a, b) =>
          b.title.localeCompare(
            a.title,
            'tr'
          )
        );

      case 'time_asc':
        return copy.sort(
          (a, b) =>
            parseTimeToMinutes(
              a.time
            ) -
            parseTimeToMinutes(
              b.time
            )
        );

      case 'difficulty': {
        const order = {
          Kolay: 0,
          Orta: 1,
          Zor: 2,
        };

        return copy.sort(
          (a, b) =>
            (order[a.difficulty] ??
              1) -
            (order[b.difficulty] ??
              1)
        );
      }

      case 'calories_asc':
        return copy.sort(
          (a, b) =>
            parseCalories(
              a.calories
            ) -
            parseCalories(
              b.calories
            )
        );

      default:
        return copy;
    }
  },

  /**
   * Kategoriye göre filtreleme
   * @param {Array} recipes
   * @param {string} categoryName
   * @returns {Array}
   */
  filterByCategory(
    recipes,
    categoryName
  ) {
    const keywords = {
      Kahvaltı: [
        'kahvaltı',
        'omlet',
        'menemen',
        'börek',
      ],

      'Ana Yemek': [
        'tavuk',
        'et',
        'kuzu',
        'biftek',
        'köfte',
      ],

      'Öğle Yemeği': [
        'salata',
        'sandviç',
        'wrap',
        'makarna',
      ],

      'Akşam Yemeği': [
        'güveç',
        'fırın',
        'ızgara',
        'pirzola',
      ],

      Tatlılar: [
        'tatlı',
        'pasta',
        'kek',
        'kurabiye',
        'dondurma',
      ],

      İçecekler: [
        'içecek',
        'smoothie',
        'kokteyl',
        'limonata',
      ],

      Atıştırmalık: [
        'atıştırma',
        'cips',
        'meze',
        'snack',
      ],

      Vejetaryen: [
        'sebze',
        'salata',
        'tofu',
        'vegan',
      ],

      'Deniz Ürünleri': [
        'balık',
        'karides',
        'ahtapot',
        'midye',
        'somon',
      ],

      'Hamur İşleri': [
        'börek',
        'pide',
        'pizza',
        'pasta',
        'ekmek',
      ],
    };

    const catKeywords =
      keywords[categoryName];

    if (!catKeywords) {
      return recipes;
    }

    const lower =
      categoryName.toLowerCase();

    return recipes.filter((r) => {
      const titleLower =
        r.title.toLowerCase();

      return (
        titleLower.includes(lower) ||
        catKeywords.some((kw) =>
          titleLower.includes(kw)
        )
      );
    });
  },

  /**
   * Benzer tarifleri getirir
   * @param {Array} recipes
   * @param {Object} current
   * @param {number} limit
   * @returns {Array}
   */
  getSimilar(
    recipes,
    current,
    limit = 6
  ) {
    const titleWords =
      current.title
        .toLowerCase()
        .split(/\s+/)
        .filter(
          (w) => w.length > 2
        );

    return recipes
      .filter(
        (r) =>
          r.id !== current.id &&
          r.isPublic
      )

      .map((r) => {
        let score = 0;

        if (
          r.author === current.author
        ) {
          score += 3;
        }

        if (
          r.difficulty ===
          current.difficulty
        ) {
          score += 1;
        }

        const rTitle =
          r.title.toLowerCase();

        titleWords.forEach((word) => {
          if (
            rTitle.includes(word)
          ) {
            score += 2;
          }
        });

        return {
          recipe: r,
          score,
        };
      })

      .sort(
        (a, b) =>
          b.score - a.score
      )

      .slice(0, limit)

      .map((item) => item.recipe);
  },
};