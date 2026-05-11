/**
 * screens/index.js
 * ─────────────────────────────────────────────────────────
 * LEZZETTAT Ekran Katmanı — Merkezi Barrel Export
 *
 * Tüm ekranları tek noktadan içe aktarmak için kullanın:
 *   import { DiscoverScreen, RecipeDetailScreen } from '../screens';
 *
 * ─── Klasör Yapısı ────────────────────────────────────────
 *
 *  src/app/screens/
 *  ├── index.js                  ← Bu dosya (barrel)
 *  │
 *  ├── Auth Ekranları ──────────────────────────────────────
 *  ├── LoginScreen.jsx           ← Giriş yapma ekranı
 *  ├── RegisterScreen.jsx        ← Yeni hesap oluşturma ekranı
 *  │
 *  ├── Ana Navigasyon Ekranları ─────────────────────────────
 *  ├── DiscoverScreen.jsx        ← Keşfet (Ana sayfa) + Swipe kartlar
 *  ├── MyRecipesScreen.jsx       ← Tariflerim + Koleksiyonlar (ajantalar)
 *  ├── NotebookScreen.jsx        ← Defterim + Kategori bazlı koleksiyon
 *  ├── WeeklyPlanScreen.jsx      ← Haftalık Yemek Planı
 *  ├── ProfileScreen.jsx         ← Kullanıcı profili + bildirimler
 *  │
 *  ├── Detay / Yardımcı Ekranlar ───────────────────────────
 *  ├── RecipeDetailScreen.jsx    ← Tarif detay (malzeme, adım, yorum, plan)
 *  ├── CategoryScreen.jsx        ← Kategori tarifler + filtre
 *  ├── SearchScreen.jsx          ← Gelişmiş tarif arama + sıralama
 *  ├── FavoritesScreen.jsx       ← Pinboard (iğnelenen tarifler)
 *  ├── SettingsScreen.jsx        ← Uygulama ayarları (tema, dil, renk)
 *  └── AIChefScreen.jsx          ← AI Şef (malzemeye göre tarif eşleştirme)
 *
 * ─── Services Bağımlılıkları ──────────────────────────────
 *  Her ekran, ihtiyacına göre aşağıdaki servisleri kullanır:
 *
 *  AuthService          → LoginScreen, RegisterScreen, ProfileScreen
 *  RecipeService        → DiscoverScreen, MyRecipesScreen, RecipeDetailScreen
 *  CommentService       → RecipeDetailScreen
 *  NotebookService      → NotebookScreen, MyRecipesScreen, FavoritesScreen
 *  WeeklyPlanService    → WeeklyPlanScreen, RecipeDetailScreen
 *  NotificationService  → ProfileScreen, DiscoverScreen
 *  SettingsService      → SettingsScreen
 *  YouTubeService       → RecipeDetailScreen
 *  SearchService        → DiscoverScreen, SearchScreen, CategoryScreen
 */

// ─── Auth ─────────────────────────────────────────────────────────────────────
export { LoginScreen }    from './LoginScreen';
export { RegisterScreen } from './RegisterScreen';

// ─── Ana Navigasyon ───────────────────────────────────────────────────────────
export { DiscoverScreen }    from './DiscoverScreen';
export { MyRecipesScreen }   from './MyRecipesScreen';
export { NotebookScreen }    from './NotebookScreen';
export { WeeklyPlanScreen }  from './WeeklyPlanScreen';
export { ProfileScreen }     from './ProfileScreen';

// ─── Detay / Yardımcı ─────────────────────────────────────────────────────────
export { RecipeDetailScreen } from './RecipeDetailScreen';
export { CategoryScreen }     from './CategoryScreen';
export { SearchScreen }       from './SearchScreen';
export { FavoritesScreen }    from './FavoritesScreen';
export { SettingsScreen }     from './SettingsScreen';
