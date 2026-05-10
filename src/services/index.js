/**
 * services/index.js
 * ─────────────────────────────────────────────────────────
 * LEZZETTAT Servis Katmanı — Merkezi Barrel Export
 *
 * Tüm servisleri tek noktadan içe aktarmak için:
 *   import { RecipeService, NotificationService } from '../services';
 */

// ─── Storage ──────────────────────────────────────────────────────────────────
export {
  StorageService,
  STORAGE_KEYS,
  storageGet,
  storageSet,
  storageRemove,
  storageClearKeys,
} from './storage.service';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export { AuthService } from './auth.service';

// ─── Recipe ───────────────────────────────────────────────────────────────────
export { RecipeService } from './recipe.service';

// ─── Comment ──────────────────────────────────────────────────────────────────
export { CommentService } from './comment.service';

// ─── Notebook ─────────────────────────────────────────────────────────────────
export { NotebookService } from './notebook.service';

// ─── Weekly Plan ──────────────────────────────────────────────────────────────
export {
  WeeklyPlanService,
  WEEK_DAYS,
  EMPTY_PLAN,
} from './weekly-plan.service';

// ─── Notification ─────────────────────────────────────────────────────────────
export {
  NotificationService,
  INITIAL_NOTIFICATIONS,
} from './notification.service';

// ─── Settings ─────────────────────────────────────────────────────────────────
export {
  SettingsService,
  DEFAULT_SETTINGS,
  TRANSLATIONS,
} from './settings.service';

// ─── YouTube ──────────────────────────────────────────────────────────────────
export { YouTubeService } from './youtube.service';

// ─── Search ───────────────────────────────────────────────────────────────────
export { SearchService } from './search.service';