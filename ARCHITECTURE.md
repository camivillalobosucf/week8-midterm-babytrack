# BabyTrack — Architecture

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 + Vite 6 |
| Routing | react-router-dom v6 |
| Backend / Auth | Firebase 11 (Auth + Firestore) |
| Styling | Plain CSS (no framework) |
| i18n | Custom context (no library) |
| Hosting | Netlify (netlify.toml present) |

---

## Directory Structure

```
src/
├── firebase/
│   ├── firebaseConfig.js   # Initializes Firebase app from VITE_ env vars
│   ├── auth.js             # Exports `auth` (getAuth instance)
│   └── firestore.js        # Exports `db` (getFirestore instance)
│
├── context/
│   ├── AuthContext.jsx     # Provides { currentUser, login, register, logout }
│   └── LanguageContext.jsx # Provides { language, setLanguage, t() }
│
├── hooks/
│   ├── useAuth.js          # Consumes AuthContext
│   ├── useProfile.js       # Reads/writes users/{uid}/profile via onSnapshot
│   ├── useFeedings.js      # CRUD + real-time listener for feedings collection
│   ├── useDiapers.js       # Same for diapers
│   ├── useSleeps.js        # Same for sleeps
│   └── useDiary.js         # Same for diary
│
├── services/
│   ├── feedingService.js   # add/update/remove helpers (Firestore writes)
│   ├── diaperService.js
│   ├── sleepService.js
│   └── profileService.js   # saveProfile(uid, data) — merges into profile doc
│
├── utils/
│   ├── formatters.js       # toDate, formatTime, formatDate, formatDuration,
│   │                       # formatTimeAgo(ts, t?) — all locale-aware
│   ├── babyAge.js          # calculateAge(dob, t?) — returns translated age string
│   ├── feedingAnalytics.js # Pure functions over feedings array
│   ├── diaperAnalytics.js
│   └── sleepAnalytics.js
│
├── i18n/
│   └── translations.js     # { en: { key: value }, es: { key: value } }
│                           # ~200 keys covering all UI strings
│
├── pages/
│   ├── DashboardPage.jsx   # Summary cards + recent activity + quick-add modals
│   ├── EntriesPage.jsx     # Unified feeding/diaper/sleep timeline with filters
│   ├── DiaryPage.jsx       # Diary entries list + add/edit modal
│   ├── FeedingPage.jsx     # Feeding list + analytics (redirected → EntriesPage)
│   ├── DiaperPage.jsx      # Diaper list + analytics
│   ├── SleepPage.jsx       # Sleep list + analytics
│   ├── ProfilePage.jsx     # Baby profile form + language selector + logout
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx      # Mobile header + bottom tab bar + desktop sidebar
│   │   ├── Navbar.css
│   │   ├── Modal.jsx       # Generic centered modal wrapper
│   │   └── ProtectedRoute.jsx
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── AuthForm.css
│   ├── feeding/
│   │   ├── FeedingForm.jsx
│   │   ├── FeedingEntry.jsx
│   │   ├── FeedingAnalytics.jsx
│   │   └── Feeding.css
│   ├── diaper/             # Same pattern as feeding
│   ├── sleep/              # Same pattern
│   ├── diary/
│   │   ├── DiaryForm.jsx
│   │   └── DiaryEntry.jsx
│   └── dashboard/
│       ├── SummaryCard.jsx
│       └── RecentActivity.jsx
│
├── App.jsx                 # Router + providers + LanguageSync
├── main.jsx
└── index.css               # Global tokens, layout, shared components, dark mode
```

---

## Key Architectural Decisions

### Auth & Data Flow
- `AuthContext` wraps the whole app. All data hooks (`useFeedings`, etc.) internally call `useAuth()` to get `currentUser.uid` and scope Firestore paths to `users/{uid}/...`.
- All data hooks use `onSnapshot` for real-time updates — no manual refresh needed.

### Routing
```
/           → redirects to /dashboard
/login      → LoginPage
/register   → RegisterPage
/dashboard  → DashboardPage  (protected)
/entries    → EntriesPage    (protected) — merged feedings + diapers + sleeps
/diary      → DiaryPage      (protected)
/profile    → ProfilePage    (protected)
/feeding    → redirect to /entries
/diaper     → redirect to /entries
/sleep      → redirect to /entries
```

### Dark Mode
- Toggled by adding/removing `class="dark"` on `<html>`.
- Anti-FOUC: inline `<script>` in `index.html` runs before React mounts, reads `localStorage.theme` and applies the class immediately.
- `useTheme` hook (`src/hooks/useTheme.js`) manages toggle state, syncs to localStorage.
- All color tokens are CSS custom properties on `:root`; `html.dark` block overrides them.
- Tracker colors (`--color-feeding`, `--color-diaper`, `--color-sleep`, `--color-entry`) are light pastels in light mode, dark muted versions in dark mode.

### i18n (EN / ES)
- `LanguageContext` provides `t(key)` — looks up `translations[language][key]`, falls back to English, then to the key itself.
- Language is persisted in `localStorage` AND Firestore (`users/{uid}/profile.language`).
- `LanguageSync` component (rendered inside `ProtectedLayout` in `App.jsx`) syncs Firestore → context on login.
- Data stored in Firestore always uses English values (e.g. `type: "breast"`, `quality: "good"`, `side: "left"`). Translation happens at display time via `t()`.
- Diary tags stored as English strings; displayed via `t('tag.${tag}')`.
- `formatTimeAgo(ts, t)` and `calculateAge(dob, t)` accept an optional `t` function for translated output.

### Navigation (Mobile vs Desktop)
- **Mobile** (`≤768px`): fixed top header (logo + theme toggle) + fixed bottom tab bar (4 tabs).
- **Desktop** (`>768px`): sidebar always visible on the left (260px wide).
- 4 navigation destinations: Dashboard, Entries, Diary, Profile.

---

## Firestore Schema

```
users/{userId}/
  profile           # { babyName, babyDOB, gender, language, bloodType,
                    #   birthWeight, birthLength, pediatrician, allergies, notes }
  feedings/{id}     # { type, side, duration, amount, timestamp, notes }
  diapers/{id}      # { type, timestamp, notes }
  sleeps/{id}       # { startTime, endTime, duration, quality, notes }
  diary/{id}        # { text, tags[], timestamp }
```

All `timestamp` / `startTime` / `endTime` fields are Firestore `serverTimestamp()` or client `Timestamp`.

---

## Environment Variables

File: `.env.local` (never committed — in `.gitignore`)

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

---

## Build & Dev

```bash
npm install
# create .env.local with Firebase credentials
npm run dev      # dev server at localhost:5173
npm run build    # production build → dist/
```
