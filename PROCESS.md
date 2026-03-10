# BabyTrack — Build Process & Decisions

This document captures how the project was built, phase by phase, and the key decisions made along the way. Useful context for any future session picking up the codebase.

---

## Phase 1 — Bootstrap
- Scaffolded with `npm create vite@latest` (React template).
- Added `.gitignore` entries for `.env.local` and `dist/`.
- Created `src/firebase/firebaseConfig.js` reading `import.meta.env.VITE_*` vars.
- Separate `auth.js` and `firestore.js` export singleton instances (`getAuth`, `getFirestore`) to avoid re-initialization.

## Phase 2 — Authentication
- `AuthContext.jsx` wraps the app; provides `currentUser`, `login(email, pw)`, `register(email, pw)` (returns `UserCredential`), `logout()`.
- `ProtectedRoute` redirects unauthenticated users to `/login`.
- `LoginForm` and `RegisterForm` are form-only components; pages (`LoginPage`, `RegisterPage`) handle layout.

## Phase 3 — Firestore Services & Hooks
- Each tracker (`feedings`, `diapers`, `sleeps`, `diary`) has:
  - A **service** (`src/services/`) with `addEntry`, `updateEntry`, `removeEntry` functions.
  - A **hook** (`src/hooks/`) that calls `onSnapshot` and returns `{ entries, loading, add, update, remove }`.
- `useProfile` reads/writes the single `profile` document under the user's root.
- `profileService.saveProfile(uid, data)` uses `setDoc(..., data, { merge: true })` so partial updates are safe.

## Phase 4 — Tracker Pages
- Each tracker (Feeding, Diaper, Sleep) has: Page → Form + Entry + Analytics components.
- Form components are controlled; they receive `onSubmit(data)` and `onCancel` props.
- Entry components receive the raw Firestore doc + `onEdit` / `onDelete` callbacks.
- Analytics are pure utility functions (`src/utils/*Analytics.js`) that receive the entries array and return computed stats — no side effects.
- Diary is simpler (no analytics); uses free-text + predefined tags.

## Phase 5 — Dashboard
- `DashboardPage` composes `SummaryCard` × 4 + `RecentActivity` + quick-add modals.
- Quick-add opens a `Modal` with the corresponding Form inline; on submit, calls the hook's `add()`.
- `RecentActivity` merges all 4 entry types, sorts by timestamp descending, shows latest 10.
- `formatTimeAgo` returns relative time strings ("just now", "3h ago").
- `calculateAge` computes a human-readable age from `profile.babyDOB`.

## Phase 6 — Polish

### Emoji & Theming
- Tracker colors as CSS custom properties: `--color-feeding` (green), `--color-diaper` (yellow), `--color-sleep` (blue), `--color-entry` (pink/rose).
- Emoji consistently used as visual anchors throughout (🍼🧷😴📓).

### Mobile Navigation
- Removed hamburger/sidebar on mobile entirely.
- Added fixed bottom tab bar with 4 links. `--bottom-nav-height: 62px` CSS variable added to `app-content` padding-bottom.
- Mobile header: logo centered, theme toggle on the right, same-size spacer on the left for balance.
- Desktop sidebar unchanged.

### Unified Entries Page
- `/entries` merges all 3 trackers into one chronological timeline.
- Filter tabs: Today / Yesterday / 7 Days / All.
- Stats strip at top (feed count, diaper count, total sleep today).
- Old routes `/feeding`, `/diaper`, `/sleep` redirect to `/entries` via React Router `<Navigate>`.
- Individual tracker pages still exist but are only reachable for analytics (currently unused in nav).

### Dark Mode
- Approach: `html.dark` class + CSS custom property overrides.
- Anti-FOUC: inline `<script>` in `index.html` runs synchronously before body renders; reads `localStorage.theme` and applies class immediately. Falls back to `prefers-color-scheme: dark`.
- `useTheme` hook manages toggle state, syncs to localStorage, adds/removes class.
- Tracker colors in dark mode are dark muted versions of the pastels to prevent "glowing" colors on a dark background.
- Text colors on colored backgrounds (badges, analytics cards, summary cards, toggle buttons) all have explicit dark mode overrides to ensure white/light text on dark-pastel backgrounds.

### i18n (EN / ES Latin America)
- Custom implementation — no i18n library needed at this scale.
- `translations.js`: flat key-value object, ~200 keys per language.
- `LanguageContext`: `useState` initialized from `localStorage.language`. `t(key)` falls back en → key.
- Language picker on Login, Register (immediate effect before auth), and Profile pages.
- On registration: `saveProfile(cred.user.uid, { language })` writes to Firestore immediately.
- `LanguageSync` component (in `ProtectedLayout`): reads `profile.language` from Firestore and calls `setLanguage()` if it differs — enables cross-device sync.
- Data stored in English in Firestore; display-time translation via `t()`.
- `formatTimeAgo(ts, t?)` and `calculateAge(dob, t?)` accept optional `t` for translated relative times and age strings.
- Dashboard date uses `toLocaleDateString('es-MX', ...)` when language is Spanish.

---

## Common Patterns

### Adding a new tracker
1. Create `src/services/fooService.js` with `addFoo`, `updateFoo`, `removeFoo`.
2. Create `src/hooks/useFoos.js` using `onSnapshot`, returning `{ entries, loading, add, update, remove }`.
3. Create `FooForm.jsx`, `FooEntry.jsx`, optional `FooAnalytics.jsx` in `src/components/foo/`.
4. Add a page in `src/pages/FooPage.jsx`.
5. Add translation keys to both `en` and `es` in `translations.js`.
6. Wire into `EntriesPage` timeline and `RecentActivity`.

### Adding a translation key
1. Add to `en` object in `translations.js`.
2. Add the same key to `es` object with Spanish value.
3. Use `t('your.key')` in any component via `const { t } = useLanguage()`.

### Dark mode CSS rule
Always write a `html.dark` override for any rule that uses hard-coded colors that rely on a light background:
```css
.my-component { color: #333; }
html.dark .my-component { color: #ede9f5; }
```

---

## Known Constraints / Not Implemented
- No offline support (Firestore persistence not enabled).
- No push notifications.
- No image upload (baby photo).
- Analytics are client-side only (computed from the full entry array fetched via `onSnapshot`).
- Bundle is ~700 KB minified — mainly Firebase SDK. Code-splitting not implemented.
